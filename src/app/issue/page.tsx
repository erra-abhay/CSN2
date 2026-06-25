"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Award, CheckCircle, Copy, Key, Loader2, Sparkles, Database, ShieldCheck, Layers, Cpu, ArrowRight } from "lucide-react";

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

export default function IssuePage() {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [issuedCert, setIssuedCert] = useState<Certificate | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSimulateIssuance = () => {
    setLoading(true);
    setIssuedCert(null);
    setLoadingStep(1); // Local Hashing

    setTimeout(() => {
      setLoadingStep(2); // Key Signature
      setTimeout(() => {
        setLoadingStep(3); // Merkle Aggregation
        setTimeout(() => {
          setLoadingStep(4); // Anchoring block

          setTimeout(() => {
            // Generate a realistic mock certificate
            const mockCerts = [
              { name: "John Doe", school: "Stanford University", degree: "Master of Science in Computer Science", id: "trueva:cert:stan-cs-4281" },
              { name: "Emily Watson", school: "University of California, Berkeley", degree: "Bachelor of Arts in Data Science", id: "trueva:cert:berk-ds-8821" },
              { name: "David Kim", school: "Massachusetts Institute of Technology", degree: "Master of Engineering in AI", id: "trueva:cert:mit-ai-5060" }
            ];
            
            const selectedMock = mockCerts[Math.floor(Math.random() * mockCerts.length)];
            const randomSuffix = Math.random().toString(36).substring(2, 6);
            const finalId = `${selectedMock.id}-${randomSuffix}`;
            const date = new Date().toISOString().split("T")[0];
            
            const rawPayload = `${selectedMock.name.toLowerCase()}|${selectedMock.school.toLowerCase()}|${selectedMock.degree.toLowerCase()}|${date}`;
            
            // Hash simulation
            let hashValue = "0x";
            for (let i = 0; i < rawPayload.length; i++) {
              hashValue += rawPayload.charCodeAt(i).toString(16);
            }
            hashValue = hashValue.substring(0, 42).padEnd(42, "f");

            const signature = "0x" + Math.random().toString(16).substring(2, 10) + "..." + Math.random().toString(16).substring(2, 10) + "sig";
            const txHash = "0x" + Math.random().toString(16).substring(2, 12) + "a89d2" + Math.random().toString(16).substring(2, 8);
            const blockHeight = "blk-" + (4821 + Math.floor(Math.random() * 30));

            const newCert: Certificate = {
              id: finalId,
              studentName: selectedMock.name,
              institution: selectedMock.school,
              degree: selectedMock.degree,
              grade: "First Class Honours",
              date,
              hash: hashValue,
              signature,
              txHash,
              blockHeight,
            };

            // Save to local storage for verification lookup
            const existingCerts = JSON.parse(localStorage.getItem("trueva_certs") || "[]");
            localStorage.setItem("trueva_certs", JSON.stringify([newCert, ...existingCerts]));

            // Save to recent block explorer registry
            const existingBlocks = JSON.parse(localStorage.getItem("trueva_blocks") || "[]");
            const newBlock = {
              height: blockHeight,
              hash: "0x5d9b62f183" + Math.random().toString(16).substring(2, 8) + "ca25",
              txCount: 1,
              timestamp: new Date().toLocaleTimeString(),
              certs: [newCert],
            };
            localStorage.setItem("trueva_blocks", JSON.stringify([newBlock, ...existingBlocks]));

            setIssuedCert(newCert);
            setLoading(false);
            setLoadingStep(0);
          }, 1200);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const preLoadedCerts = [
    { id: "trueva:cert:mit-math-9831", name: "Alice Johnson", school: "Massachusetts Institute of Technology", degree: "Bachelor of Science in Mathematics" },
    { id: "trueva:cert:stan-mba-7740", name: "Bob Miller", school: "Stanford University", degree: "Master of Business Administration (MBA)" },
    { id: "trueva:cert:ahub-fse-2015", name: "Carol Smith", school: "AcadHub Academy", degree: "Diploma in Full Stack Software Engineering" },
  ];

  return (
    <>
      <NavBar />
      <div className="bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16 px-6">
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
              Trueva Protocol Specifications
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-6">
              How Issuance Works
            </h1>
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-3xl">
              Trueva does not store certificates in standard databases. Instead, academic records are processed cryptographically by institutions and committed as immutable anchors onto a PoA ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
            {/* Protocol Steps Explanation Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Step 1: Local SIS Integration */}
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm flex gap-5">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Database size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1.5">
                    1. Local SIS Integration
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">
                    Issuer institutions connect their Student Information Systems (SIS) using the Trueva API Gateway. Raw student identity details (names, grades, transcripts) remain locally on the university servers and are never uploaded to the public network, ensuring complete privacy compliance.
                  </p>
                </div>
              </div>

              {/* Step 2: Local Cryptographic Hashing & Signing */}
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm flex gap-5">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1.5">
                    2. local Hashing & ECDSA Signing
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">
                    The SIS hashes the certificate parameters into a SHA-256 value and signs it locally with the institution's private key. This signed metadata acts as a secure cryptographic stamp confirming origin and preventing retrospective forgery.
                  </p>
                </div>
              </div>

              {/* Step 3: Merkle Aggregation */}
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm flex gap-5">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1.5">
                    3. Merkle Tree Compilation
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">
                    To optimize block space and network capacity, thousands of signed hashes are combined into a binary Merkle Tree. This leaves a single 32-byte Merkle Root representing the entire batch of records.
                  </p>
                </div>
              </div>

              {/* Step 4: Blockchain Anchoring */}
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm flex gap-5">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Cpu size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1.5">
                    4. Ledger Anchoring
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">
                    The consensus orchestrator commits the Merkle Root to the Smart Contract Registry. The transaction block propagates across the validator pool, locking in the validity of all certificates in the batch.
                  </p>
                </div>
              </div>

            </div>

            {/* Simulation Trigger & Copyable IDs Column */}
            <div className="space-y-6">
              {/* Simulator Card */}
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent mb-2 block">
                    Protocol Playground
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900 mb-2">
                    Simulate Anchor
                  </h3>
                  <p className="text-[11px] leading-relaxed text-neutral-600 font-medium mb-5">
                    Trigger the full cryptographic pipeline. Simulate local hashing, signature generation, Merkle root aggregation, and block committing.
                  </p>
                </div>

                <button
                  onClick={handleSimulateIssuance}
                  disabled={loading}
                  className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {loading ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      {loadingStep === 1 && "Hashing Metadata..."}
                      {loadingStep === 2 && "Signing Hash..."}
                      {loadingStep === 3 && "Building Merkle Tree..."}
                      {loadingStep === 4 && "Broadcasting Block..."}
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      Simulate Batch Anchor
                    </>
                  )}
                </button>
              </div>

              {/* copy ID card */}
              <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-6 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 mb-2 block">
                  Copy Testing IDs
                </span>
                <h3 className="text-sm font-bold text-neutral-900 mb-2">
                  Pre-anchored Credentials
                </h3>
                <p className="text-[11px] leading-relaxed text-neutral-600 font-medium mb-4">
                  Copy one of these pre-anchored credential IDs to test the verification portal.
                </p>

                <div className="space-y-2">
                  {preLoadedCerts.map((c) => (
                    <div key={c.id} className="bg-white border border-neutral-200/40 p-2.5 rounded-xl text-[10px] flex items-center justify-between gap-1 shadow-sm font-semibold">
                      <div className="overflow-hidden">
                        <span className="block text-neutral-850 truncate">{c.name}</span>
                        <span className="block text-neutral-400 font-mono font-bold text-[8px] truncate">{c.id}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(c.id)}
                        className="p-1 bg-neutral-100 hover:bg-neutral-250 hover:text-accent rounded transition-colors text-neutral-500 flex items-center justify-center shrink-0 cursor-pointer"
                        title="Copy Certificate ID"
                      >
                        <Copy size={10} />
                      </button>
                    </div>
                  ))}
                  {copySuccess && (
                    <div className="text-[9px] text-emerald-500 font-bold text-center mt-1">
                      Copied to clipboard!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Success Panel */}
          {issuedCert && (
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-premium animate-fade-in mb-10">
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-4">
                <CheckCircle className="text-status-green w-6 h-6 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Batch Simulated Successfully</h3>
                  <p className="text-xs text-neutral-400 font-medium">Successfully committed to block height {issuedCert.blockHeight}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs mb-6">
                <div>
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Simulated Student Graduate</span>
                  <span className="font-semibold text-neutral-800">{issuedCert.studentName}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Issuing School</span>
                  <span className="font-semibold text-neutral-800">{issuedCert.institution}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Academic Award</span>
                  <span className="font-semibold text-neutral-800">{issuedCert.degree}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Registry Location</span>
                  <span className="font-semibold text-neutral-800">Trueva Mainnet block {issuedCert.blockHeight}</span>
                </div>
              </div>

              {/* Cryptographic telemetry logs box */}
              <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[10px] text-neutral-400 leading-relaxed border border-neutral-800 mb-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
                  <span className="text-neutral-500 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[8px]">
                    <Key size={10} /> Anchored Proof Telemetry
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 w-20">Cert ID:</span>
                    <span className="text-white select-all font-bold">{issuedCert.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 w-20">SHA-256 Hash:</span>
                    <span className="text-neutral-300 select-all">{issuedCert.hash}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 w-20">Signature:</span>
                    <span className="text-neutral-300">{issuedCert.signature}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 w-20">Txn Hash:</span>
                    <span className="text-cyan-400 select-all">{issuedCert.txHash}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href={`/verify?id=${issuedCert.id}`}
                  className="w-full sm:w-auto px-6 py-3.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-full shadow-sm hover:shadow text-center transition-all"
                >
                  Verify Resulting Cert
                </Link>
                <button
                  onClick={() => handleCopy(issuedCert.id)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-neutral-100 hover:bg-neutral-250 text-neutral-700 text-xs font-semibold rounded-full text-center transition-all cursor-pointer"
                >
                  Copy Cert ID
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}
