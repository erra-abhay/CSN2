"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export type DeployStatus =
  | "idle"
  | "building"
  | "verifying"
  | "rolling"
  | "swapping"
  | "completed"
  | "rolling-back"
  | "rolled-back";

export interface VMInstance {
  id: string;
  status: "healthy-old" | "draining" | "creating" | "healthy-new" | "inactive";
  version: string;
  ip: string;
}

export interface DeploymentState {
  status: DeployStatus;
  activeVersion: string;
  targetVersion: string;
  instances: VMInstance[];
  logs: string[];
  activeScenario: "promotion" | "scaleout" | "rollback" | null;
  hostname: string;
  stats: {
    successRate: string;
    avgPromoTime: string;
    manualRollbacks: number;
    currentUptime: string;
  };
}

interface DeploymentContextProps {
  state: DeploymentState;
  triggerPromotion: () => void;
  triggerScaleOut: () => void;
  triggerRollback: () => void;
  resetSimulation: () => void;
}

const initialInstances: VMInstance[] = [
  { id: "node-0", status: "healthy-old", version: "blk-4820", ip: "10.0.8.21" },
  { id: "node-1", status: "healthy-old", version: "blk-4820", ip: "10.0.8.22" },
  { id: "node-2", status: "healthy-old", version: "blk-4820", ip: "10.0.8.23" },
  { id: "node-3", status: "healthy-old", version: "blk-4820", ip: "10.0.8.24" },
  { id: "node-4", status: "healthy-old", version: "blk-4820", ip: "10.0.8.25" },
  { id: "node-5", status: "healthy-old", version: "blk-4820", ip: "10.0.8.26" },
];

const DeploymentContext = createContext<DeploymentContextProps | undefined>(undefined);

