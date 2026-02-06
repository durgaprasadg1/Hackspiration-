import { Expense } from "./algorand";

export interface OptimizedTransfer {
  from: string;
  to: string;
  amount: number;
  assetId?: number;
  assetDecimals?: number;
}

export const minimizeDebts = (expenses: Expense[], members: string[]): Record<number, OptimizedTransfer[]> => {
  const assetBalances: Record<number, Record<string, number>> = {};
  const assetDecimalsMap: Record<number, number> = {};

  expenses.forEach((exp) => {
    const aid = exp.assetId || 0;
    assetDecimalsMap[aid] = exp.assetDecimals || 6;
    if (!assetBalances[aid]) {
      assetBalances[aid] = {};
      members.forEach((m) => (assetBalances[aid][m] = 0));
    }

    const balances = assetBalances[aid];
    balances[exp.payer] += exp.amount;

    if (exp.splitType === "equal") {
      const share = exp.amount / exp.splitters.length;
      exp.splitters.forEach((s) => {
        balances[s] -= share;
      });
    } else if (exp.splitType === "percentage" && exp.splits) {
      exp.splitters.forEach((s) => {
        const share = (exp.amount * (exp.splits![s] || 0)) / 100;
        balances[s] -= share;
      });
    } else if (exp.splitType === "fixed" && exp.splits) {
      exp.splitters.forEach((s) => {
        balances[s] -= exp.splits![s] || 0;
      });
    }
  });

  const results: Record<number, OptimizedTransfer[]> = {};

  Object.keys(assetBalances).forEach((aidStr) => {
    const assetId = parseInt(aidStr);
    const balances = assetBalances[assetId];
    const debtors: { address: string; amount: number }[] = [];
    const creditors: { address: string; amount: number }[] = [];

    Object.entries(balances).forEach(([address, balance]) => {
      const roundedBalance = Math.round(balance * 1000000) / 1000000;
      if (roundedBalance < 0) {
        debtors.push({ address, amount: -roundedBalance });
      } else if (roundedBalance > 0) {
        creditors.push({ address, amount: roundedBalance });
      }
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const transfers: OptimizedTransfer[] = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const settlementAmount = Math.min(debtor.amount, creditor.amount);

      if (settlementAmount > 0.000001) {
        transfers.push({
          from: debtor.address,
          to: creditor.address,
          amount: settlementAmount,
          assetId: assetId === 0 ? undefined : assetId,
          assetDecimals: assetDecimalsMap[assetId],
        });
      }

      debtor.amount -= settlementAmount;
      creditor.amount -= settlementAmount;

      if (debtor.amount < 0.000001) dIdx++;
      if (creditor.amount < 0.000001) cIdx++;
    }
    results[assetId] = transfers;
  });

  return results;
};
