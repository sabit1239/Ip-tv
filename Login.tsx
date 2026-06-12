'use client';

import { useState } from 'react';
import { Credentials } from '@/lib/types';
import { getLiveCategories } from '@/lib/api';
import { Tv, Loader2, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (creds: Credentials) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [server, setServer] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!server || !username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    let cleanServer = server.trim();
    if (!cleanServer.startsWith('http')) cleanServer = 'http://' + cleanServer;

    setLoading(true);
    setError(null);

    try {
      const creds: Credentials = { server: cleanServer, username: username.trim(), password: password.trim() };
      const cats = await getLiveCategories(creds);
      if (!Array.isArray(cats)) throw new Error('Invalid response from server');
      // Save to sessionStorage
      sessionStorage.setItem('iptv_creds', JSON.stringify(creds));
      onLogin(creds);
    } catch (err) {
      setError('Could not connect. Check your server URL and credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 mb-4">
            <Tv className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">StreamFlow</h1>
          <p className="text-gray-500 text-sm mt-1">Connect your IPTV account to start watching</p>
        </div>

        {/* Card */}
        <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6 shadow-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Server URL</label>
              <input
                type="text"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                placeholder="http://yourserver.com:8080"
                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting…
                </>
              ) : (
                'Connect & Watch'
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Your credentials are stored only in your browser session.
        </p>
      </div>
    </div>
  );
}
