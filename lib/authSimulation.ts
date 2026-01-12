/**
 * AUTH SIMULATION MODE
 * ========================
 * Mode démo pour éviter les blocages Supabase Auth en simulation.
 * À réactiver en production : passer en Supabase Auth standard.
 */

import { Profile, UserRole } from './types';

// Comptes démo disponibles - SIMULATION ONLY
const DEMO_ACCOUNTS: Record<string, { password: string; role: UserRole }> = {
  'demo.admin@example.com': { password: 'demo123456', role: 'admin' },
  'demo.production@example.com': { password: 'demo123456', role: 'production' },
  'demo.client@example.com': { password: 'demo123456', role: 'client' },
  'demo.fournisseur@example.com': { password: 'demo123456', role: 'fournisseur' },
  'demo.oncall@example.com': { password: 'demo123456', role: 'oncall' },
  // Fallback : n'importe quel email avec password "demo" ou "demo123456"
};

export async function simulatedLogin(
  email: string,
  password: string
): Promise<{ success: boolean; user?: Profile; error?: string }> {
  // Validation basique
  if (!email || !password) {
    return { success: false, error: 'Email et mot de passe requis' };
  }

  // Mode démo : accepter n'importe quel email avec password = "demo" ou "demo123456"
  const isValidPassword = password === 'demo' || password === 'demo123456';
  
  if (!isValidPassword) {
    return {
      success: false,
      error: '❌ Mot de passe incorrect. Utilise "demo" ou "demo123456"',
    };
  }

  // Déterminer le rôle
  let role: UserRole = 'admin'; // Rôle par défaut
  if (DEMO_ACCOUNTS[email]) {
    role = DEMO_ACCOUNTS[email].role;
  } else {
    // Pour n'importe quel email en mode démo, accorder le rôle admin
    role = 'admin';
  }

  // Créer un profil fictif
  const user: Profile = {
    id: `user-${Date.now()}`,
    email,
    role,
    created_at: new Date().toISOString(),
  };

  return { success: true, user };
}

export function getStoredUser(): Profile | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('simulated_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setStoredUser(user: Profile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('simulated_user', JSON.stringify(user));
  localStorage.setItem('auth_token', `mock-token-${user.id}`);
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('simulated_user');
  localStorage.removeItem('auth_token');
}
