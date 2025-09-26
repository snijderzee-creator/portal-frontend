import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ExternalLink, Info, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const data = [
  { region: 'Qatar', oil: 65000, water: 50000, gas: 35000 },
  { region: 'Jeddah', oil: 52000, water: 72000, gas: 28000 },
  { region: 'Oman', oil: 55000, water: 32000, gas: 58000 },
];

const TopRegionsChart: React.FC = () => {
  const { theme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-refresh effect with visual indicator
  useEffect(() => {
    const startAutoRefresh = () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      refreshIntervalRef.current = setInterval(() => {
        setIsRefreshing(true);
        
        // Simulate refresh animation
        setTimeout(() => {
          setIsRefreshing(false);
        }, 800);
      }, 5000);
    };

    startAutoRefresh();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // Define bar colors based on theme
  const colors = {
    oil: theme === 'dark' ? '#4D3DF7' : '#38BF9D',
    water: theme === 'dark' ? '#46B8E9' : '#F6CA58',
    gas: theme === 'dark' ? '#F35DCB' : '#F56C44',
  };

  return (
    <div className={`p-4 transition-all duration-300 ${
      isRefreshing ? 'ring-2 ring-blue-400 ring-opacity-50 shadow-lg rounded-lg' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2
            className={`text-xl font-medium ${
              theme === 'dark' ? 'text-[#fff]' : 'text-[#0f0f0f]'
            }`}
          >
            Top Regions
          </h2>
          <Info
            className={`text-xs ${
              theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'
            }`}
          />
        </div>
        <div
          className={`flex items-center gap-2 border px-2 py-1 rounded-lg ${
            theme === 'dark'
              ? 'border-[#D0CCD8] text-gray-400 hover:text-white'
              : 'border-[#EAEAEA] text-gray-600 hover:text-gray-900'
          }`}
        >
          {isRefreshing && (
            <RefreshCw className={`w-4 h-4 animate-spin ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
            }`} />
          )}
          <ExternalLink />
          <MoreHorizontal
            size={14}
            className="text-gray-400 cursor-pointer hover:text-gray-800"
          />
        </div>
      </div>

      {/* Subtitle */}

      {/* Legend */}
      <div className="flex gap-10 mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full ${
              theme === 'dark' ? 'bg-[#4d3df7]' : 'bg-[#38BF9D]'
            }`}
          />
          <span
            className={`text-base ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Oil
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full ${
              theme === 'dark' ? 'bg-[#46B8E9]' : 'bg-[#F6CA58]'
            }`}
          />
          <span
            className={`text-base ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Water
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full ${
              theme === 'dark' ? 'bg-[#F35DCB]' : 'bg-[#F56C44]'
            }`}
          />
          <span
            className={`text-base ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Gas
          </span>
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
            stroke={theme === 'dark' ? '#A2AED4' : '#D2DDD8'}
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="region"
            stroke={theme === 'dark' ? '#A2AED4' : '#555758'}
            fontSize={15}
            tickMargin={20}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke={theme === 'dark' ? '#A2AED4' : '#555758'}
            fontSize={13}
            tickMargin={20}
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
            fill={colors.oil}
            radius={[20, 20, 20, 20]}
            barSize={20}
          />
          <Bar
            dataKey="water"
            fill={colors.water}
            radius={[20, 20, 20, 20]}
            barSize={20}
          />
          <Bar
            dataKey="gas"
            fill={colors.gas}
            radius={[20, 20, 20, 20]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopRegionsChart;