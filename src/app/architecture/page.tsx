"use client";

import React from "react";
import { ArrowLeft, Terminal, Server, Shield } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ArchitectureDeepDive() {
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
              Technical Specification
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-6">
              Trueva Technical Architecture
            </h1>
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-3xl">
              This document outlines the cryptographic mechanics of the certificate trust network running on the Trueva validator registry.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12 mb-20">
            
            {/* Section 1: Merkle tree */}
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Terminal size={16} />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">
                  1. Merkle Tree & Batch Anchoring
                </h2>
              </div>
              
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-6 font-medium">
                Instead of anchoring each certificate individually—which is slow and public-exposing—Trueva aggregates multiple records into a single Merkle Tree. Only the single cryptographic root hash is committed to the blockchain, protecting privacy while proving existence.
              </p>

              <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[11px] text-neutral-400 leading-relaxed border border-neutral-800">
                <div className="text-neutral-500 border-b border-neutral-800 pb-2 mb-2 uppercase tracking-wider text-[9px] font-bold">
                  trueva_cert_anchor.sh
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap no-scrollbar">
{`# 1. Generate SHA-256 hash for document metadata
sha256sum student_degree_payload.json > cert_hash.txt

# 2. Build Merkle Tree root from directory of hashes
node build_merkle_tree.js --hashes ./cert_hashes/ --out merkle_root.json

# 3. Anchor Merkle Root to Smart Contract Registry
cast send $TRUEVA_REGISTRY_CONTRACT "anchorRoot(bytes32)" $MERKLE_ROOT \\
  --private-key $ISSUER_PRIVATE_KEY

# 4. Sync validator nodes
for validator_ip in $(trueva-cli list-validators); do
  echo "Broadcasting updated block height to node at $validator_ip..."
  curl -X POST -d @new_block.json http://$validator_ip/api/consensus/sync
done`}
                </pre>
              </div>
            </div>

            {/* Section 2: Consensus */}
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Shield size={16} />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">
                  2. Signature Auditing & BFT Consensus
                </h2>
              </div>
              
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-4 font-medium">
                Before a block is appended to the ledger, validator nodes execute consensus verification. Each validator audits the proposed state block against registered keys.
              </p>

              <ul className="space-y-3 text-xs md:text-sm text-neutral-600 font-medium list-disc list-inside">
                <li><strong className="text-neutral-850">Cryptographic Identity:</strong> Validators check that the proposed root signature matches the authorized issuer public key registered in the Smart Contract.</li>
                <li><strong className="text-neutral-850">Byzantine Fault Tolerance:</strong> If any validator node attempts to broadcast a block containing tampered hashes, the consensus protocol fails signature checks, rejects the block proposal, and isolates the offending node.</li>
              </ul>
            </div>

            {/* Section 3: High Availability Statistics */}
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Server size={16} />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">
                  3. Verification Gateway API
                </h2>
              </div>
              
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">
                Trueva uses a load-balanced RPC gateway layer. Verification queries are routed dynamically to synchronized validator nodes. Each validation query requires only an O(log N) Merkle path proof check, returning audit logs in under 120 milliseconds.
              </p>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
