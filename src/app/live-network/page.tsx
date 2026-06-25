"use client";

import React, { useEffect } from "react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import RecentDeploys from "@/components/recent-deploys";
import ClosingCta from "@/components/closing-cta";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDeployment } from "@/lib/deployment-store";

export default function LiveNetworkPage() {
  const { state, triggerPromotion } = useDeployment();

  useEffect(() => {
    // Check if auto=true parameter is present in search queries
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("auto") === "true") {
        // Trigger a simulated batch anchoring after a short delay
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
      <main className="bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 mb-10">
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
      </main>
      <Footer />
    </>
  );
}
