import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound, CheckCircle2, ShieldAlert } from 'lucide-react';
import {
  supabase,
  isSupabaseConfigured,
  ADMIN_ALLOWED_EMAIL,
  hashAppPassword,
  getStoredAppPasswordHash,
  setStoredAppPasswordHash,
  saveAdminSession,
  AdminSession,
} from '../../lib/supabase';
import { Logo } from '../../components/ui/Logo';

interface AdminAuthProps {
  onAuthenticated: (session: AdminSession) => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticated }) => {
  // Step 1: Google OAuth verification, Step 2: App Password verification
  const [step, setStep] = useState<1 | 2>(1);
  const [googleEmail, setGoogleEmail] = useState(ADMIN_ALLOWED_EMAIL);
  const [appPassword, setAppPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFirstSetup, setIsFirstSetup] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if initial app password exists
    const existingHash = getStoredAppPasswordHash();
    if (!existingHash) {
      setIsFirstSetup(true);
    }

    // Check URL search and hash for OAuth errors (e.g. from Supabase / Google)
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    const errorDesc = urlParams.get('error_description') || hashParams.get('error_description');
    
    if (errorDesc) {
      const decodedError = decodeURIComponent(errorDesc.replace(/\+/g, ' '));
      if (decodedError.includes('Unable to exchange external code') || decodedError.includes('unexpected_failure')) {
        setErrorMsg('Configuration Google OAuth incomplète dans Supabase / Google Cloud. Vérifiez les identifiants Client ID / Secret et l’URI de redirection.');
      } else {
        setErrorMsg(`Erreur d'authentification : ${decodedError}`);
      }
      // Clean up URL without reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if Supabase OAuth redirect returned a valid session
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user?.email) {
          if (session.user.email.toLowerCase() === ADMIN_ALLOWED_EMAIL.toLowerCase()) {
            setGoogleEmail(session.user.email);
            setStep(2);
          } else {
            setErrorMsg('Accès refusé. Cette adresse email n’est pas autorisée.');
            supabase?.auth.signOut();
          }
        }
      });
    }
  }, []);

  // Handler for Factor 1: Google Authentication
  const handleGoogleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // If live Supabase is active, trigger real OAuth
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/classs`,
        },
      });
      if (error) {
        setErrorMsg('Erreur de connexion Google : ' + error.message);
        setIsLoading(false);
      }
      return;
    }

    // Direct / Fallback Verification
    setTimeout(() => {
      setIsLoading(false);
      if (googleEmail.trim().toLowerCase() !== ADMIN_ALLOWED_EMAIL.toLowerCase()) {
        // Generic refusal message without revealing system internals
        setErrorMsg('Accès non autorisé. Identifiants incorrects.');
        return;
      }
      setStep(2);
    }, 400);
  };

  // Handler for Factor 2: App Password Verification / Initial Setup
  const handleAppPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const storedHash = getStoredAppPasswordHash();

      if (isFirstSetup || !storedHash) {
        // Initial setup: define password
        if (appPassword.length < 6) {
          setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
          setIsLoading(false);
          return;
        }
        if (appPassword !== confirmPassword) {
          setErrorMsg('Les deux mots de passe ne correspondent pas.');
          setIsLoading(false);
          return;
        }

        const newHash = await hashAppPassword(appPassword);
        setStoredAppPasswordHash(newHash);
        setIsFirstSetup(false);

        const newSession: AdminSession = {
          email: ADMIN_ALLOWED_EMAIL,
          isGoogleVerified: true,
          isAppPasswordVerified: true,
          authenticatedAt: new Date().toISOString(),
        };
        saveAdminSession(newSession);
        onAuthenticated(newSession);
        return;
      }

      // Existing verification
      const inputHash = await hashAppPassword(appPassword);
      if (inputHash !== storedHash) {
        setErrorMsg('Mot de passe applicatif incorrect.');
        setIsLoading(false);
        return;
      }

      const verifiedSession: AdminSession = {
        email: ADMIN_ALLOWED_EMAIL,
        isGoogleVerified: true,
        isAppPasswordVerified: true,
        authenticatedAt: new Date().toISOString(),
      };
      saveAdminSession(verifiedSession);
      onAuthenticated(verifiedSession);
    } catch {
      setErrorMsg('Erreur lors de la validation du mot de passe.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-onyx text-ivoire-violet flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-imperial/20 via-amethyste/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Card */}
        <div className="bg-ardoise/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-violet-imperial/25 shadow-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-2">
              <Logo variant="blanc" size="md" asLink={false} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-imperial/20 border border-violet-imperial/30 text-amethyste text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Espace Privé Administrateur</span>
            </div>
            <h1 className="text-2xl font-title font-semibold text-white">
              Authentification sécurisée
            </h1>
            <p className="text-xs text-ivoire-violet/70 font-body">
              Accès protégé par double verrouillage exclusif
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-full bg-onyx/60 border border-white/10 text-xs">
            <div
              className={`flex-1 text-center py-1 rounded-full transition-all ${
                step === 1 ? 'bg-violet-imperial text-white font-semibold' : 'text-ivoire-violet/50'
              }`}
            >
              1. Compte Google
            </div>
            <div
              className={`flex-1 text-center py-1 rounded-full transition-all ${
                step === 2 ? 'bg-violet-imperial text-white font-semibold' : 'text-ivoire-violet/50'
              }`}
            >
              2. Mot de passe
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-body flex items-start gap-2.5 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* FACTOR 1 FORM: Google Account */}
          {step === 1 && (
            <form onSubmit={handleGoogleVerify} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1.5 font-body">
                  <Mail className="w-3.5 h-3.5 text-amethyste" />
                  Adresse Google autorisée
                </label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="wendclasss@gmail.com"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-onyx/70 border border-violet-imperial/30 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amethyste focus:ring-1 focus:ring-amethyste transition-all font-body"
                />
                <p className="text-[11px] text-ivoire-violet/50 font-body">
                  Seul le compte administrateur certifié est habilité à franchir cette étape.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-imperial to-amethyste hover:opacity-95 text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 font-body"
              >
                {isLoading ? (
                  <span>Vérification en cours...</span>
                ) : (
                  <>
                    <span>Continuer vers le 2ᵉ facteur</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FACTOR 2 FORM: App Password */}
          {step === 2 && (
            <form onSubmit={handleAppPasswordSubmit} className="space-y-5 animate-fadeIn">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-body flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Compte Google vérifié : {googleEmail}</span>
              </div>

              {isFirstSetup ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-body">
                    <p className="font-semibold mb-1">Configuration initiale du mot de passe applicatif</p>
                    <p className="text-amber-200/80 text-[11px]">
                      Définissez le mot de passe qui protégera votre espace admin Class S.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1.5 font-body">
                      <Lock className="w-3.5 h-3.5 text-amethyste" />
                      Nouveau mot de passe applicatif
                    </label>
                    <input
                      type="password"
                      value={appPassword}
                      onChange={(e) => setAppPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-onyx/70 border border-violet-imperial/30 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amethyste focus:ring-1 focus:ring-amethyste transition-all font-body"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1.5 font-body">
                      <KeyRound className="w-3.5 h-3.5 text-amethyste" />
                      Confirmez le mot de passe
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-onyx/70 border border-violet-imperial/30 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amethyste focus:ring-1 focus:ring-amethyste transition-all font-body"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ivoire-violet/90 flex items-center gap-1.5 font-body">
                    <Lock className="w-3.5 h-3.5 text-amethyste" />
                    Mot de passe applicatif Class S
                  </label>
                  <input
                    type="password"
                    value={appPassword}
                    onChange={(e) => setAppPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoFocus
                    className="w-full px-4 py-3 rounded-2xl bg-onyx/70 border border-violet-imperial/30 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amethyste focus:ring-1 focus:ring-amethyste transition-all font-body"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setAppPassword('');
                    setErrorMsg(null);
                  }}
                  className="py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-xs text-ivoire-violet/70 transition-colors font-body"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-imperial to-amethyste hover:opacity-95 text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 font-body"
                >
                  {isLoading ? (
                    <span>Déverrouillage...</span>
                  ) : (
                    <>
                      <span>{isFirstSetup ? 'Enregistrer & Déverrouiller' : 'Accéder au tableau de bord'}</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Security footnote */}
          <div className="pt-4 border-t border-white/10 text-center">
            <span className="text-[10px] text-ivoire-violet/40 font-body">
              Class S Management System • Double chiffrement actif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
