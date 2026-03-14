import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { AuthError } from '@supabase/supabase-js';

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <Link to="/" className="absolute top-10 left-10 text-white/40 hover:text-white flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all">
        <ArrowLeft size={14} /> Accueil
      </Link>

      <div className="mb-10 flex flex-col items-center gap-4 relative z-10">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
          <Sprout className="text-slate-950" size={28} />
        </div>
        <h1 className="text-xl font-black uppercase text-white tracking-tighter">
          PROVENDE<span className="text-emerald-400">BUILDER</span>
        </h1>
      </div>

      {/* Remplacement max-w-[440px] par max-w-110 selon suggestion Tailwind */}
      <div className="w-full max-w-110 bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl relative z-10">
        <div className="text-center mb-10 text-slate-900">
          <h2 className="text-3xl font-black">Se connecter</h2>
          <p className="text-slate-400 font-medium mt-2 text-sm">Accédez à votre outil de formulation</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <input type="email" required placeholder="Email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-900" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" required placeholder="Mot de passe" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-900" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <button disabled={isLoading} className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
            {isLoading ? <Loader2 className="animate-spin" /> : <>SE CONNECTER <ArrowRight size={16} /></>}
          </button>
        </form>
        
        <p className="text-center mt-10 text-slate-500 font-medium text-sm">
          Nouveau ? <Link to="/register" className="text-emerald-600 font-black ml-1">S'inscrire</Link>
        </p>
      </div>

      <p className="mt-12 text-white/20 text-[10px] font-bold uppercase tracking-widest">
        © 2026 ProvendeBuilder
      </p>
    </div>
  );
}