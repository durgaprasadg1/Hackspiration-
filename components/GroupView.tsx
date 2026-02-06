"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Plus, Users, Receipt, Send, ChevronLeft } from "lucide-react";
import {
  calculateNetDebt,
  createAtomicSettlement,
  Expense,
} from "@/utils/algorand";
import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

export default function GroupView() {
  const { activeGroup, setActiveGroup, address, groups, setGroups } =
    useAppContext();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedSplitters, setSelectedSplitters] = useState<string[]>([]);

  if (!activeGroup) return null;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !title || !amount) return;

    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      amount: parseFloat(amount),
      payer: address,
      splitters:
        selectedSplitters.length > 0 ? selectedSplitters : activeGroup.members,
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
  };

  const handleSettleUp = async () => {
    if (!address) return;
    const debts = calculateNetDebt(activeGroup.expenses, activeGroup.members);
    const myDebts = debts.filter((d) => d.from === address);

    if (myDebts.length === 0) {
      alert("You have no outstanding debts to settle!");
      return;
    }

    try {
      const txns = await createAtomicSettlement(
        address,
        myDebts.map((d) => ({ receiver: d.to, amount: d.amount })),
      );
      const signerTxns = txns.map((txn) => ({ txn, signers: [address] }));
      await peraWallet.signTransaction([signerTxns]);
      alert("Settlement transactions signed and grouped!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => setActiveGroup(null)}
        className="flex items-center gap-2 text-slate-400 mb-6 hover:text-emerald-400 transition-colors"
      >
        <ChevronLeft size={20} /> Back to Dashboard
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold mb-1">{activeGroup.name}</h2>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Users size={16} /> {activeGroup.members.length} Members
        </div>
      </div>

      <form
        onSubmit={handleAddExpense}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Receipt size={20} className="text-emerald-500" /> Add New Expense
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="What was it for?"
            className="w-full bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-emerald-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount in ALGO"
            className="w-full bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-emerald-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-2">
            <p className="text-sm text-slate-400">Paid by you. Split with:</p>
            {activeGroup.members.map((m) => (
              <label
                key={m}
                className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-lg cursor-pointer hover:bg-slate-800"
              >
                <input
                  type="checkbox"
                  className="accent-emerald-500"
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
                <span className="text-sm font-mono truncate">{m}</span>
              </label>
            ))}
          </div>
          <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
            <Plus size={18} /> Add Expense
          </button>
        </div>
      </form>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Expense Log</h3>
          <button
            onClick={handleSettleUp}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-500/20"
          >
            <Send size={16} /> Settle My Debts
          </button>
        </div>
        <div className="space-y-4">
          {activeGroup.expenses.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No expenses yet. Time to split!
            </p>
          ) : (
            activeGroup.expenses.map((exp) => (
              <div
                key={exp.id}
                className="flex justify-between items-center p-4 bg-slate-800/30 rounded-xl border border-slate-800"
              >
                <div>
                  <p className="font-semibold">{exp.title}</p>
                  <p className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                    Paid by {exp.payer === address ? "You" : exp.payer}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold">
                    {exp.amount} ALGO
                  </p>
                  <p className="text-xs text-slate-400">
                    {exp.splitters.length} splitters
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
