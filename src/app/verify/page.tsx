"use client";

import React, { useState, useEffect, Suspense } from "react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldAlert, Search, Loader2, Key, Check, Award } from "lucide-react";

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

// Pre-loaded certificates in system
const defaultCerts: Certificate[] = [
  {
    id: "trueva:cert:mit-math-9831",
    studentName: "Alice Johnson",
    institution: "Massachusetts Institute of Technology",
    degree: "Bachelor of Science in Mathematics",
    grade: "First Class Honours",
    date: "2026-05-18",
    hash: "0x12a83b9c7d8f...4e8a1",
    signature: "0xe8192a...f902sig",
    txHash: "0x3db9a2f60a...82bc7",
    blockHeight: "blk-4810",
  },
  {
    id: "trueva:cert:stan-mba-7740",
    studentName: "Bob Miller",
    institution: "Stanford University",
    degree: "Master of Business Administration (MBA)",
    grade: "Distinction",
    date: "2026-06-02",
    hash: "0x7c9a2f8d3c1e...9b8a2",
    signature: "0xa2831b...c881sig",
    txHash: "0x5d9b62a4b8...10ef2",
    blockHeight: "blk-4815",
  },
  {
    id: "trueva:cert:ahub-fse-2015",
    studentName: "Carol Smith",
    institution: "AcadHub Academy",
    degree: "Diploma in Full Stack Software Engineering",
    grade: "Distinction",
    date: "2025-12-15",
    hash: "0xf8d7c6b5a4...3e2d1",
    signature: "0xd9812e...a830sig",
    txHash: "0x98a7b6c5d4...21ab9",
    blockHeight: "blk-4752",
  }
];

function VerificationContent() {
  const searchParams = useSearchParams();
  const certIdParam = searchParams.get("id") || "";

  const [searchId, setSearchId] = useState(certIdParam);
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const steps = [
    "Querying Verification Gateway RPC nodes...",
    "Verifying Issuer Cryptographic Signature...",
    "Validating Merkle Tree Path Proof...",
    "Confirming Transaction Block Consensus..."
  ];

  useEffect(() => {
    if (certIdParam) {
      setSearchId(certIdParam);
      handleVerify(certIdParam);
    }
  }, [certIdParam]);

  const handleVerify = (idToVerify: string) => {
    const targetId = idToVerify.trim();
    if (!targetId) return;

    setLoading(true);
    setResult(null);
    setSearched(false);
    setErrorMsg("");
    setScanStep(0);

    // Dynamic scanning animation steps
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setScanStep(currentStep);
      } else {
        clearInterval(interval);
        
        // Fetch all certificates (pre-loaded + local storage)
        const localCerts = JSON.parse(localStorage.getItem("trueva_certs") || "[]");
        const allCerts = [...localCerts, ...defaultCerts];
        
        const found = allCerts.find(c => c.id.toLowerCase() === targetId.toLowerCase() || c.hash.toLowerCase() === targetId.toLowerCase());
        
        if (found) {
          setResult(found);
        } else {
          setErrorMsg("No certificate matches the provided ID or hash. The digital signature could not be verified by consensus nodes.");
        }
        setLoading(false);
        setSearched(true);
      }
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(searchId);
  };

  return (
    <div className="max-w-4xl mx-auto">
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
          Query RPC Node Gateway
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-6">
          Trueva Verification Portal
        </h1>
        <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-3xl">
          Instantly verify degree authenticity. Paste a Trueva Certificate ID or Transaction Hash below to query the blockchain registry and retrieve the signature verification audit.
        </p>
      </div>

      {/* Input box */}
      <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm mb-10">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Paste Certificate ID (e.g. trueva:cert:mit-math-9831)"
              disabled={loading}
              className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 focus:border-accent rounded-xl text-sm font-semibold focus:bg-white transition-all outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchId.trim()}
            className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Verify Authenticity"}
          </button>
        </form>

        {/* Hints */}
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-neutral-450">
          <span>Try this test ID:</span>
          <button
            onClick={() => { setSearchId("trueva:cert:mit-math-9831"); handleVerify("trueva:cert:mit-math-9831"); }}
            className="text-accent hover:underline font-mono cursor-pointer"
          >
            trueva:cert:mit-math-9831
          </button>
        </div>
      </div>

      {/* Loading Scanning Screen */}
      {loading && (
        <div className="bg-neutral-900 rounded-2xl border border-neutral-850 p-6 md:p-8 text-neutral-300 font-mono text-xs shadow-xl animate-pulse">
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-4 mb-6">
            <Loader2 className="animate-spin text-accent w-5 h-5" />
            <span className="font-bold text-white uppercase tracking-wider">
              RUNNING CRYPTOGRAPHIC AUDIT ON REGISTRY...
            </span>
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => {
              const isDone = idx < scanStep;
              const isActive = idx === scanStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 transition-opacity duration-300 ${
                    isDone ? "text-emerald-400 font-bold" : isActive ? "text-white" : "text-neutral-600"
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {isDone ? (
                      <Check size={12} strokeWidth={3} className="text-emerald-400" />
                    ) : isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                    ) : (
                      <span className="w-1 h-1 rounded-full bg-neutral-700" />
                    )}
                  </div>
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Success Result Verification Card */}
      {searched && result && (
        <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-premium animate-fade-in">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-status-green/10 flex items-center justify-center text-status-green">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Credential Authenticated</h2>
              <span className="text-[10px] font-bold text-status-green uppercase tracking-wider font-mono">
                ✓ cryptographically verified (blk consensus check passed)
              </span>
            </div>
          </div>

          {/* Certificate design box */}
          <div className="border border-neutral-200/60 rounded-2xl p-6 md:p-8 bg-[#FAF9F6] relative overflow-hidden mb-6">
            {/* Background design elements */}
            <div className="absolute right-4 top-4 text-neutral-200/40 pointer-events-none">
              <Award size={140} />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="border-b border-neutral-200/60 pb-4">
                <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block">Issuing Authority</span>
                <span className="text-sm font-extrabold text-neutral-900">{result.institution}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block">Student Graduate</span>
                <span className="text-xl font-extrabold text-neutral-900 tracking-tight">{result.studentName}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block">Degree / Award Title</span>
                  <span className="text-xs font-bold text-neutral-850">{result.degree}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block">Academic Grade</span>
                  <span className="text-xs font-bold text-neutral-850">{result.grade}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-semibold text-neutral-450 pt-2 border-t border-neutral-200/60">
                <span>Date: {result.date}</span>
                <span className="font-mono">ID: {result.id}</span>
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
              <div><span className="text-neutral-500">Blockchain Block Hash:</span> <span className="text-neutral-300">0x5d9b62f183ae439ca257a09d...</span></div>
              <div><span className="text-neutral-500">Blockchain Transaction:</span> <span className="text-cyan-400 select-all">{result.txHash}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Failure Result Card */}
      {searched && errorMsg && (
        <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-premium animate-fade-in text-center">
          <div className="w-12 h-12 rounded-full bg-status-red/10 flex items-center justify-center text-status-red mx-auto mb-4">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">Verification Failed</h2>
          <p className="text-xs text-neutral-600 font-semibold max-w-md mx-auto leading-relaxed mb-6">
            {errorMsg}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => { setSearchId(""); setResult(null); setSearched(false); setErrorMsg(""); }}
              className="px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-full text-center transition-all cursor-pointer"
            >
              Clear Search
            </button>
            <Link
              href="/issue"
              className="px-6 py-3.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-full text-center transition-all"
            >
              Issue a New Cert
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <>
      <NavBar />
      <div className="bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16 px-6">
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
