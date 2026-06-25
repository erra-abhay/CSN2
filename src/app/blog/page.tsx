"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tag: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "azure-scale-sets-blue-green",
    title: "Zero-Downtime Rollouts on Azure VM Scale Sets",
    excerpt: "How to configure Azure Scale Sets to recycle instances one by one behind a reverse proxy, achieving a hitless release pipeline.",
    date: "June 24, 2026",
    readingTime: "5 min read",
    tag: "Azure Infrastructure"
  },
  {
    slug: "traefik-routing-rules",
    title: "Hot-Swapping Traffic Splits Using Traefik",
    excerpt: "Deep dive into configuring Traefik's dynamic routing parameters to seamlessly transition live traffic between stable and staging container ports.",
    date: "June 18, 2026",
    readingTime: "4 min read",
    tag: "Load Balancing"
  },
  {
    slug: "automatic-rollback-triggers",
    title: "Designing Fail-Safe Automated Rollback Gating",
    excerpt: "Learn how to wire up synthetic health tests to intercept rollout loops, automatically reverting traffic split on anomalies to guarantee 100% SLA.",
    date: "June 10, 2026",
    readingTime: "6 min read",
    tag: "DevOps"
  }
];

export default function BlogListing() {
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
              csn2.me engineering blog
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-6">
              Infrastructure Engineering Chronicles
            </h1>
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-3xl">
              Deep dives, lessons learned, and system logs from running our auto-scaling blue-green deployments on Azure.
            </p>
          </div>

          {/* Post Listing Grid */}
          <div className="space-y-8 mb-20">
            {blogPosts.map((post) => (
              <div 
                key={post.slug}
                className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex flex-wrap items-center gap-3.5 mb-4 text-[11px] font-semibold text-neutral-400">
                  <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-full font-bold uppercase tracking-wider">
                    {post.tag}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readingTime}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-neutral-950 mb-3 hover:text-accent transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-neutral-600 text-sm leading-relaxed mb-6 font-medium">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-hover transition-colors group"
                >
                  Read full article
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
