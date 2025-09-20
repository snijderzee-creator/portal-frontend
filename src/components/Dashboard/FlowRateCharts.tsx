import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ExternalLink, MoreHorizontal } from 'lucide-react';
import { DeviceChartData, HierarchyChartData } from '../../services/api';
import { useTheme } from '../../hooks/useTheme';

interface FlowRateChartsProps {
  chartData?: DeviceChartData | null;
  hierarchyChartData?: HierarchyChartData | null;
}

interface SingleFlowRateChartProps {
  title: string;
  unit: string;
  data: any[];
  dataKey: string;
}

const FlowRateChart: React.FC<SingleFlowRateChartProps> = ({ title, unit, data, dataKey }) => {
  const { theme } = useTheme();

  return (
    <div className={`rounded-lg p-4 ${
      theme === 'dark' ? 'bg-[#2A2D47]' : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{title} ({unit})</h3>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
          }`}>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>i</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 border px-2 py-1 rounded ${
          theme === 'dark' 
            ? 'border-gray-600 text-gray-400 hover:text-white' 
            : 'border-gray-300 text-gray-600 hover:text-gray-900'
        }`}>
          <ExternalLink size={12} className="cursor-pointer" />
          <MoreHorizontal size={12} className="cursor-pointer" />
        </div>
      </div>

      <div className="mb-3">
        <p className={`text-xs mb-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>Comparison</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-[#EC4899] rounded"></div>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Line Condition</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-[#6366F1] rounded"></div>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Standard Condition</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'} strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            stroke={theme === 'dark' ? '#6B7280' : '#6B7280'} 
            fontSize={10}
            tickMargin={5}
          />
          <YAxis
            stroke={theme === 'dark' ? '#6B7280' : '#6B7280'}
            fontSize={10}
            tickMargin={5}
            domain={[0, 12000]}
            ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000]}
            tickFormatter={(value) => {
              if (value === 0) return '00';
              return value.toString();
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#EC4899"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="standard"
            stroke="#6366F1"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const FlowRateCharts: React.FC<FlowRateChartsProps> = ({ chartData, hierarchyChartData }) => {
  // Transform API data to chart format
  const ofrData = useMemo(() => {
    if (chartData?.chartData) {
      return chartData.chartData.map(point => ({
        time: new Date(point.timestamp).toLocaleTimeString(),
        line: point.ofr || 0,
        standard: (point.ofr || 0) * 0.95,
      }));
    } else if (hierarchyChartData?.chartData) {
      return hierarchyChartData.chartData.map(point => ({
        time: new Date(point.timestamp).toLocaleTimeString(),
        line: point.totalOfr || 0,
        standard: (point.totalOfr || 0) * 0.95,
      }));
    }
    // Default data if no API data
    return [
      { time: '14:25:48', line: 10000, standard: 9500 },
      { time: '14:25:50', line: 8000, standard: 7500 },
      { time: '14:25:52', line: 6000, standard: 5500 },
      { time: '14:25:54', line: 4000, standard: 3500 },
    ];
  }, [chartData, hierarchyChartData]);

  const wfrData = useMemo(() => {
    // Similar logic for WFR data
    return ofrData.map(point => ({
      ...point,
      line: point.line * 0.8, // Simulate different values
      standard: point.standard * 0.8,
    }));
  }, [ofrData]);

  const gfrData = useMemo(() => {
    // Similar logic for GFR data
    return ofrData.map(point => ({
      ...point,
      line: point.line * 1.2, // Simulate different values
      standard: point.standard * 1.2,
    }));
  }, [ofrData]);

  return (
    <div className="grid grid-cols-3 gap-6">
      <FlowRateChart title="OFR" unit="bbd" data={ofrData} dataKey="line" />
      <FlowRateChart title="WFR" unit="bbd" data={wfrData} dataKey="line" />
      <FlowRateChart title="GFR" unit="bbd" data={gfrData} dataKey="line" />
    </div>
  );
};

export default FlowRateCharts;