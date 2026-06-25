"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, ShieldCheck, Heart } from "lucide-react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <div className="bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16 px-6">
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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-6">
              About csn2.me
            </h1>
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-3xl">
              A public showcase and stress-testbed constructed to demonstrate the mechanics of zero-downtime, 
              auto-scaling deployment pipelines.
            </p>
          </div>

          {/* About Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-5">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">
                Why this site exists
              </h3>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">
                Most deployment pipelines are hidden away in internal company networks. 
                csn2.me brings this backend orchestration to the public-facing web. 
                It functions as a live portfolio piece demonstrating high-availability hosting patterns on cloud virtual machines.
              </p>
            </div>

            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">
                Strict Constraints
              </h3>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">
                To keep the experiment honest, the site runs within a standard dockerized runtime 
                on Azure Virtual Machine Scale Sets. Deploys follow the exact rolling, connection-drained blue-green 
                lifecycle described on our landing page.
              </p>
            </div>
          </div>

          {/* Credits Callout */}
          <div className="bg-neutral-900 rounded-2xl p-8 text-neutral-300 shadow-md mb-20 flex flex-col md:flex-row items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0">
              <Heart size={20} className="fill-current" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Designed for reliability</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Made for developers, infra engineers, and product builders. By showcasing active host IDs, 
                dynamic VM states, and live telemetry split routing rules, csn2.me demonstrates that modern, 
                high-availability deployment strategies are accessible, simple, and robust.
              </p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
