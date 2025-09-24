import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ExternalLink, Info, MoreHorizontal, RefreshCw } from 'lucide-react';
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
  isRefreshing?: boolean;
}

const FlowRateChart: React.FC<SingleFlowRateChartProps> = ({
  title,
  unit,
  data,
  dataKey,
  isRefreshing = false,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-lg p-4 transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'
      } ${isRefreshing ? 'ring-2 ring-blue-400 ring-opacity-50 shadow-lg' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3
            className={`text-base font-medium ${
              theme === 'dark' ? 'text-[#fff]' : 'text-[#0f0f0f]'
            }`}
          >
            {title} ({unit})
          </h3>
          <Info
            className={`text-sm ${
              theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'
            }`}
          />
        </div>
        <div
          className={`flex items-center gap-2 border px-2 py-1 rounded-md ${
            theme === 'dark'
              ? 'border-[#D0CCD8] text-gray-400 hover:text-white'
              : 'border-[#EAEAEA] text-gray-600 hover:text-gray-900'
          }`}
        >
          {isRefreshing && (
            <RefreshCw
              size={14}
              className={`animate-spin ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`}
            />
          )}
          <ExternalLink
            size={16}
            className="dark:text-white cursor-pointer dark:hover:text-gray-200"
          />
          <MoreHorizontal
            size={16}
            className="text-gray-400 dark:text-white cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-[#38BF9D] dark:bg-[#EC4899] rounded"></div>
            <span
              className={`text-sm font-thin ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Line Condition
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        >
          <CartesianGrid
            stroke={theme === 'dark' ? '#d5dae740' : '#E5E7EB'}
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="time"
            stroke={theme === 'dark' ? '#A2AED4' : '#6B7280'}
            fontSize={10}
            tickMargin={20}
          />
          <YAxis
            stroke={theme === 'dark' ? '#A2AED4' : '#6B7280'}
            fontSize={13}
            tickMargin={20}
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
            stroke={theme === 'dark' ? '#EC4899' : '#38BF9D'}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const FlowRateCharts: React.FC<FlowRateChartsProps> = ({
  chartData,
  hierarchyChartData,
}) => {
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

  // Transform API data to chart format
  const ofrData = useMemo(() => {
    if (chartData?.chartData) {
      return chartData.chartData.map((point) => ({
        time: new Date(point.timestamp).toLocaleTimeString(),
        line: point.ofr || 0,
        standard: point.ofr || 0,
      }));
    } else if (hierarchyChartData?.chartData) {
      return hierarchyChartData.chartData.map((point) => ({
        time: new Date(point.timestamp).toLocaleTimeString(),
        line: point.totalOfr || 0,
        standard: point.totalOfr || 0,
      }));
    }
    // Return empty array if no data
    return [];
  }, [chartData, hierarchyChartData]);

  const wfrData = useMemo(() => {
    if (chartData?.chartData) {
      return chartData.chartData.map((point) => ({
        time: new Date(point.timestamp).toLocaleTimeString(),
        line: point.wfr || 0,
        standard: point.wfr || 0,
      }));
    } else if (hierarchyChartData?.chartData) {
      return hierarchyChartData.chartData.map((point) => ({
        time: new Date(point.timestamp).toLocaleTimeString(),
        line: point.totalWfr || 0,
        standard: point.totalWfr || 0,
      }));
    }
    // Return empty array if no data
    return [];
  }, [chartData, hierarchyChartData]);

  const gfrData = useMemo(() => {
    if (chartData?.chartData) {
      return chartData.chartData.map((point) => ({
        time: new Date(point.timestamp).toLocaleTimeString(),
        line: point.gfr || 0,
        standard: point.gfr || 0,
      }));
    } else if (hierarchyChartData?.chartData) {
      return hierarchyChartData.chartData.map((point) => ({
        time: new Date(point.timestamp).toLocaleTimeString(),
        line: point.totalGfr || 0,
        standard: point.totalGfr || 0,
      }));
    }
    // Return empty array if no data
    return [];
  }, [chartData, hierarchyChartData]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <FlowRateChart title="OFR" unit="bbd" data={ofrData} dataKey="line" isRefreshing={isRefreshing} />
      <FlowRateChart title="WFR" unit="bbd" data={wfrData} dataKey="line" isRefreshing={isRefreshing} />
      <FlowRateChart title="GFR" unit="bbd" data={gfrData} dataKey="line" isRefreshing={isRefreshing} />
    </div>
  );
};

export default FlowRateCharts;