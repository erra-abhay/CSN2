import React from "react";
import NavBar from "@/components/navbar";
import Hero from "@/components/hero";
import StatsStrip from "@/components/stats-strip";
import Footer from "@/components/footer";
import Link from "next/link";
import { Award, ShieldCheck, Database, Cpu, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex-grow">
        {/* Animated Hero Header */}
        <Hero />
        
        {/* Key trust statistics */}
        <StatsStrip />

        {/* Portals Showcase Section */}
        <section className="py-24 bg-white border-t border-neutral-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold tracking-wide uppercase">
                Consensus Portal Suite
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mt-4 mb-4">
                Explore Trueva Capabilities
              </h2>
              <p className="text-neutral-600 text-sm md:text-base max-w-xl mx-auto">
                Discover the ledger infrastructure. Click any card to launch its dedicated portal and interact with cryptographic mock data.
              </p>
            </div>

            {/* 2x2 Interactive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* Card 1: Issuer Console */}
              <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-premium-hover transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    Issuer Console
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-650 leading-relaxed font-medium mb-6">
                    Sign academic transcripts, diploma certificates, or professional badges. Format metadata payloads as structured JSON, compute SHA-256 hashes, generate signatures, and anchor them onto the registry block.
                  </p>
                </div>
                <Link
                  href="/issue"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors group/link"
                >
                  Open Issuer Portal
                  <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Card 2: Verification Portal */}
              <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-premium-hover transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    Verification Portal
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-650 leading-relaxed font-medium mb-6">
                    Query validator node records. Audit certificate parameters instantly by checking digital signature origins and executing Merkle proof validations to guarantee 100% data integrity without database access.
                  </p>
                </div>
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors group/link"
                >
                  Launch Verification checks
                  <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Card 3: Blockchain Explorer */}
              <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-premium-hover transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    Chain Explorer
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-650 leading-relaxed font-medium mb-6">
                    Inspect block transitions and transaction histories on the PoA ledger. Browse recent block heights, committed transaction counts, public keys, and cryptographic Merkle root hashes in real-time.
                  </p>
                </div>
                <Link
                  href="/explorer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors group/link"
                >
                  Browse Ledger Logs
                  <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Card 4: Node Simulator */}
              <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-premium-hover transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    Node Consensus Simulator
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-650 leading-relaxed font-medium mb-6">
                    Interact with validator nodes. Trigger real-time block consensus syncs, scale read queries, or trigger audit fails to test BFT signature validation mechanisms and consensus rejection logs.
                  </p>
                </div>
                <Link
                  href="/live-network"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors group/link"
                >
                  Interact with Consensus Nodes
                  <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
