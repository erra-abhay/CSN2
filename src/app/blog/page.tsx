"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion, Variants } from "framer-motion";

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
    slug: "decentralized-credential-verification",
    title: "Decentralized Credential Verification: Merkle Trees & Cryptographic Proofs",
    excerpt: "How to compile certificate metadata into Merkle Tree root hashes to enable zero-knowledge proofs and fast verification checks without central authority dependencies.",
    date: "June 24, 2026",
    readingTime: "5 min read",
    tag: "Cryptography"
  },
  {
    slug: "preventing-certificate-tampering",
    title: "Preventing Certificate Tampering: How Consensus Guards Ledger Integrity",
    excerpt: "Deep dive into Proof-of-Authority consensus checks, auditing proposed transaction blocks, and isolating malicious nodes attempting state tampering.",
    date: "June 18, 2026",
    readingTime: "4 min read",
    tag: "Consensus Protocols"
  },
  {
    slug: "scalable-verification-rpc-gateways",
    title: "Scalable Verification: Architecture of Trueva RPC Gateways",
    excerpt: "Learn how to build load-balanced RPC node networks to deliver sub-150ms verification latencies while handling heavy verification query volumes.",
    date: "June 10, 2026",
    readingTime: "6 min read",
    tag: "RPC Infrastructure"
  },
  {
    slug: "consensus-mechanisms-poa-pos",
    title: "Proof-of-Authority vs Proof-of-Stake in Enterprise Ledgers",
    excerpt: "An in-depth analysis of consensus protocols, explaining why Proof-of-Authority serves as the optimal trust architecture for institutional academic record registries.",
    date: "June 05, 2026",
    readingTime: "7 min read",
    tag: "Consensus Protocols"
  },
  {
    slug: "privacy-preserving-zero-knowledge",
    title: "Privacy-Preserving Credentials: Implementing Zero-Knowledge Merkle Proofs",
    excerpt: "How to use zero-knowledge cryptography to check degree credentials without exposing personal identifiable information (PII) to verification request logs.",
    date: "May 28, 2026",
    readingTime: "8 min read",
    tag: "Zero-Knowledge"
  },
  {
    slug: "w3c-verifiable-credentials-dids",
    title: "W3C Verifiable Credentials & DIDs: The Future of Sovereign Digital Identity",
    excerpt: "An extensive analysis of W3C Verifiable Credentials, Decentralized Identifiers (DIDs), and how public registries establish a cryptographic trust layer for digital credentials.",
    date: "May 20, 2026",
    readingTime: "9 min read",
    tag: "W3C Standards"
  }
];

export default function BlogListing() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

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
              Trueva Engineering Chronicles
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-6">
              Decentralized Trust & Ledger Systems
            </h1>
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-3xl">
              Deep dives, lessons learned, and cryptographic specifications from building Trueva's high-throughput certificate verification ledger.
            </p>
          </div>

          {/* Post Listing Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8 mb-20"
          >
            {blogPosts.map((post) => (
              <motion.div 
                key={post.slug}
                variants={cardVariants}
                className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex flex-wrap items-center gap-3.5 mb-4 text-[11px] font-semibold text-neutral-400">
                  <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-full font-bold uppercase tracking-wider font-sans">
                    {post.tag}
                  </span>
                  <span className="flex items-center gap-1 font-sans">
                    <Calendar size={12} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1 font-sans">
                    <Clock size={12} />
                    {post.readingTime}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-neutral-950 mb-3 hover:text-accent transition-colors font-sans">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-neutral-600 text-sm leading-relaxed mb-6 font-medium font-sans">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-hover transition-colors group font-sans"
                >
                  Read full article
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
      <Footer />
    </>
  );
}
