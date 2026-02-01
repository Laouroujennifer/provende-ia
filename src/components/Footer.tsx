// src/components/Footer.tsx
import { Sprout, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Sprout className="text-slate-900" size={18} />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter">Provende<span className="text-emerald-400">Builder</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">
              L'excellence nutritionnelle par l'intelligence artificielle. Optimisez vos coûts, maximisez vos rendements.
            </p>
            <div className="flex gap-4">
              <Facebook size={20} className="text-slate-500 hover:text-emerald-400 transition-colors" />
              <Twitter size={20} className="text-slate-500 hover:text-emerald-400 transition-colors" />
              <Instagram size={20} className="text-slate-500 hover:text-emerald-400 transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-emerald-500">Navigation</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-emerald-500">Assistance</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li className="flex items-center gap-3"><Mail size={16} /> support@provendebuilder.com</li>
              <li className="flex items-center gap-3"><Phone size={16} /> +229 90 00 00 00</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-emerald-500">Newsletter</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="Votre email" className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none flex-1 text-sm focus:border-emerald-500" />
              <button className="bg-emerald-500 text-slate-900 px-4 rounded-xl font-bold text-xs uppercase">OK</button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-slate-500 text-xs font-medium">
          © 2026 ProvendeBuilder. Tous droits réservés. L'IA au service de l'agriculture.
        </div>
      </div>
    </footer>
  )
}