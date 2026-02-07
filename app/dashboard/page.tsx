"use client";

import React, { useState, useEffect } from "react";
import WalletConnect from "@/components/WalletConnect";
import GroupView from "@/components/GroupView";
import { useAppContext } from "@/context/AppContext";
import {
  Plus,
  Users,
  ArrowRight,
  Wallet,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { Group } from "@/utils/algorand";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { address, activeGroup, setActiveGroup, groups, setGroups, isLoading } =
    useAppContext();
  const [newGroupName, setNewGroupName] = useState("");
  const [newMember, setNewMember] = useState("");
  const [tempMembers, setTempMembers] = useState<string[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-emerald-500 text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (status !== "authenticated") {
    return null;
  }

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
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-slate-400 hover:text-emerald-500 transition-colors"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-emerald-500 tracking-tighter italic">
              SPLIT-IT
            </h1>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">
              Smart Expense Ledger
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right mr-2">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-tight">
              Identity Verified
            </p>
            <p className="text-xs text-slate-400 font-medium">
              {session?.user?.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
          <WalletConnect />
        </div>
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
              <h2 className="text-3xl font-black mb-4 tracking-tight">
                Financial Protocol
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Connect your Algorand wallet to access the decentralized expense
                splitting graph. Manage dorm costs and campus tabs with
                cryptographic certainty.
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
              <div className="glass-card rounded-4xl p-8 space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-widest">
                    Protocol Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Room 402 Utilities"
                    className="w-full glass-input rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-widest">
                    Add Participant Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Algorand Address..."
                      className="flex-1 glass-input rounded-2xl p-4 text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newMember}
                      onChange={(e) => setNewMember(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        if (newMember.length === 58) {
                          setTempMembers([...tempMembers, newMember]);
                          setNewMember("");
                        } else {
                          toast.error("Invalid Algosig address");
                        }
                      }}
                      className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-500 px-6 rounded-2xl transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {tempMembers.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800"
                    >
                      <span className="text-[10px] font-mono text-slate-400">
                        {m.slice(0, 12)}...{m.slice(-8)}
                      </span>
                      <button
                        onClick={() =>
                          setTempMembers(
                            tempMembers.filter((_, i) => i !== idx),
                          )
                        }
                        className="text-red-500/50 hover:text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {tempMembers.length === 0 && (
                    <p className="text-center text-slate-600 text-xs italic py-4">
                      No observers added to graph
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCreateGroup}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
                >
                  Confirm Group Setup
                </button>
              </div>
            </section>

            <section className="lg:col-span-7 space-y-8">
              <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Users size={20} className="text-slate-950" />
                </div>
                Active Ledgers
              </h2>
              {groups.length === 0 ? (
                <div className="glass-card rounded-[2.5rem] p-16 text-center border-dashed border-2 border-slate-800">
                  <Users size={64} className="mx-auto mb-6 text-slate-800" />
                  <p className="text-slate-500 font-medium">
                    No ledger groups found in local registry.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groups.map((group) => (
                    <motion.div
                      key={group.id}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveGroup(group)}
                      className="glass-card rounded-3xl p-8 cursor-pointer border-emerald-500/0 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ArrowRight size={40} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-slate-100">
                        {group.name}
                      </h3>
                      <div className="flex items-center gap-2 text-emerald-500/70 text-sm font-bold">
                        <Users size={16} /> {group.members.length} Participants
                      </div>
                      <div className="mt-6 flex justify-between items-center bg-slate-900/50 p-3 rounded-xl">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                          Status
                        </span>
                        <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 rounded-md">
                          Live Graph
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
