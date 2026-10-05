import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Building,
  User,
  Phone,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  FormDataState,
  initialFormData,
  ProjectType,
  PROJECT_TYPE_OPTIONS,
  GOAL_OPTIONS,
  BRANCH_A_OPTIONS,
  BRANCH_B_OPTIONS,
  BRANCH_C_OPTIONS,
  EVENT_TIMING_OPTIONS,
  EVENT_PRINT_ITEMS,
  EVENT_DIGITAL_ITEMS,
  BRANCH_E_OPTIONS
} from '../../data/formulaire';
import { CtaButton } from '../ui/CtaButton';
import { submitDemande } from '../../lib/supabase';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Total steps is 4 (+ 1 confirmation screen)
  const totalSteps = 4;

  const handleProjectTypeSelect = (type: ProjectType) => {
    setFormData((prev) => ({ ...prev, projectType: type }));
    setErrorMsg(null);
  };

  const handleGoalToggle = (goalId: string) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goalId);
      const newGoals = exists
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId];
      return { ...prev, goals: newGoals };
    });
    setErrorMsg(null);
  };

  // Branch C Toggle
  const handlePrintItemToggle = (item: string) => {
    setFormData((prev) => {
      const current = prev.printItems || [];
      const exists = current.includes(item);
      const updated = exists ? current.filter((i) => i !== item) : [...current, item];
      return { ...prev, printItems: updated };
    });
  };

  // Branch D Toggles
  const handleEventPrintToggle = (item: string) => {
    if (formData.eventUnknown) return;
    setFormData((prev) => {
      const current = prev.eventPrintItems || [];
      const exists = current.includes(item);
      const updated = exists ? current.filter((i) => i !== item) : [...current, item];
      return { ...prev, eventPrintItems: updated, eventUnknown: false };
    });
  };

  const handleEventDigitalToggle = (item: string) => {
    if (formData.eventUnknown) return;
    setFormData((prev) => {
      const current = prev.eventDigitalItems || [];
      const exists = current.includes(item);
      const updated = exists ? current.filter((i) => i !== item) : [...current, item];
      return { ...prev, eventDigitalItems: updated, eventUnknown: false };
    });
  };

  const handleSelectAllEventPrint = () => {
    if (formData.eventUnknown) return;
    const isAll = (formData.eventPrintItems || []).length === EVENT_PRINT_ITEMS.length;
    setFormData((prev) => ({
      ...prev,
      eventPrintItems: isAll ? [] : [...EVENT_PRINT_ITEMS],
      eventUnknown: false,
    }));
  };

  const handleSelectAllEventDigital = () => {
    if (formData.eventUnknown) return;
    const isAll = (formData.eventDigitalItems || []).length === EVENT_DIGITAL_ITEMS.length;
    setFormData((prev) => ({
      ...prev,
      eventDigitalItems: isAll ? [] : [...EVENT_DIGITAL_ITEMS],
      eventUnknown: false,
    }));
  };

  const handleEventUnknownToggle = () => {
    setFormData((prev) => {
      const nextUnknown = !prev.eventUnknown;
      if (nextUnknown) {
        return {
          ...prev,
          eventUnknown: true,
          eventPrintItems: [],
          eventDigitalItems: [],
          eventOtherText: '',
        };
      }
      return { ...prev, eventUnknown: false };
    });
  };

  // Validation before advancing
  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      if (!formData.projectType) {
        setErrorMsg('Veuillez sélectionner un type de projet pour continuer.');
        return false;
      }
    }

    if (currentStep === 2) {
      if (formData.goals.length === 0) {
        setErrorMsg('Veuillez cocher au moins un objectif pour votre projet.');
        return false;
      }
      if (formData.goals.includes('other') && (!formData.goalOtherText || formData.goalOtherText.trim() === '')) {
        setErrorMsg('Veuillez préciser votre objectif dans le champ libre.');
        return false;
      }
    }

    if (currentStep === 3) {
      // Validate branch specifics
      if (formData.projectType === 'logo' && !formData.hasLogo) {
        setErrorMsg('Veuillez indiquer si vous avez déjà un logo.');
        return false;
      }
      if (formData.projectType === 'social' && !formData.socialFrequency) {
        setErrorMsg('Veuillez choisir une fréquence de publication.');
        return false;
      }
      if (formData.projectType === 'print' && (formData.printItems?.length === 0 && !formData.printOtherText)) {
        setErrorMsg('Veuillez sélectionner au moins un support imprimé.');
        return false;
      }
      if (formData.projectType === 'event') {
        if (!formData.eventTiming) {
          setErrorMsg('Veuillez indiquer la date approximative de votre événement.');
          return false;
        }
        if (
          !formData.eventUnknown &&
          (formData.eventPrintItems?.length === 0 &&
            formData.eventDigitalItems?.length === 0 &&
            !formData.eventOtherText)
        ) {
          setErrorMsg('Veuillez cocher les besoins de votre événement ou choisir "Je ne sais pas encore".');
          return false;
        }
      }
      if (formData.projectType === 'website' && !formData.websiteType) {
        setErrorMsg('Veuillez sélectionner le type de site web envisagé.');
        return false;
      }
    }

    if (currentStep === 4) {
      if (!formData.fullName.trim()) {
        setErrorMsg('Veuillez renseigner votre nom.');
        return false;
      }
      if (!formData.companyName.trim()) {
        setErrorMsg('Veuillez renseigner le nom de votre entreprise.');
        return false;
      }
      if (!formData.whatsappNumber.trim()) {
        setErrorMsg('Veuillez renseigner votre numéro WhatsApp.');
        return false;
      }
    }

    setErrorMsg(null);
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    // Build structured branch data based on project type
    const branchData: Record<string, any> = {};
    if (formData.projectType === 'logo') {
      branchData.hasLogo = formData.hasLogo;
    } else if (formData.projectType === 'social') {
      branchData.socialFrequency = formData.socialFrequency;
    } else if (formData.projectType === 'print') {
      branchData.printItems = formData.printItems;
      branchData.printOtherText = formData.printOtherText;
    } else if (formData.projectType === 'event') {
      branchData.eventTiming = formData.eventTiming;
      branchData.eventUnknown = formData.eventUnknown;
      branchData.eventPrintItems = formData.eventPrintItems;
      branchData.eventDigitalItems = formData.eventDigitalItems;
      branchData.eventOtherText = formData.eventOtherText;
    } else if (formData.projectType === 'website') {
      branchData.websiteType = formData.websiteType;
    } else if (formData.projectType === 'unknown') {
      branchData.unknownContext = 'Échange d’orientation direct demandé sur WhatsApp';
    }

    try {
      const result = await submitDemande({
        project_type: formData.projectType || 'unknown',
        goals: formData.goals,
        goals_other: formData.goalOtherText,
        branch_data: branchData,
        full_name: formData.fullName,
        company_name: formData.companyName,
        whatsapp_number: formData.whatsappNumber,
      });

      if (!result.success) {
        setErrorMsg(result.error || 'Une erreur est survenue lors de l’envoi. Veuillez réessayer.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6600CC', '#C9A070', '#A87FE8'],
        });
      } catch {
        // Fallback gracefully
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg('Impossible d’enregistrer votre demande. Veuillez vérifier votre connexion ou nous contacter directement sur WhatsApp.');
    }
  };

  // Direct WhatsApp Pre-filled link generator
  const getWhatsAppDirectLink = () => {
    const selectedTypeObj = PROJECT_TYPE_OPTIONS.find((t) => t.id === formData.projectType);
    const typeLabel = selectedTypeObj ? selectedTypeObj.label : 'Nouveau projet';
    const text = encodeURIComponent(
      `Bonjour Scott (Class S),\nJe vous contacte depuis votre site web officiel.\n\n👤 Nom : ${formData.fullName}\n🏢 Entreprise : ${formData.companyName}\n📌 Projet : ${typeLabel}\n📱 WhatsApp : ${formData.whatsappNumber}\n\nJ'aimerais échanger avec vous sur ce projet.`
    );
    // Direct link to Scott's number (or generic wa.me)
    return `https://wa.me/22670000000?text=${text}`; // Note: placeholder country code BF (226)
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-ivoire-violet via-white to-ivoire-violet relative scroll-mt-24">
      {/* Decorative ambient elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-violet-imperial/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-or-champagne/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-imperial/10 border border-violet-imperial/20 text-violet-imperial text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-violet-imperial" />
            Parlons de votre projet
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-title font-semibold text-onyx leading-tight">
            Prêt à transformer votre image en outil de vente ?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-onyx/75 font-body">
            Répondez à quelques questions courtes pour me permettre de comprendre votre besoin. 
            Je reviens vers vous personnellement avec une proposition adaptée.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft-lg border border-violet-imperial/15 relative overflow-hidden">
          {/* Progress Header */}
          {!isSuccess && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-medium text-onyx/60 mb-2 font-body">
                <span>Étape {currentStep} sur {totalSteps}</span>
                <span className="text-violet-imperial font-semibold">
                  {currentStep === 1 && 'Type de projet'}
                  {currentStep === 2 && 'Objectifs visés'}
                  {currentStep === 3 && 'Détails du besoin'}
                  {currentStep === 4 && 'Vos coordonnées'}
                </span>
              </div>
              <div className="w-full h-2 bg-violet-imperial/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-imperial to-amethyste rounded-full"
                  initial={{ width: '25%' }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Form Step Content */}
          <AnimatePresence mode="wait">
            {/* Confirmation Screen */}
            {isSuccess ? (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10 space-y-6"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-violet-imperial/10 border-2 border-violet-imperial/30 flex items-center justify-center text-violet-imperial">
                  <CheckCircle2 className="w-10 h-10 text-violet-imperial" />
                </div>
                
                <div className="space-y-3 max-w-lg mx-auto">
                  <h3 className="text-2xl sm:text-3xl font-title font-semibold text-onyx">
                    Demande transmise avec succès
                  </h3>
                  <p className="text-lg text-onyx/85 font-medium leading-relaxed font-body bg-ivoire-violet p-4 rounded-2xl border border-violet-imperial/15">
                    « Merci, votre demande est bien reçue. Je reviens vers vous sur WhatsApp sous 24 heures. »
                  </p>
                  <p className="text-xs text-onyx/60 font-body">
                    Vous souhaitez accélérer l'échange ? Vous pouvez également m'écrire directement sur WhatsApp avec votre récapitulatif pré-rempli :
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <CtaButton
                    href={getWhatsAppDirectLink()}
                    variant="champagne"
                    size="md"
                    icon={<MessageCircle className="w-5 h-5" />}
                  >
                    Ouvrir la discussion WhatsApp
                  </CtaButton>
                  <CtaButton
                    onClick={() => {
                      setIsSuccess(false);
                      setCurrentStep(1);
                      setFormData(initialFormData);
                    }}
                    variant="secondary"
                    size="md"
                  >
                    Faire une autre demande
                  </CtaButton>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* STEP 1: Project Type */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <label className="text-lg font-semibold text-onyx font-body block">
                        1. Quel est le type de votre projet ?
                      </label>
                      <p className="text-xs text-onyx/60">Sélectionnez une option pour personnaliser les questions suivantes.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {PROJECT_TYPE_OPTIONS.map((option) => {
                        const isSelected = formData.projectType === option.id;
                        return (
                          <button
                            type="button"
                            key={option.id}
                            onClick={() => handleProjectTypeSelect(option.id)}
                            className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-imperial ${
                              isSelected
                                ? 'bg-violet-imperial/10 border-violet-imperial ring-2 ring-violet-imperial/20 shadow-sm'
                                : 'bg-white border-violet-imperial/15 hover:border-violet-imperial/40 hover:bg-violet-imperial/[0.02]'
                            }`}
                          >
                            <span className="font-semibold text-sm sm:text-base text-onyx font-body block mb-1">
                              {option.label}
                            </span>
                            <span className="text-xs text-onyx/60 font-body">
                              {option.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Goal */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <label className="text-lg font-semibold text-onyx font-body block">
                        2. Qu’aimeriez-vous que ce projet vous apporte ?
                      </label>
                      <p className="text-xs text-onyx/60">Plusieurs choix possibles.</p>
                    </div>

                    <div className="space-y-3">
                      {GOAL_OPTIONS.map((goal) => {
                        const isChecked = formData.goals.includes(goal.id);
                        return (
                          <div key={goal.id} className="space-y-2">
                            <button
                              type="button"
                              onClick={() => handleGoalToggle(goal.id)}
                              className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
                                isChecked
                                  ? 'bg-violet-imperial/10 border-violet-imperial text-onyx font-medium'
                                  : 'bg-white border-violet-imperial/15 hover:border-violet-imperial/40 text-onyx/80'
                              }`}
                            >
                              <span className="text-sm sm:text-base font-body">{goal.label}</span>
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                  isChecked
                                    ? 'bg-violet-imperial border-violet-imperial text-white'
                                    : 'border-violet-imperial/30 bg-white'
                                }`}
                              >
                                {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                              </div>
                            </button>

                            {/* Free text input if 'Autre' is checked */}
                            {goal.isCustom && isChecked && (
                              <div className="pl-2 pt-1">
                                <input
                                  type="text"
                                  value={formData.goalOtherText || ''}
                                  onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, goalOtherText: e.target.value }))
                                  }
                                  placeholder="Précisez votre objectif ici..."
                                  className="w-full px-4 py-3 text-sm bg-ivoire-violet border border-violet-imperial/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-imperial font-body"
                                  autoFocus
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Conditional Branch */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* BRANCHE A: Logo */}
                    {formData.projectType === 'logo' && (
                      <div className="space-y-4">
                        <label className="text-lg font-semibold text-onyx font-body block">
                          3. Votre entreprise a-t-elle déjà un logo ?
                        </label>
                        <div className="space-y-3">
                          {BRANCH_A_OPTIONS.map((opt) => (
                            <button
                              type="button"
                              key={opt.id}
                              onClick={() => setFormData((prev) => ({ ...prev, hasLogo: opt.id as any }))}
                              className={`w-full p-4 rounded-2xl border text-left transition-all ${
                                formData.hasLogo === opt.id
                                  ? 'bg-violet-imperial/10 border-violet-imperial ring-2 ring-violet-imperial/20 font-medium'
                                  : 'bg-white border-violet-imperial/15 hover:border-violet-imperial/40'
                              }`}
                            >
                              <span className="text-sm sm:text-base font-body">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* BRANCHE B: Social */}
                    {formData.projectType === 'social' && (
                      <div className="space-y-4">
                        <label className="text-lg font-semibold text-onyx font-body block">
                          3. À quelle fréquence souhaitez-vous publier ?
                        </label>
                        <div className="space-y-3">
                          {BRANCH_B_OPTIONS.map((opt) => (
                            <button
                              type="button"
                              key={opt.id}
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, socialFrequency: opt.id as any }))
                              }
                              className={`w-full p-4 rounded-2xl border text-left transition-all ${
                                formData.socialFrequency === opt.id
                                  ? 'bg-violet-imperial/10 border-violet-imperial ring-2 ring-violet-imperial/20 font-medium'
                                  : 'bg-white border-violet-imperial/15 hover:border-violet-imperial/40'
                              }`}
                            >
                              <span className="text-sm sm:text-base font-body">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* BRANCHE C: Print */}
                    {formData.projectType === 'print' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-lg font-semibold text-onyx font-body block">
                            3. Quels supports vous faut-il ?
                          </label>
                          <p className="text-xs text-onyx/60">Choix multiple.</p>
                        </div>
                        <div className="space-y-3">
                          {BRANCH_C_OPTIONS.map((opt) => {
                            const isSelected = (formData.printItems || []).includes(opt.id);
                            return (
                              <button
                                type="button"
                                key={opt.id}
                                onClick={() => handlePrintItemToggle(opt.id)}
                                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                                  isSelected
                                    ? 'bg-violet-imperial/10 border-violet-imperial font-medium'
                                    : 'bg-white border-violet-imperial/15 hover:border-violet-imperial/40'
                                }`}
                              >
                                <span className="text-sm sm:text-base font-body">{opt.label}</span>
                                <div
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                    isSelected
                                      ? 'bg-violet-imperial border-violet-imperial text-white'
                                      : 'border-violet-imperial/30 bg-white'
                                  }`}
                                >
                                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                              </button>
                            );
                          })}

                          {/* Cumulative Autre field for print */}
                          <div className="pt-2">
                            <label className="text-xs font-semibold text-onyx/70 block mb-1">
                              Autre support imprimé particulier (optionnel) :
                            </label>
                            <input
                              type="text"
                              value={formData.printOtherText || ''}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, printOtherText: e.target.value }))
                              }
                              placeholder="Ex: Menus de restaurant, chemises à rabat..."
                              className="w-full px-4 py-3 text-sm bg-ivoire-violet border border-violet-imperial/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-imperial font-body"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* BRANCHE D: Event (D.1 & D.2) */}
                    {formData.projectType === 'event' && (
                      <div className="space-y-6">
                        {/* D.1 Timing */}
                        <div className="space-y-3">
                          <label className="text-base sm:text-lg font-semibold text-onyx font-body block">
                            3.1 Quand a lieu votre événement ?
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {EVENT_TIMING_OPTIONS.map((opt) => (
                              <button
                                type="button"
                                key={opt.id}
                                onClick={() =>
                                  setFormData((prev) => ({ ...prev, eventTiming: opt.id as any }))
                                }
                                className={`p-3.5 rounded-xl border text-left text-sm font-body transition-all ${
                                  formData.eventTiming === opt.id
                                    ? 'bg-violet-imperial/10 border-violet-imperial ring-2 ring-violet-imperial/20 font-medium'
                                    : 'bg-white border-violet-imperial/15 hover:border-violet-imperial/40'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* D.2 Requirements by Category */}
                        <div className="space-y-4 pt-2 border-t border-violet-imperial/10">
                          <div className="space-y-1">
                            <label className="text-base sm:text-lg font-semibold text-onyx font-body block">
                              3.2 Que faut-il prévoir pour votre événement ?
                            </label>
                            <p className="text-xs text-onyx/60">Sélectionnez tous les éléments nécessaires.</p>
                          </div>

                          {/* Catégorie À imprimer */}
                          <div className="p-4 rounded-2xl bg-ivoire-violet/70 border border-violet-imperial/15 space-y-3">
                            <div className="flex items-center justify-between pb-1 border-b border-violet-imperial/10">
                              <span className="text-xs uppercase tracking-wider font-bold text-violet-imperial">
                                Catégorie « À imprimer »
                              </span>
                              <button
                                type="button"
                                onClick={handleSelectAllEventPrint}
                                disabled={formData.eventUnknown}
                                className="text-xs text-violet-imperial hover:underline font-semibold"
                              >
                                {(formData.eventPrintItems || []).length === EVENT_PRINT_ITEMS.length
                                  ? 'Tout désélectionner'
                                  : 'Tout sélectionner'}
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {EVENT_PRINT_ITEMS.map((item) => {
                                const isChecked = (formData.eventPrintItems || []).includes(item);
                                return (
                                  <button
                                    type="button"
                                    key={item}
                                    disabled={formData.eventUnknown}
                                    onClick={() => handleEventPrintToggle(item)}
                                    className={`p-2.5 rounded-xl border text-left text-xs sm:text-sm font-body flex items-center justify-between transition-all ${
                                      formData.eventUnknown
                                        ? 'opacity-40 bg-gray-100 border-gray-200'
                                        : isChecked
                                        ? 'bg-violet-imperial/15 border-violet-imperial font-medium'
                                        : 'bg-white border-violet-imperial/15 hover:border-violet-imperial/40'
                                    }`}
                                  >
                                    <span className="pr-2">{item}</span>
                                    <div
                                      className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${
                                        isChecked
                                          ? 'bg-violet-imperial border-violet-imperial text-white'
                                          : 'border-violet-imperial/30 bg-white'
                                      }`}
                                    >
                                      {isChecked && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Catégorie Pour les écrans */}
                          <div className="p-4 rounded-2xl bg-ivoire-violet/70 border border-violet-imperial/15 space-y-3">
                            <div className="flex items-center justify-between pb-1 border-b border-violet-imperial/10">
                              <span className="text-xs uppercase tracking-wider font-bold text-violet-imperial">
                                Catégorie « Pour les écrans (numérique) »
                              </span>
                              <button
                                type="button"
                                onClick={handleSelectAllEventDigital}
                                disabled={formData.eventUnknown}
                                className="text-xs text-violet-imperial hover:underline font-semibold"
                              >
                                {(formData.eventDigitalItems || []).length === EVENT_DIGITAL_ITEMS.length
                                  ? 'Tout désélectionner'
                                  : 'Tout sélectionner'}
                              </button>
                            </div>
                            <div className="space-y-2">
                              {EVENT_DIGITAL_ITEMS.map((item) => {
                                const isChecked = (formData.eventDigitalItems || []).includes(item);
                                return (
                                  <button
                                    type="button"
                                    key={item}
                                    disabled={formData.eventUnknown}
                                    onClick={() => handleEventDigitalToggle(item)}
                                    className={`w-full p-2.5 rounded-xl border text-left text-xs sm:text-sm font-body flex items-center justify-between transition-all ${
                                      formData.eventUnknown
                                        ? 'opacity-40 bg-gray-100 border-gray-200'
                                        : isChecked
                                        ? 'bg-violet-imperial/15 border-violet-imperial font-medium'
                                        : 'bg-white border-violet-imperial/15 hover:border-violet-imperial/40'
                                    }`}
                                  >
                                    <span>{item}</span>
                                    <div
                                      className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${
                                        isChecked
                                          ? 'bg-violet-imperial border-violet-imperial text-white'
                                          : 'border-violet-imperial/30 bg-white'
                                      }`}
                                    >
                                      {isChecked && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Options communes (Autre + Exclusif Je ne sais pas encore) */}
                          <div className="space-y-3 pt-2">
                            <div>
                              <input
                                type="text"
                                disabled={formData.eventUnknown}
                                value={formData.eventOtherText || ''}
                                onChange={(e) =>
                                  setFormData((prev) => ({ ...prev, eventOtherText: e.target.value }))
                                }
                                placeholder="Autre besoin pour l'événement (cumulable)..."
                                className={`w-full px-4 py-3 text-sm border rounded-xl font-body ${
                                  formData.eventUnknown
                                    ? 'opacity-40 bg-gray-100 border-gray-200'
                                    : 'bg-white border-violet-imperial/20 focus:ring-2 focus:ring-violet-imperial'
                                }`}
                              />
                            </div>

                            <button
                              type="button"
                              onClick={handleEventUnknownToggle}
                              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                                formData.eventUnknown
                                  ? 'bg-ardoise text-white border-ardoise font-semibold shadow-sm'
                                  : 'bg-white border-violet-imperial/15 hover:border-violet-imperial/40 text-onyx/80'
                              }`}
                            >
                              <span className="text-sm font-body">Je ne sais pas encore (option exclusive)</span>
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                  formData.eventUnknown
                                    ? 'bg-white border-white text-ardoise'
                                    : 'border-violet-imperial/30 bg-white'
                                }`}
                              >
                                {formData.eventUnknown && <CheckCircle2 className="w-3.5 h-3.5 text-ardoise" />}
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* BRANCHE E: Website */}
                    {formData.projectType === 'website' && (
                      <div className="space-y-4">
                        <label className="text-lg font-semibold text-onyx font-body block">
                          3. De quel site avez-vous besoin ?
                        </label>
                        <div className="space-y-3">
                          {BRANCH_E_OPTIONS.map((opt) => (
                            <div key={opt.id} className="space-y-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({ ...prev, websiteType: opt.id as any }))
                                }
                                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                                  formData.websiteType === opt.id
                                    ? 'bg-violet-imperial/10 border-violet-imperial ring-2 ring-violet-imperial/20 font-medium'
                                    : 'bg-white border-violet-imperial/15 hover:border-violet-imperial/40'
                                }`}
                              >
                                <span className="text-sm sm:text-base font-body">{opt.label}</span>
                              </button>

                              {opt.id === 'other' && formData.websiteType === 'other' && (
                                <input
                                  type="text"
                                  value={formData.websiteOtherText || ''}
                                  onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, websiteOtherText: e.target.value }))
                                  }
                                  placeholder="Précisez votre besoin de site..."
                                  className="w-full px-4 py-3 text-sm bg-ivoire-violet border border-violet-imperial/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-imperial font-body"
                                  autoFocus
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* BRANCHE F: Unknown */}
                    {formData.projectType === 'unknown' && (
                      <div className="space-y-4">
                        <label className="text-lg font-semibold text-onyx font-body block">
                          3. Racontez-moi en quelques mots votre situation.
                        </label>
                        <p className="text-xs text-onyx/60 font-body">Ce champ est facultatif.</p>
                        <textarea
                          rows={4}
                          value={formData.freeTextSituation || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, freeTextSituation: e.target.value }))
                          }
                          placeholder="Par exemple : je viens de lancer mon activité et je ne sais pas par où commencer."
                          className="w-full px-4 py-3 text-sm sm:text-base bg-ivoire-violet border border-violet-imperial/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-imperial font-body leading-relaxed"
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 4: Contact Details */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <label className="text-lg font-semibold text-onyx font-body block">
                        4. Vos coordonnées pour la prise de contact
                      </label>
                      <p className="text-xs text-onyx/60 font-body">
                        Tous les champs sont obligatoires pour vous recontacter directement sur WhatsApp.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Nom */}
                      <div>
                        <label className="text-xs font-semibold text-onyx/80 block mb-1.5 font-body">
                          Nom & Prénom <span className="text-violet-imperial">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-5 h-5 text-onyx/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                            }
                            placeholder="Votre nom complet"
                            className="w-full pl-11 pr-4 py-3 text-sm bg-ivoire-violet/60 border border-violet-imperial/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-imperial font-body"
                          />
                        </div>
                      </div>

                      {/* Entreprise */}
                      <div>
                        <label className="text-xs font-semibold text-onyx/80 block mb-1.5 font-body">
                          Nom de l’entreprise ou de la marque <span className="text-violet-imperial">*</span>
                        </label>
                        <div className="relative">
                          <Building className="w-5 h-5 text-onyx/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={formData.companyName}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                            }
                            placeholder="Nom de votre activité"
                            className="w-full pl-11 pr-4 py-3 text-sm bg-ivoire-violet/60 border border-violet-imperial/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-imperial font-body"
                          />
                        </div>
                      </div>

                      {/* WhatsApp */}
                      <div>
                        <label className="text-xs font-semibold text-onyx/80 block mb-1.5 font-body">
                          Numéro WhatsApp <span className="text-violet-imperial">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-5 h-5 text-onyx/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={formData.whatsappNumber}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, whatsappNumber: e.target.value }))
                            }
                            placeholder="Ex: +226 70 00 00 00"
                            className="w-full pl-11 pr-4 py-3 text-sm bg-ivoire-violet/60 border border-violet-imperial/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-imperial font-body"
                          />
                        </div>
                        <span className="text-[11px] text-onyx/50 block mt-1">
                          Réponse directe sur votre messagerie sous 24h ouvrées.
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mt-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 font-body animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 pt-6 border-t border-violet-imperial/10 flex items-center justify-between gap-4">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-onyx/70 hover:text-violet-imperial rounded-full hover:bg-violet-imperial/5 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Précédent
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < totalSteps ? (
                    <CtaButton
                      type="button"
                      onClick={handleNext}
                      variant="primary"
                      size="md"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continuer
                    </CtaButton>
                  ) : (
                    <CtaButton
                      type="submit"
                      variant="champagne"
                      size="md"
                      disabled={isSubmitting}
                      icon={<Send className="w-4 h-4" />}
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                    </CtaButton>
                  )}
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
