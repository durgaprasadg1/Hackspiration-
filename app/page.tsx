"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Smartphone,
  BarChart3,
  Layers,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <ShieldCheck className="text-emerald-500" />,
      title: "Blockchain Security",
      desc: "Every transaction is secured on the Algorand blockchain with cryptographic certainty.",
    },
    {
      icon: <Zap className="text-emerald-500" />,
      title: "Instant Settlement",
      desc: "Atomic transactions ensure all debts are cleared simultaneously or not at all.",
    },
    {
      icon: <BarChart3 className="text-emerald-500" />,
      title: "Debt Optimization",
      desc: "Our graph algorithm reduces N-party debts to the absolute minimum number of transfers.",
    },
    {
      icon: <Layers className="text-emerald-500" />,
      title: "Multi-Asset Support",
      desc: "Split expenses in ALGO, USDC, or any campus-specific Algorand Standard Asset (ASA).",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card rounded-none! border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-emerald-500 tracking-tighter italic">
              SPLIT-IT
            </h1>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">
              v2.0
            </span>
          </div>
          <Link
            href="/dashboard"
            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            Launch Protocol
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-emerald-500/10 blur-[120px] -z-10 rounded-full" />

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-12px font-black uppercase tracking-[0.4em] text-emerald-500 mb-6">
              Algorithmically Perfect
            </h2>
            <h3 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-white italic">
              Decentralized Peer <br />
              <span className="text-emerald-500">Expense Graph</span>
            </h3>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              The world's first expense splitter built on Algorand. Minimize
              transfers, verify debts on-chain, and settle instantly with
              institutional-grade security.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-3 active:scale-95 group"
              >
                Enter Dashboard{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto glass-card px-10 py-5 rounded-2xl font-black text-lg hover:border-emerald-500/50 transition-all flex items-center justify-center"
              >
                Whitepaper logic
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Badges */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 opacity-40">
          <div className="flex items-center gap-2 font-black italic tracking-tighter text-2xl">
            ALGORAND
          </div>
          <div className="flex items-center gap-2 font-black italic tracking-tighter text-2xl">
            PERA WALLET
          </div>
          <div className="flex items-center gap-2 font-black italic tracking-tighter text-2xl">
            DEBT GRAPH v3
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h4 className="text-3xl font-black tracking-tight mb-4 italic">
              Engineered for Transparency
            </h4>
            <p className="text-slate-500 max-w-xl mx-auto font-medium">
              Built with the campus economy in mind. From dorm utilities to club
              dinners, Split-It handles the math so you don't have to.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-3xl border-emerald-500/5 hover:border-emerald-500/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h5 className="text-xl font-bold mb-3">{f.title}</h5>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto glass-card rounded-[4rem] p-12 md:p-24 text-center border-emerald-500/20 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 blur-[100px]" />
          <h4 className="text-4xl md:text-5xl font-black mb-8 italic">
            Ready to optimize your <br />{" "}
            <span className="text-emerald-500">financial graph?</span>
          </h4>
          <p className="text-slate-400 max-w-lg mx-auto mb-12 font-medium">
            Join the decentralized campus economy today. Secure, transparent,
            and built on the future of finance.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-emerald-500/30 active:scale-95"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-emerald-500 tracking-tighter italic">
              SPLIT-IT
            </h1>
          </div>
          <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest text-center">
            © 2026 Split-It Protocol. Secured by Algorand Labs.
          </p>
          <div className="flex gap-6 text-slate-500 text-sm font-bold">
            <a href="#" className="hover:text-emerald-500">
              Twitter
            </a>
            <a href="#" className="hover:text-emerald-500">
              Whitepaper
            </a>
            <a href="#" className="hover:text-emerald-500">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
