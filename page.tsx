'use client';

import { useState, useEffect } from 'react';
import { Credentials } from '@/lib/types';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('iptv_creds');
      if (stored) {
        setCredentials(JSON.parse(stored));
      }
    } catch {}
    setChecked(true);
  }, []);

  const handleLogin = (creds: Credentials) => {
    setCredentials(creds);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('iptv_creds');
    setCredentials(null);
  };

  if (!checked) return null;

  if (!credentials) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard credentials={credentials} onLogout={handleLogout} />;
}
