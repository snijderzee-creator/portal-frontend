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
    <div className="bg-[#2A2D47] rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-lg font-medium">Top Regions</h2>
          <Info size={16} className="text-gray-400" />
        </div>
        <div className="flex items-center gap-2 border border-gray-600 px-3 py-1 rounded-lg">
          <ExternalLink size={16} className="text-gray-400 cursor-pointer hover:text-white" />
          <MoreHorizontal size={16} className="text-gray-400 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-gray-400 text-sm mb-6">Comparison</p>

      {/* Legend */}
      <div className="flex gap-8 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#4D3DF7]" />
          <span className="text-white text-sm">Oil</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#22D3EE]" />
          <span className="text-white text-sm">Water</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FE44CC]" />
          <span className="text-white text-sm">Gas</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
          barCategoryGap="25%"
        >
          <CartesianGrid
            stroke="#374151"
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="region"
            stroke="#9CA3AF"
            fontSize={14}
            fontWeight={500}
            tickMargin={15}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
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