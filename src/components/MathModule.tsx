import React, { useState } from 'react';
import { Calculator, Sparkles, Send, Binary, PieChart, FunctionSquare, Layers, TrendingDown } from 'lucide-react';
import { DepreciationCalculator } from './DepreciationCalculator';

interface MathModuleProps {
  onAskAI: (prompt: string, specialty: string) => void;
}

export const MathModule: React.FC<MathModuleProps> = ({ onAskAI }) => {
  const [problemInput, setProblemInput] = useState('');

  const mathCategories = [
    {
      title: 'Métodos de Depreciación Financiera',
      desc: 'Comparativa gráfica de Línea Recta, Saldo Decreciente y Suma de Dígitos.',
      icon: '📉',
      prompt: 'Genera la gráfica y tabla comparativa de los métodos de depreciación (Línea Recta, Doble Saldo Decreciente y Suma de Dígitos de los Años) para un activo con costo inicial de $100,000 USD, salvamento de $10,000 y vida útil de 5 años.'
    },
    {
      title: 'Álgebra y Ecuaciones',
      desc: 'Sistemas de ecuaciones, polinomios, factorización y simplificación.',
      icon: '🧮',
      prompt: 'Resuelve el siguiente sistema de ecuaciones de 2x2: 3x + 2y = 12 y 5x - y = 7 mostrando todo el procedimiento paso a paso.'
    },
    {
      title: 'Cálculo Diferencial e Integral',
      desc: 'Límites, derivadas, integrales definidas e indefinidas.',
      icon: '∫',
      prompt: 'Calcula la derivada de f(x) = x^3 * sin(x) paso a paso usando la regla del producto.'
    },
    {
      title: 'Estadística y Probabilidad',
      desc: 'Media, mediana, desviación estándar, permutaciones y distribuciones.',
      icon: '📊',
      prompt: 'Dada la serie de datos [12, 15, 18, 22, 22, 30], calcula la media, mediana, moda y desviación estándar muestral.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemInput.trim()) return;
    onAskAI(`[Resolución Matemática Paso a Paso]\n${problemInput}`, 'matematicas');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#081021] to-[#050A14] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase">
              <Calculator className="w-3.5 h-3.5 text-[#00E5FF]" />
              Resolvedor Matemático Inteligente Chepe IA
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Matemáticas, Álgebra y Cálculo Paso a Paso
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Escribe tus problemas matemáticos, ecuaciones o fórmulas físicas para recibir una explicación paso a paso con las fórmulas y demostraciones claras.
            </p>
          </div>
        </div>
      </div>

      {/* Math Input Box */}
      <div className="p-6 rounded-3xl bg-[#081021] border border-cyan-900/80 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00E5FF]" />
          Ingresa tu Ecuación o Problema Matemático:
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={problemInput}
            onChange={(e) => setProblemInput(e.target.value)}
            placeholder="Ejemplo: Resuelve 2x² + 5x - 3 = 0 utilizando la fórmula general cuadrática..."
            rows={4}
            className="w-full p-4 rounded-2xl bg-[#050A14] border border-cyan-900 text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:border-[#00E5FF] leading-relaxed resize-none font-mono"
          />

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={!problemInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 disabled:opacity-40 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Resolver Paso a Paso</span>
            </button>
          </div>
        </form>
      </div>

      {/* Math Topic Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
          Temas y Categorías Frecuentes:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mathCategories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onAskAI(cat.prompt, 'matematicas')}
              className="p-5 rounded-2xl bg-[#081021] hover:bg-[#0F1C36] border border-cyan-900/60 hover:border-[#00E5FF] transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl p-2 rounded-xl bg-[#050A14] border border-cyan-900 text-cyan-400 font-extrabold">
                  {cat.icon}
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                    {cat.title}
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Probar ejemplo de resolución</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Interactive Depreciation Calculator & Chart */}
      <DepreciationCalculator onAskAI={onAskAI} />
    </div>
  );
};
