'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientPage() {
  const [user, setUser] = useState<any>(null);
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    // Charger rappels
    fetch(`/api/recalls?customer_id=${userData.id}`)
      .then(r => r.json())
      .then(d => {
        setRecalls(d.data || []);
        setLoading(false);
      });
  }, [router]);

  const handleAck = async (notificationId: string) => {
    const res = await fetch('/api/recalls/acknowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notification_id: notificationId }),
    });
    const result = await res.json();
    if (result.success) {
      setRecalls(recalls.filter(r => r.id !== notificationId));
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Vue Client</h1>
        <button onClick={() => {
          localStorage.clear();
          router.push('/login');
        }} style={styles.btn}>Déconnexion</button>
      </header>

      <main style={styles.main}>
        <h2>Rappels actifs ({recalls.length})</h2>
        {recalls.length === 0 ? (
          <p>Aucun rappel en cours</p>
        ) : (
          <div>
            {recalls.map((recall: any) => (
              <div key={recall.id} style={styles.card}>
                <p><strong>Produit:</strong> {recall.recall?.product?.name}</p>
                <p><strong>DLC concernée:</strong> {recall.recall?.dlc_ref}</p>
                <p><strong>Sévérité:</strong> {recall.recall?.severity}</p>
                <button
                  onClick={() => handleAck(recall.id)}
                  style={styles.ackBtn}
                >
                  ✓ J'ai lu et compris
                </button>
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
  header: { backgroundColor: '#17a2b8', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between' },
  main: { flex: 1, padding: '20px', maxWidth: '600px', margin: '0 auto', width: '100%' },
  card: { backgroundColor: 'white', padding: '15px', marginBottom: '15px', borderRadius: '8px', borderLeft: '4px solid #ff9800' },
  ackBtn: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
  btn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
};
