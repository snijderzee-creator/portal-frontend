import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import InteractiveMap from './InteractiveMap';
import TopRegionsChart from './TopRegionsChart';

const MapAndChart: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* Interactive Map Card */}
      <div className={`rounded-lg border ${
        theme === 'dark' 
          ? 'bg-[#1E293B] border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <InteractiveMap />
        </div>
      </div>

      {/* Top Regions Chart Card */}
      <div className={`rounded-lg border ${
        theme === 'dark' 
          ? 'bg-[#1E293B] border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <TopRegionsChart />
        </div>
      </div>
    </div>
  );
};

export default MapAndChart;