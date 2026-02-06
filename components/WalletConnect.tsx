"use client";

import React, { useEffect } from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import { useAppContext } from "@/context/AppContext";
import { Wallet, LogOut } from "lucide-react";

const peraWallet = new PeraWalletConnect();

export default function WalletConnect() {
  const { address, setAddress } = useAppContext();

  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length) {
        setAddress(accounts[0]);
      }
    });
  }, [setAddress]);

  const handleConnect = async () => {
    try {
      const accounts = await peraWallet.connect();
      setAddress(accounts[0]);
    } catch (error: any) {
      if (error?.message !== "Connect modal is closed by user") {
        console.error(error);
      }
    }
  };

  const handleDisconnect = () => {
    peraWallet.disconnect();
    setAddress(null);
  };

  return (
    <div className="flex items-center gap-4 ">
      {address ? (
        <div className="flex items-center gap-3 bg-slate-800 p-2 px-4 rounded-xl border border-emerald-500/30">
          <span className="text-slate-300 text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <button
            onClick={handleDisconnect}
            className="text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl transition-all shadow-lg shadow-emerald-900/20"
        >
          <Wallet size={18} />
          <span className="font-semibold">Connect Wallet</span>
        </button>
      )}
    </div>
  );
}
