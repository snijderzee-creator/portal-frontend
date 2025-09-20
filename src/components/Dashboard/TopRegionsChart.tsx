import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ExternalLink, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const data = [
  { region: 'Qatar', oil: 65000, water: 50000, gas: 35000 },
  { region: 'Jeddah', oil: 52000, water: 72000, gas: 28000 },
  { region: 'Oman', oil: 55000, water: 32000, gas: 58000 },
];

const TopRegionsChart: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`rounded-lg p-6 ${
      theme === 'dark' ? 'bg-[#2A2D47]' : 'bg-white border border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className={`text-base font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Top Regions</h2>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
          }`}>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>i</span>
          </div>
        </div>
        <div className={`flex items-center gap-2 border px-2 py-1 rounded-lg ${
          theme === 'dark' 
            ? 'border-gray-600 text-gray-400 hover:text-white' 
            : 'border-gray-300 text-gray-600 hover:text-gray-900'
        }`}>
            className="cursor-pointer"
          <MoreHorizontal size={14} className="text-gray-400 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Subtitle */}
      <p className={`text-xs mb-4 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>Comparison</p>

      {/* Legend */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <span className={`text-xs ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Oil</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#06B6D4]" />
          <span className={`text-xs ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Water</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EC4899]" />
          <span className={`text-xs ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Gas</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
          barCategoryGap="25%"
        >
          <CartesianGrid
            stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'}
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="region"
            stroke={theme === 'dark' ? '#6B7280' : '#6B7280'}
            fontSize={12}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke={theme === 'dark' ? '#6B7280' : '#6B7280'}
            fontSize={12}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
            domain={[0, 75000]}
            ticks={[0, 25000, 50000, 75000]}
            tickFormatter={(value) => {
              if (value === 0) return '00';
              if (value === 25000) return '25k';
              if (value === 50000) return '50k';
              if (value === 75000) return '75k';
              return value;
            }}
          />
          <Bar
            dataKey="oil"
            fill="#6366F1"
            radius={[20, 20, 20, 20]}
            barSize={20}
          />
          <Bar
            dataKey="water"
            fill="#06B6D4"
            radius={[20, 20, 20, 20]}
            barSize={20}
          />
          <Bar
            dataKey="gas"
            fill="#EC4899"
            radius={[20, 20, 20, 20]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopRegionsChart;