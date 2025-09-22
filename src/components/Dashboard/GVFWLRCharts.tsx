import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { HierarchyChartData, DeviceChartData } from '../../services/api';
import { Info } from 'lucide-react';

interface GVFWLRChartsProps {
  chartData?: DeviceChartData | null;
  hierarchyChartData?: HierarchyChartData | null;
}

const GVFWLRCharts: React.FC<GVFWLRChartsProps> = ({ chartData, hierarchyChartData }) => {
  const { theme } = useTheme();

  // Calculate GVF and WLR values from chart data
  let gvfValue = 65;
  let wlrValue = 85;

  if (hierarchyChartData?.chartData && hierarchyChartData.chartData.length > 0) {
    const latestData = hierarchyChartData.chartData[hierarchyChartData.chartData.length - 1];
    gvfValue = latestData.totalGvf || 65;
    wlrValue = latestData.totalWlr || 85;
  } else if (chartData?.chartData && chartData.chartData.length > 0) {
    const latestData = chartData.chartData[chartData.chartData.length - 1];
    gvfValue = latestData.gvf || 65;
    wlrValue = latestData.wlr || 85;
  }

  const gvfData = [
    { name: 'GVF', value: gvfValue, color: theme === 'dark' ? '#4D3DF7' : '#38BF9D' },
    {
      name: 'Remaining',
      value: 100 - gvfValue,
      color: theme === 'dark' ? '#FE44CC' : '#F56C44',
    },
  ];

  const wlrData = [
    { name: 'WLR', value: wlrValue, color: theme === 'dark' ? '#4D3DF7' : '#38BF9D' },
    {
      name: 'Remaining',
      value: 100 - wlrValue,
      color: theme === 'dark' ? '#22D3EE' : '#F6CA58',
    },
  ];

  return (
    <div className="p-4">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <h2
          className={`text-base font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Average GVF/WLR
        </h2>
        <Info
          className={`text-xs ${
            theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'
          }`}
        />
      </div>

      {/* Charts Row */}
      <div className="flex flex-1 justify-around items-center">
        {/* GVF Chart */}
        <div className="relative flex-1 h-80">
          {' '}
          {/* fills height */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gvfData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
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
            <span
              className={`lg:text-5xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {Math.round(gvfValue)}%
            </span>
            <span
              className={`lg:text-xL font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              GVF
            </span>
          </div>
        </div>

        {/* WLR Chart */}
        <div className="relative flex-1 h-80">
          {' '}
          {/* fills height */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={wlrData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
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
            <span
              className={`text-5xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {Math.round(wlrValue)}%
            </span>
            <span
              className={`text-xl font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              WLR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GVFWLRCharts;
