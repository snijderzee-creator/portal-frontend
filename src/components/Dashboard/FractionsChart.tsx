import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ExternalLink, Info, MoreHorizontal } from 'lucide-react';
import { DeviceChartData, HierarchyChartData } from '../../services/api';
import { useTheme } from '../../hooks/useTheme';

interface FractionsChartProps {
  chartData?: DeviceChartData | null;
  hierarchyChartData?: HierarchyChartData | null;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

const FractionsChart: React.FC<FractionsChartProps> = ({
  chartData,
  hierarchyChartData,
}) => {
  const { theme } = useTheme();

  // Transform API data to chart format and round to 1 decimal place
  const data = useMemo(() => {
    if (chartData?.chartData) {
      return chartData.chartData.map((point) => ({
        time: new Date(point.timestamp).toLocaleTimeString(),
        gvf: point.gvf != null ? round1(point.gvf) : 0,
        wlr: point.wlr != null ? round1(point.wlr) : 0,
      }));
    } else if (hierarchyChartData?.chartData) {
      return hierarchyChartData.chartData.map((point) => ({
        time: new Date(point.timestamp).toLocaleTimeString(),
        gvf: point.totalGvf != null ? round1(point.totalGvf) : 0,
        wlr: point.totalWlr != null ? round1(point.totalWlr) : 0,
      }));
    }
    
    // Default data if no API data - matching the image pattern
    return [
      { time: '14:25:48', gvf: round1(12000), wlr: round1(12500) },
      { time: '14:25:50', gvf: round1(9000), wlr: round1(9500) },
      { time: '14:25:52', gvf: round1(7500), wlr: round1(8000) },
      { time: '14:25:54', gvf: round1(6000), wlr: round1(6500) },
    ];
  }, [chartData, hierarchyChartData]);

  const latestGvf = data.length > 0 ? data[data.length - 1].gvf : 0;
  const latestWlr = data.length > 0 ? data[data.length - 1].wlr : 0;
  const isHierarchyData = !!hierarchyChartData;

  return (
    <div
      className={`p-4 rounded-2xl shadow-md ${
        theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <h2
            className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Fractions
          </h2>
          <Info
            size={16}
            className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}
          />
        </div>
        <div
          className={`flex items-center gap-2 border px-2 py-1 rounded-lg ${
            theme === 'dark'
              ? 'text-gray-300 border-[#A2AED4]'
              : 'text-gray-600 border-gray-300'
          }`}
        >
          <ExternalLink
            size={20}
            className="cursor-pointer hover:text-white"
          />
          <MoreHorizontal
            size={20}
            className="cursor-pointer hover:text-white"
          />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <p
              className={`text-lg font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              No fractions data available
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <p
              className={`text-base mb-2 ${
                theme === 'dark' ? 'text-[#A2AED4]' : 'text-gray-600'
              }`}
            >
              Comparison
            </p>
            <div className="flex gap-6 py-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-[2px] bg-pink-500 rounded" />
                <span
                  className={
                    theme === 'dark' ? 'text-[#A2AED4]' : 'text-gray-600'
                  }
                >
                  GVF (%)
                </span>
                <span className="text-emerald-300 text-xs">
                  {latestGvf.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-[2px] bg-indigo-500 rounded" />
                <span
                  className={
                    theme === 'dark' ? 'text-[#A2AED4]' : 'text-gray-600'
                  }
                >
                  WLR (%)
                </span>
                <span className="text-emerald-300 text-xs">
                  {latestWlr.toFixed(1)}
                </span>
              </div>
                         </div>
          </div>

          <ResponsiveContainer
            width="100%"
            height={350}
            style={{ outline: 'none', border: 'none' }}
          >
            <LineChart
              data={data}
              margin={{ top: 30, right: 20, left: 10, bottom: 30 }}
            >
              <CartesianGrid
                stroke={theme === 'dark' ? '#2C3A65' : '#E5E7EB'}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="time"
                stroke={theme === 'dark' ? '#A2AED4' : '#6B7280'}
                tickMargin={15}
              />
              <YAxis
                stroke={theme === 'dark' ? '#A2AED4' : '#6B7280'}
                domain={[0, 100]}
                tickMargin={15}
                tickFormatter={(value) => {
                  if (value === 0) return '00';
                  if (value >= 1000) return `${value / 1000}k`;
                  return value.toString();
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1E1E2F' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  color: theme === 'dark' ? '#FFFFFF' : '#000000',
                }}
                cursor={false}
              />
              <Line
                type="monotone"
                dataKey="gvf"
                stroke="#FE44CC"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="wlr"
                stroke="#4D3DF7"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default FractionsChart;