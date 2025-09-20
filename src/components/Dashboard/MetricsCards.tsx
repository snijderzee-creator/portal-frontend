import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const MetricsCards: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const dateString = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.');
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      icon: '🛢️',
      title: 'Oil flow rate',
      value: '264.93',
      unit: 'bpd',
      change: '+35%',
      period: 'vs last month',
      color: '#6366F1'
    },
    {
      icon: '💧',
      title: 'Water flow rate',
      value: '264.93',
      unit: 'bpd',
      change: '+35%',
      period: 'vs last month',
      color: '#06B6D4'
    },
    {
      icon: '🔥',
      title: 'Gas flow rate',
      value: '264.93',
      unit: 'bpd',
      change: '+35%',
      period: 'vs last month',
      color: '#EC4899'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-[#2A2D47] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: metric.color }}
            >
              <span className="text-white text-xs">{metric.icon}</span>
            </div>
            <span className="text-gray-400 text-xs">{metric.title}</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-white text-xl font-bold">{metric.value}</span>
            <span className="text-gray-400 text-sm">{metric.unit}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-xs">{metric.change}</span>
            <span className="text-gray-500 text-xs">{metric.period}</span>
          </div>
        </div>
      ))}
      
      {/* Time/Date/User Info Card */}
      <div className="bg-[#2A2D47] rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 rounded-lg bg-[#6366F1] flex items-center justify-center">
            <span className="text-white text-xs">⏰</span>
          </div>
          <span className="text-gray-400 text-xs">System Info</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-white text-xl font-bold font-mono">{currentTime}</span>
          </div>
          <div className="text-gray-400 text-xs">{currentDate}</div>
          <div className="text-gray-500 text-xs">
            Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-GB') : 'Today'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;