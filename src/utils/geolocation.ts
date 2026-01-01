// Correction TS1484 : Utilisation de "import type"
import type { Currency } from '../types/subscription'

export const detectCurrency = (): Currency => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Simple heuristic based on timezone
    if (
      timeZone.includes('Africa') ||
      timeZone.includes('Abidjan') ||
      timeZone.includes('Dakar') ||
      timeZone.includes('Lagos')
    ) {
      return 'XOF'
    }
    if (
      timeZone.includes('Europe') ||
      timeZone.includes('Paris') ||
      timeZone.includes('Berlin')
    ) {
      return 'EUR'
    }
    if (timeZone.includes('America')) {
      return 'USD'
    }

    // Default fallback
    return 'XOF'
  } catch {
    // Correction ESLint : On a enlevé le (e) car il n'était pas utilisé
    return 'XOF'
  }
}

export const formatPrice = (amount: number, currency: Currency): string => {
  switch (currency) {
    case 'XOF':
      return `${amount.toLocaleString('fr-FR')} FCFA`
    case 'EUR':
      return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
    case 'USD':
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    default:
      return `${amount} ${currency}`
  }
}