import { useEffect, useState } from 'react'
import { Trash2, Calendar, Wheat, DollarSign, Loader2, FlaskConical } from 'lucide-react'
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

  useEffect(() => {
    // Variable pour éviter de mettre à jour l'état si le composant est démonté
    let isMounted = true;

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

    // On lance l'appel asynchrone
    fetchFormulas()

    // Fonction de nettoyage
    return () => {
      isMounted = false
    }
  }, [user]) // L'effet se relance uniquement si l'utilisateur change

  async function deleteFormula(id: string) {
    if (!window.confirm("Voulez-vous vraiment supprimer cette formule ?")) return
    
    const { error } = await supabase.from('formulas').delete().eq('id', id)
    if (!error) {
      setFormulas(prev => prev.filter(f => f.id !== id))
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
    </div>
  )

  if (formulas.length === 0) return (
    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
      <FlaskConical className="mx-auto text-slate-200 mb-4" size={48} />
      <h3 className="text-xl font-black text-slate-900">Aucune formule sauvegardée</h3>
      <p className="text-slate-400 mt-2">Commencez à formuler pour voir vos recettes ici.</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
      {formulas.map((formula) => (
        <div key={formula.id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <FlaskConical size={24} />
            </div>
            <button 
              onClick={() => deleteFormula(formula.id)}
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-4 truncate">{formula.name}</h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-slate-500">
              <Wheat size={14} className="text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-widest">{formula.ingredients.length} Ingrédients</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <DollarSign size={14} className="text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-widest">
                {formula.cost_per_100kg.toLocaleString()} F / 100kg
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Calendar size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {new Date(formula.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
            {formula.ingredients.slice(0, 3).map((ing, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-50 rounded-full text-[9px] font-black text-slate-400 uppercase">
                {ing.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}