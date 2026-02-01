import { Link } from 'react-router-dom'
import { Sprout, ArrowRight } from 'lucide-react'

export function Login() {
  return (
    <div className="min-h-screen bg-[#064e3b] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-10 -ml-48 -mb-48" />

      <div className="w-full max-w-lg bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl relative z-10">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6"><Sprout className="text-[#064e3b]" size={32} /></div>
          <h1 className="text-3xl font-black text-[#064e3b]">Bon retour !</h1>
          <p className="text-slate-400 font-medium mt-2">Accédez à votre espace formulation.</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
            <input type="email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium" placeholder="votre@email.com" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot de passe</label><a href="#" className="text-[10px] font-black text-emerald-600 uppercase">Oublié ?</a></div>
            <input type="password" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium" placeholder="••••••••" />
          </div>
          <button className="w-full py-5 bg-[#064e3b] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">Se connecter <ArrowRight size={16}/></button>
        </form>

        <p className="text-center mt-10 text-slate-500 font-medium text-sm">Pas encore de compte ? <Link to="/register" className="text-emerald-600 font-black border-b-2 border-emerald-100 hover:border-emerald-500 transition-all">Inscrivez-vous</Link></p>
      </div>
    </div>
  )
}