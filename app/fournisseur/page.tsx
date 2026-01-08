'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FournisseurPage() {
  const [user, setUser] = useState<any>(null);
  const [productId, setProductId] = useState('');
  const [dlcRef, setDlcRef] = useState('');
  const [severity, setSeverity] = useState('MEDIUM');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
  }, [router]);

  const handleCreateRecall = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const res = await fetch('/api/recalls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        dlc_ref: dlcRef,
        severity,
      }),
    });

    const result = await res.json();
    if (result.success) {
      setMessage(`✅ Rappel créé - ${result.data.customers_notified} clients notifiés`);
      setProductId('');
      setDlcRef('');
    } else {
      setMessage(`❌ ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Vue Fournisseur</h1>
        <button onClick={() => {
          localStorage.clear();
          router.push('/login');
        }} style={styles.btn}>Déconnexion</button>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h2>Créer un rappel produit</h2>
          <form onSubmit={handleCreateRecall}>
            <div style={styles.formGroup}>
              <label>ID Produit (UUID)</label>
              <input
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="uuid..."
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label>DLC de référence</label>
              <input
                type="date"
                value={dlcRef}
                onChange={(e) => setDlcRef(e.target.value)}
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Sévérité</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)} disabled={loading}>
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>CRITICAL</option>
              </select>
            </div>

            {message && <div style={styles.message}>{message}</div>}

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Création...' : 'Créer rappel'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  header: { backgroundColor: '#fd7e14', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between' },
  main: { flex: 1, padding: '20px', maxWidth: '600px', margin: '0 auto', width: '100%' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  formGroup: { marginBottom: '15px' },
  message: { padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#d4edda' },
  submitBtn: { width: '100%', padding: '10px', backgroundColor: '#fd7e14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
};
