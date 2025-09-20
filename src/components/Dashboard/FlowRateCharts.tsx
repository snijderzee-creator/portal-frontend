import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ExternalLink, MoreHorizontal } from 'lucide-react';

const data = [
  { time: '14:25:48', line: 10000, standard: 9500 },
  { time: '14:25:50', line: 8000, standard: 7500 },
  { time: '14:25:52', line: 6000, standard: 5500 },
  { time: '14:25:54', line: 4000, standard: 3500 },
];

interface FlowRateChartProps {
  title: string;
  unit: string;
}

const FlowRateChart: React.FC<FlowRateChartProps> = ({ title, unit }) => {
  return (
    <div className="bg-[#2A2D47] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-white text-lg font-medium">{title} ({unit})</h3>
          <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-gray-400 text-xs">i</span>
          </div>
        </div>
        <div className="flex items-center gap-2 border border-gray-600 px-2 py-1 rounded-lg">
          <ExternalLink size={16} className="text-gray-400 cursor-pointer hover:text-white" />
          <MoreHorizontal size={16} className="text-gray-400 cursor-pointer hover:text-white" />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">Comparison</p>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-[#FE44CC] rounded"></div>
            <span className="text-gray-400 text-sm">Line Condition</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-[#4D3DF7] rounded"></div>
            <span className="text-gray-400 text-sm">Standard Condition</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF" 
            fontSize={12}
            tickMargin={10}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickMargin={10}
            domain={[0, 12000]}
            ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000]}
            tickFormatter={(value) => {
              if (value === 0) return '00';
              return value.toString();
            }}
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
};

const FlowRateCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <FlowRateChart title="OFR" unit="bbd" />
      <FlowRateChart title="WFR" unit="bbd" />
      <FlowRateChart title="GFR" unit="bbd" />
    </div>
  );
};

export default FlowRateCharts;