/**
 * Hook useAuth - MODE SIMULATION
 * ================================
 * Simplifie la gestion de l'authentification dans les pages.
 * Accepte les utilisateurs simulés et redirige vers login si absent.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from './types';

export function useAuth() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mode simulation : accepter simulated_user ET user
    const userStr = localStorage.getItem('simulated_user') || localStorage.getItem('user');
    
    if (!userStr) {
      router.push('/login');
      setLoading(false);
      return;
    }

    try {
      const userData = JSON.parse(userStr) as Profile;
      setUser(userData);
    } catch (error) {
      console.error('Erreur parsing utilisateur:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('simulated_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user'); // Nettoyer aussi l'ancien format
    router.push('/login');
  };

  return { user, loading, logout };
}
