'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/lib/types';
import PageHeader from '@/app/components/PageHeader';

export default function ProductionPage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [productCode, setProductCode] = useState('');
  const [lotCode, setLotCode] = useState('');
  const [dlc, setDlc] = useState('');
  const [qty, setQty] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Mode simulation : accepter simulated_user ET user
    // Pas de vérification de rôle en mode démo
    const userStr = localStorage.getItem('simulated_user') || localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(userStr) as Profile;
    setUser(userData);
  }, [router]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_code: productCode,
          lot_code: lotCode,
          dlc,
          qty: parseInt(qty),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`✅ Lot créé: ${lotCode}`);
        setProductCode('');
        setLotCode('');
        setDlc('');
        setQty('');
      } else {
        setMessage(`❌ Erreur: ${result.error}`);
      }
    } catch (error) {
      setMessage('❌ Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <PageHeader 
        title="Production - Réception & Stock"
        subtitle="Gestion des arrivages et mouvements de stock"
        icon="🏭"
      />

      <main style={styles.main}>
        <div style={styles.card}>
          <h2>Saisie réception (scanner)</h2>
          <form onSubmit={handleScan}>
            <div style={styles.formGroup}>
              <label>Code produit</label>
              <input
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                placeholder="PROD-001-LAIT"
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Numéro lot</label>
              <input
                value={lotCode}
                onChange={(e) => setLotCode(e.target.value)}
                placeholder="LOT-2024-001"
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Date limite de consommation</label>
              <input
                type="date"
                value={dlc}
                onChange={(e) => setDlc(e.target.value)}
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Quantité</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="100"
                disabled={loading}
              />
            </div>

            {message && (
              <div style={styles.message}>
                {message}
              </div>
            )}

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Traitement...' : 'Valider réception'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  header: { backgroundColor: '#28a745', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between' },
  main: { flex: 1, padding: '20px', maxWidth: '600px', margin: '0 auto', width: '100%' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  formGroup: { marginBottom: '15px' },
  message: { padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#d4edda' },
  submitBtn: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
};
