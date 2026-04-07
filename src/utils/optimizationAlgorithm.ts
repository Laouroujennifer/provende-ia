import type { SelectedIngredient } from '../types/ingredients'
import type { AnimalRequirement } from '../types/animalRequirements'
import { ingredientsDatabase } from '../data/ingredientsDatabase'

export const optimizeFormula = (
  selectedIngredients: SelectedIngredient[],
  requirement: AnimalRequirement,
): SelectedIngredient[] => {

  const emT  = (requirement.em.min  + requirement.em.max)  / 2
  const pbT  = (requirement.pb.min  + requirement.pb.max)  / 2
  const caT  = ((requirement.ca?.min || 0) + (requirement.ca?.max || 0)) / 2
  const pT   = ((requirement.p?.min  || 0) + (requirement.p?.max  || 0)) / 2
  const lysT = ((requirement.lys?.min || 0) + (requirement.lys?.max || 0)) / 2
  const metT = ((requirement.met?.min || 0) + (requirement.met?.max || 0)) / 2

  // AUTO-COMPLÉTION
  const pool: SelectedIngredient[] = selectedIngredients.map(i => ({ ...i }))
  const hasId = (id: string) => pool.some(i => i.id === id)
  const addFromDb = (id: string) => {
    if (hasId(id)) return
    const found = ingredientsDatabase.find(i => i.id === id)
    if (found) pool.push({ ...found, quantity: 0, price: found.defaultPrice || 0 })
  }

  if (!pool.some(i => (i.ca || 0) > 15)) addFromDb('coquille_huitre')
  if (!pool.some(i => ['Protéines','Protéines Animales','Concentrés'].includes(i.category))) addFromDb('tourteau_soja')
  if (!pool.some(i => ['Céréales','Racines','Matières Grasses'].includes(i.category))) addFromDb('mais')
  if (!hasId('premix'))  addFromDb('premix')
  if (!hasId('nacl'))    addFromDb('nacl')
  if (lysT > 0)          addFromDb('lysine')
  if (metT > 0)          addFromDb('methionine')

  // CATÉGORISATION
  const isEnergy  = (ing: SelectedIngredient) => ['Céréales','Racines','Matières Grasses','Sous-produits'].includes(ing.category)
  const isProtein = (ing: SelectedIngredient) => ['Protéines','Protéines Animales','Concentrés','Fourrages'].includes(ing.category)
  const isMineral = (ing: SelectedIngredient) => ing.category === 'Minéraux'

  const energySources  = pool.filter(isEnergy)
  const proteinSources = pool.filter(isProtein)
  const caSource       = pool.find(i => (i.ca || 0) > 15 && isMineral(i))
  const lysineSyn      = pool.find(i => i.id === 'lysine')
  const methionineSyn  = pool.find(i => i.id === 'methionine')

  // DOSES FIXES
  const qty: Map<string, number> = new Map()
  qty.set('premix', 0.25)
  qty.set('nacl',   0.30)
  if (lysineSyn)     qty.set('lysine',     0)
  if (methionineSyn) qty.set('methionine', 0)

  // Calcium : dose exacte
  if (caSource && caT > 0) {
    qty.set(caSource.id, Math.min((caT / caSource.ca) * 100, 6))
  }

  let fixedTotal = 0
  for (const [, v] of qty) fixedTotal += v
  const free = 100 - fixedTotal

  // RÉSOLUTION ANALYTIQUE énergie/protéines
  const wAvg = (sources: SelectedIngredient[], key: keyof SelectedIngredient): number => {
    if (sources.length === 0) return 0
    const totalW = sources.reduce((s, i) => s + 1 / Math.max(i.price || 1, 1), 0)
    return sources.reduce((s, i) => s + ((i[key] as number) || 0) * (1 / Math.max(i.price || 1, 1)) / totalW, 0)
  }

  const emE = wAvg(energySources,  'em')
  const emP = wAvg(proteinSources, 'em')
  const pbE = wAvg(energySources,  'pb')
  const pbP = wAvg(proteinSources, 'pb')

  let fixedEM = 0, fixedPB = 0
  for (const [id, q] of qty) {
    const ing = pool.find(i => i.id === id)
    if (ing) { fixedEM += (ing.em || 0) * (q / 100); fixedPB += (ing.pb || 0) * (q / 100) }
  }

  const emRes = emT - fixedEM
  const pbRes = pbT - fixedPB
  const freeR = free / 100

  // Système 2x2 exact :
  // emE*e + emP*p = emRes
  // pbE*e + pbP*p = pbRes
  // avec e + p = freeR
  // → substitution p = freeR - e dans les deux équations, on prend la moyenne
  let ePct: number
  const detEM = emE - emP
  const detPB = pbE - pbP

  if (Math.abs(detEM) > 10 && Math.abs(detPB) > 0.5) {
    const eFromEM = (emRes - emP * freeR) / detEM
    const eFromPB = (pbRes - pbP * freeR) / detPB
    // Moyenne pondérée : on fait confiance aux deux équations
    ePct = (eFromEM + eFromPB) / 2
  } else if (Math.abs(detEM) > 10) {
    ePct = (emRes - emP * freeR) / detEM
  } else if (Math.abs(detPB) > 0.5) {
    ePct = (pbRes - pbP * freeR) / detPB
  } else {
    ePct = freeR * 0.65
  }

  ePct = Math.max(0.10, Math.min(freeR - 0.10, ePct))
  const pPct = Math.max(0.10, freeR - ePct)

  const distribute = (sources: SelectedIngredient[], totalPct: number) => {
    if (sources.length === 0) return
    const totalW = sources.reduce((s, i) => s + 1 / Math.max(i.price || 1, 1), 0)
    sources.forEach(ing => {
      qty.set(ing.id, totalPct * 100 * (1 / Math.max(ing.price || 1, 1)) / totalW)
    })
  }

  distribute(energySources,  ePct)
  distribute(proteinSources, pPct)

  // CALCUL COURANT
  const calcNut = () => {
    let em = 0, pb = 0, ca = 0, p = 0, lys = 0, met = 0
    for (const [id, q] of qty) {
      const ing = pool.find(i => i.id === id)
      if (!ing) continue
      const r = q / 100
      em  += (ing.em  || 0) * r
      pb  += (ing.pb  || 0) * r
      ca  += (ing.ca  || 0) * r
      p   += (ing.p   || 0) * r
      lys += (ing.lys || 0) * r
      met += (ing.met || 0) * r
    }
    return { em, pb, ca, p, lys, met }
  }

  // CORRECTION PROTÉINES : si PB trop bas, augmenter proportionnellement les protéines
  // et réduire proportionnellement les céréales pour garder le total stable
  for (let pass = 0; pass < 10; pass++) {
    const nut = calcNut()
    const pbDeficit = pbT - nut.pb
    if (Math.abs(pbDeficit) < 0.05) break

    // Augmenter les sources protéiques proportionnellement
    const totalProtQty = proteinSources.reduce((s, i) => s + (qty.get(i.id) || 0), 0)
    const totalEnerQty = energySources.reduce((s, i)  => s + (qty.get(i.id) || 0), 0)
    if (totalProtQty <= 0 || totalEnerQty <= 0) break

    // Combien faut-il ajouter aux protéines ?
    // delta_pb ≈ avgPbProtein * (deltaP/100) - avgPbEnergy * (deltaP/100) = pbDeficit
    // → deltaP = pbDeficit / (avgPbProt/100 - avgPbEner/100)
    const avgPbProt = pbP  // déjà calculé
    const avgPbEner = pbE
    const denomPb   = (avgPbProt - avgPbEner) / 100
    if (Math.abs(denomPb) < 0.01) break

    const deltaP = pbDeficit / denomPb  // en kg
    const adjustFactor = Math.min(Math.abs(deltaP) / totalProtQty, 0.15) * Math.sign(deltaP)

    proteinSources.forEach(ing => {
      const current = qty.get(ing.id) || 0
      qty.set(ing.id, Math.max(0.5, current * (1 + adjustFactor)))
    })
    energySources.forEach(ing => {
      const current = qty.get(ing.id) || 0
      qty.set(ing.id, Math.max(0.5, current * (1 - adjustFactor * totalProtQty / totalEnerQty)))
    })
  }

  // CORRECTION LYSINE (5 passes)
  for (let pass = 0; pass < 5; pass++) {
    if (lysineSyn && lysT > 0) {
      const nut = calcNut()
      const deficit = lysT - nut.lys
      const lysConc = lysineSyn.lys / 100
      const current = qty.get('lysine') || 0
      if (Math.abs(deficit) > 0.005) {
        qty.set('lysine', Math.max(0, Math.min(0.6, current + (deficit / 100 / lysConc) * 100)))
      }
    }
    if (methionineSyn && metT > 0) {
      const nut = calcNut()
      const deficit = metT - nut.met
      const metConc = methionineSyn.met / 100
      const current = qty.get('methionine') || 0
      if (Math.abs(deficit) > 0.005) {
        qty.set('methionine', Math.max(0, Math.min(0.4, current + (deficit / 100 / metConc) * 100)))
      }
    }
  }

  // RECALIBRAGE CALCIUM après toutes les corrections
  if (caSource && caT > 0) {
    const nut    = calcNut()
    const deficit = caT - nut.ca
    const caConc  = caSource.ca / 100
    const current = qty.get(caSource.id) || 0
    if (Math.abs(deficit) > 0.01) {
      qty.set(caSource.id, Math.max(0.1, Math.min(7, current + (deficit / 100 / caConc) * 100)))
    }
  }

  // NORMALISATION FINALE
  let total = 0
  for (const [, v] of qty) total += v
  for (const [k, v] of qty) qty.set(k, (v / total) * 100)

  return pool
    .map(ing => ({ ...ing, quantity: Number((qty.get(ing.id) || 0).toFixed(2)) }))
    .filter(ing => ing.quantity >= 0.05)
}