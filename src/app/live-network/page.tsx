"use client";

import React, { useEffect, useState } from "react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import RecentDeploys from "@/components/recent-deploys";
import ClosingCta from "@/components/closing-cta";
import Link from "next/link";
import { ArrowLeft, Cpu, Activity, ShieldCheck, Key, Globe, Wifi, Settings } from "lucide-react";
import { useDeployment } from "@/lib/deployment-store";
import { FloatingCubesBackground } from "@/components/cube-animation";

export default function LiveNetworkPage() {
  const { state, triggerPromotion } = useDeployment();
  const [nodePings, setNodePings] = useState<Record<string, number>>({
    "node-1": 12,
    "node-2": 15,
    "node-3": 18,
    "node-4": 14,
    "node-5": 22,
    "node-6": 16
  });

  // Periodically fluctuate node latencies to make them look alive/dynamic
  useEffect(() => {
    const timer = setInterval(() => {
      setNodePings(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
          next[key] = Math.max(8, Math.min(35, next[key] + delta));
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check if auto=true parameter is present in search queries
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("auto") === "true") {
        const timeout = setTimeout(() => {
          triggerPromotion();
        }, 800);
        return () => clearTimeout(timeout);
      }
    }
  }, []);

  return (
    <>
      <NavBar />
      <main className="relative bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16 overflow-hidden">
        <FloatingCubesBackground count={10} />
        <div className="max-w-7xl mx-auto px-6 mb-10 animate-fade-in">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-accent transition-colors group mb-8"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to homepage
          </Link>

          {/* Header */}
          <div className="mb-6">
            <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold tracking-wide uppercase">
              Decentralized Nodes Dashboard
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-4">
              Consensus Node Simulator
            </h1>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-xl">
              Monitor active validator states in real-time. Use the control panel below to trigger simulated cryptographic operations and watch node propagation logs.
            </p>
          </div>
        </div>

        {/* Live Grid */}
        <RecentDeploys />

        {/* Console Controls */}
        <ClosingCta />

        {/* Real-time Heartbeat Monitor Panel */}
        <section className="py-12 bg-white border-t border-neutral-250/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200/50 pb-6 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                    <Globe size={20} className="text-accent" /> Consortium Network Vital Signs
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 font-semibold">Heartbeat synchronization status and network connection latency for educational nodes.</p>
                </div>
                <div className="flex gap-4 text-xs font-bold font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-green animate-pulse" />
                    <span>6/6 Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi size={14} className="text-cyan-500" />
                    <span>Avg Latency: ~15.8ms</span>
                  </div>
                </div>
              </div>

              {/* Heartbeat nodes list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px]">
                {Object.entries(nodePings).map(([nodeId, ping]) => (
                  <div key={nodeId} className="bg-white border border-neutral-200/60 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Cpu size={14} className="text-neutral-400" />
                        <span className="font-bold text-xs text-neutral-900 uppercase">{nodeId}</span>
                      </div>
                      <div className="text-[9px] text-neutral-400 font-semibold uppercase">
                        IP: 192.168.10.{(parseInt(nodeId.slice(-1)) * 14) + 12} · Peer Count: 5
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <span className="block font-bold text-neutral-800">{ping}ms</span>
                        <span className="text-[8px] text-neutral-400 font-semibold block uppercase">Latency</span>
                      </div>
                      {/* Pulse visual */}
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <span className="absolute w-4 h-4 rounded-full bg-status-green/30 animate-ping" />
                        <span className="relative w-2 h-2 rounded-full bg-status-green" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Deep Dive technical information section */}
        <section className="py-16 bg-white border-t border-neutral-200/40">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 flex items-center gap-2">
              <Cpu className="text-accent" /> Consensus Simulator Technical Specifications
            </h2>

            <div className="space-y-10 text-neutral-600 text-sm md:text-base leading-relaxed font-medium">
              
              {/* Byzantine Fault Tolerant Consensus */}
              <div>
                <h3 className="text-lg font-bold text-neutral-950 mb-3 flex items-center gap-2">
                  <Activity size={18} className="text-accent" /> Byzantine Fault Tolerant (BFT) Consensus
                </h3>
                <p className="mb-4">
                  The network simulator represents a decentralized consortium of 6 active validator nodes. 
                  Unlike public blockchains that consume massive electricity to mine blocks, Trueva uses a **Proof-of-Authority (PoA)** model with **Byzantine Fault Tolerant (BFT)** rules.
                </p>
                <p>
                  To validate a block candidate (e.g. block `blk-4821`), a proposer node broadcasts transaction data containing signed Merkle roots. 
                  Each validator node audits the block independently. A block is successfully committed only when a quorum (2/3 majority, i.e., 4 of 6 validators) signs off on its state transition validity.
                </p>
              </div>

              {/* Validator Node Configuration parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-100">
                <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-150">
                  <h4 className="font-bold text-neutral-900 mb-1.5 flex items-center gap-1 text-xs uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-accent" /> Quorum Quota
                  </h4>
                  <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
                    Requires at least 4 of 6 synced nodes to authenticate block headers. Prevents compromised validators from modifying state records.
                  </p>
                </div>

                <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-150">
                  <h4 className="font-bold text-neutral-900 mb-1.5 flex items-center gap-1 text-xs uppercase tracking-wider">
                    <Key size={14} className="text-accent" /> ECDSA Key Sets
                  </h4>
                  <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
                    Each node validates block payloads by checking signatures against registered public keys of authenticated university registrars.
                  </p>
                </div>

                <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-150">
                  <h4 className="font-bold text-neutral-900 mb-1.5 flex items-center gap-1 text-xs uppercase tracking-wider">
                    <Settings size={14} className="text-accent" /> Gateway Sync
                  </h4>
                  <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
                    The RPC API load balancer routes query validation searches exclusively to validator nodes reporting fully synchronized block heights.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
