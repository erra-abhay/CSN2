"use client";

import React, { useState, useEffect } from "react";
import { useDeployment } from "@/lib/deployment-store";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { state, triggerPromotion } = useDeployment();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWatchDeploy = () => {
    if (window.location.pathname !== "/") {
      window.location.href = "/#live-deploys";
      return;
    }
    const target = document.getElementById("live-deploys");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      triggerPromotion();
    }, 600);
  };

  const handleScrollTo = (id: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-neutral-200/50 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Wordmark & Host Badge */}
        <div className="flex items-center gap-3">
          <div 
            className="text-lg font-bold tracking-tight text-neutral-900 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            csn2<span className="text-accent font-black">.me</span>
          </div>
          <div className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[10px] font-mono border border-neutral-200/50 flex items-center gap-1.5 shadow-sm">
            <span className="w-1 h-1 rounded-full bg-status-green animate-pulse" />
            <span className="text-neutral-450 uppercase font-bold text-[8px] tracking-wider">Host:</span>
            <span className="font-semibold text-[9px]">{state.hostname}</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleScrollTo("how-it-works")}
            className="text-sm font-medium text-neutral-600 hover:text-accent transition-colors cursor-pointer"
          >
            How it works
          </button>
          <button
            onClick={() => handleScrollTo("architecture")}
            className="text-sm font-medium text-neutral-600 hover:text-accent transition-colors cursor-pointer"
          >
            Architecture
          </button>
          <button
            onClick={() => handleScrollTo("live-deploys")}
            className="text-sm font-medium text-neutral-600 hover:text-accent transition-colors cursor-pointer"
          >
            Live deploys
          </button>
          <a
            href="/blog"
            className="text-sm font-medium text-neutral-600 hover:text-accent transition-colors"
          >
            Blog
          </a>
        </nav>

        {/* Right: CTA Pill Button */}
        <div>
          <button
            onClick={handleWatchDeploy}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
          >
            Watch a live deploy
          </button>
        </div>
      </div>
    </header>
  );
}
