"use client";

import React, { useState } from "react";
import { Terminal, Check, Server, RefreshCw } from "lucide-react";
import { useDeployment } from "@/lib/deployment-store";

export default function RecentDeploys() {
  const { state } = useDeployment();

  const normalLogs = [
    "[10:14:02] [Pipeline] Starting rollout #128...",
    "[10:14:04] [Registry] Pushing image tag: acadhub-api:v128-production",
    "[10:14:05] [HealthCheck] Gated test passed. Verification successful.",
    "[10:14:06] [VM-Set] Upgrading 6 VM instances...",
    "[10:14:38] [Traefik] Swapping traffic split: v127 (0%) -> v128 (100%).",
    "[10:14:41] [System] Rollout v128-production fully live. Fleet healthy.",
  ];

  const scaleLogs = [
    "[08:30:00] [AutoScaler] CPU usage at 85% (threshold: 80%) for 3m.",
    "[08:30:02] [AutoScaler] Scaling out: provisioning 2 instances (vm-6, vm-7).",
    "[08:30:15] [VM-Set] Instances vm-6, vm-7 boot complete. Running v128.",
    "[08:30:20] [HealthCheck] vm-6 and vm-7 reporting healthy.",
    "[08:30:22] [Traefik] Attaching vm-6, vm-7 to load balancer pool.",
    "[08:30:25] [AutoScaler] Average CPU utilization stabilized at 45%.",
  ];

  const rollbackLogs = [
    "[15:22:00] [Pipeline] Starting rollout #127...",
    "[15:22:04] [Registry] Tag promoted: acadhub-api:v127-production",
    "[15:22:08] [HealthCheck] CRITICAL: /health returned 500 Internal Error.",
    "[15:22:09] [Pipeline] Failure threshold exceeded. Reverting traffic split...",
    "[15:22:10] [Traefik] Traffic reverted: v127 (0%) -> v126 (100%).",
    "[15:22:15] [System] Rollback drill finished. v126 restored. 0 downtime.",
  ];

  return (
    <section id="live-deploys" className="py-24 bg-white border-t border-neutral-250/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            What&apos;s running right now
          </h2>
          <p className="text-neutral-600 text-sm md:text-base max-w-xl mx-auto">
            Real events from the deployment pipeline, replayed here. Watch how the fleet automatically reacts.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Normal Promotion */}
          <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-status-green flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-green" />
                  Completed in 41s
                </span>
                <span className="text-xs font-semibold text-neutral-400">2 hours ago</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-4">
                Promote v128 → production
              </h3>
              
              <ul className="space-y-2.5 mb-6 text-xs text-neutral-600 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  Image tag verified
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  Instances draining
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  Traffic swapped via Traefik
                </li>
              </ul>
            </div>

            {/* Micro Terminal */}
            <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[10px] text-neutral-400 leading-relaxed border border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
                <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
                  <Terminal size={10} /> deploy_v128.log
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-status-green" />
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[110px] no-scrollbar">
                {normalLogs.map((log, i) => (
                  <div key={i} className={log.includes("[System]") ? "text-emerald-400" : ""}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Scale Set Expansion */}
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
                Scale Set: +2 VM instances
              </h3>
              
              <ul className="space-y-2.5 mb-6 text-xs text-neutral-600 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-amber/10 flex items-center justify-center text-status-amber">
                    <Server size={10} />
                  </div>
                  CPU utilization peak &gt; 82%
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  VM-6 & VM-7 provisioned
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  Load balancer attached
                </li>
              </ul>
            </div>

            {/* Micro Terminal */}
            <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[10px] text-neutral-400 leading-relaxed border border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
                <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
                  <Terminal size={10} /> autoscale_monitor.log
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-status-amber" />
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[110px] no-scrollbar">
                {scaleLogs.map((log, i) => (
                  <div key={i} className={log.includes("[AutoScaler]") ? "text-amber-400" : ""}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Rollback drill */}
          <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-status-red flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-red" />
                  Rollback Drill
                </span>
                <span className="text-xs font-semibold text-neutral-400">1 day ago</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-4">
                Rollback drill: v127 → v126
              </h3>
              
              <ul className="space-y-2.5 mb-6 text-xs text-neutral-600 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-red/10 flex items-center justify-center text-status-red">
                    <RefreshCw size={10} />
                  </div>
                  Health failure simulation (v127)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  Immediate Traefik revert
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  0 manual intervention
                </li>
              </ul>
            </div>

            {/* Micro Terminal */}
            <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[10px] text-neutral-400 leading-relaxed border border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
                <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
                  <Terminal size={10} /> rollback_exec.log
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-status-red" />
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[110px] no-scrollbar">
                {rollbackLogs.map((log, i) => (
                  <div key={i} className={log.includes("[System]") ? "text-emerald-400" : log.includes("CRITICAL") ? "text-red-400 font-bold" : ""}>
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
                  ACTIVE DEPLOY PIPELINE: {state.activeScenario?.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-neutral-500">
                Target Version: {state.targetVersion}
              </span>
            </div>

            {/* List of VMs and Progress */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
              {state.instances.map((vm) => {
                let statusBg = "bg-neutral-850 border-neutral-800 text-neutral-500";
                if (vm.status === "healthy-old") statusBg = "bg-neutral-800 border-neutral-700 text-neutral-300";
                if (vm.status === "draining") statusBg = "bg-status-amber/10 border-status-amber/30 text-status-amber animate-pulse";
                if (vm.status === "creating") statusBg = "bg-blue-950 border-blue-900 text-blue-300 animate-pulse";
                if (vm.status === "healthy-new") statusBg = "bg-status-green/10 border-status-green/30 text-status-green";

                return (
                  <div key={vm.id} className={`border rounded-xl p-3 flex flex-col items-center justify-center text-center ${statusBg}`}>
                    <span className="text-[10px] font-bold uppercase">{vm.id}</span>
                    <span className="text-[9px] mt-1 font-semibold">{vm.version}</span>
                    <span className="text-[8px] text-neutral-500 mt-0.5">{vm.ip}</span>
                    <span className="text-[8px] mt-1.5 uppercase font-black text-center text-[7px]">
                      {vm.status.replace("-", " ")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Live Terminal Log Stream */}
            <div className="bg-black/40 rounded-xl p-4 h-[180px] overflow-y-auto flex flex-col gap-1 border border-neutral-850 no-scrollbar">
              {state.logs.map((log, idx) => (
                <div key={idx} className={log.includes("CRITICAL") || log.includes("failure") ? "text-red-400 font-bold" : log.includes("[HealthCheck]") ? "text-emerald-400" : ""}>
                  {log}
                </div>
              ))}
              <div className="text-accent animate-pulse font-semibold mt-1">
                &gt; Listening for pipeline telemetry...
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
