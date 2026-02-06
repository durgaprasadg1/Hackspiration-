"use client";

import React, { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import GroupView from "@/components/GroupView";
import { useAppContext } from "@/context/AppContext";
import { Plus, Users, ArrowRight, Wallet } from "lucide-react";
import { Group } from "@/utils/algorand";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function Home() {
  const { address, activeGroup, setActiveGroup, groups, setGroups, isLoading } = useAppContext();
  const [newGroupName, setNewGroupName] = useState("");
  const [newMember, setNewMember] = useState("");
  const [tempMembers, setTempMembers] = useState<string[]>([]);

  const handleCreateGroup = () => {
    if (!newGroupName || tempMembers.length === 0) {
      toast.error("Group name and at least 1 member required");
      return;
    }
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGroupName,
      members: [address!, ...tempMembers],
      expenses: [],
    };
    setGroups([...groups, newGroup]);
    setNewGroupName("");
    setTempMembers([]);
    toast.success("Group created successfully");
  };

  if (activeGroup) return <GroupView />;

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-16"
      >
        <div>
          <h1 className="text-4xl font-black text-emerald-500 tracking-tighter italic">SPLIT-IT</h1>
          <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Institutional-Grade Expense Ledger</p>
        </div>
        <WalletConnect />
      </motion.header>

      <AnimatePresence mode="wait">
        {!address ? (
          <motion.div 
            key="connect"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            className="max-w-md mx-auto mt-20 text-center"
          >
            <div className="glass-card p-12 rounded-[2.5rem] border-emerald-500/20">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                <Wallet size={40} className="text-emerald-500" />
              </div>
              <h2 className="text-3xl font-black mb-4 tracking-tight">Financial Protocol</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Connect your Algorand wallet to access the decentralized expense splitting graph. 
                Manage dorm costs and campus tabs with cryptographic certainty.
              </p>
              <div className="p-4 bg-slate-900/50 rounded-2xl text-[10px] text-slate-500 font-mono tracking-tight uppercase">
                Waiting for wallet handshake...
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            <section className="lg:col-span-5 space-y-8">
              <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Plus size={20} className="text-slate-950" />
                </div>
                Initialize Group
              </h2>
              <div className="glass-card rounded-[2rem] p-8 space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-widest">Protocol Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Room 402 Utilities"
                    className="w-full glass-input rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-widest">Add Nodes (Wallets)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Algorand Address"
                      className="flex-1 glass-input rounded-2xl p-4 text-xs font-mono outline-none"
                      value={newMember}
                      onChange={(e) => setNewMember(e.target.value)}
                    />
                    <button 
                      onClick={() => {
                        if (newMember) {
                          setTempMembers([...tempMembers, newMember]);
                          setNewMember("");
                        }
                      }}
                      className="bg-slate-800 px-6 rounded-2xl hover:bg-slate-700 transition font-bold"
                    >
                      ADD
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {tempMembers.map((m) => (
                    <motion.span 
                      key={m}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-500/10 text-emerald-500 text-[10px] font-mono p-2 px-3 rounded-xl border border-emerald-500/20"
                    >
                      {m.slice(0, 6)}...{m.slice(-4)}
                    </motion.span>
                  ))}
                </div>

                <button 
                  onClick={handleCreateGroup}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-900/20 active:scale-95"
                >
                  DEPLOY GROUP
                </button>
              </div>
            </section>

            <section className="lg:col-span-7 space-y-8">
              <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Users size={18} className="text-emerald-500" />
                </div>
                Active Graphs
              </h2>
              <div className="grid gap-4">
                {groups.length === 0 ? (
                  <div className="glass-card border-dashed border-slate-800 rounded-[2rem] p-20 text-center text-slate-500 flex flex-col items-center gap-4">
                    <Users size={40} className="opacity-20" />
                    <p className="font-medium">No active settlement graphs detected.</p>
                  </div>
                ) : (
                  groups.map((group, idx) => (
                    <motion.div 
                      key={group.id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setActiveGroup(group)}
                      className="group glass-card p-8 rounded-[2rem] hover:border-emerald-500/40 transition-all cursor-pointer flex justify-between items-center shadow-lg active:scale-[0.99]"
                    >
                      <div>
                        <h3 className="font-black text-xl group-hover:text-emerald-400 transition-colors">{group.name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                           <p className="text-xs text-slate-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                            <Users size={12} /> {group.members.length} Members
                          </p>
                          <p className="text-xs text-emerald-500/60 font-bold flex items-center gap-1 uppercase tracking-widest">
                            <Plus size={12} /> {group.expenses.length} Records
                          </p>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center group-hover:bg-emerald-500 transition-all">
                        <ArrowRight className="text-slate-600 group-hover:text-slate-950 transition-all" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
