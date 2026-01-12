/**
 * Module de simulation QHSE avancé
 * Support RETRAIT vs RAPPEL avec fenêtre DLC
 * Statuts: DEPOT_STOCK, IN_TRANSIT, DELIVERED
 */

import { DISTRIBUTION_CENTERS, DEMO_CUSTOMERS, getDistributionCenterById } from "@/data/demoCatalog";
import { getMotifByCode, getUrgencyMultiplier } from "@/data/motifs";

export type OperationType = "RETRAIT" | "RAPPEL";
export type StockStatus = "DEPOT_STOCK" | "IN_TRANSIT" | "DELIVERED";
export type Severity = "LOW" | "MEDIUM" | "HIGH";
export type ConfirmationStatus = "pending" | "confirmed";
export type ScenarioType = "NORMAL" | "WORST_CASE" | "HIGH_TRANSIT" | "MOSTLY_DELIVERED" | "RANDOM";

/**
 * Impact d'une opération QHSE sur une unité/lot
 */
export interface QHSEImpact {
  id: string;
  operation_type: OperationType;
  stock_status: StockStatus;
  
  // Infos produit/lot
  product_id: string;
  dlc: string;
  lot_code: string;
  qty_units: number;
  
  // Localisation
  distribution_center_id: string;
  location_details: string; // adresse dépôt / transporteur / client
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  
  // État confirmation
  confirmation_status: ConfirmationStatus;
  confirmed_by?: string;
  timestamp_confirmed?: string;
  
  // Notifications
  sms_sent: boolean;
  email_sent: boolean;
  
  // Timestamps
  timestamp_created: string;
  timestamp_notification?: string;
}

/**
 * Simulation complète d'une opération
 */
export interface QHSESimulation {
  id: string;
  operation_type: OperationType;
  scenario: ScenarioType;
  severity: Severity;
  
  // Motif
  motif_code: string;
  motif_label: string;
  motif_details?: string; // Si motif = "Autre"
  
  // Produit & DLC
  product_id: string;
  product_name: string;
  dlc_reference: string;
  dlc_window_minus_days: number;
  dlc_window_plus_days: number;
  
  // Calculs DLC
  dlc_min: string; // Date min impactée
  dlc_max: string; // Date max impactée
  total_units_impacted: number;
  total_units_out_of_window: number;
  
  // Répartition
  impacts: QHSEImpact[];
  distribution_by_status: Record<StockStatus, number>;
  distribution_by_center: Record<string, number>;
  
  // État
  central_notified: boolean;
  timestamp_created: string;
  timestamp_central_notified?: string;
}

/**
 * Configuration pour simuler une opération
 */
export interface QHSESimulationConfig {
  operation_type: OperationType;
  scenario: ScenarioType;
  severity: Severity;
  motif_code: string;
  motif_label: string;
  motif_details?: string;
  product_id: string;
  product_name: string;
  dlc_reference: string;
  dlc_window_minus_days: number;
  dlc_window_plus_days: number;
}

/**
 * Génère une simulation QHSE complète
 */
