"use client";

import React from "react";
import { Hammer, Tag, ServerCrash, CheckSquare, ArrowRight } from "lucide-react";

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
      title: "Build & tag",
      description: "A new container image is built from commit and pushed into the Azure container registry under a staging tag, completely isolated from what is currently live.",
      icon: <Hammer className="w-5 h-5 text-accent" />,
      diagram: (
        <div className="flex items-center justify-center gap-2 mt-4 bg-white/40 border border-neutral-200/50 rounded-xl p-3 h-24">
          <div className="px-2 py-1 bg-neutral-900 text-white rounded text-[10px] font-mono font-bold">git push</div>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          <div className="flex flex-col items-center gap-1">
            <div className="px-2.5 py-1 bg-accent/10 border border-accent/20 text-accent rounded text-[9px] font-mono font-bold">
              v129-staging
            </div>
            <span className="text-[8px] text-neutral-500 font-semibold font-mono">Registry</span>
          </div>
        </div>
      )
    },
    {
      number: "02",
      title: "Promote tag",
      description: "Once staging checks pass, the registry promotes its tag pointer to the stable 'production' tag. Note: Nothing on the live fleet has changed yet — only registry pointers.",
      icon: <Tag className="w-5 h-5 text-accent" />,
      diagram: (
        <div className="flex flex-col justify-center gap-1.5 mt-4 bg-white/40 border border-neutral-200/50 rounded-xl p-3 h-24">
          <div className="flex items-center justify-between text-[9px] font-mono">
            <span className="text-neutral-400 font-medium">Staging:</span>
            <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-500 font-semibold">v129-staging</span>
          </div>
          <div className="h-[1px] bg-neutral-200/50 w-full" />
          <div className="flex items-center justify-between text-[9px] font-mono">
            <span className="text-neutral-900 font-bold flex items-center gap-1">Production: <ArrowRight className="w-2.5 h-2.5 text-accent" /></span>
            <span className="px-1.5 py-0.5 bg-accent text-white rounded font-bold">v129-production</span>
          </div>
        </div>
      )
    },
    {
      number: "03",
      title: "Roll the fleet",
      description: "The auto-scaling VM instances continuously watch the registry tag. A dedicated 'deployment anchor' machine recycles and provisions VMs instance by instance, applying updates.",
      icon: <ServerCrash className="w-5 h-5 text-accent" />,
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
            Rolling...
          </span>
        </div>
      )
    },
    {
      number: "04",
      title: "Verify & Gating",
      description: "Health checks gate every swap. Traefik reverse proxies split traffic. If telemetry reports failures, the split is instantly reverted back to the previous stable release.",
      icon: <CheckSquare className="w-5 h-5 text-accent" />,
      diagram: (
        <div className="flex flex-col justify-center items-center gap-1.5 mt-4 bg-white/40 border border-neutral-200/50 rounded-xl p-3 h-24">
          <div className="flex items-center gap-1 text-[9px] font-bold text-status-green font-mono bg-status-green/10 border border-status-green/20 px-2 py-0.5 rounded">
            ✓ health: 200 OK
          </div>
          <span className="text-[8px] text-neutral-500 font-semibold uppercase tracking-wider">
            Zero Dropped Requests
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
            How a deploy actually happens
          </h2>
          <p className="text-neutral-600 text-sm md:text-base max-w-xl mx-auto">
            The mechanical steps that govern our Azure VM Scale Set fleet rollout. Secure, gated, and automated.
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
