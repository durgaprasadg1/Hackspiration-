"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result: any = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result.ok) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Login Successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-emerald-500/10 blur-[120px] -z-10 rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors mb-8 font-bold text-xs uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Back
        </Link>

        <div className="glass-card p-10 rounded-[2.5rem] border-emerald-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-3xl" />

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <ShieldCheck size={32} className="text-emerald-500" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter mb-2">
              LOGIN
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  size={18}
                />
                <input
                  type="email"
                  required
                  placeholder="name@campus.edu"
                  className="w-full glass-input rounded-2xl p-4 pl-12 outline-none focus:border-emerald-500/50 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  size={18}
                />
                <input
                  type="password"
                  required
                  placeholder="Your password"
                  className="w-full glass-input rounded-2xl p-4 pl-12 outline-none focus:border-emerald-500/50 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-emerald-900/40 mt-4 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? "PLEASE WAIT..." : "LOGIN NOW"}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-slate-500 text-xs font-medium mb-4">
              Don't have an account?
            </p>
            <Link
              href="/auth/register"
              className="text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-widest text-xs"
            >
              Register Now
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
