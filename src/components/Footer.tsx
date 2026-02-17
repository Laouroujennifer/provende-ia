// src/components/Footer.tsx
import { Sprout, Facebook, Twitter, Instagram, Mail, Phone, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Grille principale : 1 col mobile, 2 cols tablette, 4 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. LOGO & BIO */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sprout className="text-slate-950" size={20} />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter">
                Provende<span className="text-emerald-400">Builder</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 italic max-w-xs">
              L'excellence nutritionnelle par la technologie de précision. Optimisez vos coûts, maximisez vos rendements.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-slate-950 transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. NAVIGATION */}
          <div className="text-center sm:text-left">
            <h4 className="font-black mb-8 text-[10px] uppercase tracking-[0.2em] text-emerald-500">Navigation</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-bold uppercase tracking-widest">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Accueil</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Services</Link></li>
              <li><Link to="/formations" className="hover:text-emerald-400 transition-colors">Formations</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* 3. ASSISTANCE */}
          <div className="text-center sm:text-left">
            <h4 className="font-black mb-8 text-[10px] uppercase tracking-[0.2em] text-emerald-500">Assistance</h4>
            <ul className="space-y-6 text-sm text-slate-400 font-medium">
              <li className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-emerald-400">
                    <Mail size={16} />
                </div>
                support@provendebuilder.com
              </li>
              <li className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-emerald-400">
                    <Phone size={16} />
                </div>
                +229 90 00 00 00
              </li>
            </ul>
          </div>

          {/* 4. NEWSLETTER */}
          <div className="text-center sm:text-left">
            <h4 className="font-black mb-8 text-[10px] uppercase tracking-[0.2em] text-emerald-500">Newsletter</h4>
            <p className="text-xs text-slate-500 mb-6 font-medium uppercase tracking-wider">Recevez nos conseils de formulation</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl outline-none text-sm focus:border-emerald-500 focus:bg-white/10 transition-all" 
              />
              <button className="absolute right-2 top-2 bottom-2 bg-emerald-500 text-slate-950 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-emerald-400 transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>© 2026 ProvendeBuilder. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  )
}