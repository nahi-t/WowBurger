import React, { useEffect, useState } from 'react';
import { X, Settings, AlertTriangle, Check, RefreshCw } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  email: string;
  loading: boolean;
  onClose: () => void;
  onSave: (data: { email?: string; password?: string }) => void;
}

export default function ProfileModal({ isOpen, email, loading, onClose, onSave }: ProfileModalProps) {
  const [newEmail, setNewEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewEmail(email);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    if (!newPassword && newEmail === email) {
      alert('Please enter at least one field to update.');
      return;
    }

    const updateData: any = {};

    if (newEmail && newEmail !== email) {
      updateData.email = newEmail;
    }

    if (newPassword) {
      updateData.password = newPassword;
    }

    onSave(updateData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-55">
      <div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl relative">
        <div className="border-b border-stone-900 p-6 flex justify-between items-center">
          <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
            <Settings size={18} className="text-amber-500" />
            <span>Update Profile</span>
          </h3>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-900 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-2">
              Current Email
            </label>
            <p className="bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-sm">
              {email}
            </p>
            <p className="text-xs text-stone-500 mt-1 font-mono">Current logged-in email</p>
          </div>

          <div className="pt-2 border-t border-stone-900 space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                New Email (Optional)
              </label>
              <input
                type="email"
                placeholder="Enter new email"
                className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                New Password (Optional)
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {newPassword && newPassword !== confirmPassword && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs flex gap-2 items-center">
              <AlertTriangle size={16} className="text-red-500 shrink-0" />
              <span>Passwords do not match</span>
            </div>
          )}

          <div className="pt-4 border-t border-stone-900 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-stone-900 border border-stone-850 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
