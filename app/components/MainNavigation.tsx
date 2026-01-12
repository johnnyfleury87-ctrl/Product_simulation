/**
 * NAVIGATION GLOBALE - MODE SIMULATION
 * ===================================
 * Composant réutilisable pour naviguer entre les vues.
 * Visible sur TOUTES les pages après connexion.
 * Aucune vérification de rôle en mode démo.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Profile } from '@/lib/types';

export interface NavigationItem {
  label: string;
  icon: string;
  route: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Dashboard', icon: '🏠', route: '/dashboard' },
  { label: 'Production', icon: '🏭', route: '/production' },
  { label: 'Fournisseur', icon: '📦', route: '/fournisseur' },
  { label: 'Client', icon: '🧾', route: '/client' },
  { label: 'On-call', icon: '🚨', route: '/oncall' },
  { label: 'Logs', icon: '📜', route: '/logs' },
];

export default function MainNavigation() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Récupérer utilisateur du localStorage
    const userStr = localStorage.getItem('simulated_user') || localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Erreur parsing utilisateur:', error);
      }
    }

    // Déterminer la route actuelle (client-side)
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('simulated_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        {/* Left: Logo + Brand */}
        <div style={styles.navBrand}>
          <button
            onClick={() => handleNavigation('/dashboard')}
            style={styles.logoButton}
          >
            📦 Traçabilité DLC
          </button>
        </div>

        {/* Center: Navigation Items */}
        <div style={styles.navLinks}>
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.route}
              onClick={() => handleNavigation(item.route)}
              style={{
                ...styles.navLink,
                ...(currentPath === item.route ? styles.navLinkActive : {}),
              }}
              title={item.label}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right: User Info + Logout */}
        <div style={styles.navRight}>
          {user && (
            <>
              <div style={styles.userInfo}>
                <span style={styles.userEmail}>{user.email}</span>
                <span style={styles.userRole}>({user.role})</span>
              </div>
              <button onClick={handleLogout} style={styles.logoutButton}>
                🚪 Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    padding: '0',
    borderBottom: '3px solid #3498db',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '12px 20px',
    gap: '20px',
  },
  navBrand: {
    flexShrink: 0,
  },
  logoButton: {
    background: 'none',
    border: 'none',
    color: '#ecf0f1',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#34495e',
    },
  },
  navLinks: {
    display: 'flex',
    gap: '0px',
    flex: '1',
    justifyContent: 'center',
    flexWrap: 'wrap',
    minWidth: '300px',
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: '#bdc3c7',
    cursor: 'pointer',
    padding: '8px 12px',
    margin: '0',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
  },
  navLinkActive: {
    backgroundColor: '#3498db',
    color: '#ecf0f1',
    fontWeight: 'bold',
  },
  navIcon: {
    fontSize: '18px',
    display: 'inline-block',
  },
  navLabel: {
    display: 'inline',
    fontSize: '13px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexShrink: 0,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    fontSize: '12px',
  },
  userEmail: {
    color: '#ecf0f1',
    fontWeight: '500',
  },
  userRole: {
    color: '#95a5a6',
    fontSize: '11px',
  },
  logoutButton: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#c0392b',
    },
  },
};
