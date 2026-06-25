"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Cpu, Database, Eye, Globe, Key, Search, Server, TrendingUp, BarChart2, Shield } from "lucide-react";
import { useDeployment } from "@/lib/deployment-store";
import { FloatingCubesBackground } from "@/components/cube-animation";

interface BlockData {
  height: string;
  hash: string;
  txCount: number;
  timestamp: string;
  certs?: any[];
}

interface TxData {
  hash: string;
  block: string;
  issuer: string;
  studentInitials: string;
  type: string;
  status: string;
}

const defaultBlocks: BlockData[] = [
  { height: "blk-4820", hash: "0x5d9b62f183ae439ca257a09d18b1ea32a", txCount: 42, timestamp: "10 mins ago" },
  { height: "blk-4819", hash: "0x1a7c39b2e0df4831ca62e7a18b2c45d3e", txCount: 1, timestamp: "25 mins ago" },
  { height: "blk-4818", hash: "0xfa8d3e2c1b0a9b8372e61a4c9e8d3b7e6", txCount: 28, timestamp: "1 hour ago" },
  { height: "blk-4817", hash: "0x8e7a6d5c4b3a2f1e0d9c8b7a6f5e4d3c2", txCount: 1, timestamp: "2 hours ago" },
  { height: "blk-4816", hash: "0x9bc2b8a736a49f82d1c68e7a1b0a3f9e2", txCount: 15, timestamp: "4 hours ago" },
  { height: "blk-4815", hash: "0x3db9a2f60a8e7a09d18b1ea32a82bc71e", txCount: 8, timestamp: "6 hours ago" },
  { height: "blk-4814", hash: "0x4b3a2f1e0d9c8b7a6f5e4d3c2b1a0e9d", txCount: 33, timestamp: "8 hours ago" },
  { height: "blk-4813", hash: "0x5e4d3c2b1a0e9d8c7b6a5f4e3d2c1b0a", txCount: 12, timestamp: "12 hours ago" },
  { height: "blk-4812", hash: "0x6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a", txCount: 1, timestamp: "18 hours ago" },
  { height: "blk-4811", hash: "0x7a6f5e4d3c2b1a0e9d8c7b6a5f4e3d2c", txCount: 50, timestamp: "1 day ago" }
];

const defaultTxs: TxData[] = [
  { hash: "0x3db9a2f60a8e7a...82bc7", block: "blk-4820", issuer: "Stanford University", studentInitials: "A.M.", type: "Batch Anchor (42 Certs)", status: "SUCCESS" },
  { hash: "0x5d9b62a4b8c9d0...10ef2", block: "blk-4820", issuer: "Stanford University", studentInitials: "J.D.", type: "Single Cert Verification", status: "SUCCESS" },
  { hash: "0x98a7b6c5d4e3f2...21ab9", block: "blk-4818", issuer: "Massachusetts Institute of Technology", studentInitials: "A.J.", type: "Batch Anchor (28 Certs)", status: "SUCCESS" },
  { hash: "0x12a83b9c7d8f5e...4e8a1", block: "blk-4816", issuer: "AcadHub Academy", studentInitials: "C.S.", type: "Batch Anchor (15 Certs)", status: "SUCCESS" },
  { hash: "0x82bcf92da103ec...902af", block: "blk-4815", issuer: "University of California, Berkeley", studentInitials: "K.L.", type: "Revocation Drill", status: "SUCCESS" },
  { hash: "0x7a8b9c0d1e2f3a...4b5c6", block: "blk-4814", issuer: "Stanford University", studentInitials: "M.H.", type: "Batch Anchor (33 Certs)", status: "SUCCESS" },
  { hash: "0x2d3e4f5a6b7c8d...9e0f1", block: "blk-4813", issuer: "Massachusetts Institute of Technology", studentInitials: "H.Y.", type: "Batch Anchor (12 Certs)", status: "SUCCESS" },
  { hash: "0x1b2c3d4e5f6a7b...8c9d0", block: "blk-4811", issuer: "University of California, Berkeley", studentInitials: "R.P.", type: "Batch Anchor (50 Certs)", status: "SUCCESS" },
  { hash: "0x9c8d7e6f5a4b3c...2d1e0", block: "blk-4811", issuer: "AcadHub Academy", studentInitials: "T.W.", type: "Single Cert Issue", status: "SUCCESS" },
  { hash: "0x8a7b6c5d4e3f2a...1b0c9", block: "blk-4810", issuer: "Stanford University", studentInitials: "L.K.", type: "Revocation Drill", status: "SUCCESS" }
];

