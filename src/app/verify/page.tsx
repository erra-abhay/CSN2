"use client";

import React, { useState, useEffect, Suspense } from "react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldAlert, Loader2, Key, Check, Award, FileText, Database, Shield, Layers, HelpCircle, CheckSquare, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingCubesBackground } from "@/components/cube-animation";

interface Certificate {
  id: string;
  studentName: string;
  institution: string;
  degree: string;
  grade: string;
  date: string;
  hash: string;
  signature: string;
  txHash: string;
  blockHeight: string;
}

const defaultCerts: Certificate[] = [
  {
    id: "trueva:cert:mit-math-9831",
    studentName: "Alice Johnson",
    institution: "Massachusetts Institute of Technology",
    degree: "Bachelor of Science in Mathematics",
    grade: "First Class Honours",
    date: "2026-05-18",
    hash: "0x12a83b9c7d8f5e2b0a9b8372e61a4c9e8d3b7e61",
    signature: "0xe8192a6b29c010a3f902sig",
    txHash: "0x3db9a2f60a8e7a09d18b1ea32a82bc71e",
    blockHeight: "blk-4810",
  },
  {
    id: "trueva:cert:stan-mba-7740",
    studentName: "Bob Miller",
    institution: "Stanford University",
    degree: "Master of Business Administration (MBA)",
    grade: "Distinction",
    date: "2026-06-02",
    hash: "0x7c9a2f8d3c1e0b9a8f3d6c7b9e2a10ef2a9b8a21",
    signature: "0xa2831b6c09df10ef3c881sig",
    txHash: "0x5d9b62a4b8c9d0e1f2a3b4c5d6e7f8a9b",
    blockHeight: "blk-4815",
  },
  {
    id: "trueva:cert:ahub-fse-2015",
    studentName: "Carol Smith",
    institution: "AcadHub Academy",
    degree: "Diploma in Full Stack Software Engineering",
    grade: "Distinction",
    date: "2025-12-15",
    hash: "0xf8d7c6b5a4e3d2c1b0a9f8e7d6c5b4a3e2d1c0b1",
    signature: "0xd9812e03a9b8cd7a830sig",
    txHash: "0x98a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d",
    blockHeight: "blk-4752",
  }
];

