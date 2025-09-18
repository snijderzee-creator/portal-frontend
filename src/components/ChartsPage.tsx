import OFRChart from './Charts/GfrChart';
import WFRChart from './Charts/WfrChart';
import GFRChart from './Charts/GfrChart';
import StatsCard from './Charts/StatsCard';
import CircularTimer from './Charts/Timer';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-6 p-6 bg-slate-950 min-h-screen">
      <OFRChart />
      <WFRChart />
      <GFRChart />
      <div className="flex flex-row gap-6">
        <div className="bg-[#1D2147] flex-1 p-4 rounded-2xl shadow-md flex flex-col justify-between">
          <h2 className="text-white mb-4 text-sm">Title</h2>
          <StatsCard
            label="WLR"
            value={85}
            style={{ backgroundColor: '#FE44CC' }}
          />
          <StatsCard
            label="GOR"
            value={70}
            style={{ backgroundColor: '#4D3DF7' }}
          />
          <StatsCard
            label="CVF"
            value={20}
            style={{ backgroundColor: '#10B981' }}
          />
        </div>
        <CircularTimer />
      </div>
    </div>
  );
}
