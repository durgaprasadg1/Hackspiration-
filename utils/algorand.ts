import algosdk from "algosdk";

export const getAlgodClient = () => {
  const server = process.env.NEXT_PUBLIC_ALGOD_SERVER || "https://testnet-api.algonode.cloud";
  const port = process.env.NEXT_PUBLIC_ALGOD_PORT || "";
  const token = process.env.NEXT_PUBLIC_ALGOD_TOKEN || "";
  return new algosdk.Algodv2(token, server, port);
};

export type SplitType = "equal" | "percentage" | "fixed";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  payer: string;
  splitters: string[];
  assetId?: number;
  assetDecimals?: number;
  category?: string;
  timestamp: number;
  splitType: SplitType;
  splits?: Record<string, number>;
  isRecurring?: boolean;
  interval?: "weekly" | "monthly";
}

export interface Group {
  id: string;
  name: string;
  members: string[];
  expenses: Expense[];
}

export const createAtomicSettlement = async (
  sender: string,
  settlements: { receiver: string; amount: number; assetId?: number; assetDecimals?: number }[]
) => {
  const client = getAlgodClient();
  const params = await client.getTransactionParams().do();
  
  const txns = settlements.map((s) => {
    if (!s.assetId || s.assetId === 0) {
      return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: sender,
        receiver: s.receiver,
        amount: BigInt(algosdk.algosToMicroalgos(s.amount)),
        suggestedParams: params,
      });
    } else {
      return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: sender,
        receiver: s.receiver,
        assetIndex: BigInt(s.assetId),
        amount: BigInt(Math.round(s.amount * Math.pow(10, s.assetDecimals || 6))),
        suggestedParams: params,
      });
    }
  });

  const groupID = algosdk.computeGroupID(txns);
  txns.forEach((txn) => (txn.group = groupID));

  return txns;
};

export const calculateNetDebt = (expenses: Expense[], members: string[]) => {
  const assetBalances: Record<number, Record<string, number>> = {};

  expenses.forEach((exp) => {
    const aid = exp.assetId || 0;
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

  return assetBalances;
};

export const calculateRawDebts = (expenses: Expense[], members: string[]) => {
  const rawTransfers: { from: string; to: string; amount: number; assetId?: number }[] = [];

  expenses.forEach((exp) => {
    if (exp.splitType === "equal") {
      const share = exp.amount / exp.splitters.length;
      exp.splitters.forEach((s) => {
        if (s !== exp.payer) {
          rawTransfers.push({ from: s, to: exp.payer, amount: share, assetId: exp.assetId });
        }
      });
    } else if (exp.splitType === "percentage" && exp.splits) {
      exp.splitters.forEach((s) => {
        if (s !== exp.payer) {
          const share = (exp.amount * (exp.splits![s] || 0)) / 100;
          if (share > 0) {
            rawTransfers.push({ from: s, to: exp.payer, amount: share, assetId: exp.assetId });
          }
        }
      });
    } else if (exp.splitType === "fixed" && exp.splits) {
      exp.splitters.forEach((s) => {
        if (s !== exp.payer) {
          const share = exp.splits![s] || 0;
          if (share > 0) {
            rawTransfers.push({ from: s, to: exp.payer, amount: share, assetId: exp.assetId });
          }
        }
      });
    }
  });

  return rawTransfers;
};
