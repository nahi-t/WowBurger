import React, { FormEvent, Dispatch, SetStateAction } from 'react';
import { Key, AlertTriangle, RefreshCw, Shield, ArrowLeft } from 'lucide-react';

// 1. Define the props interface to match exactly what AdminPanel is sending
interface AdminLoginProps {
  onBack: () => void;
  handleLogin: (e: FormEvent<HTMLFormElement>) => Promise<void> | void;
  loading: boolean;
  authError: string | null;
  email: string;
  setEmail: Dispatch<SetStateAction<string>> | ((val: string) => void);
  password: string;
  setPassword: Dispatch<SetStateAction<string>> | ((val: string) => void);
}

// 2. Use the interface on your component function definition
export default function AdminLogin({
  onBack,
  handleLogin,
  loading,
  authError,
  email,
  setEmail,
  password,
  setPassword
}: AdminLoginProps) { // <-- Change the type annotation here to AdminLoginProps
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_50%)]" />
      
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-1.5 bg-stone-850 hover:bg-stone-800 text-stone-300 font-bold text-xs py-2.5 px-4 rounded-xl border border-stone-800 transition-all cursor-pointer"
      >
        <ArrowLeft size={14} className="text-red-500" />
        <span>Exit Admin Portal</span>
      </button>

      <div className="w-full max-w-md bg-stone-950/80 backdrop-blur-md border border-stone-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-red-950/50 mb-3">
            <Shield size={22} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white uppercase">Wow Burger Console</h2>
        </div>

        {authError && (
          <div className="mb-4 bg-red-900/20 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs flex gap-2 items-center">
            <AlertTriangle size={16} className="text-red-500 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-3 text-stone-100 text-sm focus:outline-none"
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
              className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-3 text-stone-100 text-sm focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all flex justify-center items-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Key size={14} />
                <span>Authenticate Session</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}