function VerificationContent() {
  const searchParams = useSearchParams();
  const certIdParam = searchParams.get("id") || "";

  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [allCerts, setAllCerts] = useState<Certificate[]>(defaultCerts);

  // Revocation list state (mock database)
  const [revokedIds, setRevokedIds] = useState<string[]>(["trueva:cert:mit-math-9831-revoked"]);

  const steps = [
    "Re-Hashing Metadata payload (SHA-256 check)...",
    "Verifying Issuer ECDSA Public Signature key...",
    "Validating sibling nodes path in Merkle Tree...",
    "Confirming block height consensus on RPC nodes..."
  ];

  useEffect(() => {
    // Read certificates from local storage
    if (typeof window !== "undefined") {
      const localCerts = JSON.parse(localStorage.getItem("trueva_certs") || "[]");
      setAllCerts([...localCerts, ...defaultCerts]);
    }
  }, []);

  useEffect(() => {
    if (certIdParam && allCerts.length > defaultCerts.length) {
      handleVerify(certIdParam);
    } else if (certIdParam && allCerts.length === defaultCerts.length) {
      handleVerify(certIdParam);
    }
  }, [certIdParam, allCerts.length]);

  const handleVerify = (idToVerify: string) => {
    const targetId = idToVerify.trim();
    if (!targetId) return;

    setLoading(true);
    setResult(null);
    setSearched(false);
    setErrorMsg("");
    setScanStep(0);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setScanStep(currentStep);
      } else {
        clearInterval(interval);
        
        // Handle revocation check scenario
        if (targetId.includes("revoked")) {
          setErrorMsg("CRITICAL FAILURE: Certificate hash revoked by Issuer Node! Check revocation reason: Academic Plagiarism (Drill).");
          setLoading(false);
          setSearched(true);
          return;
        }

        const found = allCerts.find(
          c => c.id.toLowerCase() === targetId.toLowerCase() || c.hash.toLowerCase() === targetId.toLowerCase()
        );
        
        if (found) {
          setResult(found);
        } else {
          setErrorMsg("Verification Failed: Cryptographic signature mismatch. The certificate details have been altered or are not registered in the ledger.");
        }
        setLoading(false);
        setSearched(true);
      }
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-accent transition-colors mb-10 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to homepage
      </Link>

      {/* Header */}
      <div className="mb-12">
        <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold tracking-wide uppercase">
          RPC Node Audits
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-6">
          Certificate Auditing Portal
        </h1>
        <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-3xl">
          Trueva certificates are validated through decentralized cryptographic checks. Read the protocol breakdown below, select a credentials card to simulate verification, and review the ledger transaction data.
        </p>
      </div>

      {/* Grid: 4 Verification Layers Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {/* Layer 1 */}
        <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
            <FileText size={16} />
          </div>
          <h3 className="text-xs font-bold text-neutral-900 mb-1.5 uppercase tracking-wider">
            1. Metadata Check
          </h3>
          <p className="text-[10px] leading-relaxed text-neutral-500 font-semibold">
            Re-hashes certificate data fields locally to verify that text or details have not been altered.
          </p>
        </div>

        {/* Layer 2 */}
        <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
            <Key size={16} />
          </div>
          <h3 className="text-xs font-bold text-neutral-900 mb-1.5 uppercase tracking-wider">
            2. ECDSA Signature
          </h3>
          <p className="text-[10px] leading-relaxed text-neutral-500 font-semibold">
            Decrypts signed payloads using the issuer's registered public key to confirm authentic origin.
          </p>
        </div>

        {/* Layer 3 */}
        <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
            <Layers size={16} />
          </div>
          <h3 className="text-xs font-bold text-neutral-900 mb-1.5 uppercase tracking-wider">
            3. Merkle Proof
          </h3>
          <p className="text-[10px] leading-relaxed text-neutral-500 font-semibold">
            Checks parent nodes to construct the Merkle path and match the root hash committed to the block.
          </p>
        </div>

        {/* Layer 4 */}
        <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
            <Database size={16} />
          </div>
          <h3 className="text-xs font-bold text-neutral-900 mb-1.5 uppercase tracking-wider">
            4. State Consensus
          </h3>
          <p className="text-[10px] leading-relaxed text-neutral-500 font-semibold">
            Queries validator pool RPC endpoints to confirm the root is included in active consensus blocks.
          </p>
        </div>
      </div>

      {/* Split layout: Credentials Grid & Validation Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mb-12">
        
        {/* Left: Certificate selector list */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Award size={14} className="text-accent" /> Available Credentials for Audit
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allCerts.map((c) => (
              <div
                key={c.id}
                onClick={() => handleVerify(c.id)}
                className={`bg-white border text-left p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5 ${
                  result?.id === c.id ? "border-accent ring-2 ring-accent/10 bg-accent/5" : "border-neutral-200/50"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-bold text-neutral-400 font-mono tracking-wider truncate max-w-[120px]">
                    {c.id}
                  </span>
                  <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded-[4px] text-[8px] font-bold uppercase tracking-wider font-mono">
                    {c.blockHeight}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-neutral-900 mb-1 truncate">
                  {c.studentName}
                </h3>
                <span className="text-[10px] font-bold text-neutral-500 block truncate font-sans">
                  {c.institution}
                </span>
                <span className="text-[9px] font-semibold text-neutral-400 block truncate mt-1">
                  {c.degree}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVerify(c.id);
                  }}
                  className="mt-4 w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-[10px] rounded-full text-center transition-all cursor-pointer"
                >
                  Verify Certificate
                </button>
              </div>
            ))}
            
            {/* Revoked trigger card */}
            <div 
              onClick={() => handleVerify("trueva:cert:mit-math-9831-revoked")}
              className="bg-white border border-neutral-200/50 text-left p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5 border-dashed border-status-red/40"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[9px] font-bold text-status-red font-mono tracking-wider truncate">
                  trueva:cert:mit-math-9831-revoked
                </span>
                <span className="px-1.5 py-0.5 bg-status-red/10 text-status-red rounded-[4px] text-[8px] font-bold uppercase tracking-wider font-mono">
                  Revoked
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-neutral-900 mb-1">
                Alice Johnson (Drill)
              </h3>
              <span className="text-[10px] font-semibold text-neutral-500 block">
                MIT Registry Node
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVerify("trueva:cert:mit-math-9831-revoked");
                }}
                className="mt-4 w-full py-2 bg-status-red/10 hover:bg-status-red/20 text-status-red font-semibold text-[10px] rounded-full text-center transition-all cursor-pointer border border-status-red/20"
              >
                Simulate Revocation Fail
              </button>
            </div>
          </div>
        </div>

        {/* Right: Validation Terminal Logs */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Shield size={14} className="text-accent" /> Cryptographic Telemetry console
          </h2>

          {/* Validation Checklist state */}
          <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-5 md:p-6 text-neutral-300 font-mono text-[11px] leading-relaxed shadow-xl min-h-[220px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-[9px] font-bold uppercase text-neutral-500 tracking-wider">
                <span>Verification logs</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              </div>

              {!loading && !searched && (
                <div className="text-center py-8 text-neutral-500 flex flex-col items-center justify-center gap-2">
                  <HelpCircle size={28} className="text-neutral-600" />
                  <span className="font-sans">Select any certificate on the left to trigger validation check and logs.</span>
                </div>
              )}

              {loading && (
                <div className="space-y-2.5">
                  {steps.map((step, idx) => {
                    const isDone = idx < scanStep;
                    const isActive = idx === scanStep;

                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 transition-colors duration-300 ${
                          isDone ? "text-emerald-400 font-bold" : isActive ? "text-white" : "text-neutral-600"
                        }`}
                      >
                        <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                          {isDone ? (
                            <Check size={10} strokeWidth={3} className="text-emerald-400" />
                          ) : isActive ? (
                            <Loader2 className="animate-spin text-accent w-3 h-3" />
                          ) : (
                            <span className="w-1 h-1 rounded-full bg-neutral-700" />
                          )}
                        </div>
                        <span className="text-[10px]">{step}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {searched && result && (
                <div className="space-y-2 text-emerald-400 font-semibold">
                  <div className="flex items-center gap-2 text-white border-b border-neutral-850 pb-2 mb-2 uppercase text-[9px] tracking-wider">
                    <CheckCircle2 size={12} className="text-emerald-400" /> Audit complete
                  </div>
                  <div><span className="text-neutral-500">Hash match:</span> YES</div>
                  <div><span className="text-neutral-500">ECDSA verify:</span> SIGNATURE OK</div>
                  <div><span className="text-neutral-500">Merkle root:</span> ROOT MATCHED</div>
                  <div><span className="text-neutral-500">Block status:</span> SYNCED</div>
                  <div className="text-[9px] text-neutral-400 border-t border-neutral-850 pt-2 font-mono break-all leading-normal select-all">
                    Tx: {result.txHash}
                  </div>
                </div>
              )}

              {searched && errorMsg && (
                <div className="text-status-red space-y-2 font-semibold">
                  <div className="flex items-center gap-2 text-white border-b border-neutral-850 pb-2 mb-2 uppercase text-[9px] tracking-wider">
                    <ShieldAlert size={12} className="text-status-red animate-pulse" /> Audit Mismatch
                  </div>
                  <div className="text-[10px] leading-normal">{errorMsg}</div>
                </div>
              )}
            </div>

            {loading && (
              <div className="text-[9px] text-accent animate-pulse font-bold border-t border-neutral-800 pt-3 mt-3">
                &gt; Processing RPC validation...
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Cryptographic hash matching inspector visual panel (Only displayed when successfully verified) */}
      <AnimatePresence>
        {searched && result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm mb-12"
          >
            <h3 className="text-sm font-bold text-neutral-850 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckSquare size={16} className="text-status-green" /> Cryptographic Integrity Inspector
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed mb-6 font-medium">
              We audit credentials by matching signed hash outputs. Decrypting the ECDSA signature with the issuer's public key yields the original signed digest. Re-hashing the document payload yields the computed digest. If they match, integrity is 100% mathematically proven:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[10px] text-neutral-600">
              <div className="bg-[#FAF9F6] border border-neutral-200/50 p-4 rounded-xl space-y-1">
                <span className="text-[8px] text-neutral-500 uppercase font-black tracking-wider block">Decrypted Signed Hash</span>
                <span className="text-status-green font-bold truncate block">{result.hash}</span>
                <span className="text-[8px] text-neutral-400 block pt-1">// Decrypted via Public Key: {result.signature.slice(0, 14)}...</span>
              </div>
              
              <div className="bg-[#FAF9F6] border border-neutral-200/50 p-4 rounded-xl space-y-1">
                <span className="text-[8px] text-neutral-500 uppercase font-black tracking-wider block">Re-computed Document Hash</span>
                <span className="text-status-green font-bold truncate block">{result.hash}</span>
                <span className="text-[8px] text-neutral-400 block pt-1">// Hashed locally using SHA-256 algorithm</span>
              </div>
            </div>

            <div className="mt-4 bg-status-green/10 border border-status-green/20 text-status-green font-bold text-xs p-3.5 rounded-xl text-center">
              ✓ AUDIT STATUS: IDENTICAL. ZERO DOCUMENT TAMPERING DETECTED.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Result Verification Card */}
      <AnimatePresence>
        {searched && result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-premium mb-10"
          >
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900 font-sans">Credential Authenticated</h2>
                <span className="text-[10px] font-bold text-status-green uppercase tracking-wider font-mono">
                  ✓ cryptographically verified (blk consensus check passed)
                </span>
              </div>
            </div>

            {/* Certificate design box */}
            <div className="border border-neutral-200/60 rounded-2xl p-6 md:p-8 bg-[#FAF9F6] relative overflow-hidden mb-6">
              {/* Background design elements */}
              <div className="absolute right-4 top-4 text-neutral-200/30 pointer-events-none">
                <Award size={140} />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="border-b border-neutral-200/60 pb-4">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Issuing Authority</span>
                  <span className="text-sm font-extrabold text-neutral-900">{result.institution}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Student Graduate</span>
                  <span className="text-xl font-extrabold text-neutral-900 tracking-tight">{result.studentName}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Degree / Award Title</span>
                    <span className="text-xs font-bold text-neutral-850">{result.degree}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Academic Grade</span>
                    <span className="text-xs font-bold text-neutral-850">{result.grade}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-semibold text-neutral-500 pt-2 border-t border-neutral-200/60 font-mono">
                  <span>Date: {result.date}</span>
                  <span>ID: {result.id}</span>
                </div>
              </div>
            </div>

            {/* Technical proofs */}
            <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[10px] text-neutral-400 leading-relaxed border border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
                <span className="text-neutral-500 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[8px]">
                  <Key size={10} /> Signature Validation Telemetry
                </span>
                <span className="text-emerald-400 font-bold text-[8px] uppercase">Synced</span>
              </div>
              <div className="space-y-1">
                <div><span className="text-neutral-500">Document SHA-256 Hash:</span> <span className="text-neutral-200 select-all">{result.hash}</span></div>
                <div><span className="text-neutral-500">Issuer Public Signature:</span> <span className="text-neutral-200">{result.signature}</span></div>
                <div><span className="text-neutral-500">Anchored Block Height:</span> <span className="text-white font-bold">{result.blockHeight}</span></div>
                <div><span className="text-neutral-500">Blockchain Block Hash:</span> <span className="text-neutral-300 font-sans">0x5d9b62f183ae439ca257a09d...</span></div>
                <div><span className="text-neutral-500">Blockchain Transaction:</span> <span className="text-cyan-400 select-all">{result.txHash}</span></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <>
      <NavBar />
      <div className="relative bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16 px-6 overflow-hidden">
        <FloatingCubesBackground count={10} />
        <Suspense fallback={
          <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-accent w-8 h-8" />
          </div>
        }>
          <VerificationContent />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
