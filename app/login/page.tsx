'use client';

import { redirect } from 'next/navigation';

/**
 * PAGE DE LOGIN - DÉSACTIVÉE
 * ==========================
 * Cette page a été désactivée car la démo n'a pas besoin d'authentification.
 * Accédez directement à /qhse ou à l'URL racine pour la démonstration.
 */

export default function LoginPage() {
  // Rediriger automatiquement vers la démo
  redirect('/qhse');
}
