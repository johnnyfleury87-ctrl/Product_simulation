/**
 * Module de simulation pour rappels QHSE
 * Génère des impacts, répartitions, et données de notification
 */

import { DISTRIBUTION_CENTERS, DEMO_CUSTOMERS, getDistributionCenterById } from "@/data/demoCatalog";

export type Severity = "LOW" | "MEDIUM" | "HIGH";
export type ProductLocation = "stock" | "preparation" | "in_transit" | "delivered";
export type NotificationChannel = "sms" | "email";

export interface RecallImpact {
  customer_id: string;
  product_id: string;
  dlc: string;
  location: ProductLocation;
  qty_units: number;
  distribution_center_id: string;
  sms_sent: boolean;
  email_sent: boolean;
  client_confirmed: boolean;
  confirmed_status: "pending" | "confirmed";
  timestamp_created: string;
  timestamp_notification: string | null;
  timestamp_confirmed: string | null;
}

export interface RecallSimulation {
  id: string;
  product_id: string;
  product_name: string;
  dlc: string;
  severity: Severity;
  total_units: number;
  distribution_by_location: Record<ProductLocation, number>;
  distribution_by_center: Record<string, number>;
  central_notified: boolean;
  stop_confirmed_transport: boolean;
  impacts: RecallImpact[];
  timestamp_created: string;
  timestamp_central_notified: string | null;
  timestamp_transport_stopped: string | null;
}

// Répartition typique des produits par localisation (selon sévérité)
const LOCATION_DISTRIBUTION = {
  LOW: { stock: 0.6, preparation: 0.2, in_transit: 0.1, delivered: 0.1 },
  MEDIUM: { stock: 0.4, preparation: 0.25, in_transit: 0.2, delivered: 0.15 },
  HIGH: { stock: 0.2, preparation: 0.2, in_transit: 0.25, delivered: 0.35 },
};

// Nombre de clients impactés selon sévérité
const AFFECTED_CUSTOMERS_COUNT = {
  LOW: { min: 15, max: 35 },
  MEDIUM: { min: 40, max: 100 },
  HIGH: { min: 100, max: 200 },
};

/**
 * Génère une simulation de rappel complet
 */
export function generateRecallSimulation(
  productId: string,
  productName: string,
  dlcDate: string,
  severity: Severity,
): RecallSimulation {
  const recallId = `RECALL-${Date.now()}`;
  const now = new Date().toISOString();

  // Calculer les unités totales impactées
  const totalUnits = calculateTotalAffectedUnits(severity);

  // Répartition par localisation
  const distributionByLocation = distributeByLocation(totalUnits, severity);

  // Répartition par centre de distribution
  const distributionByCenter = distributeByCenter(totalUnits);

  // Générer les impacts clients
  const affectedCustomerCount = getRandomInRange(
    AFFECTED_CUSTOMERS_COUNT[severity].min,
    AFFECTED_CUSTOMERS_COUNT[severity].max,
  );

  const impacts = generateImpacts(
    recallId,
    productId,
    dlcDate,
    affectedCustomerCount,
    distributionByLocation,
  );

  return {
    id: recallId,
    product_id: productId,
    product_name: productName,
    dlc: dlcDate,
    severity,
    total_units: totalUnits,
    distribution_by_location: distributionByLocation,
    distribution_by_center: distributionByCenter,
    central_notified: false,
    stop_confirmed_transport: false,
    impacts,
    timestamp_created: now,
    timestamp_central_notified: null,
    timestamp_transport_stopped: null,
  };
}

/**
 * Calcule le nombre total d'unités impactées
 */
function calculateTotalAffectedUnits(severity: Severity): number {
  const ranges = {
    LOW: { min: 500, max: 2000 },
    MEDIUM: { min: 2000, max: 8000 },
    HIGH: { min: 8000, max: 25000 },
  };
  return getRandomInRange(ranges[severity].min, ranges[severity].max);
}

/**
 * Répartit les unités par localisation (stock, préparation, transport, livré)
 */
function distributeByLocation(
  totalUnits: number,
  severity: Severity,
): Record<ProductLocation, number> {
  const dist = LOCATION_DISTRIBUTION[severity];

  return {
    stock: Math.round(totalUnits * dist.stock),
    preparation: Math.round(totalUnits * dist.preparation),
    in_transit: Math.round(totalUnits * dist.in_transit),
    delivered: Math.round(totalUnits * dist.delivered),
  };
}

/**
 * Répartit les unités par centre de distribution
 */
function distributeByCenter(totalUnits: number): Record<string, number> {
  // Poids par centre (proportionnel au volume quotidien moyen)
  const weights = DISTRIBUTION_CENTERS.map((dc) => dc.averageOrdersPerDay);
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const distribution: Record<string, number> = {};
  DISTRIBUTION_CENTERS.forEach((dc, idx) => {
    const proportion = weights[idx] / totalWeight;
    distribution[dc.id] = Math.round(totalUnits * proportion);
  });

  return distribution;
}

/**
 * Génère les impacts clients avec distribution aléatoire
 */
