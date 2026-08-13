import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { Calculator, Download, Sparkles, TrendingDown, DollarSign, Layers, Table as TableIcon } from 'lucide-react';

interface DepreciationCalculatorProps {
  onAskAI?: (prompt: string, specialty: string) => void;
}

export const DepreciationCalculator: React.FC<DepreciationCalculatorProps> = ({ onAskAI }) => {
  const [assetName, setAssetName] = useState('Equipo / Maquinaria');
  const [initialCost, setInitialCost] = useState(100000);
  const [salvageValue, setSalvageValue] = useState(10000);
  const [usefulLife, setUsefulLife] = useState(5);
  const [viewMetric, setViewMetric] = useState<'bookValue' | 'annualExpense'>('bookValue');

  // Compute schedules
  const calculateSchedules = () => {
    const years = Math.max(1, Math.min(30, Math.floor(usefulLife)));
    const cost = Math.max(0, initialCost);
    const salvage = Math.max(0, Math.min(cost, salvageValue));
    const depreciableBase = cost - salvage;

    const dataPoints: Array<{
      year: string;
      yearNum: number;
      // Book values
      slBookValue: number;
      ddbBookValue: number;
      sydBookValue: number;
      // Annual expenses
      slExpense: number;
      ddbExpense: number;
      sydExpense: number;
    }> = [];

    // Year 0
    dataPoints.push({
      year: 'Año 0',
      yearNum: 0,
      slBookValue: cost,
      ddbBookValue: cost,
      sydBookValue: cost,
      slExpense: 0,
      ddbExpense: 0,
      sydExpense: 0,
    });

    // 1. Straight Line (SL)
    const slAnnualExpense = depreciableBase / years;

    // 3. Sum of the Years' Digits (SYD)
    const sydSum = (years * (years + 1)) / 2;

    // DDB tracking
    let currentDdbBook = cost;
    const ddbRate = 2 / years;

    let currentSlBook = cost;
    let currentSydBook = cost;

    for (let yr = 1; yr <= years; yr++) {
      // SL
      const slExp = slAnnualExpense;
      currentSlBook = Math.max(salvage, currentSlBook - slExp);

      // DDB
      let ddbExp = currentDdbBook * ddbRate;
      if (currentDdbBook - ddbExp < salvage) {
        ddbExp = Math.max(0, currentDdbBook - salvage);
      }
      currentDdbBook = currentDdbBook - ddbExp;

      // SYD
      const sydExp = ((years - yr + 1) / sydSum) * depreciableBase;
      currentSydBook = Math.max(salvage, currentSydBook - sydExp);

      dataPoints.push({
        year: `Año ${yr}`,
        yearNum: yr,
        slBookValue: Math.round(currentSlBook),
        ddbBookValue: Math.round(currentDdbBook),
        sydBookValue: Math.round(currentSydBook),
        slExpense: Math.round(slExp),
        ddbExpense: Math.round(ddbExp),
        sydExpense: Math.round(sydExp),
      });
    }

    return dataPoints;
  };

  const scheduleData = calculateSchedules();

  const handleExportCSV = () => {
    const headers = ['Año', 'Línea Recta (Valor Libros)', 'Doble Saldo (Valor Libros)', 'Suma Dígitos (Valor Libros)', 'Línea Recta (Gasto)', 'Doble Saldo (Gasto)', 'Suma Dígitos (Gasto)'];
    const rows = scheduleData.map(d => [
      d.year,
      d.slBookValue,
      d.ddbBookValue,
      d.sydBookValue,
      d.slExpense,
      d.ddbExpense,
      d.sydExpense
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `depreciacion_${assetName.replace(/\s+/g, '_').toLowerCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAskChepeAI = () => {
    if (!onAskAI) return;
    const prompt = `Analiza los resultados de depreciación para el activo "${assetName}":\n` +
      `- Costo Inicial: $${initialCost.toLocaleString()} USD\n` +
      `- Valor de Salvamento: $${salvageValue.toLocaleString()} USD\n` +
      `- Vida Útil: ${usefulLife} años\n` +
      `Explica las ventajas fiscales y contables de elegir Línea Recta vs Doble Saldo Decreciente vs Suma de Dígitos de los Años, e incluye las fórmulas aplicadas.`;
    onAskAI(prompt, 'matematicas');
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#060C1B] border border-cyan-500/40 shadow-2xl space-y-6 font-sans">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cyan-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-blue-600 text-stone-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/20">
            <TrendingDown className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Calculadora & Gráfica de Métodos de Depreciación</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-[#00E5FF] border border-cyan-800 text-[10px] font-mono font-bold">
                FINANZAS & CONTABILIDAD
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              Compara gráficamente Línea Recta, Doble Saldo Decreciente y Suma de Dígitos de los Años
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-[#0F1C36] hover:bg-[#162A50] text-cyan-300 border border-cyan-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Exportar CSV</span>
          </button>

          {onAskAI && (
            <button
              onClick={handleAskChepeAI}
              className="px-3.5 py-1.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-300 text-stone-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analizar con Chepe IA</span>
            </button>
          )}
        </div>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#081021] border border-cyan-950">
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-300 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
            Nombre del Activo
          </label>
          <input
            type="text"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            className="w-full bg-[#050A14] text-xs text-white border border-cyan-800 rounded-xl p-2.5 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-300 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Costo Inicial (USD)
          </label>
          <input
            type="number"
            min={0}
            step={1000}
            value={initialCost}
            onChange={(e) => setInitialCost(Number(e.target.value))}
            className="w-full bg-[#050A14] text-xs text-white border border-cyan-800 rounded-xl p-2.5 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-300 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            Valor de Salvamento (USD)
          </label>
          <input
            type="number"
            min={0}
            step={500}
            value={salvageValue}
            onChange={(e) => setSalvageValue(Number(e.target.value))}
            className="w-full bg-[#050A14] text-xs text-white border border-cyan-800 rounded-xl p-2.5 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-300 flex items-center gap-1">
            <Calculator className="w-3.5 h-3.5 text-purple-400" />
            Vida Útil (Años)
          </label>
          <input
            type="number"
            min={1}
            max={30}
            value={usefulLife}
            onChange={(e) => setUsefulLife(Number(e.target.value))}
            className="w-full bg-[#050A14] text-xs text-white border border-cyan-800 rounded-xl p-2.5 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>
      </div>

      {/* Chart Selector & Visualization */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span>Visualización de Métodos Comparados</span>
          </h3>

          <div className="flex bg-[#050A14] p-1 rounded-xl border border-cyan-900 gap-1 text-xs font-bold">
            <button
              onClick={() => setViewMetric('bookValue')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMetric === 'bookValue'
                  ? 'bg-[#00E5FF] text-stone-950 shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Valor en Libros
            </button>
            <button
              onClick={() => setViewMetric('annualExpense')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMetric === 'annualExpense'
                  ? 'bg-[#00E5FF] text-stone-950 shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Gasto Anual de Depreciación
            </button>
          </div>
        </div>

        <div className="w-full h-72 sm:h-80 bg-[#030712] p-3 rounded-2xl border border-cyan-950">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scheduleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: number) => [`$${val.toLocaleString()} USD`, '']}
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#00E5FF', borderRadius: '12px', color: '#F8FAFC' }}
              />
              <Legend />
              {viewMetric === 'bookValue' ? (
                <>
                  <Line name="Línea Recta" type="monotone" dataKey="slBookValue" stroke="#00E5FF" strokeWidth={3} dot={{ r: 5 }} />
                  <Line name="Doble Saldo Decreciente" type="monotone" dataKey="ddbBookValue" stroke="#EC4899" strokeWidth={3} dot={{ r: 5 }} />
                  <Line name="Suma de Dígitos" type="monotone" dataKey="sydBookValue" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} />
                </>
              ) : (
                <>
                  <Line name="Línea Recta" type="monotone" dataKey="slExpense" stroke="#00E5FF" strokeWidth={3} dot={{ r: 5 }} />
                  <Line name="Doble Saldo Decreciente" type="monotone" dataKey="ddbExpense" stroke="#EC4899" strokeWidth={3} dot={{ r: 5 }} />
                  <Line name="Suma de Dígitos" type="monotone" dataKey="sydExpense" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparative Data Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-stone-300 flex items-center gap-1.5 px-1">
          <TableIcon className="w-4 h-4 text-[#00E5FF]" />
          Tabla de Depreciación Anual (USD)
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-cyan-950 bg-[#050A14]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B132B] text-cyan-300 uppercase text-[10px] tracking-wider border-b border-cyan-900">
              <tr>
                <th className="p-3">Periodo</th>
                <th className="p-3 text-right">Línea Recta (Libros)</th>
                <th className="p-3 text-right">Doble Saldo (Libros)</th>
                <th className="p-3 text-right">Suma Dígitos (Libros)</th>
                <th className="p-3 text-right">Gasto Anual (Línea Recta)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/60 text-stone-300">
              {scheduleData.map((row) => (
                <tr key={row.year} className="hover:bg-[#081021] transition-colors">
                  <td className="p-3 font-bold text-white">{row.year}</td>
                  <td className="p-3 text-right text-[#00E5FF] font-bold">${row.slBookValue.toLocaleString()}</td>
                  <td className="p-3 text-right text-pink-400 font-bold">${row.ddbBookValue.toLocaleString()}</td>
                  <td className="p-3 text-right text-purple-400 font-bold">${row.sydBookValue.toLocaleString()}</td>
                  <td className="p-3 text-right text-stone-400">${row.slExpense.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
