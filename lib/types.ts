// Types TypeScript pour le système de traçabilité

// Rôles utilisateur
export type UserRole = 'admin' | 'production' | 'client' | 'fournisseur' | 'oncall';

// Statuts lot
export type LotStatus = 'ARRIVAGE' | 'STOCK' | 'RAYON' | 'BLOQUE' | 'RAPPEL';

// Statuts commande
export type OrderStatus = 'CREATED' | 'PICKING' | 'SHIPPED' | 'DELIVERED' | 'PARTIALLY_ALLOCATED' | 'BACKORDER' | 'REJECTED';

// Types mouvements
export type MovementType = 'INBOUND' | 'MOVE' | 'PICK' | 'SHIP' | 'DELIVER' | 'BLOCK';

// Statuts allocation
export type AllocationStatus = 'RESERVED' | 'PICKED' | 'SHIPPED' | 'DELIVERED';

// Sévérité rappel
export type RecallSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Statuts rappel
export type RecallStatus = 'ACTIVE' | 'RESOLVED' | 'CANCELLED';

// Types d'événements
export type EventType = 'SMS_SENT' | 'EMAIL_SENT' | 'CALL_TRIGGERED' | 'ONCALL_ALERT' | 'RECEPTION' | 'ALLOCATION' | 'DELIVERY' | 'RECALL_TRIGGERED' | 'ESCALATION_RESOLVED';

// Statuts notification
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

// Statuts ACK
export type AckStatus = 'PENDING' | 'ACKNOWLEDGED';

// Statuts escalade
export type EscalationStatus = 'NONE' | 'TRIGGERED' | 'ONCALL_NOTIFIED' | 'RESOLVED';

// Interfaces DB
export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface ProductRange {
  id: string;
  name: string;
  category: 'FRAIS' | 'FRUITS_LEGUMES' | 'CONGELES' | 'SECS' | 'VOLUMINEUX';
  dlc_min_days: number;
  dlc_max_days: number;
  daily_demand_weight: number;
}

export interface Product {
  id: string;
  product_code: string;
  name: string;
  range_id: string;
  unit: string;
  active: boolean;
  created_at: string;
}

export interface Lot {
  id: string;
  product_id: string;
  lot_code: string;
  dlc: string;
  status: LotStatus;
  created_at: string;
}

export interface Customer {
  id: string;
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
  email: string;
  demo_imei: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  qty: number;
}

export interface Allocation {
  id: string;
  order_item_id: string;
  lot_id: string;
  qty: number;
  status: AllocationStatus;
}

export interface Recall {
  id: string;
  product_id: string;
  dlc_ref: string;
  dlc_start: string;
  dlc_end: string;
  severity: RecallSeverity;
  status: RecallStatus;
  created_at: string;
}

export interface RecallNotification {
  id: string;
  recall_id: string;
  customer_id: string;
  sms_status: NotificationStatus;
  email_status: NotificationStatus;
  ack_status: AckStatus;
  escalation_status: EscalationStatus;
  sent_at: string | null;
  acked_at: string | null;
  created_at: string;
}

export interface EventLog {
  id: string;
  type: EventType;
  payload: Record<string, any>;
  created_at: string;
}

export interface SimRun {
  id: string;
  status: 'READY' | 'RUNNING' | 'PAUSED' | 'DONE';
  orders_per_day: number;
  days: number;
  tick_seconds: number;
  current_day: number;
  current_tick: number;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Profile;
  token: string;
}

export interface ScanRequest {
  product_code: string;
  lot_code: string;
  dlc: string;
  qty: number;
}

export interface CreateOrderRequest {
  customer_id: string;
  items: Array<{
    product_id: string;
    qty: number;
  }>;
}

export interface CreateRecallRequest {
  product_id: string;
  dlc_ref: string;
  severity: RecallSeverity;
}

export interface AckRecallRequest {
  notification_id: string;
}
