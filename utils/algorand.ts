import algosdk from "algosdk";

export const getAlgodClient = () => {
  const server = process.env.NEXT_PUBLIC_ALGOD_SERVER || "https://testnet-api.algonode.cloud";
  const port = process.env.NEXT_PUBLIC_ALGOD_PORT || "";
  const token = process.env.NEXT_PUBLIC_ALGOD_TOKEN || "";
  return new algosdk.Algodv2(token, server, port);
};

export const createAtomicSettlement = async (
  sender: string,
  settlements: { receiver: string; amount: number }[]
) => {
  const client = getAlgodClient();
  const params = await client.getTransactionParams().do();
  
  const txns = settlements.map((s) => {
    return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender,
      to: s.receiver,
      amount: algosdk.algosToMicroalgos(s.amount),
      suggestedParams: params,
    });
  });

  const groupID = algosdk.computeGroupID(txns);
  txns.forEach((txn) => (txn.group = groupID));

  return txns;
};

export const calculateNetDebt = (expenses: Expense[], members: string[]) => {
  const balances: Record<string, number> = {};
  members.forEach((m) => (balances[m] = 0));

  expenses.forEach((exp) => {
    const share = exp.amount / exp.splitters.length;
    balances[exp.payer] += exp.amount;
    exp.splitters.forEach((s) => {
      balances[s] -= share;
    });
  });

  const debtors = members
    .filter((m) => balances[m] < 0)
    .sort((a, b) => balances[a] - balances[b]);
  const creditors = members
    .filter((m) => balances[m] > 0)
    .sort((a, b) => balances[b] - balances[a]);

  const transactions: { from: string; to: string; amount: number }[] = [];

  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debt = -balances[debtors[i]];
    const credit = balances[creditors[j]];
    const amount = Math.min(debt, credit);

    if (amount > 0) {
      transactions.push({ from: debtors[i], to: creditors[j], amount });
    }

    balances[debtors[i]] += amount;
    balances[creditors[j]] -= amount;

    if (Math.abs(balances[debtors[i]]) < 0.01) i++;
    if (Math.abs(balances[creditors[j]]) < 0.01) j++;
  }

  return transactions;
};

export interface Expense {
  id: string;
  title: string;
  amount: number;
  payer: string;
  splitters: string[];
}

export interface Group {
  id: string;
  name: string;
  members: string[];
  expenses: Expense[];
}
