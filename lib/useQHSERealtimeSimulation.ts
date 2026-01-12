/**
 * Hook pour simulation temps réel QHSE
 */

import { useEffect } from "react";
import { QHSESimulation, simulateProgressionStep } from "@/lib/simulateQHSERecall";

export interface RealtimeConfig {
  enabled: boolean;
  intervalMs?: number;
  depotConfirmationProb?: number;
  transitConfirmationProb?: number;
  clientConfirmationProb?: number;
}

export function useQHSERealtimeSimulation(
  simulation: QHSESimulation | null,
  config: RealtimeConfig,
  onUpdate: (sim: QHSESimulation) => void,
) {
  useEffect(() => {
    if (!simulation || !config.enabled) return;

    const interval = setInterval(() => {
      onUpdate(
        simulateProgressionStep(simulation, {
          depotConfirmationProb: config.depotConfirmationProb,
          transitConfirmationProb: config.transitConfirmationProb,
          clientConfirmationProb: config.clientConfirmationProb,
        }),
      );
    }, config.intervalMs || 2000);

    return () => clearInterval(interval);
  }, [simulation, config, onUpdate]);
}

/**
 * Calcul des stats en direct pour affichage
 */
export interface LiveStats {
  total: number;
  confirmed: number;
  pending: number;
  confirmationRate: number;
  depotConfirmed: number;
  transitConfirmed: number;
  clientConfirmed: number;
}

export function calculateLiveQHSEStats(simulation: QHSESimulation | null): LiveStats {
  if (!simulation) {
    return {
      total: 0,
      confirmed: 0,
      pending: 0,
      confirmationRate: 0,
      depotConfirmed: 0,
      transitConfirmed: 0,
      clientConfirmed: 0,
    };
  }

  const confirmed = simulation.impacts.filter((i) => i.confirmation_status === "confirmed");
  const depotConfirmed = confirmed.filter((i) => i.stock_status === "DEPOT_STOCK").length;
  const transitConfirmed = confirmed.filter((i) => i.stock_status === "IN_TRANSIT").length;
  const clientConfirmed = confirmed.filter((i) => i.stock_status === "DELIVERED").length;

  return {
    total: simulation.impacts.length,
    confirmed: confirmed.length,
    pending: simulation.impacts.length - confirmed.length,
    confirmationRate: simulation.impacts.length > 0
      ? Math.round((confirmed.length / simulation.impacts.length) * 100)
      : 0,
    depotConfirmed,
    transitConfirmed,
    clientConfirmed,
  };
}

/**
 * Calcul des impacts par centre
 */
export interface CenterStats {
  confirmed: number;
  pending: number;
  total: number;
}

export function getQHSEImpactsByCenter(
  simulation: QHSESimulation | null,
): Record<string, CenterStats> {
  if (!simulation) return {};

  const centers: Record<string, CenterStats> = {};

  simulation.impacts.forEach((impact) => {
    if (!centers[impact.distribution_center_id]) {
      centers[impact.distribution_center_id] = { confirmed: 0, pending: 0, total: 0 };
    }

    centers[impact.distribution_center_id].total++;
    if (impact.confirmation_status === "confirmed") {
      centers[impact.distribution_center_id].confirmed++;
    } else {
      centers[impact.distribution_center_id].pending++;
    }
  });

  return centers;
}

/**
 * Calcul des impacts par statut
 */
export interface StatusStats {
  total: number;
  confirmed: number;
  pending: number;
}

export function getQHSEImpactsByStatus(
  simulation: QHSESimulation | null,
): Record<string, StatusStats> {
  if (!simulation) return {};

  const statuses: Record<string, StatusStats> = {
    DEPOT_STOCK: { total: 0, confirmed: 0, pending: 0 },
    IN_TRANSIT: { total: 0, confirmed: 0, pending: 0 },
    DELIVERED: { total: 0, confirmed: 0, pending: 0 },
  };

  simulation.impacts.forEach((impact) => {
    const statusStr = impact.stock_status;
    statuses[statusStr].total++;

    if (impact.confirmation_status === "confirmed") {
      statuses[statusStr].confirmed++;
    } else {
      statuses[statusStr].pending++;
    }
  });

  return statuses;
}
