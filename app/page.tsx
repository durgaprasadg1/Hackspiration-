"use client";

import React, { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import GroupView from "@/components/GroupView";
import { useAppContext } from "@/context/AppContext";
import { Plus, Users, ArrowRight } from "lucide-react";
import { Group } from "@/utils/algorand";

export default function Home() {
  const { address, activeGroup, setActiveGroup, groups, setGroups } = useAppContext();
  const [newGroupName, setNewGroupName] = useState("");
  const [newMember, setNewMember] = useState("");
  const [tempMembers, setTempMembers] = useState<string[]>([]);

  const handleCreateGroup = () => {
    if (!newGroupName || tempMembers.length === 0) return;
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGroupName,
      members: [address!, ...tempMembers],
      expenses: [],
    };
    setGroups([...groups, newGroup]);
    setNewGroupName("");
    setTempMembers([]);
  };

  if (activeGroup) return <GroupView />;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-emerald-500 tracking-tighter">SPLIT-IT</h1>
          <p className="text-slate-400 text-sm">Campus expense splitting on Algorand</p>
        </div>
        <WalletConnect />
      </header>

      {!address ? (
        <div className="max-w-md mx-auto mt-20 text-center space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <Users size={48} className="mx-auto mb-4 text-emerald-500" />
            <h2 className="text-2xl font-bold mb-2">Welcome to Split-It</h2>
            <p className="text-slate-400 mb-6">Connect your wallet to start splitting expenses with your dorm mates or study groups.</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Plus className="text-emerald-500" /> Create New Group
            </h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <input
                type="text"
                placeholder="Group Name (e.g., Apt 4B)"
                className="w-full bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-emerald-500"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Member Wallet Address"
                  className="flex-1 bg-slate-800 border-none rounded-xl p-3 text-sm font-mono"
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
                  className="bg-slate-800 px-4 rounded-xl hover:bg-slate-700 transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tempMembers.map((m) => (
                  <span key={m} className="bg-emerald-500/10 text-emerald-500 text-[10px] font-mono p-1 px-2 rounded-lg border border-emerald-500/20 truncate max-w-[120px]">
                    {m}
                  </span>
                ))}
              </div>
              <button 
                onClick={handleCreateGroup}
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold transition-all"
              >
                Launch Group
              </button>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold">Active Split Groups</h2>
            <div className="space-y-4">
              {groups.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-12 text-center text-slate-500">
                  No active groups. Create one to get started!
                </div>
              ) : (
                groups.map((group) => (
                  <div 
                    key={group.id}
                    onClick={() => setActiveGroup(group)}
                    className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-all cursor-pointer flex justify-between items-center shadow-lg"
                  >
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{group.name}</h3>
                      <p className="text-sm text-slate-400 flex items-center gap-1">
                        <Users size={14} /> {group.members.length} members
                      </p>
                    </div>
                    <ArrowRight className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
