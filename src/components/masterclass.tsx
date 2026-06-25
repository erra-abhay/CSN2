"use client";

import React, { useState, useEffect } from "react";
import { 
  Key, Cpu, Layers, HelpCircle, CheckCircle, XCircle, 
  RefreshCw, AlertTriangle, Play, Check, ShieldAlert, Award, FileText 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper for generating SHA-256 hash in browser
async function sha256Browser(text: string): Promise<string> {
  if (!text) return "0x" + "0".repeat(64);
  try {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return "0x" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    // Fallback simple hash string in case SubtleCrypto is blocked by sandbox
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padEnd(8, "f");
    return "0x" + hex.repeat(8);
  }
}

// Convert Hex hash to Binary string
function hexToBin(hex: string): string {
  let clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  let bin = "";
  for (let i = 0; i < clean.length; i++) {
    let char = clean[i];
    let val = parseInt(char, 16);
    if (!isNaN(val)) {
      bin += val.toString(2).padStart(4, "0");
    }
  }
  return bin;
}

// Calculate Hamming distance between two binary strings
function getHammingStats(bin1: string, bin2: string) {
  let maxLength = Math.max(bin1.length, bin2.length);
  let padded1 = bin1.padEnd(maxLength, "0");
  let padded2 = bin2.padEnd(maxLength, "0");
  let diffCount = 0;
  for (let i = 0; i < maxLength; i++) {
    if (padded1[i] !== padded2[i]) {
      diffCount++;
    }
  }
  let pct = maxLength > 0 ? (diffCount / maxLength) * 100 : 0;
  return { diffCount, total: maxLength, percentage: pct.toFixed(1) };
}

// Quiz questions
interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: "Why does Trueva anchor cryptographic Merkle Roots instead of raw student transcripts on-chain?",
    options: [
      "Because public chains cannot store strings longer than 10 characters.",
      "To ensure 100% GDPR & FERPA privacy compliance by keeping personal data locally hashed off-chain.",
      "To reduce transaction costs to exactly zero by hiding the academic institution's public keys.",
      "Because smart contracts can only run verification checks on math values below 32 bytes."
    ],
    correct: 1,
    explanation: "Educational records (PII) are strictly regulated. By compiling metadata into Merkle Trees and committing only the 32-byte Root Hash on-chain, Trueva verifies credential legitimacy without disclosing sensitive student records to the ledger history."
  },
  {
    question: "According to Byzantine Fault Tolerance (BFT) equations, what is the node quorum needed to secure a network against 'f' malicious node failures?",
    options: [
      "N >= 2f + 1 nodes",
      "N >= f + 1 nodes",
      "N >= 3f + 1 nodes",
      "N >= 4f + 2 nodes"
    ],
    correct: 2,
    explanation: "To survive Byzantine faults (where nodes send conflicting information or stay silent), a consensus ledger requires a validator count of N >= 3f + 1. For example, to tolerate 1 corrupt node (f=1), a minimum of 4 nodes is required to secure voting checks."
  },
  {
    question: "What is the 'Avalanche Effect' in cryptographic hashing algorithms?",
    options: [
      "An exploit that allows attackers to crack SHA-256 by overloading consensus RPC nodes.",
      "A rule where a minor input edit (e.g. 1 character) entirely changes (~50% bits) the output digest.",
      "A storage compression technique that compiles multiple leaf hashes into a single root node.",
      "The slow consensus process where block heights synchronize step-by-step from proposer to peer nodes."
    ],
    correct: 1,
    explanation: "The Avalanche Effect ensures that hash functions are collision-resistant. A tiny change in input values completely scrambles the output hash, making it mathematically impossible to guess original data parameters from a signature."
  },
  {
    question: "How do Zero-Knowledge Proofs (ZKPs) benefit credential verification audits?",
    options: [
      "They skip the signature checking phases completely to ensure transaction speed matches public networks.",
      "They allow students to verify degrees without private keys, shifting key custody to external balance pools.",
      "They let verifiers audit certificate validity without exposing personal details (names, grades) to request logs.",
      "They allow malicious nodes to sync block quorums in private network consensus environments."
    ],
    correct: 2,
    explanation: "ZKPs enable zero-disclosure verification. An applicant generates a mathematical verification proof locally. The auditor verifies the equation against the block root, proving certificate membership without seeing GPA or private info."
  }
];