export function DeploymentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DeploymentState>({
    status: "idle",
    activeVersion: "blk-4820",
    targetVersion: "blk-4820",
    instances: initialInstances,
    logs: [
      "[08:00:00] [Chain] Network initialized. Current block: blk-4820.",
      "[08:00:01] [Consensus] Proof-of-Authority (PoA) consensus active. 6 validators online.",
      "[08:00:02] [Registry] TCR Contract verified. Standing by for certificate batches.",
    ],
    activeScenario: null,
    hostname: "detecting...",
    stats: {
      successRate: "100%",
      avgPromoTime: "120ms",
      manualRollbacks: 0,
      currentUptime: "99.999%",
    },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    // Fetch hostname from the dynamic API endpoint
    fetch("/api/hostname")
      .then((res) => res.json())
      .then((data) => {
        setState((prev) => ({ ...prev, hostname: data.hostname || "unknown" }));
      })
      .catch(() => {
        setState((prev) => ({ ...prev, hostname: "unknown" }));
      });

    return () => clearTimers();
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setState((prev) => ({
      ...prev,
      logs: [...prev.logs, `[${timestamp}] ${message}`],
    }));
  };

  const triggerPromotion = () => {
    if (state.status !== "idle" && state.status !== "completed" && state.status !== "rolled-back") return;
    clearTimers();

    setState((prev) => ({
      ...prev,
      status: "building",
      targetVersion: "blk-4821",
      activeScenario: "promotion",
      instances: prev.instances.map(inst => ({ ...inst, status: "healthy-old", version: "blk-4820" })),
      logs: [`[${new Date().toLocaleTimeString("en-US", { hour12: false })}] [Registry] Initializing certificate batch anchoring #4821...`],
    }));

    let step = 0;
    const runSimulation = () => {
      step++;
      if (step === 1) {
        addLog("[HashEngine] Generating SHA-256 hashes for 42 new certificates...");
        timerRef.current = setTimeout(runSimulation, 2000);
      } else if (step === 2) {
        addLog("[HashEngine] Built Merkle Tree. Merkle Root: 0x5d9b62f183ae439ca25...");
        addLog("[Registry] Generating Ed25519 signature from Trueva Issuer Authority key...");
        setState(prev => ({ ...prev, status: "verifying" }));
        timerRef.current = setTimeout(runSimulation, 2500);
      } else if (step === 3) {
        addLog("[Consensus] Gated pre-flight check: validating transaction payload structure...");
        addLog("[Consensus] Signature verified. State transition valid.");
        addLog("[Registry] Broadcasting block blk-4821 to validator network...");
        timerRef.current = setTimeout(runSimulation, 2000);
      } else if (step === 4) {
        addLog("[Consensus] Block propagation initiated. Syncing 6 validator nodes...");
        setState(prev => ({ ...prev, status: "rolling" }));
        // Start recycling/syncing nodes one by one
        recycleVM(0);
      }
    };

    const recycleVM = (index: number) => {
      if (index >= 6) {
        // Fleet rolled! Now swap traffic
        addLog("[Consensus] All 6 validator nodes successfully synchronized block blk-4821.");
        setState(prev => ({ ...prev, status: "swapping" }));
        timerRef.current = setTimeout(() => {
          addLog("[Gateway] Reconfiguring RPC load balancer routing rules...");
          addLog("[Gateway] Directing query traffic to block height blk-4821 registry.");
          addLog("[Gateway] State sync completed. 0 latency penalty.");
          
          setState(prev => ({
            ...prev,
            status: "completed",
            activeVersion: "blk-4821",
            stats: {
              ...prev.stats,
              successRate: "100%",
              avgPromoTime: "115ms",
            }
          }));
          addLog("[Chain] Block blk-4821 committed. 42 certificates live.");
        }, 2000);
        return;
      }

      // Transition node to syncing (draining)
      setState(prev => {
        const newInst = [...prev.instances];
        newInst[index] = { ...newInst[index], status: "draining" };
        return { ...prev, instances: newInst };
      });
      addLog(`[Network] Transitioning node-${index} to receiving mode...`);

      timerRef.current = setTimeout(() => {
        // Transition node to validating (creating)
        setState(prev => {
          const newInst = [...prev.instances];
          newInst[index] = { ...newInst[index], status: "creating", version: "blk-4821" };
          return { ...prev, instances: newInst };
        });
        addLog(`[Network] Propagating block metadata to node-${index}...`);

        timerRef.current = setTimeout(() => {
          // Transition node to synced (healthy-new)
          setState(prev => {
            const newInst = [...prev.instances];
            newInst[index] = { ...newInst[index], status: "healthy-new" };
            return { ...prev, instances: newInst };
          });
          addLog(`[Consensus] node-${index} verified and appended block blk-4821.`);
          
          // Move to next node after a small delay
          timerRef.current = setTimeout(() => recycleVM(index + 1), 800);
        }, 1200);
      }, 1000);
    };

    timerRef.current = setTimeout(runSimulation, 1000);
  };

  const triggerScaleOut = () => {
    if (state.status !== "idle" && state.status !== "completed" && state.status !== "rolled-back") return;
    clearTimers();

    setState((prev) => ({
      ...prev,
      activeScenario: "scaleout",
      logs: [`[${new Date().toLocaleTimeString("en-US", { hour12: false })}] [Gateway] Traffic Alert: Verification API query volume spiked > 4,200 reqs/sec.`],
    }));

    let step = 0;
    const runSimulation = () => {
      step++;
      if (step === 1) {
        addLog("[Gateway] Dynamic Scale Rule Triggered: Provisioning 2 additional verifier nodes...");
        setState(prev => ({
          ...prev,
          instances: [
            ...prev.instances,
            { id: "node-6", status: "creating", version: prev.activeVersion, ip: "10.0.8.27" },
            { id: "node-7", status: "creating", version: prev.activeVersion, ip: "10.0.8.28" },
          ]
        }));
        timerRef.current = setTimeout(runSimulation, 2000);
      } else if (step === 2) {
        addLog("[Network] Verifier nodes node-6 and node-7 successfully booted.");
        addLog("[Consensus] Syncing node-6 with active ledger block state...");
        addLog("[Consensus] Syncing node-7 with active ledger block state...");
        timerRef.current = setTimeout(runSimulation, 2000);
      } else if (step === 3) {
        setState(prev => ({
          ...prev,
          instances: prev.instances.map(inst => 
            inst.id === "node-6" || inst.id === "node-7" ? { ...inst, status: prev.activeVersion === "blk-4820" ? "healthy-old" : "healthy-new" } : inst
          )
        }));
        addLog("[Consensus] Both nodes synchronized. Attaching to RPC Gateway load balancer pool.");
        addLog("[Gateway] Gateway routing pool expanded. Traffic load balanced. Average query latency stabilized at 120ms.");
        setState(prev => ({ ...prev, activeScenario: null }));
      }
    };

    timerRef.current = setTimeout(runSimulation, 1000);
  };

  const triggerRollback = () => {
    clearTimers();

    setState((prev) => ({
      ...prev,
      status: "rolling-back",
      targetVersion: "blk-4820",
      activeScenario: "rollback",
      logs: [`[${new Date().toLocaleTimeString("en-US", { hour12: false })}] [Consensus] Consensus Audit Triggered. Reviewing block candidate...`],
    }));

    let step = 0;
    const runSimulation = () => {
      step++;
      if (step === 1) {
        addLog("[Consensus] Verifying state signature: validating transaction block payload...");
        addLog("[Consensus] CRITICAL: Invalid signature detected on validator node-3 (mismatched root hash).");
        timerRef.current = setTimeout(runSimulation, 2000);
      } else if (step === 2) {
        addLog("[Gateway] Alert: Fraudulent block proposal rejected. Isolating malicious transaction...");
        addLog("[Gateway] Reverting API routing registry back to stable block height blk-4820.");
        setState(prev => ({ ...prev, status: "swapping" }));
        timerRef.current = setTimeout(runSimulation, 1500);
      } else if (step === 3) {
        addLog("[Network] Restoring all validator node states to consensus height blk-4820...");
        setState(prev => ({
          ...prev,
          status: "rolling",
          instances: prev.instances.map(inst => 
            inst.id.startsWith("node") ? { ...inst, status: "creating", version: "blk-4820" } : inst
          )
        }));
        timerRef.current = setTimeout(runSimulation, 2500);
      } else if (step === 4) {
        setState(prev => ({
          ...prev,
          status: "rolled-back",
          activeVersion: "blk-4820",
          instances: prev.instances.filter(inst => inst.id !== "node-6" && inst.id !== "node-7").map(inst => ({
            ...inst,
            status: "healthy-old",
            version: "blk-4820"
          })),
          stats: {
            ...prev.stats,
            manualRollbacks: prev.stats.manualRollbacks + 1
          }
        }));
        addLog("[Chain] Consensus restored. Stable ledger block height blk-4820 successfully synced across all nodes.");
      }
    };

    timerRef.current = setTimeout(runSimulation, 1000);
  };

  const resetSimulation = () => {
    clearTimers();
    setState((prev) => ({
      status: "idle",
      activeVersion: "blk-4820",
      targetVersion: "blk-4820",
      instances: initialInstances,
      logs: [
        "[08:00:00] [Chain] Network initialized. Current block: blk-4820.",
        "[08:00:01] [Consensus] Proof-of-Authority (PoA) consensus active. 6 validators online.",
        "[08:00:02] [Registry] TCR Contract verified. Standing by for certificate batches.",
      ],
      activeScenario: null,
      hostname: prev.hostname,
      stats: {
        successRate: "100%",
        avgPromoTime: "120ms",
        manualRollbacks: 0,
        currentUptime: "99.999%",
      },
    }));
  };

  return (
    <DeploymentContext.Provider
      value={{
        state,
        triggerPromotion,
        triggerScaleOut,
        triggerRollback,
        resetSimulation,
      }}
    >
      {children}
    </DeploymentContext.Provider>
  );
}

export function useDeployment() {
  const context = useContext(DeploymentContext);
  if (!context) {
    throw new Error("useDeployment must be used within a DeploymentProvider");
  }
  return context;
}
