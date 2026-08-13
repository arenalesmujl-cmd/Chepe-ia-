import React, { useState } from 'react';
import { PLAN_TIERS } from '../data/chepeData';
import { CreditCard, Check, Sparkles, Zap, Shield, HelpCircle, X } from 'lucide-react';

interface PricingModuleProps {
  currentPlan: string;
  onSelectPlan: (planName: string) => void;
}

export const PricingModule: React.FC<PricingModuleProps> = ({ currentPlan, onSelectPlan }) => {
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);
  const [activatedSuccess, setActivatedSuccess] = useState(false);

  const handleSimulateUpgrade = (planName: string) => {
    setSelectedPlanModal(planName);
  };

  const handleConfirmUpgrade = () => {
    if (selectedPlanModal) {
      onSelectPlan(selectedPlanModal);
      setActivatedSuccess(true);
      setTimeout(() => {
        setActivatedSuccess(false);
        setSelectedPlanModal(null);
      }, 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase">
          <CreditCard className="w-3.5 h-3.5 text-[#00E5FF]" />
          Planes y Suscripciones Chepe IA
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Elige la potencia perfecta para tus ideas
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Accede a modelos de lenguaje de última generación, ejecución de código en sandbox y análisis de archivos ilimitado.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLAN_TIERS.map((tier) => {
          const isCurrent = currentPlan.toLowerCase() === tier.name.toLowerCase() || currentPlan.toLowerCase().includes(tier.id);

          return (
            <div
              key={tier.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 relative border transition-all ${
                tier.popular
                  ? 'bg-gradient-to-b from-[#0B1833] via-[#081021] to-[#050A14] border-[#00E5FF] shadow-2xl shadow-cyan-500/20 scale-102'
                  : 'bg-[#081021] border-cyan-900/60 hover:border-cyan-500/40'
              }`}
            >
              {tier.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  tier.popular ? 'bg-[#00E5FF] text-stone-950 shadow-md' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                }`}>
                  {tier.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-white">{tier.name}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{tier.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-xs text-stone-400 font-medium">{tier.period}</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#050A14] border border-cyan-950 text-xs font-semibold text-cyan-300">
                  ⚡ Límite: {tier.maxDailyMessages.toLocaleString()} mensajes diarios
                </div>

                {/* Features list */}
                <div className="space-y-2.5 pt-2 border-t border-cyan-950">
                  <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">Incluye:</span>
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade Button */}
              <button
                onClick={() => handleSimulateUpgrade(tier.name)}
                disabled={isCurrent}
                className={`w-full py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 cursor-default'
                    : tier.popular
                    ? 'bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 shadow-lg shadow-cyan-500/20 active:scale-95'
                    : 'bg-[#0F1C36] hover:bg-[#162A50] text-cyan-200 border border-cyan-800'
                }`}
              >
                {isCurrent ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Plan Actual Activo</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Activar {tier.name}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Upgrade Modal Simulation */}
      {selectedPlanModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-[#0B132B] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedPlanModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#002C3E] text-[#00E5FF] flex items-center justify-center mx-auto border border-[#00E5FF]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Confirmar Activación de {selectedPlanModal}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Estás a punto de activar la suscripción <strong className="text-[#00E5FF]">{selectedPlanModal}</strong> en Chepe IA. 
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#050A14] border border-cyan-900 text-xs text-cyan-200 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Modo de Prueba / Sin Cobro Real</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-normal">
                Esta versión de Chepe IA no realiza cobros reales a tu tarjeta. Haz clic abajo para activar las características avanzadas inmediatamente.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleConfirmUpgrade}
                disabled={activatedSuccess}
                className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-transform active:scale-95 cursor-pointer"
              >
                {activatedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950" />
                    <span>¡Plan Activado con Éxito!</span>
                  </>
                ) : (
                  <span>Confirmar Activación Gratuita</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
