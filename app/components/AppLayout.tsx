/**
 * APP LAYOUT - PAGES AUTHENTIFIÉES
 * ===============================
 * Layout pour les pages après authentification.
 * Inclut la navigation globale.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainNavigation from './MainNavigation';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Vérifier authentification
    const user = localStorage.getItem('simulated_user') || localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontSize: '18px',
        color: '#666',
      }}>
        ⏳ Chargement...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MainNavigation />
      <main style={{ flex: 1, padding: '20px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
