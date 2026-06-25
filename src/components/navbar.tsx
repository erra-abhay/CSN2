"use client";

import React, { useState, useEffect } from "react";
import { useDeployment } from "@/lib/deployment-store";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useDeployment();

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
    window.location.href = "/live-network?auto=true";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        isScrolled || isOpen
          ? "bg-background/80 backdrop-blur-md border-neutral-200/50 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Wordmark & Host Badge */}
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="text-lg font-bold tracking-tight text-neutral-900 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            csn2<span className="text-accent font-black">.me</span>
          </Link>
          <div className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded text-[10px] font-mono border border-neutral-200/50 flex items-center gap-1.5 shadow-sm">
            <span className="w-1 h-1 rounded-full bg-status-green animate-pulse" />
            <span className="text-neutral-500 uppercase font-bold text-[8px] tracking-wider">Node:</span>
            <span className="font-semibold text-[9px]">{state.hostname}</span>
          </div>
        </div>

        {/* Center: Navigation Links for Desktop */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link
            href="/how-it-works"
            className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors cursor-pointer"
          >
            How it works
          </Link>
          <Link
            href="/architecture"
            className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors cursor-pointer"
          >
            Architecture
          </Link>
          <Link
            href="/live-network"
            className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors cursor-pointer"
          >
            Live Network
          </Link>
          <Link
            href="/explorer"
            className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
          >
            Explorer
          </Link>
          <Link
            href="/issue"
            className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
          >
            Issue Portal
          </Link>
          <Link
            href="/verify"
            className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
          >
            Verify Portal
          </Link>
          <Link
            href="/blog"
            className="text-xs font-semibold text-neutral-600 hover:text-accent transition-colors"
          >
            Blog
          </Link>
        </nav>

        {/* Right: CTA Pill Button for Desktop */}
        <div className="hidden lg:block">
          <button
            onClick={handleWatchDeploy}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
          >
            Watch Live Sync
          </button>
        </div>

        {/* Mobile menu toggle hamburger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-neutral-900 focus:outline-none p-1 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[57px] bottom-0 bg-background/95 backdrop-blur-md z-40 flex flex-col p-6 border-t border-neutral-200/50 overflow-y-auto">
          <nav className="flex flex-col gap-6 text-sm font-bold text-neutral-800">
            <Link
              href="/how-it-works"
              onClick={() => setIsOpen(false)}
              className="hover:text-accent transition-colors py-1"
            >
              How it works
            </Link>
            <Link
              href="/architecture"
              onClick={() => setIsOpen(false)}
              className="hover:text-accent transition-colors py-1"
            >
              Architecture
            </Link>
            <Link
              href="/live-network"
              onClick={() => setIsOpen(false)}
              className="hover:text-accent transition-colors py-1"
            >
              Live Network
            </Link>
            <Link
              href="/explorer"
              onClick={() => setIsOpen(false)}
              className="hover:text-accent transition-colors py-1"
            >
              Explorer
            </Link>
            <Link
              href="/issue"
              onClick={() => setIsOpen(false)}
              className="hover:text-accent transition-colors py-1"
            >
              Issue Portal
            </Link>
            <Link
              href="/verify"
              onClick={() => setIsOpen(false)}
              className="hover:text-accent transition-colors py-1"
            >
              Verify Portal
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="hover:text-accent transition-colors py-1"
            >
              Blog
            </Link>
          </nav>
          
          <div className="mt-8 pt-6 border-t border-neutral-200/50">
            <button
              onClick={() => {
                setIsOpen(false);
                handleWatchDeploy();
              }}
              className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-full shadow-sm text-center cursor-pointer"
            >
              Watch Live Sync
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
