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

const data = [
  { time: '14:25:48', line: 12000, standard: 11800 },
  { time: '14:25:50', line: 9500, standard: 9400 },
  { time: '14:25:52', line: 9800, standard: 9700 },
  { time: '14:25:54', line: 7000, standard: 6900 },
];

export default function OFRChart() {
  return (
    <div className="bg-[#162345] p-4 rounded-2xl shadow-md">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-white text-sm font-semibold">GFR (bbd)</h2>
          <Info size={16} className="text-gray-300" />
        </div>
        <div className="flex items-center gap-2 text-gray-300 border border-[#A2AED4] px-2 py-1 rounded-lg">
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
          <span className="text-[#A2AED4]">Line Condition</span>
          <span className="text-emerald-300 text-xs">1261.81</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-[2px] bg-indigo-500 rounded" />
          <span className="text-[#A2AED4]">Standard Condition</span>
          <span className="text-emerald-300 text-xs">1261.81</span>
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
          <CartesianGrid stroke="#2C3A65" strokeDasharray="3 3" />
          <XAxis dataKey="time" stroke="#A2AED4" tickMargin={15} />
          <YAxis
            stroke="#A2AED4"
            domain={['dataMin - 500', 'dataMax + 500']}
            tickMargin={15}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E1E2F',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
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
