"use client";

import React, { useState } from "react";
import { Terminal, Check, Server, ShieldAlert } from "lucide-react";
import { useDeployment } from "@/lib/deployment-store";

export default function RecentDeploys() {
  const { state } = useDeployment();

  const normalLogs = [
    "[10:14:02] [Chain] Starting certificate batch anchoring...",
    "[10:14:04] [HashEngine] 42 documents compiled. Merkle root ready.",
    "[10:14:05] [Consensus] Check successful. Signature verified.",
    "[10:14:06] [Network] Propagating block blk-4820 to 6 nodes...",
    "[10:14:38] [Gateway] Redirecting query traffic to blk-4820 registry.",
    "[10:14:41] [Chain] State sync completed. Block committed.",
  ];

  const scaleLogs = [
    "[08:30:00] [Gateway] Query spike detected. CPU capacity > 80%.",
    "[08:30:02] [Gateway] Dynamic scaling rule triggered: +2 nodes.",
    "[08:30:15] [Network] Nodes node-6, node-7 online. Syncing ledger...",
    "[08:30:20] [Consensus] Verification nodes synchronized with blk-4820.",
    "[08:30:22] [Gateway] Registered node-6 and node-7 to balancing pool.",
    "[08:30:25] [Gateway] Query latency stabilized at 120ms.",
  ];

  const rollbackLogs = [
    "[15:22:00] [Chain] Candidate block proposed by node-3...",
    "[15:22:04] [HashEngine] Compiling transactions for proposed block...",
    "[15:22:08] [Consensus] CRITICAL: Invalid signature block hash mismatch.",
    "[15:22:09] [Gateway] Block rejected. Isolating malicious transaction...",
    "[15:22:10] [Gateway] RPC Gateway routing locked to last stable block.",
    "[15:22:15] [Chain] Re-synchronized validator pool to blk-4819. Stable.",
  ];

  return (
    <section id="live-deploys" className="py-24 bg-white border-t border-neutral-250/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Live Ledger Activity
          </h2>
          <p className="text-neutral-600 text-sm md:text-base max-w-xl mx-auto">
            Real-time consensus telemetry, simulated live. Watch how the validator network automatically reaches agreement.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Batch Certification */}
          <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-status-green flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-green" />
                  Anchor Complete
                </span>
                <span className="text-xs font-semibold text-neutral-400">2 hours ago</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-4">
                Anchor Batch → blk-4820
              </h3>
              
              <ul className="space-y-2.5 mb-6 text-xs text-neutral-600 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  Issuer identity signature verified
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  Merkle tree path integrity OK
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  Block propagated to all nodes
                </li>
              </ul>
            </div>

            {/* Micro Terminal */}
            <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[10px] text-neutral-400 leading-relaxed border border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
                <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
                  <Terminal size={10} /> block_4820_commit.log
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-status-green" />
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[110px] no-scrollbar">
                {normalLogs.map((log, i) => (
                  <div key={i} className={log.includes("[Chain]") ? "text-emerald-400" : ""}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Verifier Scaling */}
          <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-status-amber flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-amber animate-pulse" />
                  Auto-scale out
                </span>
                <span className="text-xs font-semibold text-neutral-400">4 hours ago</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-4">
                Verifier Pool: +2 RPC Nodes
              </h3>
              
              <ul className="space-y-2.5 mb-6 text-xs text-neutral-600 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-amber/10 flex items-center justify-center text-status-amber">
                    <Server size={10} />
                  </div>
                  API query volume &gt; 4,200/s
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  node-6 & node-7 synced
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  Verification gateway pool expanded
                </li>
              </ul>
            </div>

            {/* Micro Terminal */}
            <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[10px] text-neutral-400 leading-relaxed border border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
                <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
                  <Terminal size={10} /> gateway_autoscaler.log
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-status-amber" />
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[110px] no-scrollbar">
                {scaleLogs.map((log, i) => (
                  <div key={i} className={log.includes("[Gateway]") ? "text-amber-400" : ""}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Audit failure drill */}
          <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-status-red flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-red" />
                  Audit Rejection
                </span>
                <span className="text-xs font-semibold text-neutral-400">1 day ago</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-4">
                Consensus rejection: blk-4819
              </h3>
              
              <ul className="space-y-2.5 mb-6 text-xs text-neutral-600 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-red/10 flex items-center justify-center text-status-red">
                    <ShieldAlert size={10} />
                  </div>
                  Block signature signature mismatch (node-3)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  Proposed block transition aborted
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  Isolate node, sync back to honest block
                </li>
              </ul>
            </div>

            {/* Micro Terminal */}
            <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[10px] text-neutral-400 leading-relaxed border border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
                <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
                  <Terminal size={10} /> audit_consensus.log
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-status-red" />
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[110px] no-scrollbar">
                {rollbackLogs.map((log, i) => (
                  <div key={i} className={log.includes("[Chain]") ? "text-emerald-400" : log.includes("CRITICAL") ? "text-red-400 font-bold" : ""}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulation Display (Appears when simulation is active) */}
        {state.status !== "idle" && (
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 font-mono text-xs text-neutral-300 shadow-xl max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                <span className="font-bold text-white uppercase tracking-wider">
                  ACTIVE CONSENSUS PIPELINE: {state.activeScenario === "promotion" ? "BATCH ISSUANCE" : state.activeScenario?.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-neutral-500">
                Target Block: {state.targetVersion}
              </span>
            </div>

            {/* List of Validators and Progress */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
              {state.instances.map((vm) => {
                let statusBg = "bg-neutral-850 border-neutral-800 text-neutral-500";
                let statusLabel = vm.status.replace("-", " ");
                if (vm.status === "healthy-old") {
                  statusBg = "bg-neutral-800 border-neutral-700 text-neutral-300";
                  statusLabel = "synced";
                }
                if (vm.status === "draining") {
                  statusBg = "bg-status-amber/10 border-status-amber/30 text-status-amber animate-pulse";
                  statusLabel = "receiving";
                }
                if (vm.status === "creating") {
                  statusBg = "bg-blue-950 border-blue-900 text-blue-300 animate-pulse";
                  statusLabel = "verifying";
                }
                if (vm.status === "healthy-new") {
                  statusBg = "bg-status-green/10 border-status-green/30 text-status-green";
                  statusLabel = "appended";
                }

                return (
                  <div key={vm.id} className={`border rounded-xl p-3 flex flex-col items-center justify-center text-center ${statusBg}`}>
                    <span className="text-[10px] font-bold uppercase">{vm.id}</span>
                    <span className="text-[9px] mt-1 font-semibold">{vm.version}</span>
                    <span className="text-[8px] text-neutral-500 mt-0.5">{vm.ip}</span>
                    <span className="text-[8px] mt-1.5 uppercase font-black text-center text-[7px]">
                      {statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Live Terminal Log Stream */}
            <div className="bg-black/40 rounded-xl p-4 h-[180px] overflow-y-auto flex flex-col gap-1 border border-neutral-850 no-scrollbar">
              {state.logs.map((log, idx) => (
                <div key={idx} className={log.includes("CRITICAL") || log.includes("failed") ? "text-red-400 font-bold" : log.includes("[Consensus]") || log.includes("[HashEngine]") ? "text-emerald-400" : ""}>
                  {log}
                </div>
              ))}
              <div className="text-accent animate-pulse font-semibold mt-1">
                &gt; Listening for network consensus telemetry...
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