export default function Masterclass() {
  // Module 1: Hash state
  const [inputText, setInputText] = useState("Trueva Certificate #1042 - Student: Alice Johnson");
  const [inputText2, setInputText2] = useState("Trueva Certificate #1042 - Student: Alice Johnson.");
  const [hash1, setHash1] = useState("");
  const [hash2, setHash2] = useState("");

  // Module 2: Key sign state
  const [privKey, setPrivKey] = useState("");
  const [pubKey, setPubKey] = useState("");
  const [payloadText, setPayloadText] = useState("Stanford Registrar | CS Degree | GPA 3.95");
  const [signatureText, setSignatureText] = useState("");
  const [isSignatureVerified, setIsSignatureVerified] = useState<boolean | null>(null);
  const [signStatus, setSignStatus] = useState("");

  // Module 3: Merkle tree state
  const [leaves, setLeaves] = useState<string[]>([
    "Alice: Stanford CS",
    "Bob: MIT Math",
    "Carol: Berkeley DS",
    "David: Harvard Law"
  ]);
  const [newLeafText, setNewLeafText] = useState("");
  const [treeHashes, setTreeHashes] = useState<{
    leaves: string[];
    parents: string[];
    root: string;
  }>({ leaves: [], parents: [], root: "" });
  const [selectedLeafIdx, setSelectedLeafIdx] = useState<number | null>(null);

  // Module 4: BFT state
  const [nodeStates, setNodeStates] = useState([
    { id: "node-1", role: "Proposer", status: "online", activeBlock: "blk-4820", type: "honest" },
    { id: "node-2", role: "Validator", status: "online", activeBlock: "blk-4820", type: "honest" },
    { id: "node-3", role: "Validator", status: "online", activeBlock: "blk-4820", type: "honest" },
    { id: "node-4", role: "Validator", status: "online", activeBlock: "blk-4820", type: "honest" },
    { id: "node-5", role: "Validator", status: "online", activeBlock: "blk-4820", type: "honest" },
    { id: "node-6", role: "Validator", status: "online", activeBlock: "blk-4820", type: "honest" },
  ]);
  const [bftPhase, setBftPhase] = useState<"idle" | "pre-prepare" | "prepare" | "commit" | "complete" | "rejected">("idle");
  const [bftLogs, setBftLogs] = useState<string[]>([]);
  const [bftScenario, setBftScenario] = useState<"clean" | "malicious">("clean");

  // Module 5: Quiz state
  const [currentQuizQ, setCurrentQuizQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Compute Module 1 hashes on text change
  useEffect(() => {
    async function updateHashes() {
      const h1 = await sha256Browser(inputText);
      const h2 = await sha256Browser(inputText2);
      setHash1(h1);
      setHash2(h2);
    }
    updateHashes();
  }, [inputText, inputText2]);

  // Compute Module 3 Merkle Tree hashes
  useEffect(() => {
    async function buildTree() {
      // 1. Hash the leaves
      const leafHashes: string[] = [];
      for (const leaf of leaves) {
        leafHashes.push(await sha256Browser(leaf));
      }
      
      // Pad to power of 2 or handle empty states
      let padded = [...leafHashes];
      if (padded.length === 0) {
        setTreeHashes({ leaves: [], parents: [], root: "0x" + "0".repeat(64) });
        return;
      }
      
      // Ensure even count for pairing (simple simulation of 4 leaves)
      while (padded.length < 4) {
        padded.push(await sha256Browser("empty_leaf_" + padded.length));
      }

      // Compute parents
      const p1 = await sha256Browser(padded[0] + padded[1]);
      const p2 = await sha256Browser(padded[2] + padded[3]);
      
      // Compute root
      const rootHash = await sha256Browser(p1 + p2);

      setTreeHashes({
        leaves: padded,
        parents: [p1, p2],
        root: rootHash
      });
    }
    buildTree();
  }, [leaves]);

  // Initial keypair generation
  useEffect(() => {
    generateKeys();
  }, []);

  const generateKeys = () => {
    const randomHex = () => Math.random().toString(16).substring(2, 10).padEnd(8, "0");
    const priv = "0x" + randomHex() + randomHex() + randomHex() + randomHex() + randomHex() + randomHex() + randomHex() + randomHex();
    const pub = "0x04" + randomHex() + randomHex() + randomHex() + randomHex() + randomHex() + randomHex() + randomHex() + randomHex();
    setPrivKey(priv);
    setPubKey(pub);
    setSignatureText("");
    setIsSignatureVerified(null);
    setSignStatus("");
  };

  const handleSign = async () => {
    if (!privKey) return;
    setSignStatus("Signing payload...");
    const payloadHash = await sha256Browser(payloadText);
    setTimeout(() => {
      // ECDSA simulation
      const mockSig = "0x30440220" + Math.random().toString(16).substring(2, 10) + "0220" + Math.random().toString(16).substring(2, 10) + "01";
      setSignatureText(mockSig);
      setSignStatus("Signature generated locally!");
      setIsSignatureVerified(null);
    }, 600);
  };

  const handleVerifySig = () => {
    if (!signatureText) return;
    setSignStatus("Decrypting signature with Public Key...");
    setTimeout(() => {
      setSignStatus("Audit Check: Hash matches signed origin payload!");
      setIsSignatureVerified(true);
    }, 700);
  };

  // Merkle operations
  const handleAddLeaf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeafText.trim()) return;
    if (leaves.length >= 4) {
      alert("This educational simulator uses a 4-leaf tree for simplified visualization.");
      return;
    }
    setLeaves([...leaves, newLeafText.trim()]);
    setNewLeafText("");
    setSelectedLeafIdx(null);
  };

  const handleResetLeaves = () => {
    setLeaves([
      "Alice: Stanford CS",
      "Bob: MIT Math",
      "Carol: Berkeley DS",
      "David: Harvard Law"
    ]);
    setSelectedLeafIdx(null);
  };

  // BFT Consensus run simulator
  const runBftConsensus = () => {
    setBftPhase("pre-prepare");
    setBftLogs(["[Consensus] Proposer node-1 broadcasting block candidate blk-4821..."]);
    
    // Reset nodes block heights
    setNodeStates(prev => prev.map((node, i) => ({
      ...node,
      activeBlock: "blk-4820",
      status: "online"
    })));

    setTimeout(() => {
      setBftPhase("prepare");
      setBftLogs(prev => [
        ...prev,
        "[Consensus] Phase: PREPARE. Validator nodes executing signature verification checks...",
        ...nodeStates.map(n => {
          if (n.id === "node-1") return `[node-1] Broadcaster proposed state committed.`;
          if (bftScenario === "malicious" && n.id === "node-4") {
            return `[node-4] Warning: Tampered block payload injected! Proposing modified hash!`;
          }
          return `[${n.id}] Validated signature of issuer Stanford University Registrar node.`;
        })
      ]);

      setTimeout(() => {
        setBftPhase("commit");
        let activeScenarioMalicious = bftScenario === "malicious";
        
        if (activeScenarioMalicious) {
          setNodeStates(prev => prev.map(n => {
            if (n.id === "node-4") return { ...n, status: "malicious" };
            return n;
          }));
          setBftLogs(prev => [
            ...prev,
            "[Consensus] Phase: COMMIT. Calculating quorum verification votes...",
            "[Consensus] Quorum vote results: 5 of 6 validators confirm signature checks.",
            "[Consensus] node-4 signature mismatch detected! Consensus failed on node-4 block proposal.",
            "[Consensus] BFT Rule triggered: Tolerating f=1 malicious nodes (5/6 > 4/6 quorum required)."
          ]);
        } else {
          setBftLogs(prev => [
            ...prev,
            "[Consensus] Phase: COMMIT. Signature consensus reached. 6 of 6 validator confirmations received.",
            "[Consensus] Broadcasting block approval commits to RPC registries."
          ]);
        }

        setTimeout(() => {
          if (activeScenarioMalicious) {
            setBftPhase("rejected");
            setBftLogs(prev => [
              ...prev,
              "[Consensus] CRITICAL: node-4 consensus state isolated. Peer synchronization forced.",
              "[Consensus] Syncing node-4 database ledger to stable block blk-4821.",
              "[Consensus] Block blk-4821 committed successfully across 5 honest validator nodes."
            ]);
            setNodeStates(prev => prev.map(n => {
              if (n.id === "node-4") {
                return { ...n, activeBlock: "blk-4821 (synced)", status: "online" };
              }
              return { ...n, activeBlock: "blk-4821" };
            }));
          } else {
            setBftPhase("complete");
            setBftLogs(prev => [
              ...prev,
              "[Consensus] Block blk-4821 committed successfully.",
              "[Consensus] All 6 validator nodes fully synchronized at height #4821."
            ]);
            setNodeStates(prev => prev.map(n => ({
              ...n,
              activeBlock: "blk-4821"
            })));
          }
        }, 1500);

      }, 1500);

    }, 1200);
  };

  // Quiz helper
  const handleAnswerSubmit = (optIdx: number) => {
    if (answered) return;
    setSelectedOption(optIdx);
    setAnswered(true);
    if (optIdx === quizQuestions[currentQuizQ].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setAnswered(false);
    if (currentQuizQ < quizQuestions.length - 1) {
      setCurrentQuizQ(prev => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizQ(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizComplete(false);
    setAnswered(false);
  };

  // Hamming stats calculations
  const bin1 = hexToBin(hash1);
  const bin2 = hexToBin(hash2);
  const hamming = getHammingStats(bin1, bin2);

  return (
    <section className="py-24 bg-white border-t border-neutral-250/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="px-3 py-1 bg-accent/15 text-accent rounded-full text-xs font-bold tracking-wider uppercase mb-4 inline-block">
            Sovereign Ledger Academy
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            Blockchain & Cryptography Masterclass
          </h2>
          <p className="text-neutral-600 text-sm md:text-base max-w-2xl mx-auto font-medium">
            Learn the core mechanics of decentralized registers. Interact with real cryptographic simulators, verify tree models, trace BFT consensus quorums, and test your knowledge.
          </p>
        </div>

        {/* Masterclass Scroll Modules */}
        <div className="space-y-24 max-w-5xl mx-auto">
          
          {/* Module 1: SHA-256 Hashing */}
          <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-3xl p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center">01</span>
                <h3 className="text-xl font-bold text-neutral-900">Cryptographic Hashes & Avalanche Effect</h3>
              </div>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-semibold">
                A cryptographic hash function maps arbitrary input text into a fixed 256-bit character string (a digest). The function is **one-way**: you can verify inputs to outputs, but you can never decrypt the hash back to the string.
              </p>
              <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 text-[11px] text-amber-800 leading-normal font-semibold">
                <strong className="block mb-1 flex items-center gap-1"><AlertTriangle size={14} className="text-status-amber" /> The Avalanche Rule:</strong>
                If the input changes by even a single dot, the output hash scrambles completely. This prevents hackers from guess-modifying degree grades, as the resulting block hash immediately alerts nodes.
              </div>
            </div>

            <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-4">
              {/* Input 1 */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Input Text 1</label>
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-semibold focus:border-accent outline-none min-h-[50px] resize-none"
                />
                <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono text-neutral-400">
                  <span className="truncate max-w-[80%] font-bold text-neutral-500">SHA-256: <span className="text-accent">{hash1.slice(0, 32)}...</span></span>
                </div>
              </div>

              {/* Input 2 */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Input Text 2 (Modify slightly)</label>
                <textarea 
                  value={inputText2}
                  onChange={(e) => setInputText2(e.target.value)}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-semibold focus:border-accent outline-none min-h-[50px] resize-none"
                />
                <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono text-neutral-400">
                  <span className="truncate max-w-[80%] font-bold text-neutral-500">SHA-256: <span className="text-neutral-600">{hash2.slice(0, 32)}...</span></span>
                </div>
              </div>

              {/* Hamming Stats */}
              <div className="border-t border-neutral-100 pt-3 bg-neutral-50 rounded-xl p-3 text-[10px] space-y-1.5 font-mono text-neutral-600">
                <div className="flex justify-between font-bold">
                  <span>Hamming Distance:</span>
                  <span className="text-accent font-black">{hamming.diffCount} / {hamming.total} bits changed</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Output Deviation:</span>
                  <span className="text-accent font-black">{hamming.percentage}% difference</span>
                </div>
                <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-accent transition-all duration-300" style={{ width: `${hamming.percentage}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Module 2: ECDSA Asymmetric Signing */}
          <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-3xl p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 lg:order-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center">02</span>
                <h3 className="text-xl font-bold text-neutral-900">ECDSA & Asymmetric Key Signatures</h3>
              </div>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-semibold">
                Academic institutions operate with a cryptographic keypair consisting of a **Private Key** (kept secret by the Registrar to sign transcripts) and a **Public Key** (published openly on the registry ledger so anyone can verify signatures).
              </p>
              <p className="text-xs text-neutral-550 leading-relaxed font-semibold">
                When a degree is issued, the university's secret key encrypts the document hash to create a unique **Digital Signature**. If any details are changed, or if an unauthorized party signs the hash, verification instantly fails key alignment checks.
              </p>
              <button 
                onClick={generateKeys}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-full text-xs font-bold text-neutral-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} /> Regenerate Keypair
              </button>
            </div>

            <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-4 lg:order-1">
              {/* Keys display */}
              <div className="space-y-1.5 font-mono text-[9px]">
                <div className="bg-neutral-950 text-neutral-450 p-2.5 rounded-lg border border-neutral-850">
                  <span className="block text-accent font-bold mb-0.5 uppercase text-[7px] tracking-wider">Registrar Private Key</span>
                  <span className="break-all block font-semibold text-white/90">{privKey.slice(0, 34)}...</span>
                </div>
                <div className="bg-neutral-950 text-neutral-450 p-2.5 rounded-lg border border-neutral-850">
                  <span className="block text-neutral-400 font-bold mb-0.5 uppercase text-[7px] tracking-wider">Registrar Public Key</span>
                  <span className="break-all block font-semibold text-white/90">{pubKey.slice(0, 34)}...</span>
                </div>
              </div>

              {/* Payload signing */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Credential Data Payload</label>
                <input 
                  type="text" 
                  value={payloadText}
                  onChange={(e) => setPayloadText(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold focus:border-accent outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSign}
                  className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl shadow transition-all cursor-pointer"
                >
                  Sign Payload
                </button>
                <button
                  onClick={handleVerifySig}
                  disabled={!signatureText}
                  className="flex-1 py-3 bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-semibold text-xs rounded-xl shadow transition-all cursor-pointer"
                >
                  Verify Signature
                </button>
              </div>

              {signStatus && (
                <div className="text-[10px] font-mono bg-neutral-50 rounded-xl p-3 border border-neutral-150 text-neutral-600 font-semibold leading-normal">
                  {signStatus}
                </div>
              )}

              {signatureText && (
                <div className="bg-neutral-950 text-neutral-450 font-mono text-[9px] p-2.5 rounded-lg border border-neutral-850 max-h-16 overflow-y-auto no-scrollbar">
                  <span className="block text-emerald-400 font-bold mb-0.5 uppercase text-[7px] tracking-wider">Generated ECDSA Signature</span>
                  <span className="break-all block font-semibold">{signatureText}</span>
                </div>
              )}

              {isSignatureVerified && (
                <div className="bg-status-green/10 border border-status-green/20 text-status-green font-bold text-xs rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle size={14} />
                  Signature Legit: Validated by Public Key
                </div>
              )}
            </div>
          </div>

          {/* Module 3: Merkle Tree */}
          <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center">03</span>
                  <h3 className="text-xl font-bold text-neutral-900">Merkle Trees & Logarithmic Auditing</h3>
                </div>
                <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-semibold">
                  A Merkle Tree compiles thousands of individual hashes into a single root value. If an employer has a candidate's credential hash and the sibling hashes along the verification path (the **Merkle Proof**), they can verify database inclusion in $O(\log N)$ steps.
                </p>
                <div className="bg-white border border-neutral-200/50 rounded-2xl p-4 text-xs font-semibold text-neutral-550 leading-relaxed">
                  <strong className="block text-neutral-900 mb-1.5">Interactive Audit Instructions:</strong>
                  Click on any certificate Leaf node in the grid. Watch the diagram highlight the sibling hashes (in orange) required to recalculate the parent nodes up to the final committed Merkle Root.
                </div>
              </div>

              <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-4">
                <form onSubmit={handleAddLeaf} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newLeafText}
                    onChange={(e) => setNewLeafText(e.target.value)}
                    placeholder="Enter student & award detail..."
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold focus:border-accent outline-none"
                  />
                  <button type="submit" className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl cursor-pointer">
                    Add Leaf
                  </button>
                  <button type="button" onClick={handleResetLeaves} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-500 cursor-pointer" title="Reset to defaults">
                    <RefreshCw size={12} />
                  </button>
                </form>

                {/* Leaf items list */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-neutral-700">
                  {leaves.map((l, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedLeafIdx(i)}
                      className={`p-3 border rounded-xl cursor-pointer transition-all ${
                        selectedLeafIdx === i ? "border-amber-400 bg-amber-50/20 text-neutral-900 ring-2 ring-amber-400/10" : "border-neutral-200/40 hover:border-neutral-300 bg-neutral-50/50"
                      }`}
                    >
                      <span className="block text-[8px] text-neutral-400 uppercase font-bold mb-0.5">Leaf {i}</span>
                      <span className="truncate block font-bold">{l}</span>
                      <span className="block text-[7px] font-mono text-neutral-400 truncate mt-1">
                        {treeHashes.leaves[i] ? treeHashes.leaves[i].slice(0, 16) + "..." : "hashing..."}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tree visualization layout */}
            {treeHashes.leaves.length > 0 && (
              <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden font-mono text-[9px] min-h-[220px]">
                {/* Visual Connector lines using absolute overlays */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-neutral-200/60" strokeWidth="1">
                  {/* Lines from Leaves to Parents */}
                  <line x1="20%" y1="170" x2="30%" y2="105" className={selectedLeafIdx === 0 || selectedLeafIdx === 1 ? "stroke-amber-400 stroke-2" : ""} />
                  <line x1="40%" y1="170" x2="30%" y2="105" className={selectedLeafIdx === 0 || selectedLeafIdx === 1 ? "stroke-amber-400 stroke-2" : ""} />
                  
                  <line x1="60%" y1="170" x2="70%" y2="105" className={selectedLeafIdx === 2 || selectedLeafIdx === 3 ? "stroke-amber-400 stroke-2" : ""} />
                  <line x1="80%" y1="170" x2="70%" y2="105" className={selectedLeafIdx === 2 || selectedLeafIdx === 3 ? "stroke-amber-400 stroke-2" : ""} />
                  
                  {/* Lines from Parents to Root */}
                  <line x1="30%" y1="90" x2="50%" y2="35" className={selectedLeafIdx !== null ? "stroke-amber-400 stroke-2" : ""} />
                  <line x1="70%" y1="90" x2="50%" y2="35" className={selectedLeafIdx !== null ? "stroke-amber-400 stroke-2" : ""} />
                </svg>

                {/* Level 2: Merkle Root */}
                <div className={`px-4 py-2 border rounded-xl font-bold shadow-sm relative z-10 transition-colors ${
                  selectedLeafIdx !== null ? "border-amber-400 bg-amber-50 text-neutral-900" : "border-accent bg-accent/5 text-accent"
                }`}>
                  <span className="block text-[7px] text-neutral-400 uppercase font-black tracking-wider text-center mb-0.5">Merkle Root</span>
                  <span className="font-bold text-[9px]">{treeHashes.root.slice(0, 16)}...</span>
                </div>

                {/* Level 1: Parent nodes */}
                <div className="flex justify-around w-full mt-10 relative z-10">
                  <div className={`px-3 py-1.5 border rounded-lg shadow-sm transition-colors ${
                    selectedLeafIdx === 0 || selectedLeafIdx === 1 ? "border-amber-400 bg-amber-50 text-neutral-900" : "border-neutral-200 bg-neutral-50 text-neutral-600"
                  }`}>
                    <span className="block text-[6px] text-neutral-400 uppercase font-black tracking-wider text-center">Hash (Leaf 0 + Leaf 1)</span>
                    <span className="font-semibold text-[8px]">{treeHashes.parents[0] ? treeHashes.parents[0].slice(0, 12) + "..." : ""}</span>
                  </div>
                  <div className={`px-3 py-1.5 border rounded-lg shadow-sm transition-colors ${
                    selectedLeafIdx === 2 || selectedLeafIdx === 3 ? "border-amber-400 bg-amber-50 text-neutral-900" : "border-neutral-200 bg-neutral-50 text-neutral-600"
                  }`}>
                    <span className="block text-[6px] text-neutral-400 uppercase font-black tracking-wider text-center">Hash (Leaf 2 + Leaf 3)</span>
                    <span className="font-semibold text-[8px]">{treeHashes.parents[1] ? treeHashes.parents[1].slice(0, 12) + "..." : ""}</span>
                  </div>
                </div>

                {/* Level 0: Leaves */}
                <div className="flex justify-around w-full mt-10 relative z-10">
                  {treeHashes.leaves.slice(0, 4).map((lh, idx) => {
                    const isTarget = selectedLeafIdx === idx;
                    // Determine if it is the sibling proof required
                    const isSiblingProof = selectedLeafIdx !== null && (
                      (selectedLeafIdx === 0 && idx === 1) ||
                      (selectedLeafIdx === 1 && idx === 0) ||
                      (selectedLeafIdx === 2 && idx === 3) ||
                      (selectedLeafIdx === 3 && idx === 2)
                    );

                    let borderClass = "border-neutral-200 bg-neutral-50 text-neutral-450";
                    if (isTarget) borderClass = "border-amber-400 bg-amber-50/50 text-neutral-950 font-bold ring-1 ring-amber-400/20";
                    if (isSiblingProof) borderClass = "border-status-amber bg-status-amber/10 text-status-amber font-bold ring-1 ring-status-amber/20";

                    return (
                      <div key={idx} className={`px-2.5 py-1.5 border rounded-md shadow-sm transition-colors ${borderClass} w-[22%] text-center`}>
                        <span className="block text-[5px] text-neutral-400 uppercase font-black">
                          {isTarget ? "Target Leaf" : isSiblingProof ? "Sibling Proof" : `Leaf ${idx}`}
                        </span>
                        <span className="font-semibold text-[8px] truncate block">{lh.slice(0, 10)}...</span>
                      </div>
                    );
                  })}
                </div>

                {selectedLeafIdx !== null && (
                  <div className="mt-8 text-neutral-500 font-sans text-[10px] text-center font-medium bg-[#FAF9F6] border border-neutral-100 rounded-xl px-4 py-2">
                    To audit <span className="font-bold text-neutral-900">{leaves[selectedLeafIdx]}</span>, the verifier requires: 
                    the Leaf hash, the <span className="font-bold text-status-amber">Sibling Proof</span> hash, and the parent sibling hash to check against the <span className="font-bold text-accent">Merkle Root</span>.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Module 4: BFT Consensus & Proof-of-Authority */}
          <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center">04</span>
                  <h3 className="text-xl font-bold text-neutral-900">Byzantine Fault Tolerance (BFT) & Proof of Authority</h3>
                </div>
                <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-semibold">
                  A consortium registry functions on **Proof-of-Authority (PoA)** consensus. Instead of public miners competing with electricity, trusted institutions act as validator nodes.
                </p>
                <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-semibold">
                  To prevent fraud, nodes execute a **Byzantine Fault Tolerant (BFT)** validation loop. If a proposer tries to commit an altered block signature, the consensus nodes vote it down.
                </p>
                
                {/* Control Scenario toggles */}
                <div className="bg-white border border-neutral-250/30 rounded-2xl p-4 shadow-sm space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Simulated Network Scenario</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setBftScenario("clean"); setBftPhase("idle"); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                          bftScenario === "clean" ? "bg-accent/10 border-accent/20 text-accent" : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:text-neutral-950"
                        }`}
                      >
                        All Nodes Honest
                      </button>
                      <button 
                        onClick={() => { setBftScenario("malicious"); setBftPhase("idle"); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                          bftScenario === "malicious" ? "bg-status-red/10 border-status-red/20 text-status-red" : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:text-neutral-950"
                        }`}
                      >
                        Tampered Node-4 Drill
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={runBftConsensus}
                    disabled={bftPhase !== "idle" && bftPhase !== "complete" && bftPhase !== "rejected"}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play size={12} fill="currentColor" /> Propose & Verify Block blk-4821
                  </button>
                </div>
              </div>

              {/* Validator Node Grid */}
              <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 block">Consensus Network Node Dashboard</span>
                
                <div className="grid grid-cols-3 gap-3 font-mono text-[9px]">
                  {nodeStates.map((node) => {
                    let borderClass = "border-neutral-200 bg-neutral-50 text-neutral-550";
                    let stateText = "Synced";
                    
                    if (node.status === "malicious") {
                      borderClass = "border-status-red bg-status-red/10 text-status-red animate-pulse";
                      stateText = "FRAUD BLOCKED";
                    } else if (bftPhase === "pre-prepare" && node.id === "node-1") {
                      borderClass = "border-accent bg-accent/5 text-accent animate-pulse";
                      stateText = "PROPOSING";
                    } else if (bftPhase === "prepare" && node.id !== "node-1") {
                      borderClass = "border-amber-400 bg-amber-50/50 text-neutral-850 animate-pulse";
                      stateText = "AUDITING";
                    } else if (bftPhase === "commit" && node.status !== "malicious") {
                      borderClass = "border-emerald-400 bg-emerald-50 text-emerald-600";
                      stateText = "VOTED YES";
                    } else if (bftPhase === "complete" || bftPhase === "rejected") {
                      borderClass = "border-neutral-200 bg-white text-neutral-700";
                      stateText = "COMMITTED";
                    }

                    return (
                      <div key={node.id} className={`p-3 border rounded-xl flex flex-col items-center justify-center text-center transition-all ${borderClass}`}>
                        <Cpu size={14} className="mb-1.5" />
                        <span className="font-bold text-[10px] uppercase text-neutral-900">{node.id}</span>
                        <span className="text-[8px] text-neutral-400 mt-0.5">{node.activeBlock}</span>
                        <span className="text-[7px] font-bold uppercase mt-1 px-1 py-0.5 bg-neutral-100 rounded-sm">{stateText}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Console Log view */}
                <div className="bg-neutral-900 text-neutral-400 rounded-xl p-4 font-mono text-[9px] leading-relaxed border border-neutral-850 h-32 overflow-y-auto no-scrollbar">
                  <div className="flex items-center justify-between border-b border-neutral-850 pb-2 mb-2">
                    <span className="text-neutral-500 font-bold uppercase tracking-wider text-[8px]">Consensus telemetry console</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  </div>
                  <div className="space-y-1.5">
                    {bftLogs.length === 0 ? (
                      <div className="text-neutral-600 text-center py-6 font-sans">Click 'Propose & Verify Block' to start BFT console trace logs.</div>
                    ) : (
                      bftLogs.map((log, idx) => {
                        let logColor = "";
                        if (log.includes("[Consensus]")) logColor = "text-accent";
                        if (log.includes("Warning") || log.includes("failed")) logColor = "text-status-red font-bold";
                        if (log.includes("success")) logColor = "text-status-green font-bold";
                        return (
                          <div key={idx} className={logColor}>
                            {log}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Educational comparative analysis */}
            <div className="border-t border-neutral-150 pt-8">
              <h4 className="text-sm font-bold text-neutral-900 mb-4 text-center uppercase tracking-wider">Comparative Consensus Matrix</h4>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse text-xs font-semibold text-neutral-600">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-900 font-bold text-[10px] uppercase">
                      <th className="p-3">Consensus Mechanism</th>
                      <th className="p-3">Block Finality Time</th>
                      <th className="p-3">Energy Overhead</th>
                      <th className="p-3">Decentralization Level</th>
                      <th className="p-3">Transaction Cost Stability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr>
                      <td className="p-3 font-bold text-neutral-850">Proof-of-Authority (Trueva)</td>
                      <td className="p-3 text-status-green font-bold">&lt; 1 Second</td>
                      <td className="p-3 text-status-green font-bold">Negligible</td>
                      <td className="p-3">Consortium level (Institutional)</td>
                      <td className="p-3 text-status-green font-bold">Deterministic (0 Fees)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-neutral-850">Proof-of-Stake (Ethereum L1/L2)</td>
                      <td className="p-3">12 Seconds - 3 Minutes</td>
                      <td className="p-3 text-status-green font-bold">Low</td>
                      <td className="p-3">High (Global Pools)</td>
                      <td className="p-3 text-status-red">Volatile Gas Fees</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-neutral-850">Proof-of-Work (Bitcoin Ledger)</td>
                      <td className="p-3 text-status-red">10 - 60 Minutes</td>
                      <td className="p-3 text-status-red">Extremely High</td>
                      <td className="p-3">High (Asymmetric Pools)</td>
                      <td className="p-3 text-status-red">Highly Volatile</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Module 5: ZK-Proofs & W3C */}
          <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-3xl p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center">05</span>
                <h3 className="text-xl font-bold text-neutral-900">Zero-Knowledge Proofs & W3C Identifiers</h3>
              </div>
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-semibold">
                To guarantee absolute confidentiality under FERPA rules, modern systems implement **Zero-Knowledge proofs (ZKPs)**. Students generate a ZK-SNARK mathematical validation proof locally inside their browser client.
              </p>
              <p className="text-xs text-neutral-550 leading-relaxed font-semibold">
                The student submits this proof to an employer or verifier. The verifier queries the blockchain ledger checking if the proof equation balances against the committed root hash, verifying credential validity with **zero disclosure** of student names or GPAs.
              </p>
            </div>

            <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 block">Cryptographic Standard Specifications</span>
              
              <div className="space-y-3 font-semibold text-neutral-600 text-xs font-sans">
                <div className="flex items-start gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 text-[10px] font-bold">W3</div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-xs mb-0.5">W3C Verifiable Credentials (VC)</h4>
                    <p className="text-[10px] text-neutral-450 leading-relaxed font-medium">Standard formats for digital certificates containing signed cryptographic data structures.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 text-[10px] font-bold">ID</div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-xs mb-0.5">Decentralized Identifiers (DID)</h4>
                    <p className="text-[10px] text-neutral-450 leading-relaxed font-medium">Cryptographic URLs identifying registrars, users, and nodes without central registry servers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 text-[10px] font-bold">ZK</div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-xs mb-0.5">ZK-SNARK Proof Circuits</h4>
                    <p className="text-[10px] text-neutral-450 leading-relaxed font-medium font-semibold">Algorithms verifying membership of hashed degree records in roots with zero leakage of credentials.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Module 6: Knowledge check trivia quiz */}
          <div className="bg-neutral-900 border border-neutral-850 rounded-3xl p-8 text-neutral-300 shadow-xl scroll-mt-20" id="knowledge-quiz">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-accent" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Blockchain Knowledge Check</h3>
              </div>
              <span className="text-[10px] font-bold text-neutral-500 font-mono">
                {!quizComplete ? `Question ${currentQuizQ + 1} / ${quizQuestions.length}` : "Quiz Finished"}
              </span>
            </div>

            {!quizComplete ? (
              <div className="space-y-6">
                <h4 className="text-sm md:text-base font-bold text-white leading-relaxed font-sans">
                  {quizQuestions[currentQuizQ].question}
                </h4>

                <div className="space-y-3 font-sans">
                  {quizQuestions[currentQuizQ].options.map((opt, idx) => {
                    let optStyle = "bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border-neutral-800";
                    if (answered) {
                      if (idx === quizQuestions[currentQuizQ].correct) {
                        optStyle = "bg-status-green/20 border-status-green text-status-green font-bold";
                      } else if (selectedOption === idx) {
                        optStyle = "bg-status-red/20 border-status-red text-status-red font-bold";
                      } else {
                        optStyle = "bg-neutral-900/50 border-neutral-850 text-neutral-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSubmit(idx)}
                        disabled={answered}
                        className={`w-full p-4 border rounded-xl text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 font-bold text-[10px] text-white">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-semibold">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 text-[11px] leading-relaxed text-neutral-400 font-medium font-sans"
                    >
                      <strong className="block text-white mb-1 uppercase tracking-wide text-[9px]">
                        {selectedOption === quizQuestions[currentQuizQ].correct ? "✓ Correct!" : "✗ Incorrect"}
                      </strong>
                      {quizQuestions[currentQuizQ].explanation}
                      <button
                        onClick={handleNextQuiz}
                        className="mt-4 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        Continue <Play size={10} fill="currentColor" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-10 space-y-6 font-sans">
                <CheckCircle className="text-status-green w-16 h-16 mx-auto animate-bounce" />
                <h4 className="text-2xl font-bold text-white">Masterclass Quiz Completed!</h4>
                <p className="text-sm text-neutral-450 font-medium max-w-md mx-auto leading-relaxed">
                  You scored <span className="font-black text-white text-lg">{quizScore} out of {quizQuestions.length}</span>. You have successfully run through the fundamentals of cryptographic hash algorithms, ECDSA keypairs, Merkle trees, and BFT consensus models.
                </p>
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3.5 bg-accent hover:bg-accent-hover text-white font-bold text-xs rounded-full shadow transition-all cursor-pointer"
                >
                  Restart Quiz
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
