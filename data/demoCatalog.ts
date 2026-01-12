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
  city: string;
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

// Centres de distribution
export const DISTRIBUTION_CENTERS: DistributionCenter[] = [
  {
    id: "dc1",
    name: "Centre Île-de-France",
    city: "Paris",
    region: "Île-de-France",
    averageOrdersPerDay: 2800,
  },
  {
    id: "dc2",
    name: "Centre Rhône-Alpes",
    city: "Lyon",
    region: "Auvergne-Rhône-Alpes",
    averageOrdersPerDay: 2450,
  },
  {
    id: "dc3",
    name: "Centre Nouvelle-Aquitaine",
    city: "Bordeaux",
    region: "Nouvelle-Aquitaine",
    averageOrdersPerDay: 2250,
  },
];

// Clients fictifs (50 clients, répartis entre les 3 centrales)
export const DEMO_CUSTOMERS: DemoCustomer[] = [
  // DC1 - Île-de-France
  { id: "c1", nom: "Dupont", prenom: "Jean", email: "jean.dupont@email.com", telephone: "06 11 22 33 44", distribution_center: "dc1" },
  { id: "c2", nom: "Martin", prenom: "Marie", email: "marie.martin@email.com", telephone: "06 22 33 44 55", distribution_center: "dc1" },
  { id: "c3", nom: "Bernard", prenom: "Paul", email: "paul.bernard@email.com", telephone: "06 33 44 55 66", distribution_center: "dc1" },
  { id: "c4", nom: "Durand", prenom: "Anne", email: "anne.durand@email.com", telephone: "06 44 55 66 77", distribution_center: "dc1" },
  { id: "c5", nom: "Lefevre", prenom: "Pierre", email: "pierre.lefevre@email.com", telephone: "06 55 66 77 88", distribution_center: "dc1" },
  { id: "c6", nom: "Moreau", prenom: "Claire", email: "claire.moreau@email.com", telephone: "06 66 77 88 99", distribution_center: "dc1" },
  { id: "c7", nom: "Laurent", prenom: "Michel", email: "michel.laurent@email.com", telephone: "06 77 88 99 00", distribution_center: "dc1" },
  { id: "c8", nom: "Simon", prenom: "Françoise", email: "francoise.simon@email.com", telephone: "06 88 99 00 11", distribution_center: "dc1" },
  { id: "c9", nom: "Michel", prenom: "Jacques", email: "jacques.michel@email.com", telephone: "06 99 00 11 22", distribution_center: "dc1" },
  { id: "c10", nom: "David", prenom: "Christiane", email: "christiane.david@email.com", telephone: "07 00 11 22 33", distribution_center: "dc1" },
  { id: "c11", nom: "Bertrand", prenom: "Gérard", email: "gerard.bertrand@email.com", telephone: "07 11 22 33 44", distribution_center: "dc1" },
  { id: "c12", nom: "Roux", prenom: "Monique", email: "monique.roux@email.com", telephone: "07 22 33 44 55", distribution_center: "dc1" },
  { id: "c13", nom: "Vincent", prenom: "Alain", email: "alain.vincent@email.com", telephone: "07 33 44 55 66", distribution_center: "dc1" },
  { id: "c14", nom: "Fournier", prenom: "Bernadette", email: "bernadette.fournier@email.com", telephone: "07 44 55 66 77", distribution_center: "dc1" },
  { id: "c15", nom: "Morel", prenom: "Arlette", email: "arlette.morel@email.com", telephone: "07 55 66 77 88", distribution_center: "dc1" },
  { id: "c16", nom: "Girard", prenom: "Marcel", email: "marcel.girard@email.com", telephone: "07 66 77 88 99", distribution_center: "dc1" },
  { id: "c17", nom: "André", prenom: "Henriette", email: "henriette.andre@email.com", telephone: "07 77 88 99 00", distribution_center: "dc1" },

  // DC2 - Rhône-Alpes
  { id: "c18", nom: "Lebreton", prenom: "Guy", email: "guy.lebreton@email.com", telephone: "07 88 99 00 11", distribution_center: "dc2" },
  { id: "c19", nom: "Noel", prenom: "Marguerite", email: "marguerite.noel@email.com", telephone: "07 99 00 11 22", distribution_center: "dc2" },
  { id: "c20", nom: "Gauthier", prenom: "Denis", email: "denis.gauthier@email.com", telephone: "08 00 11 22 33", distribution_center: "dc2" },
  { id: "c21", nom: "Perrin", prenom: "Irène", email: "irene.perrin@email.com", telephone: "08 11 22 33 44", distribution_center: "dc2" },
  { id: "c22", nom: "Blanc", prenom: "Lucien", email: "lucien.blanc@email.com", telephone: "08 22 33 44 55", distribution_center: "dc2" },
  { id: "c23", nom: "Blanchard", prenom: "Colette", email: "colette.blanchard@email.com", telephone: "08 33 44 55 66", distribution_center: "dc2" },
  { id: "c24", nom: "Arnould", prenom: "Luc", email: "luc.arnould@email.com", telephone: "08 44 55 66 77", distribution_center: "dc2" },
  { id: "c25", nom: "Aubry", prenom: "Viviane", email: "viviane.aubry@email.com", telephone: "08 55 66 77 88", distribution_center: "dc2" },
  { id: "c26", nom: "Aubert", prenom: "Robert", email: "robert.aubert@email.com", telephone: "08 66 77 88 99", distribution_center: "dc2" },
  { id: "c27", nom: "Aubin", prenom: "Sylvain", email: "sylvain.aubin@email.com", telephone: "08 77 88 99 00", distribution_center: "dc2" },
  { id: "c28", nom: "Aubé", prenom: "Thérèse", email: "therese.aube@email.com", telephone: "08 88 99 00 11", distribution_center: "dc2" },
  { id: "c29", nom: "Aubeau", prenom: "Yves", email: "yves.aubeau@email.com", telephone: "08 99 00 11 22", distribution_center: "dc2" },
  { id: "c30", nom: "Aubel", prenom: "Zoé", email: "zoe.aubel@email.com", telephone: "09 00 11 22 33", distribution_center: "dc2" },
  { id: "c31", nom: "Aubelin", prenom: "Albert", email: "albert.aubelin@email.com", telephone: "09 11 22 33 44", distribution_center: "dc2" },
  { id: "c32", nom: "Aubert", prenom: "Amélie", email: "amelie.aubert@email.com", telephone: "09 22 33 44 55", distribution_center: "dc2" },

  // DC3 - Nouvelle-Aquitaine
  { id: "c33", nom: "Aubeuf", prenom: "Bernard", email: "bernard.aubeuf@email.com", telephone: "09 33 44 55 66", distribution_center: "dc3" },
  { id: "c34", nom: "Aubier", prenom: "Catherine", email: "catherine.aubier@email.com", telephone: "09 44 55 66 77", distribution_center: "dc3" },
  { id: "c35", nom: "Aubié", prenom: "Danielle", email: "danielle.aubie@email.com", telephone: "09 55 66 77 88", distribution_center: "dc3" },
  { id: "c36", nom: "Aubier", prenom: "Éric", email: "eric.aubier@email.com", telephone: "09 66 77 88 99", distribution_center: "dc3" },
  { id: "c37", nom: "Aubry", prenom: "Fabienne", email: "fabienne.aubry@email.com", telephone: "09 77 88 99 00", distribution_center: "dc3" },
  { id: "c38", nom: "Aubusson", prenom: "Grégoire", email: "gregoire.aubusson@email.com", telephone: "09 88 99 00 11", distribution_center: "dc3" },
  { id: "c39", nom: "Aucamus", prenom: "Hélène", email: "helene.aucamus@email.com", telephone: "09 99 00 11 22", distribution_center: "dc3" },
  { id: "c40", nom: "Aucamus", prenom: "Isabelle", email: "isabelle.aucamus@email.com", telephone: "10 00 11 22 33", distribution_center: "dc3" },
  { id: "c41", nom: "Aucamus", prenom: "Joël", email: "joel.aucamus@email.com", telephone: "10 11 22 33 44", distribution_center: "dc3" },
  { id: "c42", nom: "Aucamus", prenom: "Karine", email: "karine.aucamus@email.com", telephone: "10 22 33 44 55", distribution_center: "dc3" },
  { id: "c43", nom: "Aucamus", prenom: "Laure", email: "laure.aucamus@email.com", telephone: "10 33 44 55 66", distribution_center: "dc3" },
  { id: "c44", nom: "Aucamus", prenom: "Marc", email: "marc.aucamus@email.com", telephone: "10 44 55 66 77", distribution_center: "dc3" },
  { id: "c45", nom: "Aucamus", prenom: "Nathalie", email: "nathalie.aucamus@email.com", telephone: "10 55 66 77 88", distribution_center: "dc3" },
  { id: "c46", nom: "Aucamus", prenom: "Olivier", email: "olivier.aucamus@email.com", telephone: "10 66 77 88 99", distribution_center: "dc3" },
  { id: "c47", nom: "Aucamus", prenom: "Patricia", email: "patricia.aucamus@email.com", telephone: "10 77 88 99 00", distribution_center: "dc3" },
  { id: "c48", nom: "Aucamus", prenom: "Quentin", email: "quentin.aucamus@email.com", telephone: "10 88 99 00 11", distribution_center: "dc3" },
  { id: "c49", nom: "Aucamus", prenom: "Reine", email: "reine.aucamus@email.com", telephone: "10 99 00 11 22", distribution_center: "dc3" },
  { id: "c50", nom: "Aucamus", prenom: "Stéphane", email: "stephane.aucamus@email.com", telephone: "11 00 11 22 33", distribution_center: "dc3" },
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
