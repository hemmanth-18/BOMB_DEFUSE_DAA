import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/audio';
import { ArrowLeft, User, Shield, Check, Save } from 'lucide-react';
import { isSupabaseConfigured } from '../api/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const user = useGameStore(s => s.user);
  const setUser = useGameStore(s => s.setUser);

  const [username, setUsername] = useState(user?.username || 'Agent Hazard');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    sound.playClick();
    setUser({
      ...user,
      username: username.trim() || 'Agent Hazard',
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="min-h-screen bg-tactical-950 text-slate-100 p-4 sm:p-8 flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-tactical-800 pb-4 mb-6">
          <button
            onClick={() => { sound.playClick(); navigate('/'); }}
            className="flex items-center gap-2 text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> MAIN MENU
          </button>
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
            OPERATIVE DOSSIER
          </span>
        </div>

        {/* Profile Card */}
        <div className="bg-tactical-900/90 border border-tactical-700 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 border-2 border-cyan-300 flex items-center justify-center text-slate-950 shadow-lg">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-slate-100">{user?.username}</h2>
              <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3.5 h-3.5" /> SECURITY CLEARANCE: LEVEL 3 DISPOSAL
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[11px]">
                OPERATIVE CALLSIGN / USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={24}
                className="w-full px-4 py-2.5 bg-tactical-950 border border-tactical-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400 text-sm font-mono"
                placeholder="Enter callsign..."
              />
            </div>

            <div className="p-3 bg-tactical-950 rounded-lg border border-tactical-800 text-[11px] text-slate-400">
              <div className="font-bold text-slate-300 mb-1">DATA STORAGE STATUS:</div>
              <div>
                {isSupabaseConfigured ? (
                  <span className="text-emerald-400">Connected to Supabase cloud database</span>
                ) : (
                  <span className="text-amber-400">Offline mode enabled (Local memory vault active)</span>
                )}
              </div>
            </div>

            {savedMsg && (
              <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500 text-emerald-300 flex items-center gap-2 text-xs">
                <Check className="w-4 h-4" /> Callsign updated successfully!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold rounded-lg shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 text-xs"
            >
              <Save className="w-4 h-4" />
              SAVE DOSSIER
            </button>
          </form>
        </div>
      </div>

      <footer className="w-full text-center font-mono text-[11px] text-slate-600 py-4">
        Bomb Defusal Route · Agent Identity Management
      </footer>
    </div>
  );
}
