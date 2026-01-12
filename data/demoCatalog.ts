/**
 * Catalogue fictif pour la démo QHSE Recall Simulator
 * Données en dur, crédibles mais purement fictives
 */

export interface DemoProduct {
  id: string;
  name: string;
  category: string;
  sku: string;
  unitType: string;
}

export interface DemoCustomer {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  distribution_center: string;
}

export interface DistributionCenter {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  region: string;
  averageOrdersPerDay: number;
}

// Produits fictifs (catégories réalistes)
export const DEMO_PRODUCTS: DemoProduct[] = [
  { id: "p1", name: "Yaourt Nature XXX", category: "Frais", sku: "PROD-001", unitType: "250g" },
  { id: "p2", name: "Lait Demi-Écrémé 1L", category: "Frais", sku: "PROD-002", unitType: "1L" },
  { id: "p3", name: "Fromage Blanc 200g", category: "Frais", sku: "PROD-003", unitType: "200g" },
  { id: "p4", name: "Poulet Fermier 500g", category: "Frais", sku: "PROD-004", unitType: "500g" },
  { id: "p5", name: "Saumon Fumé 150g", category: "Frais", sku: "PROD-005", unitType: "150g" },
  { id: "p6", name: "Pommes Gala 1kg", category: "Fruits & Légumes", sku: "PROD-006", unitType: "1kg" },
  { id: "p7", name: "Tomates Cerises 250g", category: "Fruits & Légumes", sku: "PROD-007", unitType: "250g" },
  { id: "p8", name: "Carottes 500g", category: "Fruits & Légumes", sku: "PROD-008", unitType: "500g" },
  { id: "p9", name: "Pizza Surgelée 400g", category: "Surgelés", sku: "PROD-009", unitType: "400g" },
  { id: "p10", name: "Frites Surgelées 1kg", category: "Surgelés", sku: "PROD-010", unitType: "1kg" },
  { id: "p11", name: "Épinards Surgelés 500g", category: "Surgelés", sku: "PROD-011", unitType: "500g" },
  { id: "p12", name: "Pâtes Sèches 500g", category: "Secs", sku: "PROD-012", unitType: "500g" },
  { id: "p13", name: "Riz Blanc 1kg", category: "Secs", sku: "PROD-013", unitType: "1kg" },
  { id: "p14", name: "Sucre Blanc 1kg", category: "Secs", sku: "PROD-014", unitType: "1kg" },
  { id: "p15", name: "Eau Minérale 6L", category: "Volumineux", sku: "PROD-015", unitType: "6L" },
];

// Centres de distribution Suisse
export const DISTRIBUTION_CENTERS: DistributionCenter[] = [
  {
    id: "ecu",
    name: "ECU - Ecublens",
    code: "ECU",
    address: "Chemin du Croset 9",
    city: "Ecublens",
    postalCode: "1024",
    phone: "+41 21 555 01 01",
    region: "Suisse Romande",
    averageOrdersPerDay: 2800,
  },
  {
    id: "prat",
    name: "PRAT - Pratteln",
    code: "PRAT",
    address: "Zurlindenstrasse 1",
    city: "Pratteln",
    postalCode: "4133",
    phone: "+41 61 555 02 02",
    region: "Suisse Alémaniques",
    averageOrdersPerDay: 2450,
  },
  {
    id: "brem",
    name: "BREM - Bremgarten",
    code: "BREM",
    address: "Bahnhofstrasse 12",
    city: "Bremgarten",
    postalCode: "5620",
    phone: "+41 56 555 03 03",
    region: "Suisse Centrale",
    averageOrdersPerDay: 2250,
  },
];

