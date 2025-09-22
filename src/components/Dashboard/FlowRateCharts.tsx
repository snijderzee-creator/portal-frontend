import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ExternalLink, Info, MoreHorizontal } from 'lucide-react';
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

const FlowRateChart: React.FC<SingleFlowRateChartProps> = ({
  title,
  unit,
  data,
  dataKey,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-lg p-4 ${
        theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'
      }`}
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
        <p
          className={`text-base mb-2 ${
            theme === 'dark' ? 'text-[#A2AED4]' : 'text-gray-600'
          }`}
        >
          Comparison
        </p>
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
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-[#F56C44] dark:bg-[#6366F1] rounded"></div>
            <span
              className={`text-xs font-thin  ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Standard Condition
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
          <Line
            type="monotone"
            dataKey="standard"
            stroke={theme === 'dark' ? '#6366F1' : '#F56C44'}
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
    // Default data if no API data
    return [
      { time: '14:25:48', line: 10000, standard: 10000 },
      { time: '14:25:50', line: 8000, standard: 8000 },
      { time: '14:25:52', line: 6000, standard: 6000 },
      { time: '14:25:54', line: 4000, standard: 4000 },
    ];
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
    // Default data if no API data
    return [
      { time: '14:25:48', line: 8000, standard: 8000 },
      { time: '14:25:50', line: 6400, standard: 6400 },
      { time: '14:25:52', line: 4800, standard: 4800 },
      { time: '14:25:54', line: 3200, standard: 3200 },
    ];
  }, [ofrData]);

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
    // Default data if no API data
    return [
      { time: '14:25:48', line: 12000, standard: 12000 },
      { time: '14:25:50', line: 9600, standard: 9600 },
      { time: '14:25:52', line: 7200, standard: 7200 },
      { time: '14:25:54', line: 4800, standard: 4800 },
    ];
  }, [ofrData]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <FlowRateChart title="OFR" unit="bbd" data={ofrData} dataKey="line" />
      <FlowRateChart title="WFR" unit="bbd" data={wfrData} dataKey="line" />
      <FlowRateChart title="GFR" unit="bbd" data={gfrData} dataKey="line" />
    </div>
  );
};

export default FlowRateCharts;