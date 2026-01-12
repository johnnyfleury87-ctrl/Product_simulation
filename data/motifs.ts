export type OperationType = "RETRAIT" | "RAPPEL";

export type Motif = {
  code: string;
  label: string;
  type: OperationType;
  requiresDetails?: boolean;
  urgency?: "LOW" | "MEDIUM" | "HIGH"; // Influence les confirmations
};

export const MOTIFS: Motif[] = [
  // RETRAIT - Dépôt uniquement
  {
    code: "INTERNAL_NC",
    label: "Non-conformité interne détectée",
    type: "RETRAIT",
    urgency: "MEDIUM",
  },
  {
    code: "INTERNAL_LABEL",
    label: "Erreur d'étiquetage interne (SKU / code)",
    type: "RETRAIT",
    urgency: "MEDIUM",
  },
  {
    code: "DEPOT_DAMAGE",
    label: "Produit détérioré en stockage",
    type: "RETRAIT",
    urgency: "LOW",
  },
  {
    code: "STORAGE_INCIDENT",
    label: "Incident de stockage (température/humidité)",
    type: "RETRAIT",
    urgency: "MEDIUM",
  },
  {
    code: "PRECAUTION_HOLD",
    label: "Lot isolé par précaution (investigation)",
    type: "RETRAIT",
    urgency: "LOW",
  },
  {
    code: "PICKING_ERROR",
    label: "Erreur de picking / mauvais lot stocké",
    type: "RETRAIT",
    urgency: "MEDIUM",
  },
  {
    code: "INTERNAL_AUDIT",
    label: "Audit interne / contrôle renforcé",
    type: "RETRAIT",
    urgency: "LOW",
  },

  // RAPPEL - Workflow complet
  {
    code: "MICRO_RISK",
    label: "Risque microbiologique",
    type: "RAPPEL",
    urgency: "HIGH",
  },
  {
    code: "UNDECLARED_ALLERGEN",
    label: "Allergène non déclaré",
    type: "RAPPEL",
    urgency: "HIGH",
  },
  {
    code: "FOREIGN_BODY",
    label: "Corps étranger (métal/plastique/verre)",
    type: "RAPPEL",
    urgency: "HIGH",
  },
  {
    code: "CONSUMER_LABEL_ERROR",
    label: "Erreur d'étiquetage consommateur (DLC/lot/composition)",
    type: "RAPPEL",
    urgency: "MEDIUM",
  },
  {
    code: "COLD_CHAIN",
    label: "Problème chaîne du froid (prod/transport)",
    type: "RAPPEL",
    urgency: "HIGH",
  },
  {
    code: "SUPPLIER_NC",
    label: "Non-conformité fournisseur (analyse labo)",
    type: "RAPPEL",
    urgency: "HIGH",
  },
  {
    code: "TRACE_FRAUD",
    label: "Suspicion fraude / substitution",
    type: "RAPPEL",
    urgency: "HIGH",
  },
  {
    code: "AUTHORITY_NOTICE",
    label: "Instruction autorité (OFSP)",
    type: "RAPPEL",
    urgency: "HIGH",
  },
  {
    code: "CUSTOMER_COMPLAINT",
    label: "Incident client confirmé",
    type: "RAPPEL",
    urgency: "MEDIUM",
  },
  {
    code: "OTHER",
    label: "Autre (motif libre)",
    type: "RAPPEL",
    requiresDetails: true,
    urgency: "MEDIUM",
  },
];

// Pour RETRAIT, ajouter un motif "Autre"
MOTIFS.push({
  code: "OTHER_RETRAIT",
  label: "Autre (motif libre)",
  type: "RETRAIT",
  requiresDetails: true,
  urgency: "MEDIUM",
});

/**
 * Retourne les motifs filtrés par type d'opération
 */
export function getMotifsByType(type: OperationType): Motif[] {
  return MOTIFS.filter((m) => m.type === type);
}

/**
 * Retourne un motif par son code
 */
export function getMotifByCode(code: string): Motif | undefined {
  return MOTIFS.find((m) => m.code === code);
}

/**
 * Retourne les multiplicateurs de confirmations selon l'urgence
 */
export function getUrgencyMultiplier(urgency?: string): number {
  switch (urgency) {
    case "HIGH":
      return 1.5; // +50% de confirmations
    case "MEDIUM":
      return 1.0; // Normal
    case "LOW":
      return 0.7; // -30% de confirmations
    default:
      return 1.0;
  }
}
