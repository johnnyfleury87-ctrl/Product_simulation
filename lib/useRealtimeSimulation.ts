import { useEffect, useCallback, useRef } from "react";
import { RecallSimulation } from "./simulateRecall";

export interface RealtimeOptions {
  enabled: boolean;
  intervalMs?: number;
  confirmationProbability?: number; // 0-1 (normal)
  worstCaseProbability?: number; // 0-1 (worst case)
}

/**
 * Hook pour simuler les confirmations clients en temps réel
 * Met à jour automatiquement la liste des clients à confirmation en attente
 */
export function useRealtimeSimulation(
  recall: RecallSimulation | null,
  options: RealtimeOptions,
  onUpdate: (updatedRecall: RecallSimulation) => void,
) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef<number>(0);

  const updateRandomClientConfirmations = useCallback(() => {
    if (!recall) return;

    // Copier la simulation
    const updated = { ...recall };
    updated.impacts = [...recall.impacts];

    // Trouver les clients en attente
    const pendingIndices = updated.impacts
      .map((impact, idx) => (impact.confirmed_status === "pending" ? idx : -1))
      .filter((idx) => idx !== -1);

    if (pendingIndices.length === 0) return; // Tous confirmés

    // Sélectionner 1-3 clients aléatoires à confirmer
    const randomCount = Math.floor(Math.random() * 3) + 1;
    const toConfirm = pendingIndices.slice(0, randomCount);

    // Déterminer la probabilité de confirmation
    const iWorstCase = Math.random() < (options.worstCaseProbability || 0.1);
    const confirmProb = iWorstCase
      ? options.worstCaseProbability || 0.1
      : options.confirmationProbability || 0.3;

    toConfirm.forEach((idx) => {
      if (Math.random() < confirmProb) {
        const impact = updated.impacts[idx];
        updated.impacts[idx] = {
          ...impact,
          confirmed_status: "confirmed",
          client_confirmed: true,
          timestamp_confirmed: new Date().toISOString(),
        };
      }
    });

    lastUpdateRef.current = Date.now();
    onUpdate(updated);
  }, [recall, options, onUpdate]);

  useEffect(() => {
    if (!options.enabled || !recall) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const interval = options.intervalMs || 2000;
    intervalRef.current = setInterval(updateRandomClientConfirmations, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [options, recall, updateRandomClientConfirmations]);
}

/**
 * Utilitaire pour calculer les statistiques en temps réel
 */
export function calculateLiveStats(recall: RecallSimulation | null) {
  if (!recall) {
    return {
      total: 0,
      confirmed: 0,
      pending: 0,
      confirmationRate: 0,
    };
  }

  const confirmed = recall.impacts.filter((i) => i.confirmed_status === "confirmed").length;
  const total = recall.impacts.length;
  const pending = total - confirmed;
  const confirmationRate = total > 0 ? (confirmed / total) * 100 : 0;

  return {
    total,
    confirmed,
    pending,
    confirmationRate: Math.round(confirmationRate),
  };
}

/**
 * Utilitaire pour obtenir les clients par centre en temps réel
 */
export function getImpactsByCenter(recall: RecallSimulation | null) {
  if (!recall) return {};

  const byCenter: Record<
    string,
    { confirmed: number; pending: number; total: number }
  > = {};

  recall.impacts.forEach((impact) => {
    const centerId = impact.distribution_center_id;
    if (!byCenter[centerId]) {
      byCenter[centerId] = { confirmed: 0, pending: 0, total: 0 };
    }

    byCenter[centerId].total += 1;
    if (impact.confirmed_status === "confirmed") {
      byCenter[centerId].confirmed += 1;
    } else {
      byCenter[centerId].pending += 1;
    }
  });

  return byCenter;
}
