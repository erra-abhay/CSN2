"use client";

import React, { useState } from "react";
import { useDeployment } from "@/lib/deployment-store";
import { CheckCircle2, Play, ArrowRight, X, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingCubesBackground } from "./cube-animation";

export default function Hero() {
  const { state, triggerPromotion } = useDeployment();
  const [showTimeline, setShowTimeline] = useState(false);

  const handleWatchDeploy = () => {
    const target = document.getElementById("live-deploys");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      triggerPromotion();
    }, 600);
  };

  const handleScrollToArch = () => {
    const target = document.getElementById("architecture");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get status dot color
  const getStatusColor = () => {
    switch (state.status) {
      case "idle":
      case "completed":
        return "bg-status-green animate-pulse";
      case "building":
      case "verifying":
      case "rolling":
      case "swapping":
      case "rolling-back":
        return "bg-status-amber animate-pulse-slow";
      case "rolled-back":
        return "bg-status-red";
      default:
        return "bg-neutral-400";
    }
  };

  // Get dynamic summary sentence for the floating status card
  const getStatusText = () => {
    const activeV = state.activeVersion;
    const targetV = state.targetVersion;

    switch (state.status) {
      case "idle":
        return `Decentralized ledger running stable at block ${activeV}. All 6 primary validator nodes synced.`;
      case "building":
        return `Batch Anchoring triggered. Hashing credentials and building Merkle Tree for ${targetV}...`;
      case "verifying":
        return `Verifying cryptographic signature on ${targetV}. Auditing Merkle proof path...`;
      case "rolling":
        const drainedCount = state.instances.filter(i => i.status === "healthy-new" || i.status === "creating").length;
        return `Consensus propagation in progress. ${drainedCount} of 6 validators verified and updated to block ${targetV}.`;
      case "swapping":
        return `State transition proposed. Reconfiguring routing tables: ${activeV} → ${targetV} (100% agreement).`;
      case "completed":
        return `Block #${targetV} committed successfully. All 6 nodes synchronized. Zero validation delay.`;
      case "rolling-back":
        return `CRITICAL: Block signature mismatch detected. Consensus failed. Reverting to last honest block ${targetV}...`;
      case "rolled-back":
        return `Ledger state restored back to stable block ${activeV}. Malicious transaction successfully isolated.`;
      default:
        return `Auditing network status...`;
    }
  };

  return (
    <section className="relative pt-32 pb-44 overflow-hidden flex flex-col items-center justify-center">
      {/* Reusable floating background blockchain cubes */}
      <FloatingCubesBackground count={12} />

      {/* Dynamic blurred ambient gradient background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-200/40 blur-[120px] animate-gradient-slow" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-indigo-100/50 blur-[90px] animate-float" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-200/60 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-neutral-600 uppercase">
            Decentralized Trust Network · Immutable Verification
          </span>
        </div>

        {/* Giant headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.08] mb-6 max-w-3xl mx-auto">
          Cryptographic Trust.
          <span className="block mt-2">
            Instantly{" "}
            <span className="text-accent font-black drop-shadow-sm">verified.</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-10">
          csn2.me is a public live demonstration of Trueva's decentralized validator network and verification registry. 
          Certificate hashes are signed, batched into Merkle Trees, and anchored onto a PoA blockchain. 
          Query nodes distribute verification traffic dynamically, rejecting tampered records in real-time.
          <span className="block mt-2 font-semibold text-neutral-800">
            Instant verifiability. Zero reliance on central authorities.
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <button
            onClick={handleWatchDeploy}
            className="w-full sm:w-auto px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Play size={15} fill="currentColor" />
            Watch Live Sync
          </button>
          <button
            onClick={handleScrollToArch}
            className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-neutral-100/50 text-neutral-800 font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
          >
            Read Technical Specs
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Floating status card (peeking up) */}
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-premium border border-neutral-200/50 p-6 text-left relative z-20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-sm font-bold text-neutral-800">Trueva Registry (TCR)</span>
                <span className="text-xs font-medium text-neutral-400">·</span>
                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-mono font-bold uppercase">
                  mainnet-proof
                </span>
                <span className="text-xs font-medium text-neutral-400">·</span>
                <span className="text-xs font-mono font-medium text-neutral-500">
                  Block #{state.status === "idle" ? "blk-4820" : state.targetVersion}
                </span>
                <span className="text-xs font-medium text-neutral-400">·</span>
                <span className="text-xs font-mono text-neutral-400 font-medium">
                  node: <span className="text-neutral-650 font-bold">{state.hostname}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                <span className="text-xs font-semibold text-neutral-600 capitalize">
                  {state.status === "idle" ? "synced" : state.status.replace("-", " ")}
                </span>
              </div>
            </div>

            {/* Checkmark verification row */}
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="text-status-green w-4 h-4 shrink-0" />
              <span className="text-xs font-semibold text-neutral-800">
                {state.status === "building" ? "Hashing credentials — building Merkle Root" : "Merkle Root committed — signature verified by all nodes"}
              </span>
            </div>

            {/* Real-time description update */}
            <div className="flex items-start gap-3 bg-neutral-50 rounded-xl p-3.5 border border-neutral-100">
              <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-black text-accent shrink-0 mt-0.5">
                t2
              </div>
              <div className="flex-1 text-xs leading-normal text-neutral-700 font-medium">
                {getStatusText()}
              </div>
              <button
                onClick={() => setShowTimeline(true)}
                className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors whitespace-nowrap shrink-0 mt-0.5 cursor-pointer underline decoration-dotted"
              >
                View Ledger Logs
              </button>
            </div>
          </div>

          {/* Underlay decoration showing card dimensions */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-100/40 to-indigo-100/40 rounded-[24px] -z-10 blur-sm pointer-events-none" />
        </div>
      </div>

      {/* Log Timeline Modal */}
      <AnimatePresence>
        {showTimeline && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTimeline(false)}
              className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl z-10 overflow-hidden text-neutral-300"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-neutral-850 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Terminal size={16} className="text-accent" />
                  <span className="font-bold text-sm text-white">Decentralized Registry Log Stream</span>
                </div>
                <button
                  onClick={() => setShowTimeline(false)}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Log view area */}
              <div className="p-5 font-mono text-xs leading-relaxed max-h-[350px] overflow-y-auto no-scrollbar flex flex-col gap-2">
                {state.logs.map((log, index) => {
                  let colorClass = "text-neutral-400";
                  if (log.includes("[Chain]")) colorClass = "text-blue-400";
                  if (log.includes("[Consensus]")) colorClass = "text-emerald-400";
                  if (log.includes("[Registry]")) colorClass = "text-cyan-400";
                  if (log.includes("[HashEngine]")) colorClass = "text-indigo-400 text-bold";
                  if (log.includes("[Gateway]")) colorClass = "text-amber-400";
                  if (log.includes("CRITICAL") || log.includes("failed")) colorClass = "text-red-400 font-bold";

                  return (
                    <div key={index} className={`${colorClass} whitespace-pre-wrap`}>
                      {log}
                    </div>
                  );
                })}
                {state.status !== "idle" && state.status !== "completed" && state.status !== "rolled-back" && (
                  <div className="flex items-center gap-2 text-accent animate-pulse mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                    <span>Consensus protocol processing event...</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3.5 bg-neutral-950 border-t border-neutral-850 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Active Target: {state.targetVersion}</span>
                <span>Gateway RPC: Synced</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
