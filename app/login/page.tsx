'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Erreur de connexion');
        setLoading(false);
        return;
      }

      // Sauvegarder le token et l'utilisateur dans localStorage
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));

      // Rediriger selon le rôle
      const role = result.data.user.role;
      const routes: Record<string, string> = {
        admin: '/dashboard',
        production: '/production',
        client: '/client',
        fournisseur: '/fournisseur',
        oncall: '/oncall',
      };

      router.push(routes[role] || '/dashboard');
    } catch (err) {
      setError('Erreur serveur');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Traçabilité Produits & DLC</h1>
        <p style={styles.subtitle}>Système de Simulation</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo.admin@example.com"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo123456"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div style={styles.demoAccounts}>
          <h3>Comptes démo disponibles:</h3>
          <ul style={styles.accountList}>
            <li>demo.admin@example.com (Admin)</li>
            <li>demo.production@example.com (Production)</li>
            <li>demo.client@example.com (Client)</li>
            <li>demo.fournisseur@example.com (Fournisseur)</li>
            <li>demo.oncall@example.com (On-call)</li>
          </ul>
          <p style={styles.passwordNote}>Mot de passe pour tous: <strong>demo123456</strong></p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    margin: '0 0 30px 0',
    fontSize: '14px',
    color: '#666',
  },
  form: {
    marginBottom: '30px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    padding: '10px',
    marginBottom: '15px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    fontSize: '14px',
  },
  demoAccounts: {
    backgroundColor: '#e7f3ff',
    padding: '20px',
    borderRadius: '4px',
    fontSize: '13px',
  },
  accountList: {
    margin: '10px 0',
    paddingLeft: '20px',
  },
  passwordNote: {
    margin: '10px 0 0 0',
    fontStyle: 'italic',
    color: '#666',
  },
};
