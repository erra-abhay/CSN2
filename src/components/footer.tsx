"use client";

import React from "react";
import { useDeployment } from "@/lib/deployment-store";

export default function Footer() {
  const { state } = useDeployment();
  const handleScrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#FAF9F6] border-t border-neutral-250/40 pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Restrained link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Product
            </span>
            <button
              onClick={() => handleScrollTo("how-it-works")}
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors text-left cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => handleScrollTo("architecture")}
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors text-left cursor-pointer"
            >
              Architecture diagram
            </button>
            <button
              onClick={() => handleScrollTo("live-deploys")}
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors text-left cursor-pointer"
            >
              Live deploys
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Project
            </span>
            <a
              href="/architecture"
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
            >
              Deep Technical Specs
            </a>
            <a
              href="/blog"
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
            >
              Development Blog
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
            >
              GitHub repository
            </a>
          </div>

          <div className="col-span-2 flex flex-col justify-between items-start md:items-end text-left md:text-right">
            <div>
              <span className="text-xs font-bold text-neutral-900 block mb-1">
                Azure Blue-Green Pipeline
              </span>
              <p className="text-[11px] leading-relaxed text-neutral-500 max-w-xs">
                Zero-downtime, health-gated container orchestrations running over VM Scale Sets behind Traefik.
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
          <span>&copy; 2026 csn2 &middot; an infrastructure experiment</span>
          <span className="font-mono text-[9px] lowercase bg-neutral-200/50 text-neutral-600 px-2 py-0.5 rounded border border-neutral-300/30">
            host: {state.hostname}
          </span>
          <span className="mt-2 sm:mt-0">Designed for AcadHub VM Orchestrator</span>
        </div>

      </div>
    </footer>
  );
}
