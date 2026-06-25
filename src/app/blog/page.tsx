"use client";

import React from "react";
import { ArrowLeft, Clock, MessageSquareCode } from "lucide-react";
import Link from "next/link";

export default function BlogPlaceholder() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans py-16 px-6 flex flex-col justify-center items-center">
      <div className="max-w-md w-full text-center">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-accent transition-colors mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to homepage
        </Link>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto mb-8 shadow-sm">
          <MessageSquareCode size={28} />
        </div>

        {/* Header */}
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 mb-4">
          csn2.me Blog
        </h1>
        <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-8 font-medium">
          Writing about Azure Scale Sets, Traefik configurations, and CI/CD pipeline automation experiments.
        </p>

        {/* Coming soon box */}
        <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-sm flex items-center justify-center gap-3">
          <Clock size={16} className="text-accent animate-pulse" />
          <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Coming soon &middot; July 2026
          </span>
        </div>

        {/* Footer */}
        <div className="mt-20 border-t border-neutral-200/60 pt-6 text-xs text-neutral-400 font-semibold uppercase tracking-wider">
          &copy; 2026 csn2 &middot; Dev blog
        </div>
      </div>
    </div>
  );
}
