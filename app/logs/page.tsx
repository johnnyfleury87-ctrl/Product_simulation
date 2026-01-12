'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/app/components/PageHeader';

export default function LogsPage() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mode simulation : accepter simulated_user ET user
    const userStr = localStorage.getItem('simulated_user') || localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userStr));

    loadEvents();
  }, [router]);

  const loadEvents = async (type = '') => {
    setLoading(true);
    const url = `/api/events?limit=200${type ? `&type=${type}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    setEvents(data.data || []);
    setLoading(false);
  };

  const handleFilterChange = (type: string) => {
    setTypeFilter(type);
    loadEvents(type);
  };

  const eventTypes = ['SMS_SENT', 'EMAIL_SENT', 'CALL_TRIGGERED', 'ONCALL_ALERT', 'RECEPTION', 'ALLOCATION', 'DELIVERY', 'RECALL_TRIGGERED'];

  return (
    <div style={styles.container}>
      <PageHeader 
        title="Logs - Historique des Événements"
        subtitle="Consultez tous les événements du système"
        icon="📜"
      />

      <main style={styles.main}>
        <div style={styles.filter}>
          <label>Filtre par type: </label>
          <select value={typeFilter} onChange={(e) => handleFilterChange(e.target.value)}>
            <option value="">Tous</option>
            {eventTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <h2>Événements ({events.length})</h2>
        {loading ? (
          <p>Chargement...</p>
        ) : events.length === 0 ? (
          <p>Aucun événement</p>
        ) : (
          <div>
            {events.map((event: any) => (
              <div key={event.id} style={styles.logEntry}>
                <div style={styles.logType}>{event.type}</div>
                <div style={styles.logTime}>
                  {new Date(event.created_at).toLocaleString('fr-FR')}
                </div>
                <pre style={styles.logPayload}>{JSON.stringify(event.payload, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  header: { backgroundColor: '#6c757d', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between' },
  main: { flex: 1, padding: '20px', maxWidth: '1000px', margin: '0 auto', width: '100%' },
  filter: { marginBottom: '20px' },
  logEntry: { backgroundColor: 'white', padding: '15px', marginBottom: '10px', borderRadius: '4px', borderLeft: '4px solid #6c757d' },
  logType: { fontWeight: 'bold', color: '#007bff', marginBottom: '5px' },
  logTime: { fontSize: '12px', color: '#666', marginBottom: '10px' },
  logPayload: { backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto', fontSize: '12px' },
  btn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
};
