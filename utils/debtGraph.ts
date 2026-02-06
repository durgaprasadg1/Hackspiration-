import { Expense } from "./algorand";

export interface OptimizedTransfer {
  from: string;
  to: string;
  amount: number;
}

export const minimizeDebts = (expenses: Expense[], members: string[]): OptimizedTransfer[] => {
  const balances: Record<string, number> = {};
  members.forEach((m) => (balances[m] = 0));

  expenses.forEach((exp) => {
    const share = exp.amount / exp.splitters.length;
    balances[exp.payer] += exp.amount;
    exp.splitters.forEach((s) => {
      balances[s] -= share;
    });
  });

  const debtors: { address: string; amount: number }[] = [];
  const creditors: { address: string; amount: number }[] = [];

  Object.entries(balances).forEach(([address, balance]) => {
    const roundedBalance = Math.round(balance * 100) / 100;
    if (roundedBalance < 0) {
      debtors.push({ address, amount: -roundedBalance });
    } else if (roundedBalance > 0) {
      creditors.push({ address, amount: roundedBalance });
    }
  });

  // Sort to prioritize large debts and credits for simpler matching
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transfers: OptimizedTransfer[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    const settlementAmount = Math.min(debtor.amount, creditor.amount);

    if (settlementAmount > 0.01) {
      transfers.push({
        from: debtor.address,
        to: creditor.address,
        amount: settlementAmount,
      });
    }

    debtor.amount -= settlementAmount;
    creditor.amount -= settlementAmount;

    if (debtor.amount < 0.01) dIdx++;
    if (creditor.amount < 0.01) cIdx++;
  }

  return transfers;
};
