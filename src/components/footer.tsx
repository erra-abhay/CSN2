"use client";

import React from "react";
import { useDeployment } from "@/lib/deployment-store";
import Link from "next/link";

export default function Footer() {
  const { state } = useDeployment();

  return (
    <footer className="bg-[#FAF9F6] border-t border-neutral-250/40 pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Restrained link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Network
            </span>
            <Link
              href="/how-it-works"
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors text-left"
            >
              How it works
            </Link>
            <Link
              href="/architecture"
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors text-left"
            >
              Consensus Topology
            </Link>
            <Link
              href="/live-network"
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors text-left"
            >
              Live Network
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Portals
            </span>
            <Link
              href="/explorer"
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
            >
              Block Explorer
            </Link>
            <Link
              href="/issue"
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
            >
              Issue Certificates
            </Link>
            <Link
              href="/verify"
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
            >
              Verify Portal
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Project
            </span>
            <Link
              href="/architecture"
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
            >
              Technical Specs
            </Link>
            <Link
              href="/blog"
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
            >
              Engineering Blog
            </Link>
            <Link
              href="/about"
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
            >
              About csn2.me
            </Link>
          </div>

          <div className="flex flex-col justify-between items-start md:items-end text-left md:text-right">
            <div>
              <span className="text-xs font-bold text-neutral-900 block mb-1">
                Trueva Blockchain Trust
              </span>
              <p className="text-[11px] leading-relaxed text-neutral-500 max-w-xs">
                Decentralized cryptographic certificate registry ensuring immutable validation, high-throughput verification, and consensus audit transparency.
              </p>
            </div>
          </div>
        </div>

        {/* Giant wordmark centerpiece */}
        <div className="select-none text-center py-4 border-t border-neutral-200/40">
          <h2 className="text-[16vw] font-black tracking-tighter text-[#121212] leading-none select-none uppercase font-sans">
            csn2.me
          </h2>
        </div>

        {/* Quiet footer meta info */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider gap-4">
          <span>&copy; 2026 csn2 &middot; Trueva public validator node</span>
          <span className="font-mono text-[9px] lowercase bg-neutral-200/50 text-neutral-600 px-2 py-0.5 rounded border border-neutral-300/30">
            host: {state.hostname}
          </span>
          <span className="mt-2 sm:mt-0">Designed for Trueva Certificate Trust Network</span>
        </div>

      </div>
    </footer>
  );
}
