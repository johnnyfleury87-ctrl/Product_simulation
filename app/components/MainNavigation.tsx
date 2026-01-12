/**
 * NAVIGATION GLOBALE - DÉSACTIVÉE
 * ===================================
 * Ce composant a été désactivé car la démo n'utilise plus de navigation.
 * Accédez directement à /qhse
 */

export default function MainNavigation() {
  return null;
}

export interface NavigationItem {
  label: string;
  icon: string;
  route: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [];
