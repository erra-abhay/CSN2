"use client";

import React, { useState } from "react";
import NavBar from "@/components/navbar";
import Hero from "@/components/hero";
import StatsStrip from "@/components/stats-strip";
import Masterclass from "@/components/masterclass";
import Footer from "@/components/footer";
import Link from "next/link";
import { Award, ShieldCheck, Database, Cpu, ArrowRight, Code2, MessageSquare, ChevronDown, CheckCircle, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is the difference between Trueva and traditional credential registries?",
    answer: "Traditional registries store student records in centralized, private databases. They are vulnerable to data breaches, require manual registrar lookup queries, and are prone to credential forgery. Trueva operates on a Proof-of-Authority blockchain registry, anchoring cryptographic Merkle roots of certificates. Verification queries are handled instantly by RPC endpoints in under 120ms, completely bypassing manual lookup processes."
  },
  {
    question: "How is student privacy guaranteed on a public consensus ledger?",
    answer: "Trueva utilizes a local hashing protocol (Local SIS). Student metadata (names, transcripts, course titles) is compiled and hashed using SHA-256 on the university's local server. Only the resulting 32-byte cryptographic root is committed to the blockchain block. This guarantees 100% GDPR and FERPA compliance because no personal identifiable information (PII) is ever written to the public ledger."
  },
  {
    question: "Who operates the validator nodes on the Proof-of-Authority network?",
    answer: "Trueva utilizes a Proof-of-Authority (PoA) consensus mechanism where validator nodes are operated by pre-approved, high-reputation educational and professional institutions (such as registrar offices of participating universities). This eliminates public mining economics, cuts operational energy overhead to zero, and ensures that the ledger consensus remains entirely in the hands of trusted academic authorities."
  },
  {
    question: "Can academic certificates be revoked or modified after anchoring?",
    answer: "While the blockchain ledger is immutable, Trueva supports secure, cryptographically auditable revocations. To revoke a certificate (e.g. in cases of academic integrity violations), the issuing institution publishes a signed revocation proof to the Smart Contract Registry. Verifier gateways check the revocation list in the registry contract during validation audits, marking the certificate as 'REVOKED' immediately."
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"shell" | "node" | "python">("shell");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const codeSnippets = {
    shell: `# 1. Hash and sign credential metadata locally
curl -X POST https://api.csn2.me/v1/certificates/hash \\
  -H "Authorization: Bearer $TRUEVA_API_KEY" \\
  -d '{
    "student": "Jane Doe",
    "degree": "Master of Computer Science",
    "gpa": "3.92"
  }'

# Response returns {"hash": "0x5d9b62f18...", "signature": "0xe8192a..."}

# 2. Verify certificate hash against committed roots
curl -X GET https://api.csn2.me/v1/verify/trueva:cert:stan-cs-4281`,
    node: `import { TruevaSDK } from "@trueva/sdk";

const sdk = new TruevaSDK({ apiKey: process.env.TRUEVA_API_KEY });

// Local hashing and cryptographic signing
const credential = {
  student: "Jane Doe",
  degree: "Master of Computer Science",
  gpa: "3.92"
};

const proof = await sdk.credentials.signAndAnchor(credential);
console.log(\`Anchored in block: \${proof.blockHeight}\`);
console.log(\`Transaction ID: \${proof.txHash}\`);`,
    python: `from trueva import TruevaClient

client = TruevaClient(api_key="your_api_key")

# Verify any certificate hash instantly
result = client.verify.certificate("trueva:cert:stan-cs-4281")

if result.is_valid:
    print(f"Verified! Issuer: {result.issuer}")
    print(f"Committed block: {result.block_height}")
else:
    print("Verification failed: signature mismatch")`
  };

  return (
    <>
      <NavBar />
      <main className="flex-grow">
        {/* Animated Hero Header */}
        <Hero />
        
        {/* Key trust statistics */}
        <StatsStrip />

        {/* Detailed Metrics Panel */}
        <section className="py-24 bg-[#FAF9F6] border-t border-neutral-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold tracking-wide uppercase">
                  Consensus Efficiency
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mt-4 mb-6">
                  High-Throughput Cryptographic Registry
                </h2>
                <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-8 font-medium">
                  Trueva operates on a dedicated Proof-of-Authority trust network. By replacing complex gas fees and mining algorithms with pre-approved validator keys, our registry anchors academic credentials at enterprise speeds with zero transactional volatility.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-status-green/10 flex items-center justify-center text-status-green shrink-0 mt-0.5">
                      <CheckCircle size={12} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 mb-1">Sub-Second Finality</h4>
                      <p className="text-[11px] leading-relaxed text-neutral-500 font-semibold">Transactions are grouped in Merkle Trees and finalized in blocks instantly by PoA consensus nodes.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-status-green/10 flex items-center justify-center text-status-green shrink-0 mt-0.5">
                      <CheckCircle size={12} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 mb-1">GDPR & FERPA Privacy Keys</h4>
                      <p className="text-[11px] leading-relaxed text-neutral-500 font-semibold">Verification check systems hash credentials locally. Public contract registries only hold root hashes.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-status-green/10 flex items-center justify-center text-status-green shrink-0 mt-0.5">
                      <CheckCircle size={12} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 mb-1">Dynamic Read Autoscaling</h4>
                      <p className="text-[11px] leading-relaxed text-neutral-500 font-semibold">Verification RPC nodes automatically expand to balance workload spikes without latency penalty.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphical representation stats */}
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-neutral-450 uppercase tracking-wider mb-2">
                  Validator Sync Performance Comparison
                </h3>
                
                {/* Latency metric bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-neutral-800">
                    <span>Trueva RPC Verification Latency</span>
                    <span className="text-accent">115ms</span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: "12%" }} />
                  </div>
                </div>

                {/* Legacy registry check bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-neutral-800">
                    <span>Public L1 Consensus Finality</span>
                    <span>12,000ms</span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-400 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>

                {/* Manual Registrar check bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-neutral-800">
                    <span>Manual Registrar Database lookup</span>
                    <span>72 hours</span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-900 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div className="text-[10px] text-neutral-400 font-medium leading-normal border-t border-neutral-100 pt-4">
                  Metrics verified across 6 active consensus validation nodes in the public demo environment.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portals Showcase Section */}
        <section className="py-24 bg-white border-t border-neutral-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold tracking-wide uppercase">
                Consensus Portal Suite
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mt-4 mb-4">
                Explore Trueva Capabilities
              </h2>
              <p className="text-neutral-600 text-sm md:text-base max-w-xl mx-auto">
                Discover the ledger infrastructure. Click any card to launch its dedicated portal and interact with cryptographic mock data.
              </p>
            </div>

            {/* 2x2 Interactive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              
              {/* Card 1: Issuer Console */}
              <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-premium-hover transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    Issuer Console
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-650 leading-relaxed font-medium mb-6">
                    Sign academic transcripts, diploma certificates, or professional badges. Format metadata payloads as structured JSON, compute SHA-256 hashes, generate signatures, and anchor them onto the registry block.
                  </p>
                </div>
                <Link
                  href="/issue"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors group/link"
                >
                  Open Issuer Portal
                  <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Card 2: Verification Portal */}
              <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-premium-hover transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    Verification Portal
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-650 leading-relaxed font-medium mb-6">
                    Query validator node records. Audit certificate parameters instantly by checking digital signature origins and executing Merkle proof validations to guarantee 100% data integrity without database access.
                  </p>
                </div>
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors group/link"
                >
                  Launch Verification checks
                  <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Card 3: Blockchain Explorer */}
              <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-premium-hover transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    Chain Explorer
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-650 leading-relaxed font-medium mb-6">
                    Inspect block transitions and transaction histories on the PoA ledger. Browse recent block heights, committed transaction counts, public keys, and cryptographic Merkle root hashes in real-time.
                  </p>
                </div>
                <Link
                  href="/explorer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors group/link"
                >
                  Browse Ledger Logs
                  <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Card 4: Node Simulator */}
              <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-premium-hover transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    Node Consensus Simulator
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-650 leading-relaxed font-medium mb-6">
                    Interact with validator nodes. Trigger real-time block consensus syncs, scale read queries, or trigger audit fails to test BFT signature validation mechanisms and consensus rejection logs.
                  </p>
                </div>
                <Link
                  href="/live-network"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors group/link"
                >
                  Interact with Consensus Nodes
                  <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Developer Integration Section */}
        <section className="py-24 bg-white border-t border-neutral-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold tracking-wide uppercase">
                  Developer Hub
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mt-4 mb-6">
                  Simple API Integration
                </h2>
                <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-6 font-medium">
                  Integrate Trueva directly into university registrar workflows or hiring platform portals. Query proof registries using raw CLI scripts, or import our modular lightweight SDKs.
                </p>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-neutral-100 pb-3">
                  <button
                    onClick={() => setActiveTab("shell")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                      activeTab === "shell" ? "bg-accent/10 text-accent" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setActiveTab("node")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                      activeTab === "node" ? "bg-accent/10 text-accent" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    NodeJS
                  </button>
                  <button
                    onClick={() => setActiveTab("python")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                      activeTab === "python" ? "bg-accent/10 text-accent" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    Python
                  </button>
                </div>

                <div className="text-xs text-neutral-450 leading-relaxed">
                  Refer to the full specification details inside our technical documentation to integrate validation checks.
                </div>
              </div>

              {/* Code Box */}
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 shadow-xl font-mono text-[11px] text-neutral-300 leading-relaxed overflow-x-auto">
                <div className="flex items-center justify-between border-b border-neutral-850 pb-3 mb-4 text-[9px] font-bold uppercase text-neutral-500 tracking-wider">
                  <span className="flex items-center gap-1.5"><Code2 size={12} className="text-accent" /> api_quickstart.{activeTab === "shell" ? "sh" : activeTab === "node" ? "ts" : "py"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-status-green" />
                </div>
                <pre className="overflow-x-auto whitespace-pre no-scrollbar">
                  <code>{codeSnippets[activeTab]}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise testimonials / Logos Directory */}
        <section className="py-24 bg-[#FAF9F6] border-t border-neutral-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold tracking-wide uppercase">
                Active Issuers
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mt-4 mb-4">
                Trusted by Registrars
              </h2>
              <p className="text-neutral-600 text-sm md:text-base max-w-xl mx-auto">
                Discover what registrar offices and enterprise credential issuers say about migrating to Trueva blockchain networks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Stanford */}
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <p className="text-xs text-neutral-600 italic leading-relaxed mb-6 font-medium">
                  &ldquo;Trueva's cryptographic Merkle proof structure allows us to anchor graduates' certificates in single block transactions, reducing lookup inquiries to zero.&rdquo;
                </p>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Stanford University</h4>
                  <span className="text-[9px] font-semibold text-neutral-400 block uppercase">Office of the Registrar</span>
                </div>
              </div>

              {/* MIT */}
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <p className="text-xs text-neutral-600 italic leading-relaxed mb-6 font-medium">
                  &ldquo;Privacy is our highest priority. By utilizing local metadata hashing, Trueva checks signature authenticity without storing any student record parameters on-chain.&rdquo;
                </p>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">MIT</h4>
                  <span className="text-[9px] font-semibold text-neutral-400 block uppercase">Credentialing Lab Team</span>
                </div>
              </div>

              {/* Berkeley */}
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <p className="text-xs text-neutral-600 italic leading-relaxed mb-6 font-medium">
                  &ldquo;BFT validator consensus checks keep our registries 100% immune to forgery attempts. The verification gateway handles queries instantly.&rdquo;
                </p>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">UC Berkeley</h4>
                  <span className="text-[9px] font-semibold text-neutral-400 block uppercase">Systems Auditing Office</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collapsible FAQ Section */}
        <section className="py-24 bg-white border-t border-neutral-200/40">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold tracking-wide uppercase">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mt-4 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-neutral-600 text-sm md:text-base max-w-xl mx-auto">
                Read deep answers about Trueva consensus protocols, ledger privacy compliance, and certificate modifications.
              </p>
            </div>

            {/* Accordion list */}
            <div className="space-y-4 max-w-2xl mx-auto">
              {faqs.map((faq, index) => {
                const isFaqOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-neutral-200/50 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-neutral-850 text-xs sm:text-sm hover:text-accent transition-colors outline-none cursor-pointer"
                    >
                      <span className="flex items-center gap-2"><MessageSquare size={14} className="text-accent shrink-0" /> {faq.question}</span>
                      <ChevronDown
                        size={16}
                        className={`text-neutral-450 transition-transform duration-300 shrink-0 ${
                          isFaqOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isFaqOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden bg-[#FAF9F6]"
                        >
                          <div className="px-6 pb-6 pt-2 text-xs md:text-sm leading-relaxed text-neutral-600 font-medium border-t border-neutral-100">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Masterclass Educational Scroll Zone */}
        <Masterclass />

      </main>
      <Footer />
    </>
  );
}
