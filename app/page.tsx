import { redirect } from 'next/navigation';

export default function Page() {
  // Rediriger directement vers la démo QHSE - pas d'authentification
  redirect('/qhse');
}
