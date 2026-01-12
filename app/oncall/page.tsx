'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/app/components/PageHeader';

export default function OncallPage() {
  const [user, setUser] = useState<any>(null);
  const [escalations, setEscalations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Mode simulation : accepter simulated_user ET user
    const userStr = localStorage.getItem('simulated_user') || localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    // Charger escalades non résolues
    fetch('/api/events?type=ONCALL_ALERT&limit=50')
      .then(r => r.json())
      .then(d => setEscalations(d.data || []));
  }, [router]);

  return (
    <div style={styles.container}>
      <PageHeader 
        title="On-call - Gestion des Escalades"
        subtitle="Gérez les escalades de rappels"
        icon="🚨"
      />

      <main style={styles.main}>
        <h2>Escalades actives ({escalations.length})</h2>
        {escalations.length === 0 ? (
          <p>Aucune escalade en cours</p>
        ) : (
          <div>
            {escalations.map((esc: any) => (
              <div key={esc.id} style={styles.card}>
                <p><strong>Client ID:</strong> {esc.payload?.customer_id}</p>
                <p><strong>Rappel ID:</strong> {esc.payload?.recall_id}</p>
                <p><strong>Temps escalade:</strong> {esc.payload?.escalation_time}s</p>
                <p><strong>Créé:</strong> {new Date(esc.created_at).toLocaleString()}</p>
                <button style={styles.resolveBtn}>✓ Résolu</button>
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
  header: { backgroundColor: '#dc3545', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between' },
  main: { flex: 1, padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' },
  card: { backgroundColor: 'white', padding: '15px', marginBottom: '15px', borderRadius: '8px', borderLeft: '4px solid #dc3545' },
  resolveBtn: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
  btn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
};
