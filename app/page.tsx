import { redirect } from 'next/navigation';

export default function Page() {
  // Rediriger vers login par défaut
  redirect('/login');
}
