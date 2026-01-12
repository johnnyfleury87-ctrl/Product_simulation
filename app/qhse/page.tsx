"use client";

import React, { useState } from "react";
import {
  generateQHSESimulation,
  notifyQHSECentrals,
  sendQHSENotifications,
  confirmQHSEImpact,
  confirmAllQHSEImpactsByStatus,
  getQHSEStats,
  QHSESimulation,
  QHSESimulationConfig,
  OperationType,
  ScenarioType,
  Severity,
  StockStatus,
} from "@/lib/simulateQHSERecall";
import {
  useQHSERealtimeSimulation,
  calculateLiveQHSEStats,
  getQHSEImpactsByCenter,
  getQHSEImpactsByStatus,
} from "@/lib/useQHSERealtimeSimulation";
import { DEMO_PRODUCTS, DISTRIBUTION_CENTERS } from "@/data/demoCatalog";
import styles from "./page.module.css";

interface FilterState {
  operationType: OperationType | "ALL";
  statusFilter: StockStatus | "ALL";
  confirmationOnly: "ALL" | "pending" | "confirmed";
  centerFilter: string | "ALL";
}

export default function QHSERecallSimulator() {
  const [simulation, setSimulation] = useState<QHSESimulation | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>(DEMO_PRODUCTS[0].id);
  const [selectedDlcRef, setSelectedDlcRef] = useState<string>(getTomorrowDate());
  const [dlcWindowMinus, setDlcWindowMinus] = useState<number>(4);
  const [dlcWindowPlus, setDlcWindowPlus] = useState<number>(2);
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>("MEDIUM");
  const [selectedOperationType, setSelectedOperationType] = useState<OperationType>("RAPPEL");
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>("NORMAL");
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [realtimePaused, setRealtimePaused] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    operationType: "ALL",
    statusFilter: "ALL",
    confirmationOnly: "ALL",
    centerFilter: "ALL",
  });
  const [sortBy, setSortBy] = useState<"center" | "status" | "dlc" | "qty">("status");

  useQHSERealtimeSimulation(
    simulation,
    {
      enabled: realtimeEnabled && !realtimePaused,
      intervalMs: 2000,
      depotConfirmationProb: selectedOperationType === "RETRAIT" ? 0.25 : 0.15,
      transitConfirmationProb: 0.15,
      clientConfirmationProb: 0.1,
    },
    setSimulation,
  );

  const launchSimulation = () => {
    const product = DEMO_PRODUCTS.find((p) => p.id === selectedProduct);
    if (!product) return;

    const config: QHSESimulationConfig = {
      operation_type: selectedOperationType,
      scenario: selectedScenario,
      severity: selectedSeverity,
      product_id: product.id,
      product_name: product.name,
      dlc_reference: selectedDlcRef,
      dlc_window_minus_days: dlcWindowMinus,
      dlc_window_plus_days: dlcWindowPlus,
    };

    const newSim = generateQHSESimulation(config);
    setSimulation(newSim);
    setRealtimeEnabled(true);
    setRealtimePaused(false);
  };

  const handleNotifyCentrals = () => {
    if (simulation) setSimulation(notifyQHSECentrals(simulation));
  };

  const handleSendNotifications = () => {
    if (simulation) setSimulation(sendQHSENotifications(simulation));
  };

  const handleConfirmImpact = (impactId: string) => {
    if (simulation) setSimulation(confirmQHSEImpact(simulation, impactId, "manual"));
  };

  const handleConfirmAllByStatus = (status: StockStatus) => {
    if (simulation) setSimulation(confirmAllQHSEImpactsByStatus(simulation, status));
  };

  const handleResetSimulation = () => {
    setSimulation(null);
    setRealtimeEnabled(false);
    setRealtimePaused(false);
  };

  const liveStats = calculateLiveQHSEStats(simulation);
  const centerStats = getQHSEImpactsByCenter(simulation);
  const statusStats = getQHSEImpactsByStatus(simulation);
  const stats = simulation ? getQHSEStats(simulation) : null;

  let filteredImpacts = simulation?.impacts || [];
  if (filters.operationType !== "ALL") {
    filteredImpacts = filteredImpacts.filter((i) => i.operation_type === filters.operationType);
  }
  if (filters.statusFilter !== "ALL") {
    filteredImpacts = filteredImpacts.filter((i) => i.stock_status === filters.statusFilter);
  }
  if (filters.confirmationOnly !== "ALL") {
    filteredImpacts = filteredImpacts.filter((i) => i.confirmation_status === filters.confirmationOnly);
  }
  if (filters.centerFilter !== "ALL") {
    filteredImpacts = filteredImpacts.filter((i) => i.distribution_center_id === filters.centerFilter);
  }

  filteredImpacts = filteredImpacts.sort((a, b) => {
    if (sortBy === "center") return a.distribution_center_id.localeCompare(b.distribution_center_id);
    if (sortBy === "status") return a.stock_status.localeCompare(b.stock_status);
    if (sortBy === "dlc") return a.dlc.localeCompare(b.dlc);
    return b.qty_units - a.qty_units;
  });

  const dlcRefDate = new Date(selectedDlcRef);
  const dlcMinDate = new Date(dlcRefDate);
  dlcMinDate.setDate(dlcMinDate.getDate() - dlcWindowMinus);
  const dlcMaxDate = new Date(dlcRefDate);
  dlcMaxDate.setDate(dlcMaxDate.getDate() + dlcWindowPlus);

  const formatDate = (date: Date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>🚨 QHSE Recall Simulator - Suisse</div>
          <div className={styles.headerSubtitle}>Simulation de RETRAIT vs RAPPEL avec fenêtre DLC</div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <aside className={styles.leftPanel}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Lancer une opération</div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Produit</label>
              <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className={styles.formSelect}>
                {DEMO_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>DLC Référence</label>
              <input type="date" value={selectedDlcRef} onChange={(e) => setSelectedDlcRef(e.target.value)} className={styles.formInput} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Fenêtre DLC</label>
              <div className={styles.dlcWindowRow}>
                <div className={styles.dlcWindowItem}>
                  <label className={styles.dlcWindowLabel}>- jours</label>
                  <input type="number" min="0" max="30" value={dlcWindowMinus} onChange={(e) => setDlcWindowMinus(Math.max(0, parseInt(e.target.value) || 0))} className={styles.formInput} />
                </div>
                <div className={styles.dlcWindowItem}>
                  <label className={styles.dlcWindowLabel}>+ jours</label>
                  <input type="number" min="0" max="30" value={dlcWindowPlus} onChange={(e) => setDlcWindowPlus(Math.max(0, parseInt(e.target.value) || 0))} className={styles.formInput} />
                </div>
              </div>
              <div className={styles.dlcWindowDisplay}>Du {formatDate(dlcMinDate)} au {formatDate(dlcMaxDate)}</div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Sévérité</label>
              <div className={styles.buttonGroup}>
                {(["LOW", "MEDIUM", "HIGH"] as Severity[]).map((sev) => (
                  <button key={sev} className={`${styles.buttonSmall} ${selectedSeverity === sev ? styles.active : ""} ${styles[`severity-${sev}`]}`} onClick={() => setSelectedSeverity(sev)}>
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Type d'opération</label>
              <div className={styles.buttonGroup}>
                {(["RETRAIT", "RAPPEL"] as OperationType[]).map((type) => (
                  <button key={type} className={`${styles.buttonSmall} ${selectedOperationType === type ? styles.active : ""}`} onClick={() => setSelectedOperationType(type)}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {selectedOperationType === "RAPPEL" && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Scénario</label>
                <select value={selectedScenario} onChange={(e) => setSelectedScenario(e.target.value as ScenarioType)} className={styles.formSelect}>
                  <option value="NORMAL">Normal</option>
                  <option value="WORST_CASE">Pire cas (Livré dominant)</option>
                  <option value="HIGH_TRANSIT">Transit fort</option>
                  <option value="MOSTLY_DELIVERED">Déjà livré</option>
                  <option value="RANDOM">Aléatoire</option>
                </select>
              </div>
            )}

            <button className={styles.launchBtn} onClick={launchSimulation}>▶ Lancer la simulation</button>

            {simulation && (
              <div className={styles.simControls}>
                <button className={`${styles.controlBtn} ${realtimePaused ? styles.paused : ""}`} onClick={() => setRealtimePaused(!realtimePaused)}>
                  {realtimePaused ? "▶ Reprendre" : "⏸ Pause"}
                </button>
                <button className={`${styles.controlBtn} ${styles.reset}`} onClick={handleResetSimulation}>🔄 Réinitialiser</button>
              </div>
            )}
          </div>
        </aside>

        <main className={styles.rightPanel}>
          {simulation && stats ? (
            <>
              <div className={styles.kpisGrid}>
                <div className={`${styles.kpiCard} ${styles.primary}`}><div className={styles.kpiValue}>{simulation.total_units_impacted.toLocaleString()}</div><div className={styles.kpiLabel}>Unités concernées</div></div>
                <div className={`${styles.kpiCard} ${styles.secondary}`}><div className={styles.kpiValue}>{liveStats.total}</div><div className={styles.kpiLabel}>Impacts (lots)</div></div>
                <div className={`${styles.kpiCard} ${styles.success}`}><div className={styles.kpiValue}>{liveStats.confirmed}</div><div className={styles.kpiLabel}>✅ Confirmés</div></div>
                <div className={`${styles.kpiCard} ${styles.warning}`}><div className={styles.kpiValue}>{liveStats.pending}</div><div className={styles.kpiLabel}>⏳ Attente</div></div>
                <div className={`${styles.kpiCard} ${styles.info}`}><div className={styles.kpiValue}>{liveStats.confirmationRate}%</div><div className={styles.kpiLabel}>Taux confirmation</div></div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>Opération</div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}><span className={styles.infoLabel}>Type:</span><span className={styles.infoBadge}>{simulation.operation_type === "RETRAIT" ? "🔵 RETRAIT" : "🟠 RAPPEL"}</span></div>
                  <div className={styles.infoItem}><span className={styles.infoLabel}>Produit:</span><span>{simulation.product_name}</span></div>
                  <div className={styles.infoItem}><span className={styles.infoLabel}>DLC:</span><span>{simulation.dlc_reference}</span></div>
                  <div className={styles.infoItem}><span className={styles.infoLabel}>Fenêtre:</span><span>{simulation.dlc_min} à {simulation.dlc_max}</span></div>
                  <div className={styles.infoItem}><span className={styles.infoLabel}>Sévérité:</span><span className={styles.infoBadge}>{simulation.severity}</span></div>
                  {simulation.operation_type === "RAPPEL" && (
                    <div className={styles.infoItem}><span className={styles.infoLabel}>Scénario:</span><span>{simulation.scenario}</span></div>
                  )}
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>Répartition par Statut</div>
                <div className={styles.statusGrid}>
                  {["DEPOT_STOCK", "IN_TRANSIT", "DELIVERED"].map((status) => {
                    const status_ = status as StockStatus;
                    const stats_ = statusStats[status_] || { total: 0, confirmed: 0, pending: 0 };
                    const isDisabled = simulation.operation_type === "RETRAIT" && status_ !== "DEPOT_STOCK";
                    return (
                      <div key={status_} className={`${styles.statusCard} ${isDisabled ? styles.disabled : ""}`}>
                        <div className={styles.statusCardIcon}>{status_ === "DEPOT_STOCK" && "📦"}{status_ === "IN_TRANSIT" && "🚚"}{status_ === "DELIVERED" && "📨"}</div>
                        <div className={styles.statusCardLabel}>{status_ === "DEPOT_STOCK" && "Dépôt"}{status_ === "IN_TRANSIT" && "Transit"}{status_ === "DELIVERED" && "Livré"}</div>
                        <div className={styles.statusCardValue}>{stats_.total}</div>
                        <div className={styles.statusCardStats}><span style={{ color: "#10b981" }}>✅ {stats_.confirmed}</span><span style={{ color: "#f59e0b" }}>⏳ {stats_.pending}</span></div>
                        {!isDisabled && (<button className={styles.statusCardBtn} onClick={() => handleConfirmAllByStatus(status_)} disabled={stats_.pending === 0}>Confirmer tous</button>)}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>Répartition par Centre (Suisse)</div>
                <div className={styles.centerGrid}>
                  {DISTRIBUTION_CENTERS.map((dc) => {
                    const stats_ = centerStats[dc.id] || { confirmed: 0, pending: 0, total: 0 };
                    return (
                      <div key={dc.id} className={styles.centerCard}>
                        <div className={styles.centerCardCode}>{dc.code}</div>
                        <div className={styles.centerCardName}>{dc.name}</div>
                        <div className={styles.centerCardAddress}>{dc.address}, {dc.postalCode} {dc.city}</div>
                        <div className={styles.centerCardPhone}>📞 {dc.phone}</div>
                        <div className={styles.centerCardStats}>
                          <div style={{ color: "#666", fontSize: "0.9rem" }}>Total: <strong>{stats_.total}</strong></div>
                          <div style={{ color: "#10b981", fontSize: "0.9rem" }}>✅ {stats_.confirmed}</div>
                          <div style={{ color: "#f59e0b", fontSize: "0.9rem" }}>⏳ {stats_.pending}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>Actions QHSE</div>
                <div className={styles.actionsGrid}>
                  <button className={`${styles.actionBtn} ${simulation.central_notified ? styles.disabled : ""}`} onClick={handleNotifyCentrals} disabled={simulation.central_notified}>
                    {simulation.central_notified ? "✅ Centrales averties" : "📢 Avertir les centrales"}
                  </button>
                  <button className={`${styles.actionBtn} ${stats.smsNotificationsSent > 0 ? styles.disabled : ""}`} onClick={handleSendNotifications} disabled={stats.smsNotificationsSent > 0}>
                    {stats.smsNotificationsSent > 0 ? `✅ ${stats.smsNotificationsSent} SMS` : "📧 Envoyer SMS/Email"}
                  </button>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>État (TEMPS RÉEL)</div>
                <div className={styles.realtimeStatus}>
                  <div className={styles.realtimeIndicator}><span className={styles.realtimePulse}></span>{realtimePaused ? "⏸ PAUSÉE" : "🔴 EN COURS"}</div>
                  <div className={styles.statsRow}>
                    <div><strong style={{ color: "#10b981" }}>✅ Confirmés:</strong> {liveStats.confirmed}</div>
                    <div><strong style={{ color: "#f59e0b" }}>⏳ Attente:</strong> {liveStats.pending}</div>
                    <div><strong>📊 Taux:</strong> {liveStats.confirmationRate}%</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}><p>👈 Configurez et lancez une simulation</p></div>
          )}
        </main>
      </div>

      {simulation && (
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>Impacts détaillés ({filteredImpacts.length})</div>
            <div className={styles.tableFilters}>
              <select value={filters.statusFilter} onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value as any })} className={styles.filterSelect}>
                <option value="ALL">Tous les statuts</option>
                <option value="DEPOT_STOCK">Dépôt</option>
                <option value="IN_TRANSIT">Transit</option>
                <option value="DELIVERED">Livré</option>
              </select>
              <select value={filters.confirmationOnly} onChange={(e) => setFilters({ ...filters, confirmationOnly: e.target.value as any })} className={styles.filterSelect}>
                <option value="ALL">Tous</option>
                <option value="pending">Non confirmés</option>
                <option value="confirmed">Confirmés</option>
              </select>
              <select value={filters.centerFilter} onChange={(e) => setFilters({ ...filters, centerFilter: e.target.value as any })} className={styles.filterSelect}>
                <option value="ALL">Tous les centres</option>
                {DISTRIBUTION_CENTERS.map((dc) => (<option key={dc.id} value={dc.id}>{dc.code}</option>))}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className={styles.filterSelect}>
                <option value="status">Trier: Statut</option>
                <option value="center">Trier: Centre</option>
                <option value="dlc">Trier: DLC</option>
                <option value="qty">Trier: Quantité</option>
              </select>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.impactsTable}>
              <thead className={styles.tableHead}>
                <tr><th>Lot</th><th>DLC</th><th>Qty</th><th>Statut</th><th>Centre</th><th>Localisation</th><th>Contact</th><th>Confirmation</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredImpacts.map((impact) => {
                  const isPending = impact.confirmation_status === "pending";
                  const isHighRisk = impact.stock_status === "DELIVERED" && isPending;
                  return (
                    <tr key={impact.id} className={`${styles.tableRow} ${isPending ? styles.rowPending : styles.rowConfirmed} ${isHighRisk ? styles.rowHighRisk : ""}`}>
                      <td className={styles.tableCell}><strong>{impact.lot_code}</strong></td>
                      <td className={styles.tableCell}>{impact.dlc}</td>
                      <td className={styles.tableCell}>{impact.qty_units}</td>
                      <td className={styles.tableCell}><span className={styles.badge}>{impact.stock_status === "DEPOT_STOCK" && "📦 Dépôt"}{impact.stock_status === "IN_TRANSIT" && "🚚 Transit"}{impact.stock_status === "DELIVERED" && "📨 Livré"}</span></td>
                      <td className={styles.tableCell}>{DISTRIBUTION_CENTERS.find((dc) => dc.id === impact.distribution_center_id)?.code}</td>
                      <td className={styles.tableCell}><small>{impact.location_details}</small></td>
                      <td className={styles.tableCell}><small>{impact.contact_name}{impact.contact_phone && <div>{impact.contact_phone}</div>}{impact.contact_email && <div>{impact.contact_email}</div>}</small></td>
                      <td className={styles.tableCell}><span className={`${styles.statusBadge} ${isPending ? styles.badgePending : styles.badgeConfirmed}`}>{isPending ? <><span className={styles.blinkAnimation}>●</span> ATTENTE</> : "✅ OK"}</span></td>
                      <td className={styles.tableCell}>{isPending && (<button className={styles.confirmBtn} onClick={() => handleConfirmImpact(impact.id)}>Confirmer</button>)}</td>
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

function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}
