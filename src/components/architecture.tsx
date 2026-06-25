"use client";

import React, { useState } from "react";
import { Users, Shield, Server, FolderGit2, Anchor, HelpCircle, Sparkles } from "lucide-react";
import { useDeployment } from "@/lib/deployment-store";

interface NodeDetails {
  title: string;
  subtitle: string;
  description: string;
  details: string[];
}

export default function Architecture() {
  const { state } = useDeployment();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const nodes: Record<string, NodeDetails> = {
    registry: {
      title: "Smart Contract Registry",
      subtitle: "Trueva Registry Contract (TCR)",
      description: "Deployed smart contract containing public keys of authorized issuers and roots of certificate batches.",
      details: [
        "Immutable anchors prevent retrospective changes.",
        "Batch commits verify multiple documents in a single transaction.",
        "Secured by Proof-of-Authority consensus signatures."
      ]
    },
    fleet: {
      title: "Decentralized Validator Pool",
      subtitle: "Proof-of-Authority (PoA) Nodes",
      description: "Replicated nodes validating proposed blocks and serving verification queries to the gateway.",
      details: [
        "Scales read capacity dynamically to handle transaction peaks.",
        "Requires quorum signatures for state transitions.",
        "Maintains copy of the ledger containing Merkle roots."
      ]
    },
    anchor: {
      title: "Consensus Coordinator",
      subtitle: "Orchestration & Block Creation",
      description: "Consensus orchestrator running BFT rules to organize transactions and trigger node updates.",
      details: [
        "Aggregates signed hash batches into block structures.",
        "Propagates proposed state blocks sequentially to all nodes.",
        "Triggers alert and isolates malicious node proposed mismatches."
      ]
    },
    proxy: {
      title: "Verification Gateway API",
      subtitle: "RPC Node Gateway Layer",
      description: "Load-balanced gateway routing verification checks to synchronized verifier nodes.",
      details: [
        "Dynamically reads current block height of nodes.",
        "Enforces zero-downtime hot-swaps between synced block states.",
        "Applies verification rate-limiting and query filters."
      ]
    },
    users: {
      title: "Relying Parties",
      subtitle: "Employers & Universities",
      description: "Third-party entities sending verification queries to csn2.me.",
      details: [
        "Experience 100% query reliability during block syncs.",
        "Zero dependency on central registrar database access.",
        "Sub-150ms verification proof latency globally."
      ]
    }
  };

  const getTooltipContent = () => {
    if (!activeTooltip || !nodes[activeTooltip]) return null;
    const node = nodes[activeTooltip];
    return (
      <div className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-xl p-5 shadow-lg animate-fade-in">
        <h4 className="text-sm font-bold text-white mb-0.5">{node.title}</h4>
        <span className="text-[10px] font-semibold text-accent font-mono block mb-3 uppercase tracking-wider">
          {node.subtitle}
        </span>
        <p className="text-xs text-neutral-400 leading-relaxed mb-3">
          {node.description}
        </p>
        <ul className="space-y-1.5 text-[11px] text-neutral-500 list-disc list-inside">
          {node.details.map((detail, idx) => (
            <li key={idx}>{detail}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section id="architecture" className="py-24 bg-white border-t border-neutral-200/40 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Headings */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Verification Network Topology
          </h2>
          <p className="text-neutral-600 text-sm md:text-base max-w-xl mx-auto">
            Interactive system flow. Tap or hover over any architectural node to view details of its operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left / Center: Dynamic Visual Diagram */}
          <div className="lg:col-span-3 bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-8 shadow-sm flex flex-col justify-between min-h-[460px]">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Interactive Ledger Topology
              </span>
              <span className="text-[10px] text-neutral-500 font-semibold flex items-center gap-1">
                <HelpCircle size={12} className="text-neutral-400" /> Hover node to view details
              </span>
            </div>

            {/* Topology Flowchart */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 relative py-6">
              
              {/* Connecting line backgrounds */}
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-neutral-200/80 -translate-y-1/2 -z-10" />

              {/* Node 1: Smart Contract Registry */}
              <button
                onMouseEnter={() => setActiveTooltip("registry")}
                onClick={() => setActiveTooltip("registry")}
                className={`w-full md:w-36 bg-white border rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all duration-200 hover:border-accent hover:-translate-y-0.5 focus:outline-none ${
                  activeTooltip === "registry" ? "border-accent ring-2 ring-accent/10" : "border-neutral-200/60"
                }`}
              >
                <FolderGit2 className="text-accent mb-2.5 w-6 h-6" />
                <span className="text-xs font-bold text-neutral-800">Contract Registry</span>
                <span className="text-[9px] text-neutral-400 mt-0.5 font-mono">TCR blk-4820</span>
              </button>

              {/* Arrow */}
              <div className="hidden md:block text-neutral-400 font-black">→</div>

              {/* Node 2: Decentralized Validator Pool */}
              <button
                onMouseEnter={() => setActiveTooltip("fleet")}
                onClick={() => setActiveTooltip("fleet")}
                className={`w-full md:w-44 bg-white border rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all duration-200 hover:border-accent hover:-translate-y-0.5 focus:outline-none ${
                  activeTooltip === "fleet" ? "border-accent ring-2 ring-accent/10" : "border-neutral-200/60"
                }`}
              >
                <Server className="text-accent mb-2.5 w-6 h-6" />
                <span className="text-xs font-bold text-neutral-800">Validator Pool</span>
                <span className="text-[9px] text-neutral-400 mt-0.5 font-mono">6 consensus nodes</span>
                
                {/* Micro indicators representing node state in real-time */}
                <div className="flex gap-1.5 mt-3 justify-center">
                  {state.instances.slice(0, 6).map((inst) => {
                    let dotColor = "bg-neutral-300";
                    if (inst.status === "healthy-old") dotColor = "bg-neutral-800";
                    if (inst.status === "healthy-new") dotColor = "bg-status-green";
                    if (inst.status === "creating" || inst.status === "draining") dotColor = "bg-status-amber animate-pulse";
                    return <span key={inst.id} className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />;
                  })}
                </div>
              </button>

              {/* Arrow */}
              <div className="hidden md:block text-neutral-400 font-black">→</div>

              {/* Node 3: Verification Gateway API */}
              <button
                onMouseEnter={() => setActiveTooltip("proxy")}
                onClick={() => setActiveTooltip("proxy")}
                className={`w-full md:w-36 bg-white border rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all duration-200 hover:border-accent hover:-translate-y-0.5 focus:outline-none ${
                  activeTooltip === "proxy" ? "border-accent ring-2 ring-accent/10" : "border-neutral-200/60"
                }`}
              >
                <Shield className="text-accent mb-2.5 w-6 h-6" />
                <span className="text-xs font-bold text-neutral-800">RPC Gateway</span>
                <span className="text-[9px] text-neutral-400 mt-0.5 font-mono">Verification API</span>
              </button>

              {/* Arrow */}
              <div className="hidden md:block text-neutral-400 font-black">→</div>

              {/* Node 4: Relying Parties */}
              <button
                onMouseEnter={() => setActiveTooltip("users")}
                onClick={() => setActiveTooltip("users")}
                className={`w-full md:w-36 bg-white border rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all duration-200 hover:border-accent hover:-translate-y-0.5 focus:outline-none ${
                  activeTooltip === "users" ? "border-accent ring-2 ring-accent/10" : "border-neutral-200/60"
                }`}
              >
                <Users className="text-accent mb-2.5 w-6 h-6" />
                <span className="text-xs font-bold text-neutral-800">Relying Parties</span>
                <span className="text-[9px] text-neutral-400 mt-0.5 font-mono">API Verifiers</span>
              </button>
            </div>

            {/* Consensus Coordinator (Sits under Validator Pool) */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-4">
              <button
                onMouseEnter={() => setActiveTooltip("anchor")}
                onClick={() => setActiveTooltip("anchor")}
                className={`w-full md:w-56 bg-neutral-900 border rounded-2xl p-4 flex items-center gap-3 text-left shadow-sm cursor-pointer transition-all duration-200 hover:border-accent focus:outline-none text-white ${
                  activeTooltip === "anchor" ? "border-accent ring-2 ring-accent/10" : "border-neutral-850"
                }`}
              >
                <Anchor className="text-accent w-5 h-5 shrink-0" />
                <div>
                  <span className="text-xs font-bold block text-white">Consensus Coordinator</span>
                  <span className="text-[9px] text-neutral-500 font-mono">Orchestrates validation</span>
                </div>
              </button>
            </div>

            {/* Interactive Tooltip Output Box */}
            <div className="mt-8 min-h-[140px] flex flex-col justify-center">
              {activeTooltip ? (
                getTooltipContent()
              ) : (
                <div className="text-center py-6 text-neutral-400 text-xs font-medium border border-dashed border-neutral-200 rounded-xl">
                  Hover or tap any architectural node above to drill down into logs & state metadata.
                </div>
              )}
            </div>

          </div>

          {/* Right: "What's Next" Side Panel */}
          <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-6 shadow-sm min-h-[460px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-neutral-800 font-bold text-sm uppercase tracking-wider mb-6">
                <Sparkles size={16} className="text-accent" />
                What&apos;s Next
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-accent/10 text-accent rounded text-[8px] font-bold tracking-wide uppercase">
                      Exploring
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-950 mb-1">
                    Zero-Knowledge Proofs (ZKP)
                  </h4>
                  <p className="text-[11px] leading-relaxed text-neutral-600 font-medium">
                    Enable verification of degree details (e.g. GPA range or completion status) without revealing any underlying personal information or identity attributes.
                  </p>
                </div>

                <div className="h-[1px] bg-neutral-200/60 w-full" />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-accent/10 text-accent rounded text-[8px] font-bold tracking-wide uppercase">
                      Exploring
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-950 mb-1">
                    Multi-Chain Anchoring
                  </h4>
                  <p className="text-[11px] leading-relaxed text-neutral-600 font-medium">
                    Bridge the Trueva Registry across Ethereum L2s and Solana networks, allowing relying parties to verify documents directly in their native ecosystem contracts.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-[10px] text-neutral-400 leading-normal font-medium">
              Explore the smart contract specifications inside the secondary architecture documentation.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
