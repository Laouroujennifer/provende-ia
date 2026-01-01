
import { Download, Sprout, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSubscription } from '../contexts/SubscriptionContext'
export function Header() {
  const { subscription } = useSubscription()
  const isPro = subscription.status === 'active'
  const handleExport = () => {
    if (!isPro) {
      alert("L'export PDF est réservé aux membres Pro.")
      return
    }
    alert('Génération du PDF en cours...')
  }
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <Link
        to="/"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="bg-teal-700 p-2 rounded-lg">
          <Sprout className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-teal-900">
            Analyseur de Provende IA
          </h1>
          <p className="text-sm text-gray-500 hidden sm:block">
            Validez et optimisez vos formules alimentaires
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {!isPro && (
          <Link
            to="/pricing"
            className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg text-sm font-bold hover:bg-amber-100 transition-colors"
          >
            <Crown className="w-4 h-4" />
            <span className="hidden sm:inline">Passer Premium</span>
          </Link>
        )}

        <button
          onClick={handleExport}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isPro ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>
    </header>
  )
}
