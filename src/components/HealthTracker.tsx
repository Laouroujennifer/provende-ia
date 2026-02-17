import { Syringe, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'


export function HealthTracker() {
  const schedule = [
    { day: "Jour 1", vaccine: "Peste / Bronchite (H120)", done: true, date: "12 Oct" },
    { day: "Jour 7", vaccine: "Gumboro 1ère dose", done: true, date: "19 Oct" },
    { day: "Jour 14", vaccine: "Gumboro 2ème dose", done: false, date: "26 Oct" },
    { day: "Jour 21", vaccine: "Peste (Rappel Lasota)", done: false, date: "02 Nov" },
  ]

  return (
    <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm mt-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Syringe className="text-emerald-500" /> Carnet de Santé & Vaccination
          </h3>
          <p className="text-slate-400 text-sm font-medium">Protocole biosécurité automatisé</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
          <AlertTriangle size={14} /> 1 Vaccin en retard
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedule.map((task, i) => (
          <div key={i} className={`flex items-center justify-between p-6 rounded-4xl border transition-all ${task.done ? 'bg-emerald-50/50 border-emerald-100 opacity-60' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${task.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {task.done ? <CheckCircle2 size={24} /> : <Clock size={24} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{task.day} • {task.date}</p>
                <h4 className="font-bold text-slate-800 tracking-tight">{task.vaccine}</h4>
              </div>
            </div>
            
            {!task.done && (
              <button className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-500 transition-all">
                Valider
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}