import { useEffect, useState } from 'react'
import { Trash2, Calendar, Wheat, DollarSign, Loader2, FlaskConical, Search, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { SelectedIngredient } from '../types/ingredients'

interface Formula {
  id: string
  name: string
  ingredients: SelectedIngredient[]
  nutritional_stats: Record<string, number>
  cost_per_100kg: number
  created_at: string
}

export function SavedFormulas() {
  const { user } = useAuth()
  const [formulas, setFormulas] = useState<Formula[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchFormulas() {
      if (!user) return

      const { data, error } = await supabase
        .from('formulas')
        .select('*')
        .order('created_at', { ascending: false })

      if (isMounted) {
        if (!error && data) {
          setFormulas(data as Formula[])
        }
        setLoading(false)
      }
    }

    fetchFormulas()
    return () => { isMounted = false }
  }, [user])

  async function deleteFormula(id: string) {
    if (!window.confirm('Voulez-vous vraiment supprimer cette formule ?')) return

    const { error } = await supabase.from('formulas').delete().eq('id', id)
    if (!error) {
      setFormulas(prev => prev.filter(f => f.id !== id))
    }
  }

  // Filtrage par recherche
  const filtered = formulas.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.ingredients.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
    </div>
  )

  if (formulas.length === 0) return (
    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
      <FlaskConical className="mx-auto text-slate-200 mb-4" size={48} />
      <h3 className="text-xl font-black text-slate-900">Aucune formule sauvegardée</h3>
      <p className="text-slate-400 mt-2">Génère ou crée une formule pour la voir ici.</p>
    </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header avec recherche */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Mes formules sauvegardées</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {formulas.length} formule{formulas.length > 1 ? 's' : ''} enregistrée{formulas.length > 1 ? 's' : ''}
              {searchQuery && filtered.length !== formulas.length && ` · ${filtered.length} affichée${filtered.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom ou ingrédient…"
            className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Grille des formules */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 text-sm font-medium">Aucune formule trouvée pour "<span className="font-black">{searchQuery}</span>"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((formula) => {
            const totalIngr = formula.ingredients.filter(i => i.quantity > 0.01).length
            // Top 3 ingrédients par quantité
            const topIngr = [...formula.ingredients]
              .filter(i => i.quantity > 0.01)
              .sort((a, b) => b.quantity - a.quantity)
              .slice(0, 3)

            return (
              <div
                key={formula.id}
                className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 relative overflow-hidden"
              >
                {/* Top bar : icône + delete */}
                <div className="flex justify-between items-start mb-5">
                  <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <FlaskConical size={20} />
                  </div>
                  <button
                    onClick={() => deleteFormula(formula.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Supprimer la formule"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Nom */}
                <h3 className="text-lg font-black text-slate-900 mb-3 truncate" title={formula.name}>
                  {formula.name}
                </h3>

                {/* Top 3 ingrédients */}
                <div className="space-y-1.5 mb-4">
                  {topIngr.map((ing, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-600 truncate pr-2">{ing.name}</span>
                      <span className="font-black text-emerald-600 shrink-0">{ing.quantity.toFixed(1)}%</span>
                    </div>
                  ))}
                  {totalIngr > 3 && (
                    <p className="text-[10px] text-slate-400 font-bold italic">+ {totalIngr - 3} autres</p>
                  )}
                </div>

                {/* Stats footer */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Wheat size={12} className="text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Ingrédients</span>
                    </div>
                    <span className="text-xs font-black text-slate-700">{totalIngr}</span>
                  </div>
                  {formula.cost_per_100kg > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500">
                        <DollarSign size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Coût / 100 kg</span>
                      </div>
                      <span className="text-xs font-black text-amber-700">
                        {formula.cost_per_100kg.toLocaleString('fr-FR')} F
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Créée le</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">
                      {new Date(formula.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}