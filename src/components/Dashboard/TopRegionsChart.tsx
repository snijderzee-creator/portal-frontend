import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Info, ExternalLink, Edit3, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const data = [
  { region: 'Qatar', oil: 65000, water: 50000, gas: 35000 },
  { region: 'Jeddah', oil: 52000, water: 72000, gas: 28000 },
  { region: 'Oman', oil: 55000, water: 32000, gas: 58000 },
];

const TopRegionsChart: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`p-6 rounded-2xl shadow-md ${
      theme === 'dark' ? 'bg-[#1E293B]' : 'bg-white border border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Top Regions
          </h2>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            theme === 'dark' ? 'border-gray-400' : 'border-gray-500'
          }`}>
            <Info size={12} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
          </div>
        </div>
        <div className={`flex items-center gap-2 border px-3 py-2 rounded-lg ${
          theme === 'dark' 
            ? 'text-gray-300 border-gray-600' 
            : 'text-gray-600 border-gray-300'
        }`}>
          <ExternalLink size={16} className={`cursor-pointer ${
            theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'
          }`} />
          <Edit3 size={16} className={`cursor-pointer ${
            theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'
          }`} />
          <MoreHorizontal size={16} className={`cursor-pointer ${
            theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'
          }`} />
        </div>
      </div>

      {/* Subtitle */}
      <p className={`text-lg mb-6 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Comparison
      </p>

      {/* Legend */}
      <div className="flex gap-8 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#4D3DF7]" />
          <span className={`text-lg font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Oil
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#22D3EE]" />
          <span className={`text-lg font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Water
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#FE44CC]" />
          <span className={`text-lg font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Gas
          </span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
          barCategoryGap="25%"
        >
          <CartesianGrid 
            stroke={theme === 'dark' ? '#334155' : '#E5E7EB'} 
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis 
            dataKey="region" 
            stroke={theme === 'dark' ? '#94A3B8' : '#6B7280'}
            fontSize={16}
            fontWeight={500}
            tickMargin={20}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke={theme === 'dark' ? '#94A3B8' : '#6B7280'}
            fontSize={14}
            tickMargin={15}
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
            fill="#4D3DF7"
            radius={[20, 20, 20, 20]}
            barSize={24}
          />
          <Bar
            dataKey="water"
            fill="#22D3EE"
            radius={[20, 20, 20, 20]}
            barSize={24}
          />
          <Bar
            dataKey="gas"
            fill="#FE44CC"
            radius={[20, 20, 20, 20]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopRegionsChart;