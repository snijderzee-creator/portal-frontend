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

  const metricsData = [
    {
      icon: '🛢️',
      title: 'Oil flow rate',
      value: '264.93',
      unit: 'bpd',
      change: '+35%',
      changeText: 'vs last month',
      changeColor: 'text-green-400'
    },
    {
      icon: '💧',
      title: 'Water flow rate',
      value: '264.93',
      unit: 'bpd',
      change: '+35%',
      changeText: 'vs last month',
      changeColor: 'text-green-400'
    },
    {
      icon: '🔥',
      title: 'Gas flow rate',
      value: '264.93',
      unit: 'bpd',
      change: '+35%',
      changeText: 'vs last month',
      changeColor: 'text-green-400'
    }
  ];

  // Current time display
  const currentTime = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/[/]/g, '.').replace(',', ':');

  return (
    <div className="flex justify-between items-start mb-8">
      {/* Metrics Cards */}
      <div className="flex gap-6">
        {metricsData.map((metric, index) => (
          <div
            key={index}
            className="bg-[#2A2D47] rounded-xl p-6 min-w-[280px]"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{metric.icon}</span>
              <span className="text-gray-400 text-sm">{metric.title}</span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-white text-3xl font-bold">{metric.value}</span>
              <span className="text-gray-400 text-lg">{metric.unit}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-sm ${metric.changeColor}`}>{metric.change}</span>
              <span className="text-gray-500 text-sm">{metric.changeText}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Time Display */}
      <div className="text-right">
        <div className="text-white text-4xl font-mono font-bold">
          {currentTime}
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;