"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Email+Password, 2: OTP
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        toast.success("Verification code sent to your email!");
      } else {
        toast.error(data.error || "Failed to send code. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result: any = await signIn("credentials", {
        email,
        password,
        otp,
        redirect: false,
      });
      console.log(result);

      if (!result.ok) {
        toast.error("Invalid code. Check your email.");
      } else {
        toast.success("Account verified and created!");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
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
              <UserPlus size={32} className="text-emerald-500" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter mb-2">
              REGISTER
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {step === 1
                ? "Create your account with email and password."
                : "Verify your email with the 6-digit code."}
            </p>
          </div>

          <form
            onSubmit={step === 1 ? handleSendOtp : handleSubmit}
            className="space-y-4"
          >
            {step === 1 ? (
              <>
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
                      placeholder="At least 6 characters"
                      className="w-full glass-input rounded-2xl p-4 pl-12 outline-none focus:border-emerald-500/50 transition-all font-medium"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                  Verification Code
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    className="w-full glass-input rounded-2xl p-4 pl-12 outline-none focus:border-emerald-500/50 transition-all font-medium tracking-[0.5em]"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-emerald-900/40 mt-4 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading
                ? "PLEASE WAIT..."
                : step === 1
                  ? "CREATE ACCOUNT"
                  : "VERIFY CODE"}
            </button>
          </form>

          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="w-full mt-4 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors uppercase tracking-widest"
            >
              Change Email
            </button>
          )}

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-slate-500 text-xs font-medium mb-4">
              Already have an account?
            </p>
            <Link
              href="/auth/signin"
              className="text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-widest text-xs"
            >
              Back to Login
            </Link>
          </div>

          <p className="mt-8 text-center text-[10px] text-slate-600 font-mono uppercase tracking-widest leading-relaxed">
            By registering, you agree to secure your debt graph <br /> on the
            Algorand blockchain.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
