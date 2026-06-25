"use client";

import React from "react";
import { Key, Layers, Cpu, ShieldCheck, ArrowRight } from "lucide-react";

interface StepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  diagram: React.ReactNode;
}

export default function HowItWorks() {
  const steps: StepProps[] = [
    {
      number: "01",
      title: "Hash & Sign",
      description: "Each issued certificate is formatted as structured JSON metadata, hashed using SHA-256, and digitally signed using the issuer's private key to guarantee origin authenticity.",
      icon: <Key className="w-5 h-5 text-accent" />,
      diagram: (
        <div className="flex items-center justify-center gap-2 mt-4 bg-white/40 border border-neutral-200/50 rounded-xl p-3 h-24">
          <div className="px-2 py-1 bg-neutral-900 text-white rounded text-[10px] font-mono font-bold">Sign Metadata</div>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          <div className="flex flex-col items-center gap-1">
            <div className="px-2.5 py-1 bg-accent/10 border border-accent/20 text-accent rounded text-[9px] font-mono font-bold">
              sha256-hash
            </div>
            <span className="text-[8px] text-neutral-500 font-semibold font-mono">Signed Hash</span>
          </div>
        </div>
      )
    },
    {
      number: "02",
      title: "Merkle Aggregation",
      description: "To enable instant proof-of-existence without exposing student privacy, multiple certificate hashes are compiled into a cryptographic Merkle Tree, producing a single Merkle Root.",
      icon: <Layers className="w-5 h-5 text-accent" />,
      diagram: (
        <div className="flex flex-col justify-center gap-1.5 mt-4 bg-white/40 border border-neutral-200/50 rounded-xl p-3 h-24">
          <div className="flex items-center justify-between text-[9px] font-mono">
            <span className="text-neutral-400 font-medium">Merkle Leaves:</span>
            <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-500 font-semibold">hashes (x42)</span>
          </div>
          <div className="h-[1px] bg-neutral-200/50 w-full" />
          <div className="flex items-center justify-between text-[9px] font-mono">
            <span className="text-neutral-900 font-bold flex items-center gap-1">Merkle Root: <ArrowRight className="w-2.5 h-2.5 text-accent" /></span>
            <span className="px-1.5 py-0.5 bg-accent text-white rounded font-bold">0x5d9b62f1...</span>
          </div>
        </div>
      )
    },
    {
      number: "03",
      title: "Blockchain Anchor",
      description: "The Merkle Root is committed via a secure smart contract transaction to the Trueva registry ledger. All validator nodes on the PoA consensus network sync to this new block height.",
      icon: <Cpu className="w-5 h-5 text-accent" />,
      diagram: (
        <div className="flex items-center justify-center gap-1.5 mt-4 bg-white/40 border border-neutral-200/50 rounded-xl p-3 h-24">
          <div className="grid grid-cols-3 gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-status-green" />
            <span className="w-3.5 h-3.5 rounded-full bg-status-green" />
            <span className="w-3.5 h-3.5 rounded-full bg-status-amber animate-pulse" />
            <span className="w-3.5 h-3.5 rounded-full bg-neutral-300" />
            <span className="w-3.5 h-3.5 rounded-full bg-neutral-300" />
            <span className="w-3.5 h-3.5 rounded-full bg-neutral-300" />
          </div>
          <ArrowRight className="w-3 h-3 text-neutral-400" />
          <span className="text-[9px] font-mono font-bold text-neutral-700 bg-neutral-150 px-1.5 py-0.5 rounded">
            Syncing...
          </span>
        </div>
      )
    },
    {
      number: "04",
      title: "Verify Instantly",
      description: "Relying parties check validity instantly. By querying any node with a student's public certificate ID and Merkle path proof, they verify cryptographic integrity without central databases.",
      icon: <ShieldCheck className="w-5 h-5 text-accent" />,
      diagram: (
        <div className="flex flex-col justify-center items-center gap-1.5 mt-4 bg-white/40 border border-neutral-200/50 rounded-xl p-3 h-24">
          <div className="flex items-center gap-1 text-[9px] font-bold text-status-green font-mono bg-status-green/10 border border-status-green/20 px-2 py-0.5 rounded">
            ✓ Proof Verified
          </div>
          <span className="text-[8px] text-neutral-500 font-semibold uppercase tracking-wider">
            100% Cryptographic Match
          </span>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#FAF9F6] border-t border-neutral-200/40 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            How verification actually happens
          </h2>
          <p className="text-neutral-600 text-sm md:text-base max-w-xl mx-auto">
            The mathematical and networking steps that govern our certificate issuance and verification. Secure, gated, and automated.
          </p>
        </div>

        {/* Horizontal steps on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-[44px] left-[12%] right-[12%] h-[1px] bg-neutral-200 -z-10" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col justify-between h-full group">
              <div>
                {/* Number & Icon Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-full bg-white border border-neutral-200/60 shadow-sm flex items-center justify-center font-bold text-neutral-800 text-sm relative z-10 group-hover:border-accent transition-colors">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-neutral-300 font-mono tracking-tight">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-accent transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>

              {/* Step Diagram */}
              {step.diagram}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