// Clients fictifs (50 clients, répartis entre les 3 centrales suisses)
export const DEMO_CUSTOMERS: DemoCustomer[] = [
  // ECU - Ecublens (17 clients)
  { id: "c1", nom: "Dupont", prenom: "Jean", email: "jean.dupont@email.com", telephone: "+41 21 555 11 01", distribution_center: "ecu" },
  { id: "c2", nom: "Martin", prenom: "Marie", email: "marie.martin@email.com", telephone: "+41 21 555 11 02", distribution_center: "ecu" },
  { id: "c3", nom: "Bernard", prenom: "Paul", email: "paul.bernard@email.com", telephone: "+41 21 555 11 03", distribution_center: "ecu" },
  { id: "c4", nom: "Durand", prenom: "Anne", email: "anne.durand@email.com", telephone: "+41 21 555 11 04", distribution_center: "ecu" },
  { id: "c5", nom: "Lefevre", prenom: "Pierre", email: "pierre.lefevre@email.com", telephone: "+41 21 555 11 05", distribution_center: "ecu" },
  { id: "c6", nom: "Moreau", prenom: "Claire", email: "claire.moreau@email.com", telephone: "+41 21 555 11 06", distribution_center: "ecu" },
  { id: "c7", nom: "Laurent", prenom: "Michel", email: "michel.laurent@email.com", telephone: "+41 21 555 11 07", distribution_center: "ecu" },
  { id: "c8", nom: "Simon", prenom: "Françoise", email: "francoise.simon@email.com", telephone: "+41 21 555 11 08", distribution_center: "ecu" },
  { id: "c9", nom: "Michel", prenom: "Jacques", email: "jacques.michel@email.com", telephone: "+41 21 555 11 09", distribution_center: "ecu" },
  { id: "c10", nom: "David", prenom: "Christiane", email: "christiane.david@email.com", telephone: "+41 21 555 11 10", distribution_center: "ecu" },
  { id: "c11", nom: "Bertrand", prenom: "Gérard", email: "gerard.bertrand@email.com", telephone: "+41 21 555 11 11", distribution_center: "ecu" },
  { id: "c12", nom: "Roux", prenom: "Monique", email: "monique.roux@email.com", telephone: "+41 21 555 11 12", distribution_center: "ecu" },
  { id: "c13", nom: "Vincent", prenom: "Alain", email: "alain.vincent@email.com", telephone: "+41 21 555 11 13", distribution_center: "ecu" },
  { id: "c14", nom: "Fournier", prenom: "Bernadette", email: "bernadette.fournier@email.com", telephone: "+41 21 555 11 14", distribution_center: "ecu" },
  { id: "c15", nom: "Morel", prenom: "Arlette", email: "arlette.morel@email.com", telephone: "+41 21 555 11 15", distribution_center: "ecu" },
  { id: "c16", nom: "Girard", prenom: "Marcel", email: "marcel.girard@email.com", telephone: "+41 21 555 11 16", distribution_center: "ecu" },
  { id: "c17", nom: "André", prenom: "Henriette", email: "henriette.andre@email.com", telephone: "+41 21 555 11 17", distribution_center: "ecu" },

  // PRAT - Pratteln (15 clients)
  { id: "c18", nom: "Lebreton", prenom: "Guy", email: "guy.lebreton@email.com", telephone: "+41 61 555 22 01", distribution_center: "prat" },
  { id: "c19", nom: "Noel", prenom: "Marguerite", email: "marguerite.noel@email.com", telephone: "+41 61 555 22 02", distribution_center: "prat" },
  { id: "c20", nom: "Gauthier", prenom: "Denis", email: "denis.gauthier@email.com", telephone: "+41 61 555 22 03", distribution_center: "prat" },
  { id: "c21", nom: "Perrin", prenom: "Irène", email: "irene.perrin@email.com", telephone: "+41 61 555 22 04", distribution_center: "prat" },
  { id: "c22", nom: "Blanc", prenom: "Lucien", email: "lucien.blanc@email.com", telephone: "+41 61 555 22 05", distribution_center: "prat" },
  { id: "c23", nom: "Blanchard", prenom: "Colette", email: "colette.blanchard@email.com", telephone: "+41 61 555 22 06", distribution_center: "prat" },
  { id: "c24", nom: "Arnould", prenom: "Luc", email: "luc.arnould@email.com", telephone: "+41 61 555 22 07", distribution_center: "prat" },
  { id: "c25", nom: "Aubry", prenom: "Viviane", email: "viviane.aubry@email.com", telephone: "+41 61 555 22 08", distribution_center: "prat" },
  { id: "c26", nom: "Aubert", prenom: "Robert", email: "robert.aubert@email.com", telephone: "+41 61 555 22 09", distribution_center: "prat" },
  { id: "c27", nom: "Aubin", prenom: "Sylvain", email: "sylvain.aubin@email.com", telephone: "+41 61 555 22 10", distribution_center: "prat" },
  { id: "c28", nom: "Aubé", prenom: "Thérèse", email: "therese.aube@email.com", telephone: "+41 61 555 22 11", distribution_center: "prat" },
  { id: "c29", nom: "Aubeau", prenom: "Yves", email: "yves.aubeau@email.com", telephone: "+41 61 555 22 12", distribution_center: "prat" },
  { id: "c30", nom: "Aubel", prenom: "Zoé", email: "zoe.aubel@email.com", telephone: "+41 61 555 22 13", distribution_center: "prat" },
  { id: "c31", nom: "Aubelin", prenom: "Albert", email: "albert.aubelin@email.com", telephone: "+41 61 555 22 14", distribution_center: "prat" },
  { id: "c32", nom: "Aubert", prenom: "Amélie", email: "amelie.aubert@email.com", telephone: "+41 61 555 22 15", distribution_center: "prat" },

  // BREM - Bremgarten (18 clients)
  { id: "c33", nom: "Aubeuf", prenom: "Bernard", email: "bernard.aubeuf@email.com", telephone: "+41 56 555 33 01", distribution_center: "brem" },
  { id: "c34", nom: "Aubier", prenom: "Catherine", email: "catherine.aubier@email.com", telephone: "+41 56 555 33 02", distribution_center: "brem" },
  { id: "c35", nom: "Aubié", prenom: "Danielle", email: "danielle.aubie@email.com", telephone: "+41 56 555 33 03", distribution_center: "brem" },
  { id: "c36", nom: "Aubier", prenom: "Éric", email: "eric.aubier@email.com", telephone: "+41 56 555 33 04", distribution_center: "brem" },
  { id: "c37", nom: "Aubry", prenom: "Fabienne", email: "fabienne.aubry@email.com", telephone: "+41 56 555 33 05", distribution_center: "brem" },
  { id: "c38", nom: "Aubusson", prenom: "Grégoire", email: "gregoire.aubusson@email.com", telephone: "+41 56 555 33 06", distribution_center: "brem" },
  { id: "c39", nom: "Aucamus", prenom: "Hélène", email: "helene.aucamus@email.com", telephone: "+41 56 555 33 07", distribution_center: "brem" },
  { id: "c40", nom: "Aucamus", prenom: "Isabelle", email: "isabelle.aucamus@email.com", telephone: "+41 56 555 33 08", distribution_center: "brem" },
  { id: "c41", nom: "Aucamus", prenom: "Joël", email: "joel.aucamus@email.com", telephone: "+41 56 555 33 09", distribution_center: "brem" },
  { id: "c42", nom: "Aucamus", prenom: "Karine", email: "karine.aucamus@email.com", telephone: "+41 56 555 33 10", distribution_center: "brem" },
  { id: "c43", nom: "Aucamus", prenom: "Laure", email: "laure.aucamus@email.com", telephone: "+41 56 555 33 11", distribution_center: "brem" },
  { id: "c44", nom: "Aucamus", prenom: "Marc", email: "marc.aucamus@email.com", telephone: "+41 56 555 33 12", distribution_center: "brem" },
  { id: "c45", nom: "Aucamus", prenom: "Nathalie", email: "nathalie.aucamus@email.com", telephone: "+41 56 555 33 13", distribution_center: "brem" },
  { id: "c46", nom: "Aucamus", prenom: "Olivier", email: "olivier.aucamus@email.com", telephone: "+41 56 555 33 14", distribution_center: "brem" },
  { id: "c47", nom: "Aucamus", prenom: "Patricia", email: "patricia.aucamus@email.com", telephone: "+41 56 555 33 15", distribution_center: "brem" },
  { id: "c48", nom: "Aucamus", prenom: "Quentin", email: "quentin.aucamus@email.com", telephone: "+41 56 555 33 16", distribution_center: "brem" },
  { id: "c49", nom: "Aucamus", prenom: "Reine", email: "reine.aucamus@email.com", telephone: "+41 56 555 33 17", distribution_center: "brem" },
  { id: "c50", nom: "Aucamus", prenom: "Stéphane", email: "stephane.aucamus@email.com", telephone: "+41 56 555 33 18", distribution_center: "brem" },
];

export const getProductById = (id: string): DemoProduct | undefined => {
  return DEMO_PRODUCTS.find((p) => p.id === id);
};

export const getCustomersByDistributionCenter = (dcId: string): DemoCustomer[] => {
  return DEMO_CUSTOMERS.filter((c) => c.distribution_center === dcId);
};

export const getDistributionCenterById = (id: string): DistributionCenter | undefined => {
  return DISTRIBUTION_CENTERS.find((dc) => dc.id === id);
};
