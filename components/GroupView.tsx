"use client";

import React, { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import {
  Plus,
  Users,
  Receipt,
  Send,
  ChevronLeft,
  Share2,
  Wand2,
  Settings2,
  Hash,
  Percent,
  PieChart,
  Download,
  Clock,
  Tag,
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Food",
    icon: "🍴",
    color: "bg-orange-500/20",
    textColor: "text-orange-400",
  },
  {
    name: "Housing",
    icon: "🏠",
    color: "bg-blue-500/20",
    textColor: "text-blue-400",
  },
  {
    name: "Transport",
    icon: "🚗",
    color: "bg-purple-500/20",
    textColor: "text-purple-400",
  },
  {
    name: "Fun",
    icon: "🎮",
    color: "bg-pink-500/20",
    textColor: "text-pink-400",
  },
  {
    name: "Supplies",
    icon: "📦",
    color: "bg-yellow-500/20",
    textColor: "text-yellow-400",
  },
  {
    name: "Others",
    icon: "✨",
    color: "bg-emerald-500/20",
    textColor: "text-emerald-400",
  },
];
import {
  calculateNetDebt,
  calculateRawDebts,
  createAtomicSettlement,
  Expense,
  SplitType,
} from "@/utils/algorand";
import { minimizeDebts } from "@/utils/debtGraph";
import { PeraWalletConnect } from "@perawallet/connect";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ShareQR from "./ShareQR";
import SettlementPreview from "./SettlementPreview";

const peraWallet = new PeraWalletConnect();

