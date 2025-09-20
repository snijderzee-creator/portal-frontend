import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';

const GVFWLRCharts: React.FC = () => {
  const { theme } = useTheme();

  const gvfData = [
    { name: 'GVF', value: 65, color: '#FE44CC' },
    { name: 'Remaining', value: 35, color: '#4D3DF7' }
  ];

  const wlrData = [
    { name: 'WLR', value: 85, color: '#22D3EE' },
    { name: 'Remaining', value: 15, color: '#4D3DF7' }
  ];

  return (
    <div className={`rounded-lg p-6 ${
      theme === 'dark' ? 'bg-[#2A2D47]' : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <h2 className={`text-base font-medium ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Average GVF/WLR</h2>
        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
        }`}>
          <span className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>i</span>
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
            <span className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>65%</span>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>GVF</span>
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
            <span className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>85%</span>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>WLR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GVFWLRCharts;