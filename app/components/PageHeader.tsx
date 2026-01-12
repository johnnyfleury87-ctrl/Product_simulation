/**
 * PAGE HEADER - COMPOSANT RÉUTILISABLE
 * ===================================
 * En-tête standardisé pour toutes les pages.
 * Inclut titre + sous-titre + bouton retour optionnel.
 */

'use client';

import { useRouter } from 'next/navigation';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  showBackButton?: boolean;
}

export default function PageHeader({ 
  title, 
  subtitle,
  icon = '📄',
  showBackButton = true,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header style={styles.header}>
      <div style={styles.titleSection}>
        <h1 style={styles.title}>
          {icon} {title}
        </h1>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
      
      {showBackButton && (
        <button
          onClick={() => router.push('/dashboard')}
          style={styles.backButton}
        >
          ← Retour
        </button>
      )}
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #ecf0f1',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    margin: '0',
    fontSize: '14px',
    color: '#7f8c8d',
  },
  backButton: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
};
