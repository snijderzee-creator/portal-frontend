import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Info, ExternalLink, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const data = [
  { region: 'Qatar', oil: 65000, water: 50000, gas: 35000 },
  { region: 'Jeddah', oil: 52000, water: 72000, gas: 28000 },
  { region: 'Oman', oil: 55000, water: 32000, gas: 58000 },
];

const TopRegionsChart: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="bg-[#3C3F58] rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-base font-medium">Top Regions</h2>
          <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-gray-400 text-xs">i</span>
          </div>
        </div>
        <div className="flex items-center gap-2 border border-gray-600 px-2 py-1 rounded-lg">
          <ExternalLink size={14} className="text-gray-400 cursor-pointer hover:text-white" />
          <MoreHorizontal size={14} className="text-gray-400 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-gray-400 text-xs mb-4">Comparison</p>

      {/* Legend */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <span className="text-white text-xs">Oil</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#06B6D4]" />
          <span className="text-white text-xs">Water</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EC4899]" />
          <span className="text-white text-xs">Gas</span>
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
            stroke="#4B5563"
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="region"
            stroke="#6B7280"
            fontSize={12}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#6B7280"
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