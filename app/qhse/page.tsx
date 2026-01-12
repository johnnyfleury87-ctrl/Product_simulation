"use client";

import React, { useState, useEffect } from "react";
import {
  RecallSimulation,
  Severity,
  generateRecallSimulation,
  notifyCentrals,
  confirmTransportStop,
  sendNotifications,
  confirmCustomer,
  confirmAllCustomers,
  getRecallStats,
  groupImpactsByCenter,
  RecallImpact,
} from "@/lib/simulateRecall";
import { DEMO_PRODUCTS, DISTRIBUTION_CENTERS, DEMO_CUSTOMERS } from "@/data/demoCatalog";
import styles from "./page.module.css";

export default function QHSERecallSimulator() {
  // État de la démo
  const [recall, setRecall] = useState<RecallSimulation | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>(DEMO_PRODUCTS[0].id);
  const [selectedDlc, setSelectedDlc] = useState<string>(getTomorrowDate());
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>("MEDIUM");
  const [filterUnconfirmedOnly, setFilterUnconfirmedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"center" | "status" | "name">("center");

  // Lancer une simulation
  const launchRecall = () => {
    const product = DEMO_PRODUCTS.find((p) => p.id === selectedProduct);
    if (!product) return;

    const newRecall = generateRecallSimulation(
      product.id,
      product.name,
      selectedDlc,
      selectedSeverity,
    );
    setRecall(newRecall);
  };

  // Actions QHSE
  const handleNotifyCentrals = () => {
    if (recall) setRecall(notifyCentrals(recall));
  };

  const handleStopTransport = () => {
    if (recall) setRecall(confirmTransportStop(recall));
  };

  const handleSendNotifications = () => {
    if (recall) setRecall(sendNotifications(recall));
  };

  const handleConfirmCustomer = (customerId: string) => {
    if (recall) setRecall(confirmCustomer(recall, customerId));
  };

  const handleConfirmAll = () => {
    if (recall) setRecall(confirmAllCustomers(recall));
  };

  // Traitement des données
  const stats = recall ? getRecallStats(recall) : null;
  const impactsByCenter = recall ? groupImpactsByCenter(recall) : {};

  // Filtrer et trier les impacts
  let filteredImpacts = recall?.impacts || [];
  if (filterUnconfirmedOnly) {
    filteredImpacts = filteredImpacts.filter((i) => !i.client_confirmed);
  }

  filteredImpacts = filteredImpacts.sort((a, b) => {
    if (sortBy === "center") {
      return a.distribution_center_id.localeCompare(b.distribution_center_id);
    } else if (sortBy === "status") {
      return a.location.localeCompare(b.location);
    } else {
      return a.customer_id.localeCompare(b.customer_id);
    }
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🚨 QHSE Recall Simulator</h1>
        <p>Simulation de rappel de produits - Mode DÉMO</p>
      </header>

      <div className={styles.mainLayout}>
        {/* COLONNE GAUCHE: Lancer un rappel */}
        <aside className={styles.leftPanel}>
          <div className={styles.card}>
            <h2>Lancer un rappel</h2>

            <div className={styles.formGroup}>
              <label>Produit</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {DEMO_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>DLC Date</label>
              <input
                type="date"
                value={selectedDlc}
                onChange={(e) => setSelectedDlc(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Sévérité</label>
              <div className={styles.severityButtons}>
                {(["LOW", "MEDIUM", "HIGH"] as Severity[]).map((sev) => (
                  <button
                    key={sev}
                    className={`${styles.severityBtn} ${selectedSeverity === sev ? styles.active : ""} ${styles[`severity-${sev}`]}`}
                    onClick={() => setSelectedSeverity(sev)}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <button
              className={styles.launchBtn}
              onClick={launchRecall}
            >
              ▶ Lancer la simulation
            </button>
          </div>
        </aside>

        {/* COLONNE DROITE: Dashboard */}
        <main className={styles.rightPanel}>
          {recall && stats ? (
            <>
              {/* KPIs */}
              <div className={styles.kpisGrid}>
                <div className={`${styles.kpiCard} ${styles.primary}`}>
                  <div className={styles.kpiValue}>{stats.totalAffectedUnits.toLocaleString()}</div>
                  <div className={styles.kpiLabel}>Unités concernées</div>
                </div>
                <div className={`${styles.kpiCard} ${styles.secondary}`}>
                  <div className={styles.kpiValue}>{stats.totalAffectedCustomers}</div>
                  <div className={styles.kpiLabel}>Clients impactés</div>
                </div>
                <div className={`${styles.kpiCard} ${stats.centralNotified ? styles.success : styles.warning}`}>
                  <div className={styles.kpiValue}>{stats.centralNotified ? "✅" : "❌"}</div>
                  <div className={styles.kpiLabel}>Centrales averties</div>
                </div>
                <div className={`${styles.kpiCard} ${stats.transportStopped ? styles.success : styles.warning}`}>
                  <div className={styles.kpiValue}>{stats.transportStopped ? "✅" : "❌"}</div>
                  <div className={styles.kpiLabel}>Transport stoppé</div>
                </div>
              </div>

              {/* Répartition par localisation */}
              <div className={styles.card}>
                <h3>Localisation du stock</h3>
                <div className={styles.locationGrid}>
                  <div className={styles.locationItem}>
                    <span>📦 En stock</span>
                    <strong>{recall.distribution_by_location.stock.toLocaleString()}</strong>
                    <small>{((recall.distribution_by_location.stock / stats.totalAffectedUnits) * 100).toFixed(1)}%</small>
                  </div>
                  <div className={styles.locationItem}>
                    <span>📋 En préparation</span>
                    <strong>{recall.distribution_by_location.preparation.toLocaleString()}</strong>
                    <small>{((recall.distribution_by_location.preparation / stats.totalAffectedUnits) * 100).toFixed(1)}%</small>
                  </div>
                  <div className={styles.locationItem}>
                    <span>🚚 En transit</span>
                    <strong>{recall.distribution_by_location.in_transit.toLocaleString()}</strong>
                    <small>{((recall.distribution_by_location.in_transit / stats.totalAffectedUnits) * 100).toFixed(1)}%</small>
                  </div>
                  <div className={styles.locationItem}>
                    <span>📨 Livré au client</span>
                    <strong>{recall.distribution_by_location.delivered.toLocaleString()}</strong>
                    <small>{((recall.distribution_by_location.delivered / stats.totalAffectedUnits) * 100).toFixed(1)}%</small>
                  </div>
                </div>
              </div>

              {/* Répartition par centre */}
              <div className={styles.card}>
                <h3>Répartition par centre</h3>
                <div className={styles.centerGrid}>
                  {DISTRIBUTION_CENTERS.map((dc) => {
                    const qty = recall.distribution_by_center[dc.id] || 0;
                    return (
                      <div key={dc.id} className={styles.centerItem}>
                        <strong>{dc.name}</strong>
                        <div>{qty.toLocaleString()} unités</div>
                        <small>{dc.city} ({dc.region})</small>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions QHSE */}
              <div className={styles.card}>
                <h3>Actions QHSE</h3>
                <div className={styles.actionsGrid}>
                  <button
                    className={`${styles.actionBtn} ${recall.central_notified ? styles.disabled : ""}`}
                    onClick={handleNotifyCentrals}
                    disabled={recall.central_notified}
                  >
                    {recall.central_notified ? "✅ Centrales averties" : "📢 Avertir les centrales"}
                  </button>
                  <button
                    className={`${styles.actionBtn} ${recall.stop_confirmed_transport ? styles.disabled : ""}`}
                    onClick={handleStopTransport}
                    disabled={recall.stop_confirmed_transport}
                  >
                    {recall.stop_confirmed_transport ? "✅ Transport stoppé" : "🛑 Stop transport"}
                  </button>
                  <button
                    className={`${styles.actionBtn} ${stats.smsSent > 0 ? styles.disabled : ""}`}
                    onClick={handleSendNotifications}
                    disabled={stats.smsSent > 0}
                  >
                    {stats.smsSent > 0
                      ? `✅ ${stats.smsSent} SMS + ${stats.emailSent} Email`
                      : "📧 Envoyer SMS + Email"}
                  </button>
                  <button
                    className={`${styles.actionBtn} ${stats.confirmedCustomers === stats.totalAffectedCustomers ? styles.disabled : ""}`}
                    onClick={handleConfirmAll}
                    disabled={stats.confirmedCustomers === stats.totalAffectedCustomers}
                  >
                    Confirmer tous ({stats.confirmedCustomers}/{stats.totalAffectedCustomers})
                  </button>
                </div>
              </div>

              {/* Stats confirmations */}
              <div className={styles.card}>
                <h3>État des confirmations</h3>
                <div className={styles.statsRow}>
                  <div>
                    <strong style={{ color: "#10b981" }}>✅ Confirmés:</strong> {stats.confirmedCustomers} clients
                  </div>
                  <div>
                    <strong style={{ color: "#f59e0b" }}>⏳ En attente:</strong> {stats.pendingCustomers} clients
                  </div>
                  <div>
                    <strong>📊 Taux:</strong> {((stats.confirmedCustomers / stats.totalAffectedCustomers) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>👈 Sélectionnez un produit et lancez une simulation</p>
            </div>
          )}
        </main>
      </div>

      {/* TABLEAU DES CLIENTS */}
      {recall && (
        <div className={styles.clientsSection}>
          <div className={styles.clientsHeader}>
            <h2>Clients impactés ({filteredImpacts.length})</h2>
            <div className={styles.controls}>
              <label>
                <input
                  type="checkbox"
                  checked={filterUnconfirmedOnly}
                  onChange={(e) => setFilterUnconfirmedOnly(e.target.checked)}
                />
                Non confirmés uniquement
              </label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="center">Trier par centre</option>
                <option value="status">Trier par localisation</option>
                <option value="name">Trier par client</option>
              </select>
            </div>
          </div>

          <div className={styles.clientsTable}>
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Centre</th>
                  <th>Localisation</th>
                  <th>Unités</th>
                  <th>Notifications</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredImpacts.map((impact) => {
                  const impact_record = recall.impacts.find((i) => i.customer_id === impact.customer_id);
                  const customer = DEMO_CUSTOMERS.find((c) => c.id === impact.customer_id);
                  const center = DISTRIBUTION_CENTERS.find((c) => c.id === impact.distribution_center_id);

                  if (!customer || !center) return null;

                  const notificationStatus = `${impact.sms_sent ? "✅ SMS" : "❌ SMS"} | ${impact.email_sent ? "✅ Email" : "❌ Email"}`;

                  return (
                    <tr
                      key={impact.customer_id}
                      className={`${!impact.client_confirmed ? styles.unconfirmed : styles.confirmed} ${impact.location === "delivered" ? styles.highRisk : ""}`}
                    >
                      <td>
                        <strong>
                          {customer.prenom} {customer.nom}
                        </strong>
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.telephone}</td>
                      <td>{center.name}</td>
                      <td>
                        <span className={styles.badge}>
                          {impact.location === "stock" && "📦 Stock"}
                          {impact.location === "preparation" && "📋 Préparation"}
                          {impact.location === "in_transit" && "🚚 Transit"}
                          {impact.location === "delivered" && "📨 Livré"}
                        </span>
                      </td>
                      <td>{impact.qty_units}</td>
                      <td>{notificationStatus}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${impact.client_confirmed ? styles.confirmed : styles.pending}`}
                        >
                          {impact.client_confirmed ? "✅ Confirmé" : "⏳ En attente"}
                        </span>
                      </td>
                      <td>
                        {!impact.client_confirmed && (
                          <button
                            className={styles.confirmBtn}
                            onClick={() => handleConfirmCustomer(impact.customer_id)}
                          >
                            Confirmer
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper: obtenir la date de demain
function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}
