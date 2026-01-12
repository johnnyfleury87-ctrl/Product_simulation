import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Simulation QHSE - Démonstration',
  description: 'Démonstration interactive de gestion de rappels produits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 0 }}>
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
