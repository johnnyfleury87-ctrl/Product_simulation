/**
 * BACK TO MENU BUTTON - COMPOSANT RÉUTILISABLE
 * ============================================
 * Bouton simple pour revenir au dashboard depuis n'importe où.
 * À ajouter sur chaque vue.
 */

'use client';

import { useRouter } from 'next/navigation';

export interface BackToMenuButtonProps {
  label?: string;
  style?: React.CSSProperties;
}

export default function BackToMenuButton({ 
  label = '← Retour au menu principal',
  style: customStyle,
}: BackToMenuButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/dashboard')}
      style={{
        ...styles.button,
        ...customStyle,
      }}
    >
      {label}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    marginBottom: '20px',
  },
};
