import { Target, ShieldCheck } from 'lucide-react'

export function About() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white">
      {/* HERO sombre avec glow orange */}
      <section className="relative bg-[#0A0A0A] pt-48 pb-40 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#FF6800]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8">
            Notre <span className="text-[#FF6800]">Vocation</span>.
          </h1>
          <p className="text-xl text-white/60 leading-relaxed font-medium">
            Accompagner la souveraineté alimentaire par la technologie et la précision nutritionnelle.
          </p>
        </div>
      </section>

      {/* SECTION CONTENT */}
      <section className="py-32 px-6 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2000" 
                className="rounded-[3rem] shadow-2xl border border-[#2A2A2A]" 
                alt="Ferme Moderne" 
              />
              <div className="absolute top-10 -right-10 w-64 h-64 bg-[#FF6800] rounded-full blur-3xl opacity-10 -z-10" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white leading-tight mb-8">
                Démocratiser la <span className="text-[#FF6800]">science animale</span>.
              </h2>
              <p className="text-lg text-white/50 mb-8 leading-relaxed italic font-medium">
                ProvendeBuilder n'est pas né dans un bureau climatisé, mais dans les hangars d'élevage.
              </p>
              <p className="text-lg text-white/60 mb-10 leading-relaxed">
                Notre mission est d'offrir à chaque éleveur, qu'il possède 50 ou 50 000 têtes, les outils de calcul autrefois réservés aux grandes firmes industrielles. Nous croyons qu'une meilleure nutrition mène à une viande plus saine et une économie plus forte.
              </p>
              <div className="grid grid-cols-2 gap-12">
                {[
                  { t: "Indépendance", d: "Libérez-vous des prix imposés.", i: <Target className="text-[#FF6800]"/> },
                  { t: "Qualité", d: "Zéro carence dans vos bandes.", i: <ShieldCheck className="text-[#FF6800]"/> },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl hover:border-[#FF6800]/40 transition-all">
                    <div className="mb-4">{item.i}</div>
                    <h4 className="text-xl font-black text-white mb-2">{item.t}</h4>
                    <p className="text-sm text-white/50 leading-relaxed font-medium">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}