"use client";

import React, { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Plus, Users, Receipt, Send, ChevronLeft, Share2, Wand2 } from "lucide-react";
import {
  calculateNetDebt,
  createAtomicSettlement,
  Expense,
} from "@/utils/algorand";
import { minimizeDebts } from "@/utils/debtGraph";
import { PeraWalletConnect } from "@perawallet/connect";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ShareQR from "./ShareQR";
import SettlementPreview from "./SettlementPreview";

const peraWallet = new PeraWalletConnect();

export default function GroupView() {
  const { activeGroup, setActiveGroup, address, groups, setGroups } = useAppContext();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedSplitters, setSelectedSplitters] = useState<string[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!activeGroup) return null;

  const optimizedDebts = useMemo(() => 
    minimizeDebts(activeGroup.expenses, activeGroup.members),
    [activeGroup.expenses, activeGroup.members]
  );

  const myOptimizedDebts = useMemo(() => 
    optimizedDebts.filter(d => d.from === address),
    [optimizedDebts, address]
  );

  const rawDebts = useMemo(() => 
    calculateNetDebt(activeGroup.expenses, activeGroup.members).filter(d => d.from === address),
    [activeGroup.expenses, activeGroup.members, address]
  );

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !title || !amount) return;

    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      amount: parseFloat(amount),
      payer: address,
      splitters: selectedSplitters.length > 0 ? selectedSplitters : activeGroup.members,
    };

    const updatedGroup = {
      ...activeGroup,
      expenses: [...activeGroup.expenses, newExpense],
    };

    setActiveGroup(updatedGroup);
    setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
    setTitle("");
    setAmount("");
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
        myOptimizedDebts.map((d) => ({ receiver: d.to, amount: d.amount })),
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
        <h2 className="text-3xl font-bold mb-1 tracking-tight">{activeGroup.name}</h2>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Users size={16} /> {activeGroup.members.length} Members active in graph
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
          <div className="relative">
             <input
              type="number"
              placeholder="Amount in ALGO"
              className="w-full glass-input rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none pr-16"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">ALGO</span>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-slate-400 font-medium">Split with:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeGroup.members.map((m) => (
                <label
                  key={m}
                  className="flex items-center gap-3 glass-input p-3 rounded-xl cursor-pointer hover:bg-slate-800/50 group transition-all"
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
                  <span className="text-xs font-mono truncate text-slate-400 group-hover:text-slate-200">
                    {m.slice(0, 10)}...{m.slice(-4)}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
            <Plus size={20} strokeWidth={3} /> Add to Ledger
          </button>
        </div>
      </form>

      <div className="glass-card rounded-3xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold tracking-tight">Financial Health</h3>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-slate-800/80 hover:bg-slate-700 text-emerald-400 px-5 py-2.5 rounded-2xl text-sm font-black flex items-center gap-2 border border-emerald-500/20 transition-all active:scale-95"
          >
            <Wand2 size={18} /> {showPreview ? "View Logs" : "Magic Settle"}
          </button>
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
                rawDebtCount={rawDebts.length}
              />
              <button
                onClick={handleSettleUp}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/40"
              >
                <Send size={20} /> Execute Atomic Settlement
              </button>
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
                      <p className="font-bold text-slate-100">{exp.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">
                        BY {exp.payer === address ? "YOU" : exp.payer.slice(0, 10)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-black text-lg">
                        {exp.amount} <span className="text-xs">ALGO</span>
                      </p>
                      <div className="flex gap-1 justify-end mt-1">
                         {exp.splitters.map((_, i) => (
                           <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                         ))}
                      </div>
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
