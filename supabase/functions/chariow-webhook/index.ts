import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ─── Map product_id Chariow → crédits à ajouter ─────────────────────────────
// ⚠️ Ces product_id DOIVENT être IDENTIQUES à ceux de src/pages/PricingPage.tsx
const PRODUCT_CREDITS: Record<string, number> = {
  'prd_REMPLACER_2400': 12,  // Pack Éleveur — 2 400 F
  'prd_REMPLACER_5000': 25,  // Pack Pro     — 5 000 F
  'prd_REMPLACER_7000': 35,  // Pack Expert  — 7 000 F
}

// ─── CORS headers ────────────────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const body = await req.json()
    console.log('📦 Pulse Chariow reçu:', JSON.stringify(body))

    const event      = body?.event
    const productId  = body?.data?.product_id
    const userId     = body?.data?.metadata?.user_id
    const email      = body?.data?.customer?.email

    if (event !== 'order.completed') {
      console.log(`⏭️  Event ignoré: ${event}`)
      return new Response('Ignored', { status: 200, headers: CORS })
    }

    if (!productId || !userId) {
      console.error('❌ product_id ou user_id manquant', { productId, userId, email })
      return new Response('Missing product_id or user_id', { status: 400, headers: CORS })
    }

    const creditsToAdd = PRODUCT_CREDITS[productId]
    if (!creditsToAdd) {
      console.error('❌ Produit inconnu:', productId)
      return new Response('Unknown product', { status: 400, headers: CORS })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('credits, id')
      .eq('id', userId)
      .single()

    if (fetchError || !profile) {
      console.error('❌ Profil introuvable pour user_id:', userId, fetchError)
      return new Response('User not found', { status: 404, headers: CORS })
    }

    const currentCredits = profile.credits ?? 0
    const newCredits     = currentCredits + creditsToAdd

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', userId)

    if (updateError) {
      console.error('❌ Erreur update crédits:', updateError)
      return new Response('Update failed', { status: 500, headers: CORS })
    }

    await supabase.from('credit_transactions').insert({
      user_id:        userId,
      product_id:     productId,
      credits_added:  creditsToAdd,
      credits_after:  newCredits,
      customer_email: email || null,
      created_at:     new Date().toISOString(),
    }).then(({ error }) => {
      if (error) console.warn('⚠️  credit_transactions insert failed (non bloquant):', error.message)
    })

    console.log(`✅ ${creditsToAdd} crédits ajoutés à ${userId} | solde: ${currentCredits} → ${newCredits}`)

    return new Response(
      JSON.stringify({ success: true, credits_added: creditsToAdd, new_balance: newCredits }),
      { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('❌ Erreur inattendue:', err)
    return new Response('Internal error', { status: 500, headers: CORS })
  }
})