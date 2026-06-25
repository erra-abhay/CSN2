"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { blogPosts } from "../page";

// Detail bodies for the posts
const postBodies: Record<string, React.ReactNode> = {
  "azure-scale-sets-blue-green": (
    <article className="space-y-6 text-neutral-600 text-sm md:text-base leading-relaxed">
      <p>
        Rolling deployments are easy to explain but notoriously hard to execute without dropping a single HTTP packet.
        On Azure, achieving hitless blue-green deployments with standard VM Scale Sets (VMSS) requires careful lifecycle orchestration.
      </p>
      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">The Rolling Upgrade Lifecycle</h3>
      <p>
        In our custom pipeline running for acadhub-api, we orchestrate the rollout step by step rather than relying on Azure’s default automatic rolling upgrade policy, which lacks custom network draining controls:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Staging build verification:</strong> The runner builds a container image and tags it with a staging tag. Synthetic endpoint checks run verification tests.</li>
        <li><strong>Production promotion:</strong> The registry tag is updated to point production to the staging container digest.</li>
        <li><strong>Connection draining:</strong> Before recycling a VM instance, the deployment anchor tells Traefik to stop sending new TCP/HTTP requests to that host IP.</li>
        <li><strong>Upgrade & verification:</strong> Once active requests settle, the instance is updated to the production image and verified. Only when health checks pass does Traefik re-register the node.</li>
      </ul>
      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">Conclusion</h3>
      <p>
        By recycling instances sequentially and gating each node swap behind a custom health check validation loop, we successfully mitigate latency spikes and bad gateway errors, maintaining a 100% successful request rate during upgrades.
      </p>
    </article>
  ),
  "traefik-routing-rules": (
    <article className="space-y-6 text-neutral-600 text-sm md:text-base leading-relaxed">
      <p>
        Traefik is a modern reverse proxy designed for containerized setups. In our architecture, it plays a vital role as the dynamic routing layer that translates container promotions into seamless user request shifts.
      </p>
      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">How Traefik Handles the Swap</h3>
      <p>
        Because Traefik monitors provider APIs (such as Docker, Consul, or Azure tag states) dynamically, it automatically registers new instances and updates its routing table when VMs report health changes:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Dynamic Discovery:</strong> Traefik listens for Scale Set telemetry, mapping backend servers to frontend routers.</li>
        <li><strong>Hitless Grace Periods:</strong> When an instance goes into draining mode, Traefik immediately stops routing new requests, allowing existing requests to terminate gracefully without connection resets.</li>
        <li><strong>Health Gating:</strong> Traefik's active health checks verify that new instances are return codes of 200 OK before they are added to the load-balancing pool.</li>
      </ul>
      <p>
        This hot-swapping configuration acts as the load-balancer shield, protecting user sessions from the underlying virtual machine re-provisioning loop.
      </p>
    </article>
  ),
  "automatic-rollback-triggers": (
    <article className="space-y-6 text-neutral-600 text-sm md:text-base leading-relaxed">
      <p>
        Automation without a recovery plan is high risk. Our blue-green rollout pipeline features automated rollback gates to revert fleet configurations instantly if runtime anomalies occur.
      </p>
      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">Synthetic Health Checks</h3>
      <p>
        The pipeline anchor script doesn't just check for TCP connection success. It calls synthetic transactions on specialized API endpoints:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Internal Dependencies:</strong> Verifies active database connections and caching layers return valid responses.</li>
        <li><strong>Error Rate Monitoring:</strong> Monitors Traefik logs for any spikes in HTTP 5xx codes during the transition.</li>
        <li><strong>Automatic Fallback:</strong> If a synthetic check fails on the updated nodes, the script aborts the rollout, instantly swaps Traefik back to 100% stable old nodes, and sends alerting telemetry.</li>
      </ul>
      <p>
        This safeguards production environments by ensuring that faulty code updates are rolled back in under 10 seconds, before users notice any degradation.
      </p>
    </article>
  )
};

export default function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const post = blogPosts.find((p) => p.slug === slug);
  const body = postBodies[slug] || <p>Article content not found.</p>;

  if (!post) {
    return (
      <>
        <NavBar />
        <div className="bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16 px-6 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <Link href="/blog" className="text-accent underline mt-4">Back to blog</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-accent transition-colors mb-12 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to blog index
          </Link>

          {/* Post Header */}
          <div className="mb-12 border-b border-neutral-200/60 pb-8">
            <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold tracking-wide uppercase">
              {post.tag}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-950 mt-4 mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3.5 text-xs text-neutral-400 font-semibold">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.readingTime}
              </span>
            </div>
          </div>

          {/* Post Body Content */}
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-10 shadow-sm mb-16">
            {body}
          </div>

          {/* Author/Footer callout */}
          <div className="border border-neutral-200/60 rounded-xl p-5 bg-[#FAF9F6] flex justify-between items-center gap-4 text-xs font-semibold text-neutral-500">
            <span>Written by csn2.me Infra Team</span>
            <Link href="/" className="text-accent flex items-center gap-1">
              Back to Home <ArrowRight size={12} />
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
