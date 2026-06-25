"use client";

import React from "react";
import { ArrowLeft, Terminal, Server, Shield, Globe, Award, Lock, FileSpreadsheet } from "lucide-react";
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
              This document specifies the network topology, consensus rules, quorum threshold equations, and contract registry pathways that govern the Trueva ledger.
            </p>
          </div>

          {/* Visual Network Topology Diagram (ASCII representation inside code box) */}
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm mb-12">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Globe size={18} className="text-accent" /> Network Communication Topology
            </h2>
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-6 font-medium">
              The Trueva ecosystem detaches credential storage from verification paths, routing requests through isolated execution layers to ensure sub-120ms latencies and zero data leakage:
            </p>

            <div className="bg-neutral-900 text-neutral-450 font-mono text-[9px] p-5 rounded-xl border border-neutral-850 leading-normal overflow-x-auto whitespace-pre no-scrollbar">
{` +-------------------------------------------------------------------------------+
 |                              TRUEVA DATA HIGHWAY                              |
 +-------------------------------------------------------------------------------+
 
   [University SIS Node]
            |
            v  (SHA-256 Hashing & ECDSA Private Key Stamp)
   [Consensus Proposer Node]
            |
            +------------> [BFT Voting Queue] (Consensus Quorum Phase)
                                   |
            +----------------------+----------------------+
            |                      |                      |
            v                      v                      v
     [Validator Node 1]     [Validator Node 2]     [Validator Node 3]
            |                      |                      |
            +----------------------+----------------------+ (Commit Block blk-4821)
                                   |
                                   v
             [Smart Contract Proof Registry (TCR)]
                                   |
            +----------------------+----------------------+ (Sync Block State)
            |                      |                      |
            v                      v                      v
     [RPC Query Node A]     [RPC Query Node B]     [RPC Query Node C]
            ^                      ^                      ^
            +----------------------+----------------------+
                                   |
                                   v  (Logarithmic Merkle Path Check)
                       [Employer Auditor Gateway]`}
            </div>
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

              <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[11px] text-neutral-450 leading-relaxed border border-neutral-800">
                <div className="text-neutral-500 border-b border-neutral-800 pb-2 mb-2 uppercase tracking-wider text-[9px] font-bold">
                  trueva_cert_anchor.sh
                </div>
                <pre className="overflow-x-auto whitespace-pre no-scrollbar">
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
              
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-6 font-medium">
                Before a block is appended to the ledger, validator nodes execute consensus verification. Each validator audits the proposed state block against registered keys.
              </p>

              <ul className="space-y-3 text-xs md:text-sm text-neutral-600 font-medium list-disc list-inside mb-8">
                <li><strong className="text-neutral-850">Cryptographic Identity:</strong> Validators check that the proposed root signature matches the authorized issuer public key registered in the Smart Contract.</li>
                <li><strong className="text-neutral-850">Byzantine Fault Tolerance:</strong> If any validator node attempts to broadcast a block containing tampered hashes, the consensus protocol fails signature checks, rejects the block proposal, and isolates the offending node.</li>
              </ul>

              {/* BFT Consensus state matrix table */}
              <div className="border-t border-neutral-100 pt-6">
                <h4 className="text-xs font-bold text-neutral-850 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <FileSpreadsheet size={14} className="text-accent" />
                  BFT Consensus Quorum Threshold Matrix
                </h4>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse text-[11px] font-semibold text-neutral-600">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-900 font-bold text-[9px] uppercase">
                        <th className="p-2.5">Total Nodes (N)</th>
                        <th className="p-2.5">Tolerated Failures (f)</th>
                        <th className="p-2.5">Required Quorum (Q)</th>
                        <th className="p-2.5">Network Safety Uptime</th>
                        <th className="p-2.5">Liveness Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-mono">
                      <tr>
                        <td className="p-2.5">4 Nodes</td>
                        <td className="p-2.5">1 Byzantine Fault</td>
                        <td className="p-2.5">3 Validators (75%)</td>
                        <td className="p-2.5 text-status-green">SECURE</td>
                        <td className="p-2.5 text-status-green">ACTIVE</td>
                      </tr>
                      <tr>
                        <td className="p-2.5">6 Nodes</td>
                        <td className="p-2.5">1 Byzantine Fault</td>
                        <td className="p-2.5">5 Validators (83%)</td>
                        <td className="p-2.5 text-status-green">SECURE</td>
                        <td className="p-2.5 text-status-green">ACTIVE</td>
                      </tr>
                      <tr>
                        <td className="p-2.5">7 Nodes</td>
                        <td className="p-2.5">2 Byzantine Faults</td>
                        <td className="p-2.5">5 Validators (71%)</td>
                        <td className="p-2.5 text-status-green">SECURE</td>
                        <td className="p-2.5 text-status-green">ACTIVE</td>
                      </tr>
                      <tr>
                        <td className="p-2.5">10 Nodes</td>
                        <td className="p-2.5">3 Byzantine Faults</td>
                        <td className="p-2.5">7 Validators (70%)</td>
                        <td className="p-2.5 text-status-green">SECURE</td>
                        <td className="p-2.5 text-status-green">ACTIVE</td>
                      </tr>
                      <tr className="bg-red-50/30 text-status-red">
                        <td className="p-2.5">3 Nodes</td>
                        <td className="p-2.5">1 Byzantine Fault</td>
                        <td className="p-2.5">-- (Insolvent)</td>
                        <td className="p-2.5 font-bold">COMPROMISED</td>
                        <td className="p-2.5 font-bold">HALTED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <span className="block text-[9px] text-neutral-400 font-medium leading-relaxed mt-2.5 font-sans">
                  The quorum threshold equation is derived from Practical Byzantine Fault Tolerance rules where $N \ge 3f + 1$ to preserve safety and liveness under asynchronous packet delay conflicts.
                </span>
              </div>
            </div>

            {/* Section 3: Smart Contract Core Pathways */}
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Lock size={16} />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">
                  3. Smart Contract Proof Registry (Solidity Spec)
                </h2>
              </div>
              
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-6 font-medium">
                The smart contract deployed on the Trueva Proof-of-Authority ledger registers Merkle roots, manages authorized institutional public signing keys, and registers credential revocation status updates.
              </p>

              <div className="bg-neutral-900 rounded-xl p-4 font-mono text-[11px] text-neutral-450 leading-relaxed border border-neutral-800">
                <div className="text-neutral-500 border-b border-neutral-800 pb-2 mb-2 uppercase tracking-wider text-[9px] font-bold">
                  TruevaRegistry.sol (Registry Contract Blueprint)
                </div>
                <pre className="overflow-x-auto whitespace-pre no-scrollbar">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TruevaRegistry {
    address public owner;
    
    // Mapping of authorized educational issuer accounts
    mapping(address => bool) public authorizedIssuers;
    
    // Mapping of committed block Merkle root hashes
    mapping(bytes32 => bool) public committedRoots;
    
    // Mapping of revoked certificate leaf hashes
    mapping(bytes32 => bool) public revokedCredentials;

    event RootAnchored(bytes32 indexed root, address indexed issuer);
    event CredentialRevoked(bytes32 indexed leafHash, address indexed issuer);

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "Auth Error: Sender not registered");
        _;
    }

    // 1. Commit new batch Merkle Root
    function anchorRoot(bytes32 _root) external onlyIssuer {
        committedRoots[_root] = true;
        emit RootAnchored(_root, msg.sender);
    }

    // 2. Publish revocation proof of compromised or altered diploma
    function revokeCredential(bytes32 _leafHash) external onlyIssuer {
        revokedCredentials[_leafHash] = true;
        emit CredentialRevoked(_leafHash, msg.sender);
    }

    // 3. Verify Merkle Path inclusion proof
    function verifyProof(
        bytes32 _leaf,
        bytes32[] calldata _proof,
        bytes32 _root
    ) public view returns (bool) {
        require(committedRoots[_root], "Verify Error: Root hash not committed");
        require(!revokedCredentials[_leaf], "Verify Error: Credential has been revoked");
        
        bytes32 computedHash = _leaf;
        for (uint256 i = 0; i < _proof.length; i++) {
            bytes32 proofElement = _proof[i];
            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        return computedHash == _root;
    }
}`}
                </pre>
              </div>
            </div>

            {/* Section 4: High Availability Statistics */}
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Server size={16} />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">
                  4. Verification Gateway API
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
