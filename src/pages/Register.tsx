import { useNavigate, Link } from 'react-router-dom'
import { Sprout, UserPlus, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register() // On simule la création de compte
    navigate('/dashboard') // Redirection immédiate
  }

  return (
    <div className="min-h-screen bg-[#064e3b] flex flex-col items-center justify-center px-6 py-12">
      <Link to="/" className="absolute top-10 left-10 text-emerald-100/50 hover:text-white flex items-center gap-2 font-bold text-sm tracking-widest uppercase transition-all">
        <ArrowLeft size={18} /> Accueil
      </Link>

      <div className="w-full max-w-xl bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sprout className="text-[#064e3b]" size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#064e3b]">Créer votre espace</h1>
          <p className="text-slate-400 font-medium mt-2 text-sm">Prêt à optimiser votre production avicole ?</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom</label>
            <input type="text" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prénom</label>
            <input type="text" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
            <input type="email" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot de passe</label>
            <input type="password" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium" />
          </div>
          <div className="md:col-span-2 mt-4">
            <button type="submit" className="w-full py-5 bg-emerald-500 text-[#064e3b] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
              <UserPlus size={18}/> CRÉER MON COMPTE
            </button>
          </div>
        </form>

        <p className="text-center mt-10 text-slate-500 font-medium text-sm">
          Déjà un compte ? <Link to="/login" className="text-[#064e3b] font-black border-b-2 border-slate-100 hover:border-[#064e3b] transition-all ml-1">Connectez-vous</Link>
        </p>
      </div>
    </div>
  )
}