const leaderboards = [
  { rank: 1, node: "stanford-validator-node", region: "US-West", proposals: 420, verified: 12042, uptime: "99.98%" },
  { rank: 2, node: "mit-credential-node", region: "US-East", proposals: 412, verified: 11988, uptime: "99.99%" },
  { rank: 3, node: "berkeley-consensus-node", region: "US-West", proposals: 405, verified: 11843, uptime: "99.95%" },
  { rank: 4, node: "harvard-registry-node", region: "US-East", proposals: 395, verified: 11624, uptime: "99.96%" },
  { rank: 5, node: "princeton-academic-node", region: "US-East", proposals: 388, verified: 11450, uptime: "99.97%" },
  { rank: 6, node: "yale-registrar-node", region: "US-East", proposals: 374, verified: 11029, uptime: "99.91%" }
];

export default function ExplorerPage() {
  const { state } = useDeployment();
  const [blocks, setBlocks] = useState<BlockData[]>(defaultBlocks);
  const [txs, setTxs] = useState<TxData[]>(defaultTxs);
  const [searchVal, setSearchVal] = useState("");
  const [searchMsg, setSearchMsg] = useState("");

  useEffect(() => {
    // Read dynamic blocks/certs issued from localStorage
    const localCerts = JSON.parse(localStorage.getItem("trueva_certs") || "[]");
    const localBlocks = JSON.parse(localStorage.getItem("trueva_blocks") || "[]");

    if (localBlocks.length > 0) {
      // Map local storage blocks
      const formattedLocalBlocks: BlockData[] = localBlocks.map((b: any) => ({
        height: b.height,
        hash: b.hash,
        txCount: b.txCount,
        timestamp: b.timestamp || "Just now",
      }));
      setBlocks([...formattedLocalBlocks, ...defaultBlocks]);
    }

    if (localCerts.length > 0) {
      const formattedLocalTxs: TxData[] = localCerts.map((c: any) => ({
        hash: c.txHash,
        block: c.blockHeight,
        issuer: c.institution,
        studentInitials: c.studentName.split(" ").map((n: string) => n[0]).join(".") + ".",
        type: "Single Cert Issue",
        status: "SUCCESS",
      }));
      setTxs([...formattedLocalTxs, ...defaultTxs]);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchVal.trim().toLowerCase();
    if (!query) return;

    // Check if it looks like a certificate ID
    if (query.includes("trueva:cert:")) {
      window.location.href = `/verify?id=${query}`;
      return;
    }

    setSearchMsg("Blockchain query complete. For certificate deep audit metadata, please paste ID into the Verification Portal.");
    setTimeout(() => setSearchMsg(""), 5000);
  };

  // Determine actual node count dynamically from simulator state
  const activeNodesCount = state.instances.length;

  return (
    <>
      <NavBar />
      <div className="relative bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16 px-6 overflow-hidden">
        <FloatingCubesBackground count={10} />
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-accent transition-colors mb-10 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to homepage
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold tracking-wide uppercase">
                Consensus Ledger Explorer
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mt-4 mb-3">
                Trueva Block Explorer
              </h1>
              <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-xl">
                Browse block heights, hash commits, and verification events compiled in real-time across the PoA validator network.
              </p>
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-96">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search Block, Txn, or Cert ID"
                className="flex-1 px-4 py-3 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:border-accent transition-all outline-none"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
              >
                Search
              </button>
            </form>
          </div>

          {searchMsg && (
            <div className="bg-accent/10 border border-accent/20 text-accent text-xs font-semibold rounded-xl p-4 mb-8">
              {searchMsg}
            </div>
          )}

          {/* Network Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 text-neutral-400 mb-3">
                <Database size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Current Block Height</span>
              </div>
              <span className="text-2xl font-black text-neutral-900 font-mono">
                {state.status === "completed" ? "blk-4821" : state.activeVersion}
              </span>
            </div>

            <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 text-neutral-400 mb-3">
                <Server size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Active Consensus Nodes</span>
              </div>
              <span className="text-2xl font-black text-neutral-900 font-mono">
                {activeNodesCount} Nodes
              </span>
            </div>

            <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 text-neutral-400 mb-3">
                <Cpu size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Avg Latency</span>
              </div>
              <span className="text-2xl font-black text-neutral-900 font-mono">
                {state.stats.avgPromoTime}
              </span>
            </div>

            <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 text-neutral-400 mb-3">
                <Globe size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Ledger Network Status</span>
              </div>
              <span className="text-sm font-black text-status-green flex items-center gap-1.5 font-mono uppercase mt-1">
                <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
                CON. HEALTHY (100%)
              </span>
            </div>
          </div>

          {/* Interactive Analytics & Leaderboards panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Left Column: Consensus Performance Analytics Chart elements */}
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <h3 className="text-sm font-bold text-neutral-850 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart2 size={16} className="text-accent" /> Consensus Performance Analytics
              </h3>
              
              <div className="space-y-4">
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-neutral-700 mb-1.5">
                    <span>Validation Verification Success Rate</span>
                    <span className="text-status-green font-mono">100.0%</span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-status-green rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-neutral-700 mb-1.5">
                    <span>RPC Load Gateway Read Efficiency</span>
                    <span className="text-accent font-mono">98.2%</span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: "98%" }} />
                  </div>
                </div>

                {/* Metric 3 */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-neutral-700 mb-1.5">
                    <span>Consensus Voting Quorum Speed</span>
                    <span className="text-neutral-900 font-mono">0.68 seconds</span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-900 rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-neutral-400 font-medium leading-relaxed mt-4 border-t border-neutral-100 pt-4">
                Heartbeat validation performance checks are compiled in epochs of 100 blocks across standard RPC pools.
              </div>
            </div>

            {/* Right Column: Node Leaderboard */}
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-sm lg:col-span-2">
              <h3 className="text-sm font-bold text-neutral-850 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield size={16} className="text-accent" /> Active Validator Node Board
              </h3>
              
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse text-[11px] font-semibold text-neutral-600">
                  <thead>
                    <tr className="border-b border-neutral-100 text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                      <th className="pb-2">Rank</th>
                      <th className="pb-2">Consortium Node Name</th>
                      <th className="pb-2">Region</th>
                      <th className="pb-2 text-center">Proposals</th>
                      <th className="pb-2 text-center">Verified Certs</th>
                      <th className="pb-2 text-right">Uptime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50/50 text-neutral-700 font-mono">
                    {leaderboards.map((lead) => (
                      <tr className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-2.5 font-bold text-neutral-900">#{lead.rank}</td>
                        <td className="py-2.5 font-sans font-bold text-neutral-850">{lead.node}</td>
                        <td className="py-2.5 text-neutral-500">{lead.region}</td>
                        <td className="py-2.5 text-center text-neutral-800">{lead.proposals}</td>
                        <td className="py-2.5 text-center text-neutral-800 font-bold">{lead.verified}</td>
                        <td className="py-2.5 text-right text-status-green font-bold">{lead.uptime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Recent Blocks */}
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-neutral-900 mb-5 flex items-center gap-2">
                <Database size={16} className="text-accent" />
                Recent Blocks Sync
              </h2>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 text-[10px] font-bold text-neutral-500 uppercase tracking-wider pb-3">
                      <th className="pb-3">Height</th>
                      <th className="pb-3">Block Hash</th>
                      <th className="pb-3 text-center">Tx Count</th>
                      <th className="pb-3 text-right">Age</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-neutral-700 divide-y divide-neutral-50/50">
                    {blocks.map((block, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-4 font-mono font-bold text-neutral-900">{block.height}</td>
                        <td className="py-4 font-mono text-neutral-400 select-all max-w-[80px] sm:max-w-[120px] truncate" title={block.hash}>
                          {block.hash}
                        </td>
                        <td className="py-4 text-center font-mono font-bold text-neutral-800">{block.txCount}</td>
                        <td className="py-4 text-right text-neutral-500">{block.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Recent Transactions */}
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-neutral-900 mb-5 flex items-center gap-2">
                <Key size={16} className="text-accent" />
                Recent Certificate Registry Telemetry
              </h2>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 text-[10px] font-bold text-neutral-500 uppercase tracking-wider pb-3">
                      <th className="pb-3">Tx Hash</th>
                      <th className="pb-3">Issuer</th>
                      <th className="pb-3 text-center">Initials</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-neutral-700 divide-y divide-neutral-50/50">
                    {txs.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-4 font-mono text-neutral-400 select-all max-w-[80px] sm:max-w-[120px] truncate" title={tx.hash}>
                          {tx.hash}
                        </td>
                        <td className="py-4 text-neutral-900 truncate max-w-[160px]" title={tx.issuer}>{tx.issuer}</td>
                        <td className="py-4 text-center font-mono text-neutral-500">{tx.studentInitials}</td>
                        <td className="py-4 text-right">
                          <span className="px-2 py-0.5 bg-status-green/10 text-status-green rounded font-mono font-bold text-[9px]">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