export default function GroupView() {
  const { activeGroup, setActiveGroup, address, groups, setGroups } =
    useAppContext();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [assetId, setAssetId] = useState<number>(0);
  const [category, setCategory] = useState("Others");
  const [splitType, setSplitType] = useState<SplitType>("equal");
  const [isRecurring, setIsRecurring] = useState(false);
  const [interval, setInterval] = useState<"weekly" | "monthly">("monthly");
  const [manualSplits, setManualSplits] = useState<Record<string, number>>({});
  const [selectedSplitters, setSelectedSplitters] = useState<string[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<"logs" | "analytics">("logs");

  if (!activeGroup) return null;

  const optimizedDebtsMap = useMemo(
    () => minimizeDebts(activeGroup.expenses, activeGroup.members),
    [activeGroup.expenses, activeGroup.members],
  );

  const allOptimizedTransfers = useMemo(
    () => Object.values(optimizedDebtsMap).flat(),
    [optimizedDebtsMap],
  );

  const myOptimizedDebts = useMemo(
    () => allOptimizedTransfers.filter((d) => d.from === address),
    [allOptimizedTransfers, address],
  );

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !title || !amount) return;

    const splitters =
      selectedSplitters.length > 0 ? selectedSplitters : activeGroup.members;

    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      amount: parseFloat(amount),
      payer: address,
      splitters,
      splitType,
      category,
      assetId: assetId !== 0 ? assetId : undefined,
      splits: splitType !== "equal" ? manualSplits : undefined,
      isRecurring,
      interval: isRecurring ? interval : undefined,
      timestamp: Date.now(),
    };

    const updatedGroup = {
      ...activeGroup,
      expenses: [...activeGroup.expenses, newExpense],
    };

    setActiveGroup(updatedGroup);
    setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
    setTitle("");
    setAmount("");
    setAssetId(0);
    setCategory("Others");
    setSplitType("equal");
    setIsRecurring(false);
    setInterval("monthly");
    setManualSplits({});
    setSelectedSplitters([]);
    toast.success("Expense added to graph");
  };

  const handleSettleUp = async () => {
    if (!address) return;

    if (myOptimizedDebts.length === 0) {
      toast.error("No outstanding debts found in the optimized graph.");
      return;
    }

    const tId = toast.loading("Preparing Atomic Transfer...");

    try {
      const txns = await createAtomicSettlement(
        address,
        myOptimizedDebts.map((d) => ({
          receiver: d.to,
          amount: d.amount,
          assetId: d.assetId,
          assetDecimals: d.assetDecimals,
        })),
      );

      const signerTxns = txns.map((txn) => ({ txn, signers: [address] }));
      await peraWallet.signTransaction([signerTxns]);

      toast.success("Transactions signed and grouped!", { id: tId });
      setShowPreview(false);
    } catch (error: any) {
      if (error?.message !== "The operation was cancelled by the user") {
        console.error(error);
        toast.error("Settlement failed", { id: tId });
      } else {
        toast.dismiss(tId);
      }
    }
  };

  const rawDebtCount = useMemo(
    () =>
      calculateRawDebts(activeGroup.expenses, activeGroup.members).filter(
        (d) => d.from === address,
      ).length,
    [activeGroup.expenses, activeGroup.members, address],
  );

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    activeGroup.expenses.forEach((exp) => {
      const cat = exp.category || "Others";
      totals[cat] = (totals[cat] || 0) + exp.amount;
    });
    return totals;
  }, [activeGroup.expenses]);

  const totalSpent = useMemo(
    () => Object.values(categoryTotals).reduce((a, b) => a + b, 0),
    [categoryTotals],
  );
  const handleExportCSV = () => {
    const headers = [
      "Title",
      "Amount",
      "Payer",
      "Splitters",
      "Category",
      "Date",
      "AssetID",
    ];
    const rows = activeGroup.expenses.map((e) => [
      e.title,
      e.amount,
      e.payer,
      `"${e.splitters.join("; ")}"`,
      e.category || "Others",
      new Date(e.timestamp).toLocaleDateString(),
      e.assetId || 0,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeGroup.name}_ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Ledger exported to CSV");
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setActiveGroup(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ChevronLeft size={20} /> Dashboard
        </button>
        <button
          onClick={() => setIsShareOpen(true)}
          className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-sm font-bold"
        >
          <Share2 size={16} /> Invite
        </button>
      </div>

      <div className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Users size={80} />
        </div>
        <h2 className="text-3xl font-bold mb-1 tracking-tight">
          {activeGroup.name}
        </h2>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Users size={16} /> {activeGroup.members.length} Members active in
          graph
        </div>
      </div>

      <form
        onSubmit={handleAddExpense}
        className="glass-card rounded-3xl p-8 mb-8"
      >
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Receipt size={24} className="text-emerald-500" /> New Expense
        </h3>
        <div className="space-y-5">
          <input
            type="text"
            placeholder="What was it for?"
            className="w-full glass-input rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                  category === cat.name
                    ? `${cat.color} ${cat.textColor} border-current`
                    : "bg-slate-900 border-slate-700 text-slate-500"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="number"
                placeholder="Amount"
                className="w-full glass-input rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none pr-16"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-xs">
                {assetId === 0 ? "ALGO" : "ASA"}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="Asset ID (0=ALGO)"
                className="w-full glass-input rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={assetId || ""}
                onChange={(e) => setAssetId(parseInt(e.target.value) || 0)}
              />
              <Hash
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </div>

          <div className="flex gap-2 p-1 bg-slate-900/50 rounded-2xl">
            {(["equal", "percentage", "fixed"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSplitType(type)}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                  splitType === type
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-sm text-slate-400 font-medium flex justify-between">
              {splitType === "equal"
                ? "Split with:"
                : `Configure ${splitType} splits:`}
              {splitType !== "equal" && (
                <span className="text-[10px] text-emerald-500 uppercase">
                  Input {splitType === "percentage" ? "%" : "units"}
                </span>
              )}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {activeGroup.members.map((m) => {
                const isSelected =
                  selectedSplitters.includes(m) ||
                  selectedSplitters.length === 0;
                return (
                  <div
                    key={m}
                    className={`flex items-center gap-3 glass-input p-3 rounded-xl transition-all ${isSelected ? "opacity-100" : "opacity-40"}`}
                  >
                    <input
                      type="checkbox"
                      className="accent-emerald-500 w-4 h-4"
                      checked={selectedSplitters.includes(m)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedSplitters([...selectedSplitters, m]);
                        else
                          setSelectedSplitters(
                            selectedSplitters.filter((s) => s !== m),
                          );
                      }}
                    />
                    <span className="text-xs font-mono truncate text-slate-400 flex-1">
                      {m.slice(0, 10)}...{m.slice(-4)}{" "}
                      {m === address && "(You)"}
                    </span>
                    {splitType !== "equal" && (
                      <input
                        type="number"
                        placeholder={splitType === "percentage" ? "%" : "Amt"}
                        className="w-20 bg-slate-800 rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                        value={manualSplits[m] || ""}
                        onChange={(e) =>
                          setManualSplits({
                            ...manualSplits,
                            [m]: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex border-t border-slate-800 pt-5 mt-5">
            <button
              type="button"
              onClick={() => setIsRecurring(!isRecurring)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isRecurring
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-500 bg-slate-900 border border-transparent"
              }`}
            >
              <Clock size={14} />{" "}
              {isRecurring ? "Recurring Expense" : "One-time"}
            </button>
            {isRecurring && (
              <div className="flex gap-2 ml-4">
                {(["weekly", "monthly"] as const).map((int) => (
                  <button
                    key={int}
                    type="button"
                    onClick={() => setInterval(int)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                      interval === int
                        ? "text-emerald-400 font-black"
                        : "text-slate-600"
                    }`}
                  >
                    {int}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
            <Plus size={20} strokeWidth={3} /> Add to Ledger
          </button>
        </div>
      </form>

      <div className="glass-card rounded-3xl p-8">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold tracking-tight">
              Financial Health
            </h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="bg-slate-800/80 hover:bg-slate-700 text-emerald-400 px-5 py-2.5 rounded-2xl text-sm font-black flex items-center gap-2 border border-emerald-500/20 transition-all active:scale-95"
            >
              <Wand2 size={18} /> {showPreview ? "View Logs" : "Magic Settle"}
            </button>
          </div>

          <div className="flex gap-2 p-1 bg-slate-900/50 rounded-2xl w-fit">
            <button
              onClick={() => setViewMode("logs")}
              className={`px-6 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${viewMode === "logs" ? "bg-slate-800 text-emerald-400" : "text-slate-500"}`}
            >
              <Clock size={14} /> Activity
            </button>
            <button
              onClick={() => setViewMode("analytics")}
              className={`px-6 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${viewMode === "analytics" ? "bg-slate-800 text-emerald-400" : "text-slate-500"}`}
            >
              <PieChart size={14} /> Analytics
            </button>
          </div>

          {!showPreview && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-emerald-400 transition-colors bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-800 w-fit"
            >
              <Download size={14} /> Export CSV
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {showPreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SettlementPreview
                optimizedTransfers={myOptimizedDebts}
                rawDebtCount={rawDebtCount}
              />
              <button
                onClick={handleSettleUp}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/40"
              >
                <Send size={20} /> Execute Atomic Settlement
              </button>
            </motion.div>
          ) : viewMode === "analytics" ? (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-input p-6 rounded-2xl">
                  <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">
                    Total Group Spend
                  </p>
                  <p className="text-2xl font-black text-emerald-400">
                    {totalSpent} <span className="text-xs">ALGO</span>
                  </p>
                </div>
                <div className="glass-input p-6 rounded-2xl">
                  <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">
                    Average per Category
                  </p>
                  <p className="text-2xl font-black text-emerald-400">
                    {(
                      totalSpent / (Object.keys(categoryTotals).length || 1)
                    ).toFixed(2)}{" "}
                    <span className="text-xs">ALGO</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {CATEGORIES.map((cat) => {
                  const amount = categoryTotals[cat.name] || 0;
                  const percentage =
                    totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                  if (amount === 0) return null;

                  return (
                    <div key={cat.name} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-lg bg-slate-800 text-sm">
                            {cat.icon}
                          </span>
                          <span className="text-sm font-bold text-slate-200">
                            {cat.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-400">
                            {amount} ALGO
                          </span>
                          <span className="text-[10px] text-slate-500 ml-2">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          className={`h-full ${cat.color.replace("/20", "")} bg-current`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="logs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {activeGroup.expenses.length === 0 ? (
                <div className="text-slate-500 text-center py-12 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-700">
                    <Receipt size={32} />
                  </div>
                  <p className="font-medium">No expenses recorded yet.</p>
                </div>
              ) : (
                [...activeGroup.expenses].reverse().map((exp, idx) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex justify-between items-center p-5 glass-input rounded-2xl border border-transparent hover:border-emerald-500/20 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-100">{exp.title}</p>
                        {exp.category && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold border border-slate-700">
                            {exp.category}
                          </span>
                        )}
                        {exp.isRecurring && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 flex items-center gap-1">
                            <Clock size={10} /> {exp.interval}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">
                        BY{" "}
                        {exp.payer === address ? "YOU" : exp.payer.slice(0, 10)}
                        ...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-black text-lg">
                        {exp.amount}{" "}
                        <span className="text-xs">
                          {exp.assetId ? `ASA ${exp.assetId}` : "ALGO"}
                        </span>
                      </p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-tighter">
                        {exp.splitType} Split
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ShareQR
        groupId={activeGroup.id}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </motion.div>
  );
}
