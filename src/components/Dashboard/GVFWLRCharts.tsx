import React, { useState, useEffect, useRef } from 'react';
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

  return (
    <div className="p-4">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
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

      {/* Charts Row */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 w-full">
        {/* GVF Chart */}
        <div className="relative w-80 h-80 md:w-96 md:h-96">
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
              className={`text-5xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {gvfValue !== undefined ? Math.round(gvfValue) : ''}
              {gvfValue !== undefined ? '%' : ''}
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
        <div className="relative w-80 h-80 md:w-96 md:h-96">
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
              {wlrValue !== undefined ? Math.round(wlrValue) : ''}
              {wlrValue !== undefined ? '%' : ''}
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
