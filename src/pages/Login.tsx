import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Loader2, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { AuthError } from '@supabase/supabase-js';

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      const error = err as AuthError;
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Retour Accueil */}
      <Link to="/" className="absolute top-10 left-10 text-white/40 hover:text-white flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all">
        <ArrowLeft size={14} /> Accueil
      </Link>

      {/* Logo Section */}
      <div className="mb-10 flex flex-col items-center gap-4 relative z-10 text-center">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
          <Sprout className="text-slate-950" size={28} />
        </div>
        <h1 className="text-xl font-black uppercase text-white tracking-tighter">
          PROVENDE<span className="text-emerald-400">BUILDER</span>
        </h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-110 bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl relative z-10 border border-white/5">
        <div className="text-center mb-10 text-slate-900">
          <h2 className="text-3xl font-black tracking-tight">Se connecter</h2>
          <p className="text-slate-400 font-medium mt-2 text-sm">Accédez à votre outil de formulation</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Mail</label>
            <input 
              type="email" 
              required 
              placeholder="nom@exemple.com" 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          {/* Password avec toggle visibilité */}
          <div className="space-y-2">
            <div className="flex justify-between px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot de passe</label>
                <Link to="/reset" className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Oublié ?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="••••••••" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button 
            disabled={isLoading} 
            className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-600"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>SE CONNECTER <ArrowRight size={16} /></>}
          </button>
        </form>
        
        <p className="text-center mt-10 text-slate-500 font-medium text-sm">
          Nouveau ? <Link to="/register" className="text-emerald-600 font-black border-b-2 border-emerald-50 hover:border-emerald-500 transition-all ml-1">S'inscrire gratuitement</Link>
        </p>
      </div>

      <p className="mt-12 text-white/20 text-[10px] font-bold uppercase tracking-widest">
        © 2026 ProvendeBuilder — Sécurité Cloud
      </p>
    </div>
  );
}