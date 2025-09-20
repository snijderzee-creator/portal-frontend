import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GVFWLRCharts: React.FC = () => {
  const gvfData = [
    { name: 'GVF', value: 65, color: '#FE44CC' },
    { name: 'Remaining', value: 35, color: '#4D3DF7' }
  ];

  const wlrData = [
    { name: 'WLR', value: 85, color: '#22D3EE' },
    { name: 'Remaining', value: 15, color: '#4D3DF7' }
  ];

  const renderCustomLabel = (data: any[], mainValue: number, label: string) => {
    return (
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
        <tspan x="50%" dy="-10" className="fill-white text-3xl font-bold">
          {mainValue}%
        </tspan>
        <tspan x="50%" dy="25" className="fill-gray-400 text-sm">
          {label}
        </tspan>
      </text>
    );
  };

  return (
    <div className="bg-[#3C3F58] rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-white text-base font-medium">Average GVF/WLR</h2>
        <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center">
          <span className="text-gray-400 text-xs">i</span>
        </div>
      </div>

      <div className="flex justify-around">
        {/* GVF Chart */}
        <div className="relative w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gvfData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                startAngle={90}
                endAngle={450}
                dataKey="value"
                stroke="none"
              >
                {gvfData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-2xl font-bold">65%</span>
            <span className="text-gray-400 text-xs">GVF</span>
          </div>
        </div>

        {/* WLR Chart */}
        <div className="relative w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={wlrData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                startAngle={90}
                endAngle={450}
                dataKey="value"
                stroke="none"
              >
                {wlrData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-2xl font-bold">85%</span>
            <span className="text-gray-400 text-xs">WLR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GVFWLRCharts;