function generateImpacts(
  recallId: string,
  productId: string,
  dlcDate: string,
  customerCount: number,
  distributionByLocation: Record<ProductLocation, number>,
): RecallImpact[] {
  const impacts: RecallImpact[] = [];
  const now = new Date().toISOString();

  // Sélectionner des clients aléatoires
  const selectedCustomers = selectRandomCustomers(customerCount);

  // Répartir les localisations aléatoirement
  const locations: ProductLocation[] = [];
  Object.entries(distributionByLocation).forEach(([location, qty]) => {
    for (let i = 0; i < qty / customerCount; i++) {
      locations.push(location as ProductLocation);
    }
  });

  // Générer les impacts
  selectedCustomers.forEach((customer, idx) => {
    const location = locations[idx % locations.length] || "stock";
    const unitsPerCustomer = Math.round(distributionByLocation[location] / customerCount) + getRandomInRange(-5, 5);

    impacts.push({
      customer_id: customer.id,
      product_id: productId,
      dlc: dlcDate,
      location,
      qty_units: Math.max(10, unitsPerCustomer), // Au minimum 10 unités
      distribution_center_id: customer.distribution_center,
      sms_sent: false,
      email_sent: false,
      client_confirmed: false,
      confirmed_status: "pending",
      timestamp_created: now,
      timestamp_notification: null,
      timestamp_confirmed: null,
    });
  });

  return impacts;
}

/**
 * Sélectionne n clients aléatoires
 */
function selectRandomCustomers(count: number) {
  const shuffled = [...DEMO_CUSTOMERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, DEMO_CUSTOMERS.length));
}

/**
 * Retourne un nombre aléatoire entre min et max (inclus)
 */
function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Met à jour la notification des centrales
 */
export function notifyCentrals(recall: RecallSimulation): RecallSimulation {
  return {
    ...recall,
    central_notified: true,
    timestamp_central_notified: new Date().toISOString(),
  };
}

/**
 * Confirme l'arrêt du transport
 */
export function confirmTransportStop(recall: RecallSimulation): RecallSimulation {
  return {
    ...recall,
    stop_confirmed_transport: true,
    timestamp_transport_stopped: new Date().toISOString(),
  };
}

/**
 * Envoie notifications SMS et Email
 */
export function sendNotifications(recall: RecallSimulation): RecallSimulation {
  const now = new Date().toISOString();
  const updatedImpacts = recall.impacts.map((impact) => ({
    ...impact,
    sms_sent: true,
    email_sent: true,
    timestamp_notification: now,
  }));

  return {
    ...recall,
    impacts: updatedImpacts,
  };
}

/**
 * Confirme un client spécifique
 */
export function confirmCustomer(recall: RecallSimulation, customerId: string): RecallSimulation {
  const now = new Date().toISOString();
  const updatedImpacts = recall.impacts.map((impact) =>
    impact.customer_id === customerId
      ? {
          ...impact,
          client_confirmed: true,
          timestamp_confirmed: now,
        }
      : impact,
  );

  return {
    ...recall,
    impacts: updatedImpacts,
  };
}

/**
 * Confirme tous les clients
 */
export function confirmAllCustomers(recall: RecallSimulation): RecallSimulation {
  const now = new Date().toISOString();
  const updatedImpacts = recall.impacts.map((impact) => ({
    ...impact,
    client_confirmed: true,
    timestamp_confirmed: now,
  }));

  return {
    ...recall,
    impacts: updatedImpacts,
  };
}

/**
 * Retourne les statistiques du rappel
 */
export function getRecallStats(recall: RecallSimulation) {
  const totalImpacts = recall.impacts.length;
  const confirmedCount = recall.impacts.filter((i) => i.client_confirmed).length;
  const smsCount = recall.impacts.filter((i) => i.sms_sent).length;
  const emailCount = recall.impacts.filter((i) => i.email_sent).length;

  return {
    totalAffectedUnits: recall.total_units,
    totalAffectedCustomers: totalImpacts,
    confirmedCustomers: confirmedCount,
    pendingCustomers: totalImpacts - confirmedCount,
    smsSent: smsCount,
    emailSent: emailCount,
    centralNotified: recall.central_notified,
    transportStopped: recall.stop_confirmed_transport,
  };
}

/**
 * Regroupe les impacts par centre de distribution
 */
export function groupImpactsByCenter(recall: RecallSimulation) {
  const grouped: Record<string, RecallImpact[]> = {};

  DISTRIBUTION_CENTERS.forEach((dc) => {
    grouped[dc.id] = recall.impacts.filter((i) => i.distribution_center_id === dc.id);
  });

  return grouped;
}

/**
 * Regroupe les impacts par localisation
 */
export function groupImpactsByLocation(recall: RecallSimulation) {
  const grouped: Record<ProductLocation, RecallImpact[]> = {
    stock: [],
    preparation: [],
    in_transit: [],
    delivered: [],
  };

  recall.impacts.forEach((impact) => {
    grouped[impact.location].push(impact);
  });

  return grouped;
}
