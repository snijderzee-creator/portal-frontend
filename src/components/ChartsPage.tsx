import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { apiService, DeviceChartData, HierarchyChartData, Device } from '../services/api';
import OFRChart from './Charts/OfrChart';
import WFRChart from './Charts/WfrChart';
import GFRChart from './Charts/GfrChart';
import StatsCard from './Charts/StatsCard';
import CircularTimer from './Charts/Timer';

interface ChartsPageProps {
  selectedDevice?: Device | null;
}

export default function ChartsPage({ selectedDevice }: ChartsPageProps) {
  const { token } = useAuth();
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<DeviceChartData | null>(null);
  const [hierarchyChartData, setHierarchyChartData] = useState<HierarchyChartData | null>(null);
  const [selectedHierarchyId, setSelectedHierarchyId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('day');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load chart data when a device is selected
    if (selectedDevice) {
      loadDeviceChartData(selectedDevice.id);
    }
  }, [selectedDevice, timeRange, token]);

  const loadDeviceChartData = async (deviceId: string | number) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.getDeviceChartData(String(deviceId), timeRange, token);
      if (response.success && response.data) {
        setChartData(response.data);
      }
    } catch (error) {
      console.error('Failed to load device chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHierarchyChartData = async (hierarchyId: string) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.getHierarchyChartData(hierarchyId, timeRange, token);
      if (response.success && response.data) {
        setHierarchyChartData(response.data);
        setSelectedHierarchyId(hierarchyId);
      }
    } catch (error) {
      console.error('Failed to load hierarchy chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`grid grid-cols-2 gap-6 p-6 min-h-screen ${
      theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'
    }`}>
      {/* Time Range Selector */}
      <div className="col-span-2 mb-4">
        <div className="flex items-center gap-4">
          {selectedDevice && (
            <div className={`px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-[#162345] border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <span className="text-sm font-medium">Selected Device: </span>
              <span className="text-sm">{selectedDevice.serial_number}</span>
            </div>
          )}
          <label className={`text-sm font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Time Range:
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-[#162345] border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="hour">Last Hour</option>
            <option value="day">Last Day</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>

      {!selectedDevice && (
        <div className="col-span-2 text-center py-8">
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Please select a device from the sidebar to view charts
          </p>
        </div>
      )}

      <OFRChart chartData={chartData} />
      <WFRChart chartData={chartData} />
      <GFRChart chartData={chartData} />
      <div className="flex flex-row gap-6">
        <div className={`flex-1 p-4 rounded-2xl shadow-md flex flex-col justify-between ${
          theme === 'dark' ? 'bg-[#1D2147]' : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`mb-4 text-sm font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Flow Ratios
          </h2>
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
            label="GVF"
            value={20}
            style={{ backgroundColor: '#10B981' }}
          />
        </div>
        <CircularTimer />
      </div>

      {isLoading && (
        <div className="col-span-2 flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className={`ml-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Loading chart data...
          </span>
        </div>
      )}
    </div>
  );
}
