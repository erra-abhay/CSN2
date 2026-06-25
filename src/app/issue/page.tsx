"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Award, CheckCircle, Copy, Key, Loader2, Sparkles, Database, ShieldCheck, Layers, Cpu, ArrowRight, Code, Settings } from "lucide-react";
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

export default function IssuePage() {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [issuedCert, setIssuedCert] = useState<Certificate | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Payload Builder states
  const [includeGpa, setIncludeGpa] = useState(true);
  const [includeId, setIncludeId] = useState(true);
  const [includeDate, setIncludeDate] = useState(true);
  const [hashAlgo, setHashAlgo] = useState<"SHA-256" | "SHA3-256">("SHA-256");
  const [builderMajor, setBuilderMajor] = useState("Computer Science");
  const [builderSchool, setBuilderSchool] = useState("Stanford University");

  const [jsonPayload, setJsonPayload] = useState("");

  // Update dynamic JSON payload preview on builder state changes
  useEffect(() => {
    const payload: Record<string, any> = {
      issuer: builderSchool,
      recipient: "John Doe",
      award: `Bachelor of Science in ${builderMajor}`,
    };
    if (includeId) payload.studentId = "STU-882109";
    if (includeGpa) payload.cumulativeGpa = "3.92";
    if (includeDate) payload.graduationDate = new Date().toISOString().split("T")[0];
    payload.checksumAlgorithm = hashAlgo;

    setJsonPayload(JSON.stringify(payload, null, 2));
  }, [includeGpa, includeId, includeDate, hashAlgo, builderMajor, builderSchool]);

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
            // Generate a realistic mock certificate matching builder choices
            const date = new Date().toISOString().split("T")[0];
            const rawPayload = `${builderSchool.toLowerCase()}|john doe|${builderMajor.toLowerCase()}|${date}`;
            
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
              id: `trueva:cert:${builderSchool.slice(0, 4).toLowerCase()}-${builderMajor.slice(0, 2).toLowerCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
              studentName: "John Doe",
              institution: builderSchool,
              degree: `Bachelor of Science in ${builderMajor}`,
              grade: includeGpa ? "GPA 3.92 (Summa Cum Laude)" : "Passed with Honours",
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
      <div className="relative bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16 px-6 overflow-hidden">
        <FloatingCubesBackground count={10} />
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

          {/* Interactive developer payload builder section */}
          <div className="bg-white border border-neutral-200/50 rounded-3xl p-6 md:p-8 shadow-sm mb-12">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Code size={18} className="text-accent" /> Batch Payload JSON Schema Builder
            </h2>
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-6 font-medium">
              Toggle switches below to compile mock JSON schemas. See how the metadata payload is structured for local cryptographic hashing:
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* Toggles */}
              <div className="space-y-4 bg-[#FAF9F6] p-5 rounded-2xl border border-neutral-200/40 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Selector 1 */}
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-500 uppercase mb-1">Select Institution</label>
                    <select 
                      value={builderSchool}
                      onChange={(e) => setBuilderSchool(e.target.value)}
                      className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold focus:border-accent outline-none"
                    >
                      <option value="Stanford University">Stanford University</option>
                      <option value="Massachusetts Institute of Technology">MIT</option>
                      <option value="University of California, Berkeley">UC Berkeley</option>
                    </select>
                  </div>

                  {/* Selector 2 */}
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-500 uppercase mb-1">Select Major Field</label>
                    <select 
                      value={builderMajor}
                      onChange={(e) => setBuilderMajor(e.target.value)}
                      className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold focus:border-accent outline-none"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Data Science">Data Science</option>
                    </select>
                  </div>

                  {/* Toggles grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-bold text-neutral-700">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={includeGpa} 
                        onChange={() => setIncludeGpa(!includeGpa)}
                        className="rounded text-accent focus:ring-accent w-3.5 h-3.5"
                      />
                      <span>Include GPA Score</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={includeId} 
                        onChange={() => setIncludeId(!includeId)}
                        className="rounded text-accent focus:ring-accent w-3.5 h-3.5"
                      />
                      <span>Include Student ID</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={includeDate} 
                        onChange={() => setIncludeDate(!includeDate)}
                        className="rounded text-accent focus:ring-accent w-3.5 h-3.5"
                      />
                      <span>Include Grad Date</span>
                    </label>
                  </div>

                  {/* Hashing toggle */}
                  <div className="pt-2">
                    <span className="block text-[9px] font-bold text-neutral-500 uppercase mb-2">Checksum Algorithm</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setHashAlgo("SHA-256")}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                          hashAlgo === "SHA-256" ? "bg-accent/10 border-accent/20 text-accent" : "border-neutral-200 bg-white text-neutral-500"
                        }`}
                      >
                        SHA-256
                      </button>
                      <button
                        onClick={() => setHashAlgo("SHA3-256")}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                          hashAlgo === "SHA3-256" ? "bg-accent/10 border-accent/20 text-accent" : "border-neutral-200 bg-white text-neutral-500"
                        }`}
                      >
                        SHA3-256
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-neutral-400 font-medium leading-relaxed border-t border-neutral-200 pt-3 mt-3">
                  This custom schema parameters structure determines the SHA-256 byte payload format for the digital signature.
                </div>
              </div>

              {/* JSON preview */}
              <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-5 text-neutral-300 font-mono text-[10px] leading-relaxed shadow-xl flex flex-col justify-between overflow-x-auto">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2 text-[8px] font-bold uppercase text-neutral-500 tracking-wider">
                  <span>credential_metadata.json</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
                <pre className="flex-1 overflow-x-auto whitespace-pre no-scrollbar py-2 text-white/95">
                  <code>{jsonPayload}</code>
                </pre>
                <button
                  onClick={() => handleCopy(jsonPayload)}
                  className="mt-2 w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-[9px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Copy size={10} /> Copy JSON Payload
                </button>
              </div>

            </div>
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 block">
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
