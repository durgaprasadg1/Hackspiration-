"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Share2 } from "lucide-react";
import toast from "react-hot-toast";

interface ShareQRProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareQR({ groupId, isOpen, onClose }: ShareQRProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/join/${groupId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative glass-card w-full max-w-sm p-8 rounded-3xl text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="mb-6 flex justify-center">
              <div className="bg-white p-4 rounded-2xl">
                <QRCodeSVG value={shareUrl} size={200} />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2">Invite Friends</h3>
            <p className="text-slate-400 text-sm mb-6">
              Share this QR code or link to let roommates join the group
              instantly.
            </p>

            <div className="flex gap-2">
              <div className="flex-1 glass-input rounded-xl p-3 text-sm truncate text-slate-300 font-mono">
                {shareUrl}
              </div>
              <button
                onClick={handleCopy}
                className="bg-emerald-600 hover:bg-emerald-500 p-3 rounded-xl transition-all"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
