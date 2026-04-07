import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sprout, ArrowLeft, ArrowRight, Loader2, Gift, Ticket, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { AuthError } from '@supabase/supabase-js';

export function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // États du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        referred_by: referralCode
      });

      if (error) throw error;
      if (data.user) {
        alert("Inscription réussie ! Connectez-vous pour commencer.");
        navigate('/login');
      }
    } catch (err) {
      const error = err as AuthError;
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Retour */}
      <Link to="/" className="absolute top-10 left-10 text-white/40 hover:text-white flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all">
        <ArrowLeft size={14} /> Accueil
      </Link>

      {/* Logo Section */}
      <div className="mb-10 flex flex-col items-center gap-4 relative z-10">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
          <Sprout className="text-slate-950" size={28} />
        </div>
        <span className="text-xl font-black uppercase tracking-tighter">
          PROVENDE<span className="text-emerald-400">BUILDER</span>
        </span>
      </div>

      {/* Card Inscription */}
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10 text-slate-900 border border-white/5">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight">Inscription</h2>
          {referralCode && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px] uppercase tracking-widest">
              <Gift size={12} /> Bonus Parrainage Activé
            </div>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Prénom / Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                <input 
                type="text" required placeholder="Jean" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm font-medium" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                />
            </div>
            <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                <input 
                type="text" required placeholder="Koffi" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm font-medium" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" required placeholder="nom@exemple.com" 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm font-medium" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          {/* Mot de passe + Eye Icon */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="••••••••" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm font-medium" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {/* Parrainage */}
          <div className="space-y-1 pt-2">
            <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Ticket size={10} /> Code Parrainage (Optionnel)
            </label>
            <input 
              type="text" 
              placeholder="EX: PB-KOFFI-2024" 
              className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-2xl outline-none text-emerald-700 font-bold uppercase placeholder:text-emerald-200 text-sm" 
              value={referralCode} 
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())} 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 group shadow-xl shadow-emerald-500/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>CRÉER MON COMPTE <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-medium text-sm">
          Déjà inscrit ? <Link to="/login" className="text-emerald-600 font-black border-b-2 border-emerald-50 hover:border-emerald-500 transition-all ml-1">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}