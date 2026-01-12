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
import {
  useRealtimeSimulation,
  calculateLiveStats,
  getImpactsByCenter,
} from "@/lib/useRealtimeSimulation";
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

  // État de simulation temps réel
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [realtimePaused, setRealtimePaused] = useState(false);

  // Hook de simulation temps réel
  useRealtimeSimulation(
    recall,
    {
      enabled: realtimeEnabled && !realtimePaused,
      intervalMs: 2000,
      confirmationProbability: 0.3,
      worstCaseProbability: 0.1,
    },
    setRecall,
  );

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
    setRealtimeEnabled(true);
    setRealtimePaused(false);
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
    if (recall) {
      const updated = { ...recall };
      updated.impacts = recall.impacts.map((i) =>
        i.customer_id === customerId
          ? {
              ...i,
              client_confirmed: true,
              confirmed_status: "confirmed" as const,
              timestamp_confirmed: new Date().toISOString(),
            }
          : i,
      );
      setRecall(updated);
    }
  };

  const handleConfirmAll = () => {
    if (recall) {
      const updated = { ...recall };
      updated.impacts = recall.impacts.map((i) => ({
        ...i,
        client_confirmed: true,
        confirmed_status: "confirmed" as const,
        timestamp_confirmed: new Date().toISOString(),
      }));
      setRecall(updated);
    }
  };

  const handleResetSimulation = () => {
    setRecall(null);
    setRealtimeEnabled(false);
    setRealtimePaused(false);
  };

  // Calculs en temps réel
  const liveStats = calculateLiveStats(recall);
  const impactsByCenter = getImpactsByCenter(recall);
  const stats = recall ? getRecallStats(recall) : null;

  // Filtrer et trier les impacts
  let filteredImpacts = recall?.impacts || [];
  if (filterUnconfirmedOnly) {
    filteredImpacts = filteredImpacts.filter((i) => i.confirmed_status === "pending");
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
        <h1 className={styles.headerTitle}>🚨 QHSE Recall Simulator - Suisse</h1>
        <p className={styles.headerSubtitle}>
          Simulation de rappel de produits - Mode DÉMO - Contexte Suisse
        </p>
      </header>

      <div className={styles.mainLayout}>
        {/* COLONNE GAUCHE: Lancer un rappel */}
        <aside className={styles.leftPanel}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Lancer un rappel</h2>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Produit</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className={styles.formSelect}
              >
                {DEMO_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>DLC Date</label>
              <input
                type="date"
                value={selectedDlc}
                onChange={(e) => setSelectedDlc(e.target.value)}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Sévérité</label>
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

            <button className={styles.launchBtn} onClick={launchRecall}>
              ▶ Lancer la simulation
            </button>

            {recall && (
              <div className={styles.simControls}>
                <button
                  className={`${styles.controlBtn} ${realtimePaused ? styles.paused : ""}`}
                  onClick={() => setRealtimePaused(!realtimePaused)}
                >
                  {realtimePaused ? "▶ Reprendre" : "⏸ Pause"}
                </button>
                <button className={`${styles.controlBtn} ${styles.reset}`} onClick={handleResetSimulation}>
                  🔄 Réinitialiser
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* COLONNE DROITE: Dashboard */}
        <main className={styles.rightPanel}>
          {recall && stats ? (
            <>
              {/* KPIs EN TEMPS RÉEL */}
              <div className={styles.kpisGrid}>
                <div className={`${styles.kpiCard} ${styles.primary}`}>
                  <div className={styles.kpiValue}>{stats.totalAffectedUnits.toLocaleString()}</div>
                  <div className={styles.kpiLabel}>Unités concernées</div>
                </div>
                <div className={`${styles.kpiCard} ${styles.secondary}`}>
                  <div className={styles.kpiValue}>{liveStats.total}</div>
                  <div className={styles.kpiLabel}>Clients impactés</div>
                </div>
                <div className={`${styles.kpiCard} ${styles.success}`}>
                  <div className={styles.kpiValue}>{liveStats.confirmed}</div>
                  <div className={styles.kpiLabel}>✅ Confirmés</div>
                </div>
                <div className={`${styles.kpiCard} ${styles.warning}`}>
                  <div className={styles.kpiValue}>{liveStats.pending}</div>
                  <div className={styles.kpiLabel}>⏳ En attente</div>
                </div>
                <div className={`${styles.kpiCard} ${styles.info}`}>
                  <div className={styles.kpiValue}>{liveStats.confirmationRate}%</div>
                  <div className={styles.kpiLabel}>Taux confirmation</div>
                </div>
              </div>

              {/* Répartition par localisation */}
              <div className={styles.card}>
                <h3 className={styles.cardSubtitle}>Localisation du stock</h3>
                <div className={styles.locationGrid}>
                  <div className={styles.locationItem}>
                    <span className={styles.locationItemLabel}>📦 En stock</span>
                    <strong className={styles.locationItemValue}>
                      {recall.distribution_by_location.stock.toLocaleString()}
                    </strong>
                    <small className={styles.locationItemPercent}>
                      {((recall.distribution_by_location.stock / stats.totalAffectedUnits) * 100).toFixed(1)}%
                    </small>
                  </div>
                  <div className={styles.locationItem}>
                    <span className={styles.locationItemLabel}>📋 En préparation</span>
                    <strong className={styles.locationItemValue}>
                      {recall.distribution_by_location.preparation.toLocaleString()}
                    </strong>
                    <small className={styles.locationItemPercent}>
                      {((recall.distribution_by_location.preparation / stats.totalAffectedUnits) * 100).toFixed(1)}%
                    </small>
                  </div>
                  <div className={styles.locationItem}>
                    <span className={styles.locationItemLabel}>🚚 En transit</span>
                    <strong className={styles.locationItemValue}>
                      {recall.distribution_by_location.in_transit.toLocaleString()}
                    </strong>
                    <small className={styles.locationItemPercent}>
                      {((recall.distribution_by_location.in_transit / stats.totalAffectedUnits) * 100).toFixed(1)}%
                    </small>
                  </div>
                  <div className={styles.locationItem}>
                    <span className={styles.locationItemLabel}>📨 Livré au client</span>
                    <strong className={styles.locationItemValue}>
                      {recall.distribution_by_location.delivered.toLocaleString()}
                    </strong>
                    <small className={styles.locationItemPercent}>
                      {((recall.distribution_by_location.delivered / stats.totalAffectedUnits) * 100).toFixed(1)}%
                    </small>
                  </div>
                </div>
              </div>

              {/* Répartition par centre - CONTEXTE SUISSE */}
              <div className={styles.card}>
                <h3 className={styles.cardSubtitle}>Répartition par centre (Suisse)</h3>
                <div className={styles.centerGrid}>
                  {DISTRIBUTION_CENTERS.map((dc) => {
                    const qty = recall.distribution_by_center[dc.id] || 0;
                    const centerStats = impactsByCenter[dc.id] || { confirmed: 0, pending: 0, total: 0 };

                    return (
                      <div key={dc.id} className={styles.centerItem}>
                        <div className={styles.centerItemHeader}>
                          <strong className={styles.centerItemName}>
                            {dc.code} - {dc.name}
                          </strong>
                          <span className={styles.centerItemBadge}>{dc.city}</span>
                        </div>
                        <div className={styles.centerItemAddress}>
                          {dc.address}, {dc.postalCode} {dc.city}
                        </div>
                        <div className={styles.centerItemPhone}>📞 {dc.phone}</div>
                        <div className={styles.centerItemStats}>
                          <div className={styles.centerItemValue}>{qty.toLocaleString()} unités</div>
                          <div className={styles.centerItemConfirmation}>
                            ✅ {centerStats.confirmed} / ⏳ {centerStats.pending}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions QHSE */}
              <div className={styles.card}>
                <h3 className={styles.cardSubtitle}>Actions QHSE</h3>
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
                    className={`${styles.actionBtn} ${liveStats.pending === 0 ? styles.disabled : ""}`}
                    onClick={handleConfirmAll}
                    disabled={liveStats.pending === 0}
                  >
                    Confirmer tous ({liveStats.confirmed}/{liveStats.total})
                  </button>
                </div>
              </div>

              {/* Stats confirmations en temps réel */}
              <div className={styles.card}>
                <h3 className={styles.cardSubtitle}>État des confirmations (TEMPS RÉEL)</h3>
                <div className={styles.statsRow}>
                  <div className={styles.statsRowItem}>
                    <strong style={{ color: "#10b981" }}>✅ Confirmés:</strong> {liveStats.confirmed} clients
                  </div>
                  <div className={styles.statsRowItem}>
                    <strong style={{ color: "#f59e0b" }}>⏳ En attente:</strong> {liveStats.pending} clients
                  </div>
                  <div className={styles.statsRowItem}>
                    <strong>📊 Taux:</strong> {liveStats.confirmationRate}%
                  </div>
                </div>
                {realtimeEnabled && (
                  <div className={styles.realtimeIndicator}>
                    <span className={styles.realtimePulse}></span>
                    {realtimePaused ? "⏸ Simulation PAUSÉE" : "🔴 Simulation EN COURS"}
                  </div>
                )}
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
            <h2 className={styles.clientsHeaderTitle}>
              Clients impactés ({filteredImpacts.length})
            </h2>
            <div className={styles.controls}>
              <label className={styles.controlsLabel}>
                <input
                  type="checkbox"
                  checked={filterUnconfirmedOnly}
                  onChange={(e) => setFilterUnconfirmedOnly(e.target.checked)}
                />
                Non confirmés uniquement
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={styles.controlsSelect}
              >
                <option value="center">Trier par centre</option>
                <option value="status">Trier par localisation</option>
                <option value="name">Trier par client</option>
              </select>
            </div>
          </div>

          <div className={styles.clientsTable}>
            <table className={styles.clientsTableElement}>
              <thead className={styles.clientsTableHead}>
                <tr>
                  <th className={styles.clientsTableHeadCell}>Client</th>
                  <th className={styles.clientsTableHeadCell}>Email</th>
                  <th className={styles.clientsTableHeadCell}>Téléphone</th>
                  <th className={styles.clientsTableHeadCell}>Centre</th>
                  <th className={styles.clientsTableHeadCell}>Localisation</th>
                  <th className={styles.clientsTableHeadCell}>Unités</th>
                  <th className={styles.clientsTableHeadCell}>Notifications</th>
                  <th className={styles.clientsTableHeadCell}>Statut</th>
                  <th className={styles.clientsTableHeadCell}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredImpacts.map((impact) => {
                  const customer = DEMO_CUSTOMERS.find((c) => c.id === impact.customer_id);
                  const center = DISTRIBUTION_CENTERS.find(
                    (c) => c.id === impact.distribution_center_id,
                  );

                  if (!customer || !center) return null;

                  const notificationStatus = `${impact.sms_sent ? "✅ SMS" : "❌ SMS"} | ${impact.email_sent ? "✅ Email" : "❌ Email"}`;
                  const isPending = impact.confirmed_status === "pending";
                  const isHighRisk = impact.location === "delivered";

                  return (
                    <tr
                      key={impact.customer_id}
                      className={`${styles.clientsTableRow} ${isPending ? styles.rowPending : styles.rowConfirmed} ${isHighRisk ? styles.rowHighRisk : ""}`}
                    >
                      <td className={styles.clientsTableCell}>
                        <strong className={styles.clientsTableCellStrong}>
                          {customer.prenom} {customer.nom}
                        </strong>
                      </td>
                      <td className={styles.clientsTableCell}>{customer.email}</td>
                      <td className={styles.clientsTableCell}>{customer.telephone}</td>
                      <td className={styles.clientsTableCell}>
                        <strong>{center.code}</strong> {center.city}
                      </td>
                      <td className={styles.clientsTableCell}>
                        <span className={styles.badge}>
                          {impact.location === "stock" && "📦 Stock"}
                          {impact.location === "preparation" && "📋 Préparation"}
                          {impact.location === "in_transit" && "🚚 Transit"}
                          {impact.location === "delivered" && "📨 Livré"}
                        </span>
                      </td>
                      <td className={styles.clientsTableCell}>{impact.qty_units}</td>
                      <td className={styles.clientsTableCell}>{notificationStatus}</td>
                      <td className={styles.clientsTableCell}>
                        <span
                          className={`${styles.statusBadge} ${isPending ? styles.badgePending : styles.badgeConfirmed}`}
                        >
                          {isPending ? (
                            <>
                              <span className={styles.blinkAnimation}>●</span> EN ATTENTE
                            </>
                          ) : (
                            "✅ CONFIRMÉ"
                          )}
                        </span>
                      </td>
                      <td className={styles.clientsTableCell}>
                        {isPending && (
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
