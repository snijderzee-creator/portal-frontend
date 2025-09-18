import React, { useState, useEffect } from 'react';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { apiService, DashboardData } from '../../services/api';

const MetricsCards: React.FC = () => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) return;

      try {
        const response = await apiService.getDashboardData(token);
        if (response.success && response.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [token]);

  // Safe formatter that won't throw on undefined/null
  const formatValue = (v: unknown) => {
    if (v == null) return '0';
    if (typeof v === 'number') return new Intl.NumberFormat().format(v);
    return String(v);
  };

  const metricsData = React.useMemo(() => {
    // If stats missing — keep your placeholder metrics
    if (!dashboardData?.statistics) {
      return [
        { value: "72,150m³", label: "Total Production", color: theme === 'dark' ? 'text-white' : 'text-gray-900' },
        { value: "96%", label: "Uptime", color: theme === 'dark' ? 'text-white' : 'text-gray-900' },
        { value: "5", label: "Active Devices", color: theme === 'dark' ? 'text-white' : 'text-gray-900' },
        { value: "17", label: "Active Alarms", color: "text-red-500" },
      ];
    }

    const stats = dashboardData.statistics;

    return [
      {
        value: "72,150m³",
        label: "Total Production",
        color: theme === 'dark' ? 'text-white' : 'text-gray-900',
      },
      {
        // uptime might be number or string — format safely
        value: formatValue(stats.uptime),
        label: "Uptime",
        color: theme === 'dark' ? 'text-white' : 'text-gray-900',
      },
      {
        // safe conversion instead of using .toString() directly
        value: formatValue(stats.totalDevices),
        label: "Active Devices",
        color: theme === 'dark' ? 'text-white' : 'text-gray-900',
      },
      {
        value: formatValue(stats.activeAlarms),
        label: "Active Alarms",
        color: "text-red-500",
      },
    ];
  }, [dashboardData, theme]);

  return (
    <div className="grid grid-cols-5 gap-6 mb-6">
      {metricsData.map((metric, index) => (
        <div key={index} className={`rounded-lg border p-6 ${
          theme === 'dark' 
            ? 'bg-[#1E293B] border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={`text-2xl font-bold mb-2 ${metric.color}`}>
            {metric.value}
          </div>
          <div className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {metric.label}
          </div>
        </div>
      ))}

      {/* Timeframe Card */}
      <div className={`rounded-lg border p-6 flex items-center gap-4 ${
        theme === 'dark' 
          ? 'bg-[#1E293B] border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <CalendarIcon className={`h-8 w-8 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`} />
        <div>
          <div className={`text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Timeframe
          </div>
          <div className={`text-lg font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            October 2025
            <ChevronDownIcon className={`h-4 w-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
