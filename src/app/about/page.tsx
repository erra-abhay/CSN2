"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, ShieldCheck, Heart, Milestone, Users, Settings, User } from "lucide-react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { FloatingCubesBackground, RotatingCubeHeader } from "@/components/cube-animation";

const milestones = [
  {
    quarter: "Q1 2026",
    title: "V1 Core Consensus Ledger",
    status: "COMPLETED",
    description: "Deployed the core Trueva Proof-of-Authority consensus engine. Established the smart contract registry (TCR) to verify roots of batched degree credentials immutable commits."
  },
  {
    quarter: "Q2 2026",
    title: "V2 High-Availability RPC Gateway",
    status: "COMPLETED",
    description: "Launched the load-balanced RPC verification gateway. Implemented dynamic auto-scaling of verifier read-only nodes to handle high background-checking traffic peaks."
  },
  {
    quarter: "Q3 2026",
    title: "V3 Zero-Knowledge Privacy Proofs",
    status: "ACTIVE EXPLORING",
    description: "Integrating ZK-SNARK mathematical proofs into the client SDK. This enables employers to verify degree validity without exposing private metadata like names or GPA stats."
  },
  {
    quarter: "Q4 2026",
    title: "V4 Multi-Chain Bridging Contract",
    status: "PLANNED",
    description: "Developing cross-ledger contract bridges. This will allow institutions to query Trueva validation paths directly from Ethereum L2s and Solana networks."
  }
];

const teamMembers = [
  {
    name: "Dr. Marcus Vance",
    role: "Chief Cryptography Lead",
    background: "PhD Stanford University, 12+ years in Asymmetric Signatures & Zero-Knowledge Circuits research.",
    avatar: "MV"
  },
  {
    name: "Elena Rostova",
    role: "Academic Registrar Liaison",
    background: "Former Director of Systems Integration at MIT Registry Office. Standardizes API metadata structures.",
    avatar: "ER"
  },
  {
    name: "Devraj Nair",
    role: "Consensus Infrastructure Architect",
    background: "Ex-Distributed Systems Engineer at Cloudflare. Focuses on PBFT quorum thresholds and RPC autoscaling.",
    avatar: "DN"
  },
  {
    name: "Sarah Jenkins",
    role: "Zero-Knowledge Lead Researcher",
    background: "PhD UC Berkeley. Developed privacy-preserving credential circuits for compliance auditing checks.",
    avatar: "SJ"
  }
];

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <div className="relative bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16 px-6 overflow-hidden">
        <FloatingCubesBackground count={10} />
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-accent transition-colors mb-12 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to homepage
          </Link>

          {/* Header */}
          <div className="mb-16">
            <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold tracking-wide uppercase">
              Project Context
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-6 flex items-center gap-3">
              <RotatingCubeHeader size={38} />
              About csn2.me
            </h1>
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-3xl font-medium">
              A public showcase and playground constructed to demonstrate the mechanics of Trueva's blockchain-based certificate registry and verification ledger.
            </p>
          </div>

          {/* About Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-5">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">
                Why this site exists
              </h3>
              <p className="text-xs md:text-sm text-neutral-650 leading-relaxed font-medium">
                Most blockchain registries are obscured by CLI interfaces and smart contract transaction codes. 
                csn2.me brings this trust framework to the public-facing web. 
                It serves as a live portfolio demonstration of how digital signatures, hashing, and decentralized node verification work under the hood.
              </p>
            </div>

            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">
                Strict Constraints
              </h3>
              <p className="text-xs md:text-sm text-neutral-650 leading-relaxed font-medium">
                To keep the showcase honest, the simulator replicates a Proof-of-Authority consensus network across a pool of validator nodes. 
                Certificate batch propagation and RPC gateway load balancing follow the exact cryptographic logic described throughout the platform.
              </p>
            </div>
          </div>

          {/* Governance Section */}
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm mb-12">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Settings className="text-accent" /> Consortium Governance Protocols
            </h2>
            <p className="text-xs md:text-sm text-neutral-650 leading-relaxed mb-6 font-medium">
              Trueva does not operate as an open, permissionless network where anonymous miners buy block influence. Governance is strictly regulated through a consortium of educational registrars:
            </p>

            <div className="space-y-4 text-xs font-medium text-neutral-600">
              <div className="flex gap-4">
                <span className="w-5 h-5 rounded-full bg-accent/10 text-accent font-mono font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">01</span>
                <div>
                  <h4 className="font-bold text-neutral-950 mb-1 text-xs">Validator Node Onboarding</h4>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">Institutions apply to the Governance Board. After verification of credentials and server configurations, existing nodes run a 2/3 voting process to commit their public key to the smart contract.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="w-5 h-5 rounded-full bg-accent/10 text-accent font-mono font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">02</span>
                <div>
                  <h4 className="font-bold text-neutral-950 mb-1 text-xs">Registrar Key Rotation</h4>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">To prevent security key compromises, university registrars run key rotation cycles every 180 days. A revoked key signature is instantly blacklisted from proposing blocks.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="w-5 h-5 rounded-full bg-accent/10 text-accent font-mono font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">03</span>
                <div>
                  <h4 className="font-bold text-neutral-950 mb-1 text-xs">Revocation Consensus</h4>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">If a certificate must be revoked (e.g. academic misconduct), the issuer publishes a signed revocation hash. All validator RPC nodes update their revocation registries instantly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Team Grid Section */}
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm mb-12">
            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Users className="text-accent" /> Trueva Engineering & Registrar Core Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamMembers.map((m, idx) => (
                <div key={idx} className="bg-[#FAF9F6] border border-neutral-200/40 p-4 rounded-xl flex gap-3 shadow-sm items-start">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                    {m.avatar}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-neutral-900 text-xs mb-0.5">{m.name}</h4>
                    <span className="text-[9px] font-bold text-accent block mb-1.5 uppercase tracking-wider">{m.role}</span>
                    <p className="text-[10px] text-neutral-500 leading-normal font-medium">{m.background}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Roadmap Section */}
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm mb-12">
            <h2 className="text-xl font-bold text-neutral-900 mb-8 flex items-center gap-2">
              <Milestone className="text-accent" /> Trueva Technical Roadmap
            </h2>

            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-200">
              {milestones.map((m, idx) => (
                <div key={idx} className="relative pl-10">
                  {/* Indicator Dot */}
                  <span className={`absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm -translate-x-1/2 ${
                    m.status === "COMPLETED" ? "bg-status-green" : m.status === "ACTIVE EXPLORING" ? "bg-status-amber animate-pulse" : "bg-neutral-300"
                  }`} />
                  
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase font-mono">{m.quarter}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wide ${
                      m.status === "COMPLETED" ? "bg-status-green/10 text-status-green" : m.status === "ACTIVE EXPLORING" ? "bg-status-amber/10 text-status-amber" : "bg-neutral-100 text-neutral-500"
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-950 mb-1">{m.title}</h3>
                  <p className="text-xs leading-relaxed text-neutral-500 font-medium">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Credits Callout */}
          <div className="bg-neutral-900 rounded-2xl p-8 text-neutral-300 shadow-md mb-20 flex flex-col md:flex-row items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0">
              <Heart size={20} className="fill-current" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-2 font-sans">Designed for academic registry integrity</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-medium">
                Made for developers, registrar offices, and product builders. By showcasing active validator statuses, 
                cryptographic Merkle proofs, and live verification logs, csn2.me demonstrates that modern 
                certificate validation is secure, simple, and open.
              </p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
