"use client";

import React, { useState } from "react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import HowItWorks from "@/components/how-it-works";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Key, Code2, AlertTriangle, Cpu, Lock, Terminal, Check } from "lucide-react";

export default function HowItWorksPage() {
  const [sdkTab, setSdkTab] = useState<"node" | "python" | "rust" | "go">("node");

  const sdkSnippets = {
    node: `import { createHash } from "crypto";

// 1. Compute SHA-256 hash of credential metadata
const hashCredential = (payload: object): string => {
  const data = JSON.stringify(payload);
  return "0x" + createHash("sha256").update(data).digest("hex");
};

// 2. Perform sibling verification check
const verifyMerklePath = (
  leaf: string, 
  proof: string[], 
  root: string
): boolean => {
  let currentHash = leaf;
  for (const sibling of proof) {
    const combined = [currentHash, sibling].sort().join("");
    currentHash = "0x" + createHash("sha256").update(combined).digest("hex");
  }
  return currentHash === root;
};`,
    python: `import hashlib

def hash_credential(payload: dict) -> str:
    # 1. Standardize string key representation
    data = str(payload).encode("utf-8")
    return "0x" + hashlib.sha256(data).hexdigest()

def verify_merkle_path(leaf: str, proof: list, root: str) -> bool:
    # 2. Re-calculate tree hierarchy up to the Root
    current_hash = leaf
    for sibling in proof:
        combined = "".join(sorted([current_hash, sibling])).encode("utf-8")
        current_hash = "0x" + hashlib.sha256(combined).hexdigest()
    return current_hash == root`,
    rust: `use sha2::{Sha256, Digest};

// 1. Hash local metadata payload
pub fn hash_credential(payload: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(payload.as_bytes());
    format!("0x{:x}", hasher.finalize())
}

// 2. Verify audit sibling sequence against root hash
pub fn verify_merkle_path(leaf: &str, proof: &[String], root: &str) -> bool {
    let mut current_hash = leaf.to_string();
    for sibling in proof {
        let mut elements = vec![current_hash.clone(), sibling.clone()];
        elements.sort();
        let combined = elements.join("");
        let mut hasher = Sha256::new();
        hasher.update(combined.as_bytes());
        current_hash = format!("0x{:x}", hasher.finalize());
    }
    current_hash == root
}`,
    go: `package main

import (
	"crypto/sha256"
	"encoding/hex"
	"sort"
)

// 1. Hash local metadata payload
func HashCredential(payload string) string {
	hash := sha256.Sum256([]byte(payload))
	return "0x" + hex.EncodeToString(hash[:])
}

// 2. Re-compute Merkle path
func VerifyMerklePath(leaf string, proof []string, root string) bool {
	currentHash := leaf
	for _, sibling := range proof {
		elements := []string{currentHash, sibling}
		sort.Strings(elements)
		combined := elements[0] + elements[1]
		hash := sha256.Sum256([]byte(combined))
		currentHash = "0x" + hex.EncodeToString(hash[:])
	}
	return currentHash == root
}`
  };

  return (
    <>
      <NavBar />
      <main className="bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 mb-6">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-accent transition-colors group animate-fade-in"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to homepage
          </Link>
        </div>

        {/* Step-by-step diagram component */}
        <HowItWorks />

        {/* Mathematics Deep Dive Section */}
        <section className="py-20 bg-white border-t border-neutral-200/40">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-neutral-900 mb-8 flex items-center gap-2">
              <Cpu className="text-accent" /> Cryptographic Verification Deep-Dive
            </h2>

            <div className="space-y-12 text-neutral-600 text-sm md:text-base leading-relaxed font-medium">
              
              {/* Mathematics of Merkle Proofs */}
              <div>
                <h3 className="text-lg font-bold text-neutral-950 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-mono font-bold">M</span>
                  The Mathematics of Merkle Verification
                </h3>
                <p className="mb-4">
                  Traditional registry database lookups scale linearly—auditing $N$ certificates requires $O(N)$ operations, scanning the entire database record by record. 
                  Trueva aggregates credential hashes into a binary **Merkle Tree**, enabling verification in logarithmic time $O(\log N)$.
                </p>
                
                {/* Math Formulas Box */}
                <div className="my-6 bg-neutral-900 text-neutral-300 rounded-2xl p-6 font-mono text-xs border border-neutral-800 leading-normal space-y-4">
                  <span className="block text-accent font-bold text-[9px] uppercase tracking-wider">Merkle Node Pairwise Equations</span>
                  <div className="space-y-2">
                    <div>
                      <span className="text-neutral-500 block mb-0.5">// Compute certificate leaf hash from metadata:</span>
                      <span className="text-white font-bold">H_A = SHA256( Name_A || Award_A || Date_A )</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block mb-0.5">// Combine sibling nodes:</span>
                      <span className="text-white font-bold">H_AB = SHA256( H_A || H_B )</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block mb-0.5">// Root Node Hash:</span>
                      <span className="text-white font-bold">Root = SHA256( H_AB || H_CD )</span>
                    </div>
                  </div>
                  <div className="border-t border-neutral-800 pt-3 text-[10px] text-neutral-450 leading-relaxed font-sans font-medium">
                    To audit a single Leaf hash (e.g. $H_A$), the verify client only needs the sibling hash $H_B$ and parent sibling $H_{CD}$ to calculate the root. This is the **Merkle Proof**. It reduces verification checks on 1,000,000 documents to just 20 hashing iterations.
                  </div>
                </div>

                <p>
                  To verify that a specific certificate hash is part of the batch committed to the smart contract, the client only needs the certificate hash itself and a list of sibling node hashes along the path (the Merkle Proof). 
                  The verification gateway performs pairwise SHA-256 hashes moving up the tree, and checks if the calculated root matches the committed block root.
                </p>
              </div>

              {/* Zero-Knowledge Compliance Section */}
              <div className="border-t border-neutral-100 pt-10">
                <h3 className="text-lg font-bold text-neutral-950 mb-4 flex items-center gap-2">
                  <Lock size={18} className="text-accent" /> Zero-Knowledge Credential Compliance
                </h3>
                <p className="mb-6">
                  Trueva ensures FERPA and GDPR compliance by separating **credential identity** from **ledger proofs**. While institutions sign credentials, the public consensus layer only maintains Root Hashes.
                </p>
                
                {/* ZK Workflow Flowchart Visual */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[10px] text-neutral-600 mb-6">
                  <div className="bg-neutral-50 border border-neutral-200/50 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-accent font-bold text-[8px] uppercase tracking-wider block mb-1">Step 1: Local Hash</span>
                      <h4 className="font-bold text-neutral-900 mb-1">Local Identity</h4>
                      <p className="text-[9px] leading-relaxed text-neutral-500">Student metadata payload (Name, Degree, GPA) is hashed locally on the university registry database server.</p>
                    </div>
                    <span className="text-[8px] text-neutral-400 font-bold mt-3">Result: 32-byte digest</span>
                  </div>

                  <div className="bg-neutral-50 border border-neutral-200/50 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-accent font-bold text-[8px] uppercase tracking-wider block mb-1">Step 2: Tree Anchor</span>
                      <h4 className="font-bold text-neutral-900 mb-1">Consensus Root</h4>
                      <p className="text-[9px] leading-relaxed text-neutral-500">Local hashes are compiled into a Merkle Tree. Proposer commits root hash on-chain. Personal data never leaves local vaults.</p>
                    </div>
                    <span className="text-[8px] text-neutral-400 font-bold mt-3">Result: Root Hash committed</span>
                  </div>

                  <div className="bg-neutral-50 border border-neutral-200/50 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-accent font-bold text-[8px] uppercase tracking-wider block mb-1">Step 3: Verification</span>
                      <h4 className="font-bold text-neutral-900 mb-1">ZKP Verification</h4>
                      <p className="text-[9px] leading-relaxed text-neutral-500">Employers verify path math parameters against the root ledger. No names are sent to network request log streams.</p>
                    </div>
                    <span className="text-[8px] text-neutral-400 font-bold mt-3">Result: 0-Disclosure check</span>
                  </div>
                </div>
              </div>

              {/* Security and Auditable Compliance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-neutral-100">
                <div>
                  <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
                    <Key size={16} className="text-accent" /> Authenticity of Origin
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                    Because each certificate hash is encrypted with the issuer's private key before being compiled into the Merkle Tree, verifiers check both proof inclusion and signature validity. This guarantees that certificate templates cannot be cloned or spoofed.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
                    <Code2 size={16} className="text-accent" /> GDPR & FERPA Compliance
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                    Educational records are strictly protected. Since only the 32-byte Merkle root is committed to the blockchain, and all student details are hashed locally, no personal data resides on the ledger, meeting all regulatory rules.
                  </p>
                </div>
              </div>

              {/* Alert Warning Box */}
              <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-5 flex gap-4 text-xs text-amber-800">
                <AlertTriangle size={20} className="text-status-amber shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold mb-1">Important: Key Management Rules</h4>
                  <p className="leading-relaxed font-semibold">
                    Issuers must safeguard their private validation keys. If an institution's private key is leaked or compromised, unauthorized actors could issue signed hashes. In such cases, the contract admin must immediately publish key revocation updates to the Smart Contract Registry.
                  </p>
                </div>
              </div>

              {/* Developer SDK quickstart tutorial code blocks */}
              <div className="border-t border-neutral-100 pt-10" id="sdk-tutorial">
                <h3 className="text-lg font-bold text-neutral-950 mb-3 flex items-center gap-2">
                  <Terminal size={18} className="text-accent" /> Developer SDK Integration Guide
                </h3>
                <p className="mb-6">
                  Integrate validation checks directly into your registrar databases or application portals. Use these raw scripts to execute cryptographic verification checks locally.
                </p>

                {/* SDK tabs */}
                <div className="flex gap-2 mb-4 border-b border-neutral-100 pb-3">
                  {(["node", "python", "rust", "go"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSdkTab(tab)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer capitalize ${
                        sdkTab === tab ? "bg-accent/10 text-accent" : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      {tab === "node" ? "NodeJS" : tab}
                    </button>
                  ))}
                </div>

                {/* Code display */}
                <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 shadow-xl font-mono text-[11px] text-neutral-300 leading-relaxed overflow-x-auto">
                  <div className="flex items-center justify-between border-b border-neutral-850 pb-3 mb-4 text-[9px] font-bold uppercase text-neutral-500 tracking-wider">
                    <span className="flex items-center gap-1.5"><Code2 size={12} className="text-accent" /> sdk_verify_path.{sdkTab === "node" ? "ts" : sdkTab === "python" ? "py" : sdkTab === "rust" ? "rs" : "go"}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-status-green" />
                  </div>
                  <pre className="overflow-x-auto whitespace-pre no-scrollbar">
                    <code>{sdkSnippets[sdkTab]}</code>
                  </pre>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
