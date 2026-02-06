import Link from "next/link";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
      <div className="glass-card p-12 rounded-[3rem] border-emerald-500/20 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <AlertTriangle size={120} />
        </div>

        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 text-emerald-500">
          <AlertTriangle size={40} />
        </div>

        <h1 className="text-6xl font-black text-emerald-500 mb-2 italic">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-6">Route Not Found</h2>

        <p className="text-slate-400 mb-8 leading-relaxed">
          The financial block you are looking for does not exist in our current
          chain. Please return to the main dashboard.
        </p>

        <Link
          href="/"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Home size={20} /> Back to Base
        </Link>

        <div className="mt-8 pt-8 border-t border-slate-900">
          <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
            Error Code: ERR_BLOCK_NOT_FOUND
          </p>
        </div>
      </div>
    </div>
  );
}
