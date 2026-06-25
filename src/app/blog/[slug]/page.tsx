"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, ArrowRight, ShieldCheck, Key, Database, Cpu, Lock, Terminal, Globe } from "lucide-react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { blogPosts } from "../page";
import { motion } from "framer-motion";

// Detail bodies for the posts
const postBodies: Record<string, React.ReactNode> = {
  "decentralized-credential-verification": (
    <div className="space-y-6 text-neutral-600 text-sm md:text-base leading-relaxed font-sans font-medium">
      <p>
        Academic credential fraud is a multi-million dollar problem. Standard degree checks are slow, manual, and rely heavily on central registrar databases. 
        When employers query an institution to verify a graduate's degree, they trigger data leaks and create network latency.
        Trueva solves this by aggregating degree metadata hashes into **Merkle Trees** and anchoring the root hashes to a secure, decentralized validator network.
      </p>

      <div className="my-8 border border-neutral-200/50 bg-neutral-50 rounded-2xl p-6">
        <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-1.5 text-sm uppercase tracking-wider">
          <ShieldCheck size={16} className="text-accent" /> Why Merkle Trees?
        </h4>
        <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
          A Merkle Tree is a binary tree where every leaf node represents a cryptographic hash of certificate metadata, and every non-leaf node represents a hash of its children:
          <span className="block my-2 font-mono text-neutral-700 bg-white p-2.5 rounded border border-neutral-250/50 text-[10px] select-all">
            Parent_Hash = SHA256( Left_Node_Hash + Right_Node_Hash )
          </span>
          This hierarchy allows verification of a single certificate's presence in a batch using only O(log N) proofs, rather than auditing the entire database.
        </p>
      </div>

      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2 font-sans">Cryptographic Validation Pipeline</h3>
      <p>
        The step-by-step lifecycle of anchoring certificate records onto the Trueva ledger proceeds through these stages:
      </p>
      <ol className="list-decimal list-inside space-y-3 font-semibold text-neutral-600 text-xs">
        <li>
          <strong className="text-neutral-850">Document Hashing:</strong> Certificate details (Student Name, Institution, Degree, GPA, Issue Date) are compiled into a standard JSON string. The local engine hashes the string using SHA-256 to create a 32-byte hash.
        </li>
        <li>
          <strong className="text-neutral-850">ECDSA Signing:</strong> The institution uses its private key to encrypt the SHA-256 hash, generating a cryptographic signature that verifies origin.
        </li>
        <li>
          <strong className="text-neutral-850">Merkle Aggregation:</strong> Up to 10,000 signed certificate hashes are organized in pairs to generate a Merkle Tree. The final resulting hash is the Merkle Root.
        </li>
        <li>
          <strong className="text-neutral-850">Contract Anchor:</strong> The Merkle Root is submitted to the Trueva Contract Registry via a blockchain transaction, updating the block consensus height.
        </li>
      </ol>

      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">Verification Efficiency Comparison</h3>
      <div className="overflow-x-auto no-scrollbar my-6">
        <table className="w-full text-left border-collapse border border-neutral-200/60 rounded-xl text-xs font-semibold text-neutral-600">
          <thead>
            <tr className="bg-neutral-50 text-neutral-900 border-b border-neutral-200">
              <th className="p-3">Batch Size (Certs)</th>
              <th className="p-3">Database Verification Time</th>
              <th className="p-3">Merkle Proof Time (Trueva)</th>
              <th className="p-3">Privacy Leakage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            <tr>
              <td className="p-3">100</td>
              <td className="p-3">1,400ms</td>
              <td className="p-3">&lt; 5ms</td>
              <td className="p-3 text-status-red font-bold">EXPOSED</td>
            </tr>
            <tr>
              <td className="p-3">1,000</td>
              <td className="p-3">2,800ms</td>
              <td className="p-3">&lt; 8ms</td>
              <td className="p-3 text-status-red font-bold">EXPOSED</td>
            </tr>
            <tr>
              <td className="p-3">10,000</td>
              <td className="p-3">5,500ms</td>
              <td className="p-3">&lt; 12ms</td>
              <td className="p-3 text-status-green font-bold">ZERO LEAKS</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        By eliminating database checks and verifying hashes directly against the immutable root on the consensus nodes, Trueva reduces verification overhead to virtually zero.
      </p>
    </div>
  ),
  "preventing-certificate-tampering": (
    <div className="space-y-6 text-neutral-600 text-sm md:text-base leading-relaxed font-sans font-medium">
      <p>
        Ledger security is only as strong as its consensus mechanism. In public blockchains, Proof-of-Work (PoW) or Proof-of-Stake (PoS) are used. 
        However, for institutional credential registries, **Proof-of-Authority (PoA)** consensus serves as the optimal framework. 
        It replaces energy-intensive mining with signed verification keys allocated to approved registrar nodes.
      </p>

      <div className="my-8 border border-neutral-200/50 bg-neutral-50 rounded-2xl p-6">
        <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-1.5 text-sm uppercase tracking-wider">
          <Key size={16} className="text-accent" /> Signature Audits
        </h4>
        <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
          Every proposed block containing Merkle roots of certificates is audited by validator nodes before inclusion. Validators perform ECDSA signature verification checks against the smart contract registry of authorized institution keys.
        </p>
      </div>

      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">Consensus Audit Cycle</h3>
      <p>
        When a block update is broadcast to the network, validators follow a zero-trust consensus check loop:
      </p>
      <ul className="list-disc list-inside space-y-3 font-semibold text-neutral-600 text-xs">
        <li>
          <strong className="text-neutral-850">Pre-flight Validation:</strong> Validator nodes intercept the transaction. They check that the public address proposing the block matches one of the authorized registrar signatures.
        </li>
        <li>
          <strong className="text-neutral-850">State Verification:</strong> Nodes compute the hash of the proposed block, verifying that no transactions within the block contain mismatched inputs or tampered certificate digests.
        </li>
        <li>
          <strong className="text-neutral-850">Byzantine Rejection:</strong> If a compromised validator (e.g. node-3) proposes an invalid block containing a fake certificate hash, the other 5 nodes detect the state mismatch. The block fails the signature quorum check, is immediately rejected, and node-3 is isolated for state re-synchronization.
        </li>
      </ul>

      <p>
        This BFT design guarantees that certificate records cannot be retroactively modified or forged, even if one of the network validator nodes is compromised.
      </p>
    </div>
  ),
  "scalable-verification-rpc-gateways": (
    <div className="space-y-6 text-neutral-600 text-sm md:text-base leading-relaxed font-sans font-medium">
      <p>
        Building a blockchain registry is only the first step. To serve thousands of query requests per second from employment sites and background check companies, the network must scale its read capability. 
        Trueva accomplishes this by separating the transaction validators from the **RPC Verification Gateway Layer**.
      </p>

      <div className="my-8 border border-neutral-200/50 bg-neutral-50 rounded-2xl p-6">
        <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-1.5 text-sm uppercase tracking-wider">
          <Database size={16} className="text-accent" /> The Gateway Layer
        </h4>
        <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
          The RPC Gateway is a load-balancer that dynamically maps verification queries to synced validator nodes. By keeping read-only nodes decoupled from consensus nodes, we ensure high availability and sub-120ms latencies.
        </p>
      </div>

      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">Dynamic Capacity Scaling</h3>
      <p>
        If query volume increases (e.g. during hiring seasons), the network autoscaling rule triggers:
      </p>
      <ul className="list-disc list-inside space-y-3 font-semibold text-neutral-600 text-xs">
        <li>
          <strong className="text-neutral-850">Load Peak Detection:</strong> Gateway monitors query latencies. If CPU utilization exceeds 80% on read nodes, the scaling rule initiates.
        </li>
        <li>
          <strong className="text-neutral-850">Verifier Provisioning:</strong> Two additional read verifier nodes (node-6 and node-7) are booted and synchronized with the latest ledger block state.
        </li>
        <li>
          <strong className="text-neutral-850">RPC Attachment:</strong> Once node-6 and node-7 report synced status, they are attached to the gateway proxy balancer pool. Latency drops back to stable levels.
        </li>
      </ul>

      <p>
        This decoupling of network write consensus and read query balance ensures that the trust registry stays online under heavy workload spikes.
      </p>
    </div>
  ),
  "consensus-mechanisms-poa-pos": (
    <div className="space-y-6 text-neutral-600 text-sm md:text-base leading-relaxed font-sans font-medium">
      <p>
        Enterprise record ledgers have distinct requirements compared to public cryptocurrency networks. Public chains rely on Proof-of-Stake (PoS) to coordinate anonymous actors. 
        For trusted academic credentials, however, **Proof-of-Authority (PoA)** offers superior speed, deterministic finality, and zero gas-price volatility.
      </p>

      <div className="my-8 border border-neutral-200/50 bg-neutral-50 rounded-2xl p-6">
        <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-1.5 text-sm uppercase tracking-wider">
          <Cpu size={16} className="text-accent" /> PoA Consensus Profile
        </h4>
        <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
          In PoA, validator nodes are pre-approved institutions (e.g. Stanford, MIT, Berkeley). Staking value is replaced by institutional reputation, and transaction fees are replaced by fixed operational costs, cutting network inflation.
        </p>
      </div>

      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">Detailed Comparison</h3>
      <div className="overflow-x-auto no-scrollbar my-6">
        <table className="w-full text-left border-collapse border border-neutral-200/60 rounded-xl text-xs font-semibold text-neutral-600">
          <thead>
            <tr className="bg-neutral-50 text-neutral-900 border-b border-neutral-200">
              <th className="p-3">Metric</th>
              <th className="p-3">Proof-of-Authority (TCR)</th>
              <th className="p-3">Proof-of-Stake (L1s)</th>
              <th className="p-3">Proof-of-Work (Legacy)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            <tr>
              <td className="p-3 font-bold">Throughput (TPS)</td>
              <td className="p-3 text-status-green font-bold">2,500+ TPS</td>
              <td className="p-3">~100-500 TPS</td>
              <td className="p-3 text-status-red">~10 TPS</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Finality Latency</td>
              <td className="p-3 text-status-green font-bold">&lt; 1s (Instant)</td>
              <td className="p-3">12s - 3 mins</td>
              <td className="p-3 text-status-red">30-60 mins</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Gas Cost Stability</td>
              <td className="p-3 text-status-green font-bold">Deterministic (0)</td>
              <td className="p-3">Volatile (Gwei spikes)</td>
              <td className="p-3 text-status-red">Highly Volatile</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Energy Profile</td>
              <td className="p-3">Negligible</td>
              <td className="p-3">Low</td>
              <td className="p-3 text-status-red">Extremely High</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        For enterprise credentialing where identity and origin are key, PoA is the clear winner, bringing cost predictability and rapid block finalization.
      </p>
    </div>
  ),
  "privacy-preserving-zero-knowledge": (
    <div className="space-y-6 text-neutral-600 text-sm md:text-base leading-relaxed font-sans font-medium">
      <p>
        The biggest challenge of publishing certificate records on public ledger registries is privacy. How do we allow employers to verify a degree without exposing personal identifiable information (PII) like names, birthdates, and grades to the public blockchain history? 
        The solution lies in **Zero-Knowledge Merkle Proofs**.
      </p>

      <div className="my-8 border border-neutral-200/50 bg-neutral-50 rounded-2xl p-6">
        <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-1.5 text-sm uppercase tracking-wider">
          <Lock size={16} className="text-accent" /> ZK-SNARK Integration
        </h4>
        <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
          ZK-SNARK proofs let a user prove they possess a valid path in a Merkle tree without revealing their private parameters (the leaf indices or values). The validator only verifies the proof mathematics against the public root.
        </p>
      </div>

      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">How ZK-Proofs Work</h3>
      <p>
        A student verifying their credential on Trueva follows this cryptographic cycle:
      </p>
      <ul className="list-disc list-inside space-y-3 font-semibold text-neutral-600 text-xs">
        <li>
          <strong className="text-neutral-850">Proof Generation (Local):</strong> The student loads their certificate JSON and private key in their browser. Trueva's client SDK compiles the variables and generates a mathematical validation proof.
        </li>
        <li>
          <strong className="text-neutral-850">Proof Transmission:</strong> The client sends only the proof parameters (e.g. proof points A, B, C) to the verification gateway, keeping the name and degree course private.
        </li>
        <li>
          <strong className="text-neutral-850">Gateway Audit:</strong> The RPC node evaluates the proof equation. If the math holds, it confirms the certificate is part of the committed root, returning a verified checkmark with 0 disclosure.
        </li>
      </ul>

      <p>
        Zero-Knowledge verification ensures academic credentials are 100% auditable while maintaining absolute student privacy, complying with GDPR and strict educational confidentiality rules.
      </p>
    </div>
  ),
  "w3c-verifiable-credentials-dids": (
    <div className="space-y-6 text-neutral-600 text-sm md:text-base leading-relaxed font-sans font-medium">
      <p>
        The landscape of digital identity is shifting toward **Self-Sovereign Identity (SSI)** models. Under this model, individuals hold custody of their data using standard cryptographic keys rather than third-party servers. 
        Trueva implements these concepts directly via **W3C Verifiable Credentials (VC)** and **Decentralized Identifiers (DIDs)**.
      </p>

      <div className="my-8 border border-neutral-200/50 bg-neutral-50 rounded-2xl p-6">
        <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-1.5 text-sm uppercase tracking-wider">
          <Globe size={16} className="text-accent" /> W3C Identity Specs
        </h4>
        <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
          A Decentralized Identifier (DID) is a new type of globally unique identifier that does not require a centralized registration authority. DIDs resolve to DID Documents containing cryptographic public keys of registrars:
          <span className="block my-2 font-mono text-neutral-700 bg-white p-2.5 rounded border border-neutral-250/50 text-[9px] select-all">
            did:trueva:stan-registrar-node-4281
          </span>
        </p>
      </div>

      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">Verifiable Credential Schema Anatomy</h3>
      <p>
        A W3C credential consists of three key nodes: the **Issuer** (Signs the VC), the **Holder** (Stores the VC in a local key wallet), and the **Verifier** (Audits validity against registry nodes).
      </p>
      
      <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[10px] text-neutral-300 leading-relaxed border border-neutral-800 my-6">
        <div className="text-neutral-500 border-b border-neutral-800 pb-2 mb-2 uppercase tracking-wider text-[8px] font-bold">
          sample_w3c_credential.json
        </div>
        <pre className="overflow-x-auto whitespace-pre no-scrollbar text-neutral-300">
{`{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schema.csn2.me/trueva/v1"
  ],
  "id": "trueva:cert:stan-cs-4281",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "did:trueva:stan-registrar-node",
  "issuanceDate": "2026-06-25T12:00:00Z",
  "credentialSubject": {
    "id": "did:key:z6MkpTHR8VNs",
    "degree": "Bachelor of Science in Computer Science",
    "gpa": "3.92"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2026-06-25T12:05:00Z",
    "verificationMethod": "did:trueva:stan-registrar-node#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z3h29Ak2..."
  }
}`}
        </pre>
      </div>

      <h3 className="text-lg font-bold text-neutral-950 mt-8 mb-2">Interoperability and EBSI Standards</h3>
      <p>
        By complying with W3C standards, Trueva ensures that diplomas can be recognized across international borders. 
        It integrates with the European Blockchain Services Infrastructure (EBSI) network protocols, allowing university registries in Europe and the US to speak the same validation language.
      </p>
    </div>
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-accent transition-colors mb-12 group font-sans"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to blog index
          </Link>

          {/* Post Header */}
          <div className="mb-12 border-b border-neutral-200/60 pb-8">
            <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold tracking-wide uppercase font-sans">
              {post.tag}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-955 mt-4 mb-6 leading-tight font-sans">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3.5 text-xs text-neutral-400 font-semibold font-sans">
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

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-10 shadow-sm mb-16"
          >
            {body}
          </motion.div>

          {/* Author/Footer callout */}
          <div className="border border-neutral-200/60 rounded-xl p-5 bg-[#FAF9F6] flex justify-between items-center gap-4 text-xs font-semibold text-neutral-500 font-sans">
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