export function generateQHSESimulation(config: QHSESimulationConfig): QHSESimulation {
  const now = new Date().toISOString();
  const simId = `QHSE-${Date.now()}`;

  // Calculer les bornes de la fenêtre DLC
  const dlcRefDate = new Date(config.dlc_reference);
  const dlcMin = new Date(dlcRefDate);
  dlcMin.setDate(dlcMin.getDate() - config.dlc_window_minus_days);
  const dlcMax = new Date(dlcRefDate);
  dlcMax.setDate(dlcMax.getDate() + config.dlc_window_plus_days);

  const dlcMinStr = dlcMin.toISOString().split("T")[0];
  const dlcMaxStr = dlcMax.toISOString().split("T")[0];

  // Calculer les unités totales
  const totalUnits = calculateTotalUnitsForSeverity(config.severity);
  
  // Répartition par statut (selon type opération + scénario)
  const distributionByStatus = getDistributionByStatus(
    config.operation_type,
    config.scenario,
    config.severity,
  );

  // Générer les impacts
  const impacts = generateQHSEImpacts(
    simId,
    config.operation_type,
    config.product_id,
    config.dlc_reference,
    dlcMinStr,
    dlcMaxStr,
    totalUnits,
    distributionByStatus,
  );

  const totalUnitsInWindow = impacts.filter(
    (i) => i.dlc >= dlcMinStr && i.dlc <= dlcMaxStr
  ).length * 10; // Approximation: 10 unités par impact

  // Répartition par centre
  const distributionByCenter = distributeByCenter(impacts);

  return {
    id: simId,
    operation_type: config.operation_type,
    scenario: config.scenario,
    severity: config.severity,
    motif_code: config.motif_code,
    motif_label: config.motif_label,
    motif_details: config.motif_details,
    product_id: config.product_id,
    product_name: config.product_name,
    dlc_reference: config.dlc_reference,
    dlc_window_minus_days: config.dlc_window_minus_days,
    dlc_window_plus_days: config.dlc_window_plus_days,
    dlc_min: dlcMinStr,
    dlc_max: dlcMaxStr,
    total_units_impacted: totalUnits,
    total_units_out_of_window: totalUnits - totalUnitsInWindow,
    impacts,
    distribution_by_status: distributionByStatus,
    distribution_by_center: distributionByCenter,
    central_notified: false,
    timestamp_created: now,
  };
}

/**
 * Calcule les unités totales selon la sévérité
 */
function calculateTotalUnitsForSeverity(severity: Severity): number {
  const ranges = {
    LOW: { min: 500, max: 2000 },
    MEDIUM: { min: 2000, max: 8000 },
    HIGH: { min: 8000, max: 25000 },
  };
  const range = ranges[severity];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

/**
 * Détermine la répartition par statut (DEPOT_STOCK / IN_TRANSIT / DELIVERED)
 */
function getDistributionByStatus(
  operationType: OperationType,
  scenario: ScenarioType,
  severity: Severity,
): Record<StockStatus, number> {
  let distribution: Record<StockStatus, number> = {
    DEPOT_STOCK: 0,
    IN_TRANSIT: 0,
    DELIVERED: 0,
  };

  if (operationType === "RETRAIT") {
    // RETRAIT: uniquement DEPOT_STOCK
    distribution.DEPOT_STOCK = 100;
  } else {
    // RAPPEL: selon scénario
    switch (scenario) {
      case "NORMAL":
        distribution = {
          DEPOT_STOCK: 40,
          IN_TRANSIT: 30,
          DELIVERED: 30,
        };
        break;
      case "WORST_CASE":
        // Plus de livré
        distribution = {
          DEPOT_STOCK: 15,
          IN_TRANSIT: 15,
          DELIVERED: 70,
        };
        break;
      case "HIGH_TRANSIT":
        distribution = {
          DEPOT_STOCK: 20,
          IN_TRANSIT: 70,
          DELIVERED: 10,
        };
        break;
      case "MOSTLY_DELIVERED":
        distribution = {
          DEPOT_STOCK: 5,
          IN_TRANSIT: 10,
          DELIVERED: 85,
        };
        break;
      case "RANDOM":
        const r1 = Math.floor(Math.random() * 60);
        const r2 = Math.floor(Math.random() * (60 - r1));
        distribution = {
          DEPOT_STOCK: r1,
          IN_TRANSIT: r2,
          DELIVERED: 100 - r1 - r2,
        };
        break;
    }
  }

  return distribution;
}

/**
 * Génère les impacts individuels
 */
function generateQHSEImpacts(
  simId: string,
  operationType: OperationType,
  productId: string,
  dlcReference: string,
  dlcMin: string,
  dlcMax: string,
  totalUnits: number,
  distributionByStatus: Record<StockStatus, number>,
): QHSEImpact[] {
  const impacts: QHSEImpact[] = [];
  const now = new Date().toISOString();

  // Nombre total d'impacts (1 impact = ~10 unités)
  const impactCount = Math.ceil(totalUnits / 10);

  // Créer les DLC possibles dans la fenêtre
  const dlcDates = generateDLCDates(dlcMin, dlcMax);

  for (let i = 0; i < impactCount; i++) {
    const statusKey = selectStatusByWeight(distributionByStatus);
    const status: StockStatus = statusKey as StockStatus;

    const center = selectRandomDistributionCenter();
    const dlc = dlcDates[Math.floor(Math.random() * dlcDates.length)];

    // Générer les détails de localisation selon le statut
    const { locationDetails, contactName, contactPhone, contactEmail } =
      generateLocationDetails(status, center);

    impacts.push({
      id: `IMPACT-${simId}-${i}`,
      operation_type: operationType,
      stock_status: status,
      product_id: productId,
      dlc,
      lot_code: `LOT-${dlc.replace(/-/g, "")}-${Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, "0")}`,
      qty_units: Math.floor(Math.random() * 50) + 10, // 10-60 unités
      distribution_center_id: center.id,
      location_details: locationDetails,
      contact_name: contactName,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      confirmation_status: "pending",
      sms_sent: false,
      email_sent: false,
      timestamp_created: now,
    });
  }

  return impacts;
}

/**
 * Génère une liste de dates DLC dans la fenêtre
 */
function generateDLCDates(dlcMin: string, dlcMax: string): string[] {
  const dates: string[] = [];
  const minDate = new Date(dlcMin);
  const maxDate = new Date(dlcMax);

  for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split("T")[0]);
  }

  return dates;
}

