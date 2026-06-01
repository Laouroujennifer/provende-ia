// src/components/Footer.tsx
import { Sprout, Facebook, Twitter, Instagram, Mail, Phone, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. LOGO & BIO */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FF6800] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6800]/30">
                <Sprout className="text-white" size={20} />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter">
                Provende<span className="text-[#FF6800]">Builder</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 italic max-w-xs">
              L'excellence nutritionnelle par la technologie de précision. Optimisez vos coûts, maximisez vos rendements.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full flex items-center justify-center hover:bg-[#FF6800] hover:border-[#FF6800] hover:text-white transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. NAVIGATION */}
          <div className="text-center sm:text-left">
            <h4 className="font-black mb-8 text-[10px] uppercase tracking-[0.2em] text-[#FF6800]">Navigation</h4>
            <ul className="space-y-4 text-sm text-white/40 font-bold uppercase tracking-widest">
              <li><Link to="/" className="hover:text-[#FF6800] transition-colors">Accueil</Link></li>
              <li><Link to="/services" className="hover:text-[#FF6800] transition-colors">Services</Link></li>
              <li><Link to="/formations" className="hover:text-[#FF6800] transition-colors">Formations</Link></li>
              <li><Link to="/contact" className="hover:text-[#FF6800] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* 3. ASSISTANCE */}
          <div className="text-center sm:text-left">
            <h4 className="font-black mb-8 text-[10px] uppercase tracking-[0.2em] text-[#FF6800]">Assistance</h4>
            <ul className="space-y-6 text-sm text-white/40 font-medium">
              <li className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-8 h-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg flex items-center justify-center text-[#FF6800]">
                    <Mail size={16} />
                </div>
                support@provendebuilder.com
              </li>
              <li className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-8 h-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg flex items-center justify-center text-[#FF6800]">
                    <Phone size={16} />
                </div>
                +229 90 00 00 00
              </li>
            </ul>
          </div>

          {/* 4. NEWSLETTER */}
          <div className="text-center sm:text-left">
            <h4 className="font-black mb-8 text-[10px] uppercase tracking-[0.2em] text-[#FF6800]">Newsletter</h4>
            <p className="text-xs text-white/40 mb-6 font-medium uppercase tracking-wider">Recevez nos conseils de formulation</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-4 pr-12 rounded-2xl outline-none text-sm text-white focus:border-[#FF6800] transition-all placeholder:text-white/20" 
              />
              <button className="absolute right-2 top-2 bottom-2 bg-[#FF6800] text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#FF8533] transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="pt-8 border-t border-[#2A2A2A] flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>© 2026 ProvendeBuilder. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#FF6800] transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-[#FF6800] transition-colors">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  )
}