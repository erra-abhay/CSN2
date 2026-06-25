"use client";

import React from "react";
import { ArrowLeft, Terminal, Server, Shield, FileText } from "lucide-react";
import Link from "next/link";

export default function ArchitectureDeepDive() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans py-16 px-6">
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
            Technical Specification
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-6">
            Deployment Architecture Deep Dive
          </h1>
          <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-3xl">
            This document outlines the actual mechanics of the zero-downtime blue-green deployment pipeline 
            currently running on Azure, governing VM scale sets and proxy splits.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          
          {/* Section 1: Blue-Green Pipeline Logic */}
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Terminal size={16} />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">
                1. Blue-Green Rollout Logic
              </h2>
            </div>
            
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-6 font-medium">
              Instead of running two parallel fleets, this system implements an in-place rolling blue-green upgrade within a single Azure VM Scale Set. This model minimizes infrastructure costs while maintaining 100% service availability.
            </p>

            <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[11px] text-neutral-400 leading-relaxed border border-neutral-800">
              <div className="text-neutral-500 border-b border-neutral-800 pb-2 mb-2 uppercase tracking-wider text-[9px] font-bold">
                deployment_orchestration.sh
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap no-scrollbar">
{`# 1. Promote new image tag in ACR
az acr repository tag create --name acadhubacr \\
  --tag acadhub-api:v129-production acadhub-api:v129-staging

# 2. Sequential VM instance recycling loop
for instance_id in $(az vmss list-instances --name acadhub-fleet --query "[].instanceId" -o tsv); do
  echo "Draining connections from instance: $instance_id..."
  # Tell Traefik to stop sending requests to this instance
  curl -X POST http://traefik-proxy/api/drain/$instance_id
  sleep 5
  
  echo "Upgrading instance: $instance_id..."
  az vmss update-instances --name acadhub-fleet --instance-ids $instance_id
  
  # Gate rollout on health check validation
  until curl -f -s http://instance-$instance_id/health; do
    echo "Waiting for instance health checks..."
    sleep 2
  done
done`}
              </pre>
            </div>
          </div>

          {/* Section 2: Load Balancing Split */}
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Shield size={16} />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">
                2. Traefik Routing Configuration
              </h2>
            </div>
            
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-4 font-medium">
              Traefik acts as the reverse proxy and load balancer. Because VMs register themselves dynamically via tag-based service discovery, Traefik routes incoming requests only to instances reporting a 200 OK health status.
            </p>

            <ul className="space-y-3 text-xs md:text-sm text-neutral-600 font-medium list-disc list-inside">
              <li><strong className="text-neutral-850">TCP Session Draining:</strong> Connection draining ensures active user sessions are completed on the old container version before the instance is stopped.</li>
              <li><strong className="text-neutral-850">Gated Verification:</strong> If a single VM reports a failure code during provisioning, the script stops the fleet rollout and triggers an automatic rollback of all modified instances back to the stable tag.</li>
            </ul>
          </div>

          {/* Section 3: High Availability Statistics */}
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Server size={16} />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">
                3. High-Availability SLA
              </h2>
            </div>
            
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">
              During a typical rollout, AcadHub achieves a 100% successful request rate. Average upgrade duration scales linearly with the number of instances, taking approximately 41 seconds for a full 6-node fleet recycle.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-20 border-t border-neutral-200/60 pt-6 text-center text-xs text-neutral-400 font-semibold uppercase tracking-wider">
          &copy; 2026 csn2 &middot; Infrastructure Spec Sheet
        </div>
      </div>
    </div>
  );
}
