import React, { useState, useEffect, FormEvent } from 'react';
import { ArrowLeft, Shield, AlertTriangle, RefreshCw, Key } from 'lucide-react';
import { login, getToken, getUserId, removeToken } from '../services/api';
import AdminDashboard from './admin/AdminDashboard';

interface AdminPanelProps {
  onBack: () => void;
  onRefreshData: () => void;
}

export default function AdminPanel({ onBack, onRefreshData }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('admin@g.com');
  const [password, setPassword] = useState<string>('admin123');
  const [userId, setUserId] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Synchronize layout bounds with persistent localStorage security tokens on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      setUserId(getUserId() || '');
    }
  }, []);

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const data = await login(email, password);
      
      // Fixed: Securely handles alternative property mappings across varying endpoint structures
      if (data && ((data as any).access_token || (data as any).token)) {
        setIsLoggedIn(true);
        setUserId(data.userId || (data as any).user?.id || getUserId() || '');
        setPassword(''); // Clear reference context for safety
        onRefreshData();
      } else {
        throw new Error('Invalid authentication response structure received from server.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAction = () => {
    removeToken();
    setIsLoggedIn(false);
    setUserId('');
    onRefreshData();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-red-500 selection:text-white" id="admin-login-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />

        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-1.5 bg-stone-850 hover:bg-stone-800 text-stone-300 font-bold text-xs py-2.5 px-4 rounded-xl border border-stone-800 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} className="text-red-500" />
          <span>Exit Admin Portal</span>
        </button>

        <div className="w-full max-w-md bg-stone-950/80 backdrop-blur-md border border-stone-800 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-red-950/50 mb-3 animate-pulse">
              <Shield size={22} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white uppercase">Wow Burger Console</h2>
            <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mt-1">Authorized Administration Login</p>
          </div>

          {authError && (
            <div className="mb-4 bg-red-900/20 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs flex gap-2 items-center">
              <AlertTriangle size={16} className="text-red-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Security Password
              </label>
              <input
                type="password"
                required
                className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-red-900/30 hover:scale-[1.02] cursor-pointer flex justify-center items-center gap-1.5"
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Key size={14} />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-stone-900 pt-4 text-center">
            <span className="text-[9px] font-mono text-stone-600 block uppercase">
              Grass-fed Database Management Panel • 2026
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard
      userId={userId}
      email={email}
      onBack={handleLogoutAction}
      onRefreshData={onRefreshData}
    />
  );
}