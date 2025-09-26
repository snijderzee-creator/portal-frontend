import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { HierarchyChartData, DeviceChartData } from '../../services/api';
import { AlarmClock, RefreshCw } from 'lucide-react';

interface MetricsCardsProps {
  selectedHierarchy?: any;
  selectedDevice?: any;
  chartData?: DeviceChartData | null;
  hierarchyChartData?: HierarchyChartData | null;
  lastRefresh?: Date | null;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({
  selectedHierarchy,
  selectedDevice,
  chartData,
  hierarchyChartData,
  lastRefresh = null,
}) => {
  const { user, token } = useAuth();
  const { theme } = useTheme();

  const [currentTime, setCurrentTime] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [flowRateData, setFlowRateData] = useState({
    totalOFR: 0,
    totalWFR: 0,
    totalGFR: 0,
    avgGVF: 0,
    avgWLR: 0,
  });

  // Live clock for fallback when lastRefresh not provided
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh indicator (visual only)
  useEffect(() => {
    const startAutoRefresh = () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }

      refreshIntervalRef.current = setInterval(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
      }, 5000);
    };

    startAutoRefresh();
    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, []);

  // Compute flow aggregates from chart payloads
  useEffect(() => {
    if (hierarchyChartData?.chartData && hierarchyChartData.chartData.length > 0) {
      const latest = hierarchyChartData.chartData[hierarchyChartData.chartData.length - 1];
      setFlowRateData({
        totalOFR: latest.totalOfr || 0,
        totalWFR: latest.totalWfr || 0,
        totalGFR: latest.totalGfr || 0,
        avgGVF: latest.totalGvf || 0,
        avgWLR: latest.totalWlr || 0,
      });
    } else if (chartData?.chartData && chartData.chartData.length > 0) {
      const latest = chartData.chartData[chartData.chartData.length - 1];
      setFlowRateData({
        totalOFR: latest.ofr || 0,
        totalWFR: latest.wfr || 0,
        totalGFR: latest.gfr || 0,
        avgGVF: latest.gvf || 0,
        avgWLR: latest.wlr || 0,
      });
    } else {
      // sensible defaults for empty state (you can remove/change these)
      setFlowRateData({
        totalOFR: 264.93,
        totalWFR: 264.93,
        totalGFR: 264.93,
        avgGVF: 65,
        avgWLR: 85,
      });
    }
  }, [chartData, hierarchyChartData]);

  const metrics = [
    {
      icon: '/oildark.png',
      title: 'Oil flow rate',
      value: flowRateData.totalOFR.toFixed(2),
      unit: 'bpd',
      color: theme === 'dark' ? '#4D3DF7' : '#F56C44',
    },
    {
      icon: '/waterdark.png',
      title: 'Water flow rate',
      value: flowRateData.totalWFR.toFixed(2),
      unit: 'bpd',
      color: theme === 'dark' ? '#46B8E9' : '#F6CA58',
    },
    {
      icon: '/gasdark.png',
      title: 'Gas flow rate',
      value: flowRateData.totalGFR.toFixed(2),
      unit: 'bpd',
      color: theme === 'dark' ? '#F35DCB' : '#38BF9D',
    },
  ];

  // Format last refresh time to HH:MM:SS (24h). Fallback to live clock
  const formattedLastRefresh = lastRefresh
    ? new Date(lastRefresh).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    : currentTime;

  const lastRefreshLabel = lastRefresh ? 'From server' : 'Live';

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className={`rounded-lg p-4 transition-all duration-300 ${
            theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'
          } ${isRefreshing ? 'ring-2 ring-blue-400 ring-opacity-50 shadow-lg' : ''}`}
        >
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: metric.color }}
            >
              <img src={metric.icon} alt={metric.title} className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div
                className={`text-sm font-medium truncate ${
                  theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'
                }`}
              >
                {metric.title}
              </div>
            </div>

            {/* small spinner if refreshing */}
          </div>

          {/* --- Restored visual: big number + adjacent "bpd" exactly like your previous design --- */}
          <div className="flex items-baseline gap-4 mb-2">
            <span
              className={`lg:text-5xl md:text-4xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {metric.value}
            </span>
            <span
              className={`text-xl ${theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'}`}
            >
              {metric.unit}
            </span>
          </div>
        </div>
      ))}

      {/* Last Refresh card — styled to match other metrics */}
      <div
        className={`rounded-lg p-4 transition-all duration-300 flex flex-col justify-between ${
          theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'
        } ${isRefreshing ? 'ring-2 ring-blue-400 ring-opacity-50 shadow-lg' : ''}`}
      >
        <div className="flex items-center gap-4 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#d82e75' }}
          >
            <AlarmClock className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div
              className={`text-sm font-medium truncate ${
                theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'
              }`}
            >
              Last Refresh
            </div>
            <div
              className={`text-xs mt-0.5 ${
                theme === 'dark' ? 'text-[#A2AED4]' : 'text-gray-500'
              }`}
            >
              {lastRefreshLabel}
            </div>
          </div>

          {/* spinner aligned with other cards */}
          {isRefreshing && (
            <RefreshCw
              className={`w-4 h-4 animate-spin ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`}
            />
          )}
        </div>

        <div className="mt-2">
          <div
            className={`text-3xl md:text-4xl font-semibold leading-none ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {formattedLastRefresh}
          </div>
          <div
            className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'
            }`}
          >
            {lastRefresh ? new Date(lastRefresh).toLocaleDateString('en-GB') : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
