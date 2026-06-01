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
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Glow orange en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-[#FF6800]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Retour Accueil */}
      <Link to="/" className="absolute top-10 left-10 text-white/40 hover:text-[#FF6800] flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all z-20">
        <ArrowLeft size={14} /> Accueil
      </Link>

      {/* Logo Section */}
      <div className="mb-10 flex flex-col items-center gap-4 relative z-10 text-center">
        <div className="w-12 h-12 bg-[#FF6800] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF6800]/30">
          <Sprout className="text-white" size={28} />
        </div>
        <h1 className="text-xl font-black uppercase text-white tracking-tighter">
          PROVENDE<span className="text-[#FF6800]">BUILDER</span>
        </h1>
      </div>

      {/* Login Card — fond gris foncé pour cohérence */}
      <div className="w-full max-w-md bg-[#1A1A1A] rounded-[2rem] p-10 md:p-12 shadow-2xl relative z-10 border border-[#2A2A2A]">
        <div className="text-center mb-10 text-white">
          <h2 className="text-3xl font-black tracking-tight">Se connecter</h2>
          <p className="text-white/50 font-medium mt-2 text-sm">Accédez à votre outil de formulation</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Adresse Mail</label>
            <input 
              type="email" 
              required 
              placeholder="nom@exemple.com" 
              className="w-full p-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl outline-none focus:border-[#FF6800] focus:bg-[#0A0A0A] transition-all font-medium text-white placeholder:text-white/20" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          {/* Password avec toggle visibilité */}
          <div className="space-y-2">
            <div className="flex justify-between px-1">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Mot de passe</label>
                <Link to="/reset" className="text-[10px] font-bold text-[#FF6800] uppercase tracking-widest hover:text-[#FF8533]">Oublié ?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="••••••••" 
                className="w-full p-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl outline-none focus:border-[#FF6800] transition-all font-medium text-white placeholder:text-white/20" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#FF6800] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button 
            disabled={isLoading} 
            className="w-full py-5 bg-[#FF6800] text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#FF6800]/30 hover:bg-[#FF8533] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>SE CONNECTER <ArrowRight size={16} /></>}
          </button>
        </form>
        
        <p className="text-center mt-10 text-white/50 font-medium text-sm">
          Nouveau ? <Link to="/register" className="text-[#FF6800] font-black border-b-2 border-[#FF6800]/20 hover:border-[#FF6800] transition-all ml-1">S'inscrire gratuitement</Link>
        </p>
      </div>

      <p className="mt-12 text-white/20 text-[10px] font-bold uppercase tracking-widest relative z-10">
        © 2026 ProvendeBuilder — Sécurité Cloud
      </p>
    </div>
  );
}