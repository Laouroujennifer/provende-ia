
import { ShoppingBag, Truck, MapPin, Star } from 'lucide-react'

export function Marketplace() {
  const providers = [
    { name: "Aliment-Pro Bénin", type: "Provendier", location: "Cotonou", rating: 4.9, tags: ["Maïs", "Soja", "Concentré"], img: "🏢" },
    { name: "Poussins-Express", type: "Accouveur", location: "Abomey", rating: 4.7, tags: ["Poussins J1", "Qualité Or"], img: "🐥" },
    { name: "Agri-Tech Africa", type: "Équipementier", location: "Porto-Novo", rating: 4.5, tags: ["Mangeoires", "Abreuvoirs"], img: "⚙️" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4 tracking-tighter">Le Marché des Éleveurs</h2>
          <p className="text-white/50 font-medium max-w-xl">Commandez vos matières premières et équipements directement auprès des fournisseurs certifiés ProvendeBuilder.</p>
        </div>
       <ShoppingBag className="absolute -bottom-5 right-10 ..." />

      </div>

      <div className="space-y-4">
        {providers.map((p, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-xl hover:border-emerald-500/20 transition-all">
            <div className="flex gap-8 items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-4xl flex items-center justify-center text-3xl border border-slate-100 shadow-inner">
                {p.img}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{p.name}</h3>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-[10px] font-black">
                    <Star size={10} fill="currentColor" /> {p.rating}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="text-emerald-600 px-2 py-1 bg-emerald-50 rounded-md flex items-center gap-1"><Truck size={12}/> {p.type}</span>
                  <span className="flex items-center gap-1"><MapPin size={12}/> {p.location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {p.tags.map(t => <span key={t} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-tight">{t}</span>)}
            </div>

            <button className="w-full lg:w-auto px-10 py-5 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all">
              Passer Commande
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}