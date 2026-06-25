"use client";

import React from "react";
import { useDeployment } from "@/lib/deployment-store";

export default function StatsStrip() {
  const { state } = useDeployment();

  return (
    <section className="bg-neutral-900 border-y border-neutral-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          
          {/* Stat 1 */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-1.5 font-mono">
              100%
            </span>
            <span className="text-[10px] md:text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Cryptographic Integrity
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-1.5 font-mono">
              {state.stats.avgPromoTime}
            </span>
            <span className="text-[10px] md:text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Verification Latency
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-1.5 font-mono">
              {state.stats.manualRollbacks}
            </span>
            <span className="text-[10px] md:text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Tamper Attempts Blocked
            </span>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-1.5 font-mono">
              {state.stats.currentUptime}
            </span>
            <span className="text-[10px] md:text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Network Consensus SLA
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