/**
 * Sélectionne un statut selon les poids
 */
function selectStatusByWeight(distribution: Record<StockStatus, number>): StockStatus {
  const keys = Object.keys(distribution) as StockStatus[];
  const values = keys.map((k) => distribution[k]);
  const total = values.reduce((a, b) => a + b, 0);
  const random = Math.random() * total;

  let cumulative = 0;
  for (let i = 0; i < keys.length; i++) {
    cumulative += values[i];
    if (random < cumulative) {
      return keys[i];
    }
  }

  return "DEPOT_STOCK";
}

/**
 * Sélectionne un centre de distribution aléatoire
 */
function selectRandomDistributionCenter() {
  return DISTRIBUTION_CENTERS[Math.floor(Math.random() * DISTRIBUTION_CENTERS.length)];
}

/**
 * Génère les détails de localisation selon le statut
 */
function generateLocationDetails(
  status: StockStatus,
  center: (typeof DISTRIBUTION_CENTERS)[0],
): {
  locationDetails: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
} {
  const now = new Date();

  if (status === "DEPOT_STOCK") {
    return {
      locationDetails: `${center.address}, ${center.postalCode} ${center.city}, Suisse`,
      contactName: `${center.name} - Dépôt`,
      contactPhone: center.phone,
    };
  } else if (status === "IN_TRANSIT") {
    // Simuler un transporteur fictif
    const transporters = [
      { name: "La Poste CH", phone: "+41 800 888 888" },
      { name: "DPD Suisse", phone: "+41 61 666 6666" },
      { name: "Hermes CH", phone: "+41 56 777 7777" },
    ];
    const transporter = transporters[Math.floor(Math.random() * transporters.length)];
    const shipmentId = `SHIP-${now.getTime().toString().slice(-8)}`;

    return {
      locationDetails: `En transit via ${transporter.name} (Expédition: ${shipmentId})`,
      contactName: transporter.name,
      contactPhone: transporter.phone,
    };
  } else {
    // DELIVERED
    const customer = DEMO_CUSTOMERS[Math.floor(Math.random() * DEMO_CUSTOMERS.length)];
    return {
      locationDetails: `Livré au client - ${customer.prenom} ${customer.nom}`,
      contactName: `${customer.prenom} ${customer.nom}`,
      contactPhone: customer.telephone,
      contactEmail: customer.email,
    };
  }
}

/**
 * Distribue les impacts par centre
 */
function distributeByCenter(
  impacts: QHSEImpact[],
): Record<string, number> {
  const distribution: Record<string, number> = {};
  DISTRIBUTION_CENTERS.forEach((dc) => {
    distribution[dc.id] = impacts.filter((i) => i.distribution_center_id === dc.id).length;
  });
  return distribution;
}

/**
 * Notifie les centrales
 */
export function notifyQHSECentrals(sim: QHSESimulation): QHSESimulation {
  return {
    ...sim,
    central_notified: true,
    timestamp_central_notified: new Date().toISOString(),
  };
}

