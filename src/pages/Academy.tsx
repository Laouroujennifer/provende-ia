import { Play, BookOpen, Star, Lock, Clock } from 'lucide-react'

export function Academy() {
  const modules = [
    { title: "Maîtriser le Démarrage", level: "Débutant", duration: "1h 15", premium: false, students: 1240 },
    { title: "Gestion des Acides Aminés", level: "Expert", duration: "2h 45", premium: true, students: 850 },
    { title: "Biosécurité & Hygiène", level: "Intermédiaire", duration: "50 min", premium: true, students: 2100 },
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Académie</h2>
          <p className="text-slate-500 font-medium">Apprenez avec les meilleurs experts Frica-Volaille</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((m, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all group">
            <div className="relative h-56 bg-slate-200">
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent" />
              <img src={`https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?q=80&w=400&auto=format`} className="w-full h-full object-cover" alt="" />
              <button className="absolute inset-0 m-auto w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl scale-90 group-hover:scale-110 transition-transform">
                <Play size={24} fill="currentColor" />
              </button>
              {m.premium && (
                <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-xl">
                  <Lock size={12} /> Pro
                </div>
              )}
            </div>
            <div className="p-8">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">{m.level}</p>
              <h3 className="text-xl font-black text-slate-900 mb-6 group-hover:text-emerald-600 transition-colors">{m.title}</h3>
              <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
                  <span className="flex items-center gap-1"><Clock size={14} /> {m.duration}</span>
                  <span className="flex items-center gap-1"><Star size={14} /> {m.students}</span>
                </div>
                <BookOpen size={20} className="text-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}