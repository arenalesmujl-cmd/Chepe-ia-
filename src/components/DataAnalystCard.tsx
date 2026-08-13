import React from 'react';
import { ChartDataPayload } from '../types';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { BarChart3, Download, Table } from 'lucide-react';

interface DataAnalystCardProps {
  payload: ChartDataPayload;
}

const COLOR_PALETTE = ['#00E5FF', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

export const DataAnalystCard: React.FC<DataAnalystCardProps> = ({ payload }) => {
  const { title, chartType, data, dataKeys, xAxisKey } = payload;

  const handleExportCSV = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((item) => Object.values(item).join(','));
    const csvContent = [headers, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}_data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-3 p-4 rounded-2xl bg-[#060C1B] border border-cyan-500/40 shadow-xl space-y-3 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-900/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 text-[#00E5FF] border border-cyan-800">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-black text-white">{title || 'Análisis Visual de Datos'}</h4>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-2.5 py-1 rounded-lg bg-[#0F1C36] hover:bg-[#162A50] text-cyan-300 border border-cyan-800 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-72 bg-[#030712] p-2 rounded-xl border border-cyan-950">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey={xAxisKey} stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#00E5FF', borderRadius: '8px', color: '#F8FAFC' }} />
              <Legend />
              {dataKeys.map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: COLOR_PALETTE[idx % COLOR_PALETTE.length] }}
                />
              ))}
            </LineChart>
          ) : chartType === 'area' ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey={xAxisKey} stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#00E5FF', borderRadius: '8px', color: '#F8FAFC' }} />
              <Legend />
              {dataKeys.map((key, idx) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                  fill={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          ) : chartType === 'pie' ? (
            <PieChart>
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#00E5FF', borderRadius: '8px', color: '#F8FAFC' }} />
              <Legend />
              <Pie
                data={data}
                dataKey={dataKeys[0] || 'val'}
                nameKey={xAxisKey}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey={xAxisKey} stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#00E5FF', borderRadius: '8px', color: '#F8FAFC' }} />
              <Legend />
              {dataKeys.map((key, idx) => (
                <Bar key={key} dataKey={key} fill={COLOR_PALETTE[idx % COLOR_PALETTE.length]} radius={[6, 6, 0, 0]} />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
