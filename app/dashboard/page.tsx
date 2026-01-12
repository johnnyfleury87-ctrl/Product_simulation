'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/lib/types';

export default function DashboardPage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ orders: 0, products: 0, customers: 0, events: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mode simulation : accepter simulated_user ET user (anciennes données)
    const userStr = localStorage.getItem('simulated_user') || localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userStr) as Profile;
    setUser(userData);

    // Charger les stats
    const loadStats = async () => {
      try {
        const [ordersRes, productsRes, customersRes, eventsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/products'),
          fetch('/api/customers'),
          fetch('/api/events?limit=100'),
        ]);

        const orders = await ordersRes.json();
        const products = await productsRes.json();
        const customers = await customersRes.json();
        const events = await eventsRes.json();

        setStats({
          orders: orders.data?.length || 0,
          products: products.data?.length || 0,
          customers: customers.data?.length || 0,
          events: events.count || 0,
        });
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [router]);

  if (!user) return null;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Control Tower - Dashboard Admin</h1>
        <div>
          <span>{user.email}</span>
          <button onClick={() => {
            localStorage.clear();
            router.push('/login');
          }} style={styles.logoutBtn}>Déconnexion</button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Commandes</h3>
            <p style={styles.stat}>{stats.orders}</p>
          </div>
          <div style={styles.card}>
            <h3>Produits</h3>
            <p style={styles.stat}>{stats.products}</p>
          </div>
          <div style={styles.card}>
            <h3>Clients</h3>
            <p style={styles.stat}>{stats.customers}</p>
          </div>
          <div style={styles.card}>
            <h3>Événements</h3>
            <p style={styles.stat}>{stats.events}</p>
          </div>
        </div>

        <div style={styles.section}>
          <h2>Actions disponibles</h2>
          <ul>
            <li><a href="/production">Production</a> - Gestion réception & stock</li>
            <li><a href="/client">Client</a> - Voir commandes & rappels</li>
            <li><a href="/fournisseur">Fournisseur</a> - Créer rappels</li>
            <li><a href="/oncall">On-call</a> - Gérer escalades</li>
            <li><a href="/logs">Logs</a> - Journal des événements</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  stat: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#007bff',
    margin: '10px 0 0 0',
  },
  section: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '20px',
  },
};
