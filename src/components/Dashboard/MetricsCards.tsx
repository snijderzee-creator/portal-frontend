import React from 'react';

const MetricsCards: React.FC = () => {
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
    <div className="grid grid-cols-3 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-[#2A2D47] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: metric.color }}
            >
              <span className="text-white text-sm">{metric.icon}</span>
            </div>
            <span className="text-gray-400 text-sm">{metric.title}</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-white text-3xl font-bold">{metric.value}</span>
            <span className="text-gray-400 text-lg">{metric.unit}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-sm">{metric.change}</span>
            <span className="text-gray-500 text-sm">{metric.period}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;