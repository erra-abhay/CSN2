"use client";

import React from "react";
import { useDeployment } from "@/lib/deployment-store";
import { Play, ShieldAlert, Cpu, RotateCcw } from "lucide-react";

export default function ClosingCta() {
  const { state, triggerPromotion, triggerScaleOut, triggerRollback, resetSimulation } = useDeployment();

  const handleTriggerDeploy = () => {
    const target = document.getElementById("live-deploys");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      triggerPromotion();
    }, 600);
  };

  const handleTriggerScale = () => {
    const target = document.getElementById("live-deploys");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      triggerScaleOut();
    }, 600);
  };

  const handleTriggerRollback = () => {
    const target = document.getElementById("live-deploys");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      triggerRollback();
    }, 600);
  };

  return (
    <section className="py-24 bg-[#FAF9F6] border-t border-neutral-200/40 relative overflow-hidden">
      {/* Blurred background dot */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full bg-blue-100/30 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mb-6">
          Built for absolute trust.
        </h2>
        
        <p className="text-neutral-600 text-sm md:text-base max-w-xl mx-auto mb-12 leading-relaxed">
          Interactive consensus console. Trigger different simulated cryptographic events below, 
          then scroll up to watch the active validator nodes synchronize blocks and RPC endpoints redistribute requests.
        </p>

        {/* Dashboard Control Box */}
        <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-sm max-w-2xl mx-auto">
          <div className="text-left border-b border-neutral-100 pb-3 mb-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Consensus Control Panel
            </span>
            <span className="text-[10px] font-bold font-mono text-neutral-500">
              Chain Status: <span className="text-accent uppercase">{state.status === "building" ? "hashing" : state.status}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Action 1: Anchor Cert Batch */}
            <button
              onClick={handleTriggerDeploy}
              disabled={state.status !== "idle" && state.status !== "completed" && state.status !== "rolled-back"}
              className="px-5 py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-97"
            >
              <Play size={12} fill="currentColor" />
              Anchor Cert Batch (blk-4821)
            </button>

            {/* Action 2: Scale validator pool */}
            <button
              onClick={handleTriggerScale}
              disabled={state.status !== "idle" && state.status !== "completed" && state.status !== "rolled-back"}
              className="px-5 py-3.5 bg-white hover:bg-neutral-50 disabled:opacity-50 border border-neutral-200 text-neutral-800 font-semibold text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-97"
            >
              <Cpu size={12} />
              Scale Validator Pool (+2 Nodes)
            </button>

            {/* Action 3: Simulate Tamper */}
            <button
              onClick={handleTriggerRollback}
              disabled={state.status !== "completed" || state.activeScenario !== null}
              className="px-5 py-3.5 bg-white hover:bg-neutral-50 disabled:opacity-50 border border-neutral-200 text-status-red font-semibold text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-97"
            >
              <ShieldAlert size={12} />
              Simulate Block Tamper Attack
            </button>

            {/* Action 4: Reset */}
            <button
              onClick={resetSimulation}
              className="px-5 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-97"
            >
              <RotateCcw size={12} />
              Reset Ledger State
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
