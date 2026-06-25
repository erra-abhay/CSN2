"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { blogPosts } from "../page";

// Detail bodies for the posts
const postBodies: Record<string, React.ReactNode> = {
  "decentralized-credential-verification": (
    <article className="space-y-6 text-neutral-600 text-sm md:text-base leading-relaxed">
      <p>
        Verifying digital credentials securely is a core requirement of modern record systems. Traditional database setups suffer from central vulnerabilities, privacy leakage risks, and reliance on single registrars.
        By using Merkle Trees, Trueva enables complete verification without exposing raw student data or overloading database gateways.
      </p>
      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">The Cryptographic Proof Flow</h3>
      <p>
        In the Trueva registry, the document anchoring process operates as follows:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Local Hashing:</strong> Document metadata (e.g., student name, GPA, distinction details) is hashed locally into a unique SHA-256 value. The raw data remains completely private.</li>
        <li><strong>Merkle Tree Aggregation:</strong> Individual hashes are combined in pairs recursively to generate a Merkle Tree. This leaves us with a single hash at the top: the Merkle Root.</li>
        <li><strong>Smart Contract Commit:</strong> The Merkle Root is committed via a signed transaction to the Trueva Contract Registry on the consensus ledger.</li>
        <li><strong>Merkle Proof Checks:</strong> To verify, a verifier queries the RPC nodes with the certificate SHA-256 and the Merkle proof (a list of sibling hashes in the path). Checking the path computes the root hash, validating authenticity instantly in O(log N) time.</li>
      </ul>
      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">Conclusion</h3>
      <p>
        This cryptographic aggregation allows universities to anchor thousands of records in a single transaction block. Relying parties verify academic credentials directly, guaranteeing authenticity without requesting database access.
      </p>
    </article>
  ),
  "preventing-certificate-tampering": (
    <article className="space-y-6 text-neutral-600 text-sm md:text-base leading-relaxed">
      <p>
        In academic credential systems, preventing unauthorized alterations or retrospective modifications is critical. Trueva's Proof-of-Authority (PoA) consensus mechanism guarantees state consistency across all participating nodes.
      </p>
      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">How Consensus Protects State</h3>
      <p>
        The consensus protocol acts as an active integrity auditor:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Authorized Signatures:</strong> Only blocks proposed by registered issuer addresses containing valid ECDSA signatures are accepted.</li>
        <li><strong>Validator Node Auditing:</strong> When a new block is propagated, validators perform pre-flight consensus checks. They verify signature formats and cross-check the Merkle Root hash against transaction records.</li>
        <li><strong>Byzantine Fault Rejection:</strong> If a compromised node attempts to broadcast a block containing tampered records or duplicate transactions, the validation signature checks fail. The network immediately rejects the block, alerts RPC load balancers, and re-syncs the nodes to the last honest block.</li>
      </ul>
      <p>
        This fail-safe validation checks and automatically isolates malicious actors, guaranteeing 100% cryptographic ledger integrity.
      </p>
    </article>
  ),
  "scalable-verification-rpc-gateways": (
    <article className="space-y-6 text-neutral-600 text-sm md:text-base leading-relaxed">
      <p>
        Serving verification requests at scale requires high-performance RPC infrastructure. Trueva separates block creation logic from query routing, deploying RPC gateway load-balancers to manage high validation traffic.
      </p>
      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">High-Throughput Verification Architecture</h3>
      <p>
        The RPC Gateway Layer ensures sub-120ms verification responses globally:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Dynamic Validator Routing:</strong> The gateway tracks block height status of all validator pool nodes. It redirects verification requests only to nodes reporting fully synchronized states.</li>
        <li><strong>Cache Gating:</strong> Since Merkle roots are immutable, verified roots are cached at the edge. The gateway validates Merkle proofs instantly, bypassing database queries.</li>
        <li><strong>Dynamic Scalability:</strong> If incoming validation traffic spikes, the autoscaling controller provisions additional read-only verifier nodes, attaching them to the RPC pool to maintain low latency.</li>
      </ul>
      <p>
        This separation of validator node consensus and RPC query load balances network resources, maintaining high availability for institutions and employers globally.
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
            <span>Written by csn2.me Registry Team</span>
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
