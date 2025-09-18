import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Info, ExternalLink, MoreHorizontal } from 'lucide-react';
import { DeviceChartData } from '../../services/api';
import { useTheme } from '../../hooks/useTheme';

interface OFRChartProps {
  chartData?: DeviceChartData | null;
}

export default function OFRChart({ chartData }: OFRChartProps) {
  const { theme } = useTheme();

  // Transform API data to chart format
  const data = chartData?.chartData?.map(point => ({
    time: new Date(point.timestamp).toLocaleTimeString(),
    line: point.ofr || 0,
    standard: (point.ofr || 0) * 0.98, // Simulate standard condition
  })) || [
    { time: '14:25:48', line: 12000, standard: 11800 },
    { time: '14:25:50', line: 9500, standard: 9400 },
    { time: '14:25:52', line: 9800, standard: 9700 },
    { time: '14:25:54', line: 7000, standard: 6900 },
  ];

  const latestValue = data.length > 0 ? data[data.length - 1].line : 0;

  return (
    <div className={`p-4 rounded-2xl shadow-md ${
      theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <h2 className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            OFR (bbd)
          </h2>
          <Info size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} />
        </div>
        <div className={`flex items-center gap-2 border px-2 py-1 rounded-lg ${
          theme === 'dark' 
            ? 'text-gray-300 border-[#A2AED4]' 
            : 'text-gray-600 border-gray-300'
        }`}>
          <ExternalLink size={20} className="cursor-pointer hover:text-white" />
          <MoreHorizontal
            size={20}
            className="cursor-pointer hover:text-white"
          />
        </div>
      </div>

      <div className="flex gap-6 py-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-[2px] bg-pink-500 rounded" />
          <span className={theme === 'dark' ? 'text-[#A2AED4]' : 'text-gray-600'}>
            Line Condition
          </span>
          <span className="text-emerald-300 text-xs">{latestValue.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-[2px] bg-indigo-500 rounded" />
          <span className={theme === 'dark' ? 'text-[#A2AED4]' : 'text-gray-600'}>
            Standard Condition
          </span>
          <span className="text-emerald-300 text-xs">{(latestValue * 0.98).toFixed(2)}</span>
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
            domain={['dataMin - 500', 'dataMax + 500']}
            tickMargin={15}
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
            dataKey="line"
            stroke="#FE44CC"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="standard"
            stroke="#4D3DF7"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
