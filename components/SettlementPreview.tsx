"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Wand2, Info } from "lucide-react";
import { OptimizedTransfer } from "@/utils/debtGraph";

interface SettlementPreviewProps {
  optimizedTransfers: OptimizedTransfer[];
  rawDebtCount: number;
}

export default function SettlementPreview({
  optimizedTransfers,
  rawDebtCount,
}: SettlementPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-emerald-400">
          <Wand2 size={16} />
          <span className="font-bold">Optimization Active</span>
        </div>
        <div className="text-slate-500 italic">
          Reduced {rawDebtCount} paths → {optimizedTransfers.length} transfers
        </div>
      </div>

      <div className="grid gap-3">
        {optimizedTransfers.map((tx, idx) => (
          <motion.div
            key={`${tx.from}-${tx.to}-${idx}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-4 rounded-xl flex items-center justify-between border-emerald-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono border border-slate-700">
                {tx.from.slice(0, 2)}
              </div>
              <ArrowRight size={14} className="text-emerald-500" />
              <div className="w-8 h-8 rounded-full bg-emerald-900/40 flex items-center justify-center text-[10px] font-mono border border-emerald-500/30">
                {tx.to.slice(0, 2)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-emerald-400 font-bold">
                {tx.amount.toFixed(2)}{" "}
                {tx.assetId ? `ASA ${tx.assetId}` : "ALGO"}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {tx.from.slice(0, 6)}... → {tx.to.slice(0, 6)}...
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-3 bg-slate-900/40 rounded-lg flex gap-3 text-xs text-slate-400">
        <Info size={16} className="shrink-0 text-emerald-500" />
        <p>
          Atomic Transfers link these payments together. Either all payments
          succeed, or none do.
        </p>
      </div>
    </div>
  );
}
