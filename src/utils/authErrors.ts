/**
 * Traduction en français des messages d'erreur Supabase (auth).
 * Les utilisateurs cibles ne comprennent pas l'anglais : tout message
 * affiché à l'écran doit impérativement passer par cette fonction.
 */
export function translateAuthError(message?: string): string {
  if (!message) return 'Une erreur est survenue. Veuillez réessayer.'

  const msg = message.toLowerCase()

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials'))
    return 'Email ou mot de passe incorrect. Vérifiez vos informations et réessayez.'

  if (msg.includes('email not confirmed'))
    return 'Veuillez confirmer votre adresse email avant de vous connecter. Vérifiez votre boîte de réception.'

  if (msg.includes('user already registered') || msg.includes('already been registered'))
    return 'Un compte existe déjà avec cette adresse email. Connectez-vous plutôt.'

  if (msg.includes('password should be at least'))
    return 'Le mot de passe doit contenir au moins 6 caractères.'

  if (msg.includes('signup requires a valid password') || (msg.includes('password') && msg.includes('weak')))
    return 'Veuillez choisir un mot de passe plus sécurisé (6 caractères minimum).'

  if (msg.includes('invalid format') || msg.includes('invalid email') || msg.includes('validate email'))
    return "L'adresse email saisie n'est pas valide. Vérifiez-la et réessayez."

  if (msg.includes('rate limit') || msg.includes('too many requests'))
    return 'Trop de tentatives. Patientez quelques minutes avant de réessayer.'

  if (msg.includes('network') || msg.includes('failed to fetch') || msg.includes('fetch'))
    return 'Problème de connexion internet. Vérifiez votre réseau et réessayez.'

  if (msg.includes('user not found'))
    return "Aucun compte n'existe avec cette adresse email."

  if (msg.includes('same password') || msg.includes('different from the old'))
    return "Le nouveau mot de passe doit être différent de l'ancien."

  if (msg.includes('expired'))
    return 'Votre session a expiré. Veuillez vous reconnecter.'

  return 'Une erreur est survenue. Veuillez réessayer ou nous contacter si le problème persiste.'
}
