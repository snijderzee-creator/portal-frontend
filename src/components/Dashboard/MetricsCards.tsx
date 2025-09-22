import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { apiService, HierarchyChartData, DeviceChartData } from '../../services/api';
import { AlarmClock } from 'lucide-react';

interface MetricsCardsProps {
  selectedHierarchy?: any;
  selectedDevice?: any;
  chartData?: DeviceChartData | null;
  hierarchyChartData?: HierarchyChartData | null;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ 
  selectedHierarchy, 
  selectedDevice, 
  chartData, 
  hierarchyChartData 
}) => {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [flowRateData, setFlowRateData] = useState({
    totalOFR: 0,
    totalWFR: 0,
    totalGFR: 0,
    avgGVF: 0,
    avgWLR: 0
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const dateString = now
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .replace(/\//g, '/');

      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate flow rate totals from chart data
    if (hierarchyChartData?.chartData && hierarchyChartData.chartData.length > 0) {
      const latestData = hierarchyChartData.chartData[hierarchyChartData.chartData.length - 1];
      setFlowRateData({
        totalOFR: latestData.totalOfr || 0,
        totalWFR: latestData.totalWfr || 0,
        totalGFR: latestData.totalGfr || 0,
        avgGVF: latestData.totalGvf || 0,
        avgWLR: latestData.totalWlr || 0
      });
    } else if (chartData?.chartData && chartData.chartData.length > 0) {
      const latestData = chartData.chartData[chartData.chartData.length - 1];
      setFlowRateData({
        totalOFR: latestData.ofr || 0,
        totalWFR: latestData.wfr || 0,
        totalGFR: latestData.gfr || 0,
        avgGVF: latestData.gvf || 0,
        avgWLR: latestData.wlr || 0
      });
    } else {
      // Default values when no data is available
      setFlowRateData({
        totalOFR: 264.93,
        totalWFR: 264.93,
        totalGFR: 264.93,
        avgGVF: 65,
        avgWLR: 85
      });
    }
  }, [chartData, hierarchyChartData]);
  const metrics = [
    {
      icon: '/oildark.png',
      title: 'Oil flow rate',
      value: flowRateData.totalOFR.toFixed(2),
      unit: 'bpd',
      change: '+35%',
      period: 'vs last month',
      color: theme === 'dark' ? '#4D3DF7' : '#F56C44',
    },
    {
      icon: '/waterdark.png',
      title: 'Water flow rate',
      value: flowRateData.totalWFR.toFixed(2),
      unit: 'bpd',
      change: '+35%',
      period: 'vs last month',
      color: theme === 'dark' ? '#46B8E9' : '#F6CA58',
    },
    {
      icon: '/gasdark.png',
      title: 'Gas flow rate',
      value: flowRateData.totalGFR.toFixed(2),
      unit: 'bpd',
      change: '+35%',
      period: 'vs last month',
      color: theme === 'dark' ? '#F35DCB' : '#38BF9D',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`rounded-lg p-4 ${
            theme === 'dark'
              ? 'bg-[#162345]'
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: metric.color }}
            >
              <img src={metric.icon} alt={metric.title} className="w-6 h-6" />
            </div>
            <span
              className={`font-medium text-base ${
                theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'
              }`}
            >
              {metric.title}
            </span>
          </div>
          <div className="flex items-baseline gap-4 mb-2">
            <span
              className={`lg:text-5xl md:text-4xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {metric.value}
            </span>
            <span
              className={`text-xl ${
                theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'
              }`}
            >
              {metric.unit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#4D3DF7] text-xs">{metric.change}</span>
            <span
              className={`text-xs ${
                theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'
              }`}
            >
              {metric.period}
            </span>
          </div>
        </div>
      ))}

      {/* Time/Date/User Info Card */}
      <div
        className={`rounded-lg p-4 ${
          theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#d82e75] flex items-center justify-center">
            <span className="text-white text-xs">
              <AlarmClock />
            </span>
          </div>
          <span
            className={`font-medium text-base ${
              theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'
            }`}
          >
            System Info
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex flex-row items-baseline gap-6">
            <div
              className={`font-semibold text-3xl ${
                theme === 'dark' ? 'text-[#fff]' : 'text-[#171718]'
              }`}
            >
              {currentDate}
            </div>
            <span
              className={`text-3xl font-bold  ${
                theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'
              }`}
            >
              {currentTime}
            </span>
          </div>

          <div
            className={`text-xs ${
              theme === 'dark' ? 'text-[#D0CCD8]' : 'text-[#555758]'
            }`}
          >
            Last login:{' '}
            {user?.lastLogin
              ? new Date(user.lastLogin).toLocaleDateString('en-GB')
              : 'Today'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;