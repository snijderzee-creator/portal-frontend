import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { HierarchyChartData, DeviceChartData } from '../../services/api';
import { Info, ExternalLink, MoreHorizontal } from 'lucide-react';
import ChartModal from '../Charts/ChartModal';

interface GVFWLRChartsProps {
  chartData?: DeviceChartData | null;
  hierarchyChartData?: HierarchyChartData | null;
}

const GVFWLRCharts: React.FC<GVFWLRChartsProps> = ({ chartData, hierarchyChartData }) => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate GVF and WLR values from chart data
  let gvfValue: number | undefined;
  let wlrValue: number | undefined;

  if (hierarchyChartData?.chartData && hierarchyChartData.chartData.length > 0) {
    const latestData = hierarchyChartData.chartData[hierarchyChartData.chartData.length - 1];
    gvfValue = latestData?.totalGvf;
    wlrValue = latestData?.totalWlr;
  } else if (chartData?.chartData && chartData.chartData.length > 0) {
    const latestData = chartData.chartData[chartData.chartData.length - 1];
    gvfValue = latestData?.gvf;
    wlrValue = latestData?.wlr;
  }

  const gvfData = [
    {
      name: 'GVF',
      value: gvfValue,
      color: theme === 'dark' ? '#4D3DF7' : '#38BF9D',
    },
    {
      name: 'Remaining',
      value: gvfValue!== undefined ? 100 - gvfValue : undefined,
      color: theme === 'dark' ? '#A2AED4' : '#d4d4d4',
    },
  ];

  const wlrData = [
    {
      name: 'WLR',
      value: wlrValue,
      color: theme === 'dark' ? '#F35DCB' : '#F56C44',
    },
    {
      name: 'Remaining',
      value: wlrValue!== undefined ? 100 - wlrValue : undefined,
      color: theme === 'dark' ? '#A2AED4' : '#d4d4d4',
    },
  ];

  const renderCharts = (chartSize: string, showButtons = true) => (
    <div className="flex flex-1 justify-around items-center">
      {/* GVF Chart */}
      <div className={`relative flex-1 ${chartSize}`}>
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
            {gvfValue !== undefined ? Math.round(gvfValue): ''}{gvfValue !== undefined ? '%' : ''}
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
      <div className={`relative flex-1 ${chartSize}`}>
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
            {wlrValue !== undefined ? Math.round(wlrValue): ''}{wlrValue !== undefined ? '%' : ''}
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
  );

  return (
    <div className="p-4">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2
            className={`text-base font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            GVF/WLR
          </h2>
          <Info
            size={16}
            className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}
          />
        </div>
        <div className={`flex items-center gap-2 border px-2 py-1 rounded-lg ${
          theme === 'dark'
            ? 'text-gray-300 border-[#A2AED4]'
            : 'text-gray-600 border-gray-300'
        }`}>
          <ExternalLink
            size={20}
            className="cursor-pointer hover:text-white transition-colors"
            onClick={() => setIsModalOpen(true)}
          />
          <MoreHorizontal
            size={20}
            className="cursor-pointer hover:text-white"
          />
        </div>
      </div>

      {/* Charts Row */}
      {renderCharts('h-96')}

      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="GVF/WLR"
      >
        {renderCharts('h-[70vh]', false)}
      </ChartModal>
    </div>
  );
};

export default GVFWLRCharts;