/**
 * Confirme une impact spécifique
 */
export function confirmQHSEImpact(
  sim: QHSESimulation,
  impactId: string,
  confirmedBy: string = "system",
): QHSESimulation {
  return {
    ...sim,
    impacts: sim.impacts.map((i) =>
      i.id === impactId
        ? {
            ...i,
            confirmation_status: "confirmed",
            confirmed_by: confirmedBy,
            timestamp_confirmed: new Date().toISOString(),
          }
        : i,
    ),
  };
}

/**
 * Confirme tous les impacts d'un statut spécifique
 */
export function confirmAllQHSEImpactsByStatus(
  sim: QHSESimulation,
  status: StockStatus,
): QHSESimulation {
  return {
    ...sim,
    impacts: sim.impacts.map((i) =>
      i.stock_status === status
        ? {
            ...i,
            confirmation_status: "confirmed",
            confirmed_by: "batch_confirm",
            timestamp_confirmed: new Date().toISOString(),
          }
        : i,
    ),
  };
}

/**
 * Envoie les notifications (SMS/Email)
 */
export function sendQHSENotifications(sim: QHSESimulation): QHSESimulation {
  const now = new Date().toISOString();
  return {
    ...sim,
    impacts: sim.impacts.map((i) => ({
      ...i,
      sms_sent: true,
      email_sent: i.stock_status === "DELIVERED", // Email uniquement pour DELIVERED
      timestamp_notification: now,
    })),
  };
}

/**
 * Retourne les statistiques
 */
export interface QHSEStats {
  totalImpacts: number;
  impactsByStatus: Record<StockStatus, number>;
  confirmedCount: number;
  pendingCount: number;
  confirmationRate: number;
  smsNotificationsSent: number;
  emailNotificationsSent: number;
}

export function getQHSEStats(sim: QHSESimulation): QHSEStats {
  const impactsByStatus: Record<StockStatus, number> = {
    DEPOT_STOCK: 0,
    IN_TRANSIT: 0,
    DELIVERED: 0,
  };

  sim.impacts.forEach((i) => {
    impactsByStatus[i.stock_status]++;
  });

  const confirmed = sim.impacts.filter((i) => i.confirmation_status === "confirmed").length;
  const pending = sim.impacts.filter((i) => i.confirmation_status === "pending").length;
  const sms = sim.impacts.filter((i) => i.sms_sent).length;
  const email = sim.impacts.filter((i) => i.email_sent).length;

  return {
    totalImpacts: sim.impacts.length,
    impactsByStatus,
    confirmedCount: confirmed,
    pendingCount: pending,
    confirmationRate: sim.impacts.length > 0 ? Math.round((confirmed / sim.impacts.length) * 100) : 0,
    smsNotificationsSent: sms,
    emailNotificationsSent: email,
  };
}

/**
 * Simule une progression temps réel (confirmations progressives)
 */
export function simulateProgressionStep(sim: QHSESimulation, stepConfig?: {
  depotConfirmationProb?: number;
  transitConfirmationProb?: number;
  clientConfirmationProb?: number;
}): QHSESimulation {
  const config = {
    depotConfirmationProb: stepConfig?.depotConfirmationProb ?? 0.2,
    transitConfirmationProb: stepConfig?.transitConfirmationProb ?? 0.15,
    clientConfirmationProb: stepConfig?.clientConfirmationProb ?? 0.1,
  };

  return {
    ...sim,
    impacts: sim.impacts.map((i) => {
      if (i.confirmation_status === "confirmed") return i;

      let confirmProb = 0;
      if (i.stock_status === "DEPOT_STOCK") confirmProb = config.depotConfirmationProb;
      else if (i.stock_status === "IN_TRANSIT") confirmProb = config.transitConfirmationProb;
      else confirmProb = config.clientConfirmationProb;

      if (Math.random() < confirmProb) {
        return {
          ...i,
          confirmation_status: "confirmed",
          confirmed_by: "auto_progression",
          timestamp_confirmed: new Date().toISOString(),
        };
      }

      return i;
    }),
  };
}
