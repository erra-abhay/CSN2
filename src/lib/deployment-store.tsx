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
  { id: "vm-0", status: "healthy-old", version: "v128", ip: "10.0.0.4" },
  { id: "vm-1", status: "healthy-old", version: "v128", ip: "10.0.0.5" },
  { id: "vm-2", status: "healthy-old", version: "v128", ip: "10.0.0.6" },
  { id: "vm-3", status: "healthy-old", version: "v128", ip: "10.0.0.7" },
  { id: "vm-4", status: "healthy-old", version: "v128", ip: "10.0.0.8" },
  { id: "vm-5", status: "healthy-old", version: "v128", ip: "10.0.0.9" },
];

const DeploymentContext = createContext<DeploymentContextProps | undefined>(undefined);

export function DeploymentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DeploymentState>({
    status: "idle",
    activeVersion: "v128",
    targetVersion: "v128",
    instances: initialInstances,
    logs: [
      "[08:00:00] [System] Fleet initialized. Running version v128.",
      "[08:00:01] [Traefik] Traefik routing 100% traffic to v128 scale set.",
      "[08:00:02] [HealthCheck] All 6 VM instances report healthy. Ready.",
    ],
    activeScenario: null,
    hostname: "detecting...",
    stats: {
      successRate: "100%",
      avgPromoTime: "41s",
      manualRollbacks: 0,
      currentUptime: "99.998%",
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
      targetVersion: "v129",
      activeScenario: "promotion",
      instances: prev.instances.map(inst => ({ ...inst, status: "healthy-old", version: "v128" })),
      logs: [`[${new Date().toLocaleTimeString("en-US", { hour12: false })}] [Pipeline] Initializing rollout #129...`],
    }));

    let step = 0;
    const runSimulation = () => {
      step++;
      if (step === 1) {
        addLog("[Registry] Building Docker image for target version v129...");
        timerRef.current = setTimeout(runSimulation, 2000);
      } else if (step === 2) {
        addLog("[Registry] Docker build complete. Image size: 138MB.");
        addLog("[Registry] Pushing image tag: acadhub-api:v129-staging");
        setState(prev => ({ ...prev, status: "verifying" }));
        timerRef.current = setTimeout(runSimulation, 2500);
      } else if (step === 3) {
        addLog("[HealthCheck] Gated test: checking v129-staging on isolated container...");
        addLog("[HealthCheck] Verification successful. Response code: 200 OK.");
        addLog("[Registry] Promoting tag: acadhub-api:v129-staging -> acadhub-api:v129-production");
        timerRef.current = setTimeout(runSimulation, 2000);
      } else if (step === 4) {
        addLog("[Pipeline] Rolling fleet deployment initiated. Recycling 6 VM instances...");
        setState(prev => ({ ...prev, status: "rolling" }));
        // Start recycling VMs one by one
        recycleVM(0);
      }
    };

    const recycleVM = (index: number) => {
      if (index >= 6) {
        // Fleet rolled! Now swap traffic
        addLog("[Pipeline] All 6 VM instances recycled successfully with version v129-production.");
        setState(prev => ({ ...prev, status: "swapping" }));
        timerRef.current = setTimeout(() => {
          addLog("[Traefik] Reconfiguring load balancer routing rules...");
          addLog("[Traefik] Swapping traffic split: v128 (0%) -> v129 (100%).");
          addLog("[Traefik] Hot-swap completed without dropped requests.");
          
          setState(prev => ({
            ...prev,
            status: "completed",
            activeVersion: "v129",
            stats: {
              ...prev.stats,
              successRate: "100%",
              avgPromoTime: "39s",
            }
          }));
          addLog("[System] Rollout v129-production fully live. Fleet healthy.");
        }, 2000);
        return;
      }

      // Transition VM to draining
      setState(prev => {
        const newInst = [...prev.instances];
        newInst[index] = { ...newInst[index], status: "draining" };
        return { ...prev, instances: newInst };
      });
      addLog(`[VM-Set] Draining active traffic connections from vm-${index}...`);

      timerRef.current = setTimeout(() => {
        // Transition VM to creating
        setState(prev => {
          const newInst = [...prev.instances];
          newInst[index] = { ...newInst[index], status: "creating", version: "v129" };
          return { ...prev, instances: newInst };
        });
        addLog(`[VM-Set] Re-provisioning vm-${index} with image tag v129-production...`);

        timerRef.current = setTimeout(() => {
          // Transition VM to healthy-new
          setState(prev => {
            const newInst = [...prev.instances];
            newInst[index] = { ...newInst[index], status: "healthy-new" };
            return { ...prev, instances: newInst };
          });
          addLog(`[HealthCheck] vm-${index} reporting healthy on v129-production.`);
          
          // Move to next VM after a small delay
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
      logs: [`[${new Date().toLocaleTimeString("en-US", { hour12: false })}] [AutoScaler] High load alert: CPU utilization > 82% on average.`],
    }));

    let step = 0;
    const runSimulation = () => {
      step++;
      if (step === 1) {
        addLog("[AutoScaler] Auto-scale rule triggered: Provisioning 2 additional VM instances...");
        setState(prev => ({
          ...prev,
          instances: [
            ...prev.instances,
            { id: "vm-6", status: "creating", version: prev.activeVersion, ip: "10.0.0.10" },
            { id: "vm-7", status: "creating", version: prev.activeVersion, ip: "10.0.0.11" },
          ]
        }));
        timerRef.current = setTimeout(runSimulation, 2000);
      } else if (step === 2) {
        addLog("[VM-Set] VM instances vm-6 and vm-7 provisioned successfully.");
        addLog("[HealthCheck] Verifying vm-6 health checks...");
        addLog("[HealthCheck] Verifying vm-7 health checks...");
        timerRef.current = setTimeout(runSimulation, 2000);
      } else if (step === 3) {
        setState(prev => ({
          ...prev,
          instances: prev.instances.map(inst => 
            inst.id === "vm-6" || inst.id === "vm-7" ? { ...inst, status: prev.activeVersion === "v128" ? "healthy-old" : "healthy-new" } : inst
          )
        }));
        addLog("[HealthCheck] Both instances healthy. Attaching to Traefik pool.");
        addLog("[Traefik] Load balancer pool updated: 8 instances active. Traffic redistributed.");
        addLog("[AutoScaler] Scale out complete. Average CPU dropped to 48%.");
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
      targetVersion: "v128",
      activeScenario: "rollback",
      logs: [`[${new Date().toLocaleTimeString("en-US", { hour12: false })}] [Pipeline] Rollback drill initiated. Reverting fleet to v128...`],
    }));

    let step = 0;
    const runSimulation = () => {
      step++;
      if (step === 1) {
        addLog("[HealthCheck] Gated test: Health check failure simulation triggered on v129.");
        addLog("[Pipeline] CRITICAL: Automatic rollback threshold exceeded. Reverting traffic split...");
        timerRef.current = setTimeout(runSimulation, 2000);
      } else if (step === 2) {
        addLog("[Traefik] Reconfiguring load balancer routing rules...");
        addLog("[Traefik] Swapping traffic split: v129 (0%) -> v128 (100%).");
        addLog("[Traefik] Traffic hot-swapped back to stable v128 fleet.");
        setState(prev => ({ ...prev, status: "swapping" }));
        timerRef.current = setTimeout(runSimulation, 1500);
      } else if (step === 3) {
        addLog("[Pipeline] Restoring VM instances configuration to v128-production...");
        setState(prev => ({
          ...prev,
          status: "rolling",
          instances: prev.instances.map(inst => 
            inst.id.startsWith("vm") ? { ...inst, status: "creating", version: "v128" } : inst
          )
        }));
        timerRef.current = setTimeout(runSimulation, 2500);
      } else if (step === 4) {
        setState(prev => ({
          ...prev,
          status: "rolled-back",
          activeVersion: "v128",
          instances: prev.instances.filter(inst => inst.id !== "vm-6" && inst.id !== "vm-7").map(inst => ({
            ...inst,
            status: "healthy-old",
            version: "v128"
          })),
          stats: {
            ...prev.stats,
            manualRollbacks: prev.stats.manualRollbacks + 1
          }
        }));
        addLog("[System] Rollback completed. Stable version v128-production restored on all 6 primary instances.");
      }
    };

    timerRef.current = setTimeout(runSimulation, 1000);
  };

  const resetSimulation = () => {
    clearTimers();
    setState((prev) => ({
      status: "idle",
      activeVersion: "v128",
      targetVersion: "v128",
      instances: initialInstances,
      logs: [
        "[08:00:00] [System] Fleet initialized. Running version v128.",
        "[08:00:01] [Traefik] Traefik routing 100% traffic to v128 scale set.",
        "[08:00:02] [HealthCheck] All 6 VM instances report healthy. Ready.",
      ],
      activeScenario: null,
      hostname: prev.hostname,
      stats: {
        successRate: "100%",
        avgPromoTime: "41s",
        manualRollbacks: 0,
        currentUptime: "99.998%",
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
