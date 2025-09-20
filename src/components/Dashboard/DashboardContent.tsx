import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { apiService, DeviceChartData, HierarchyChartData, Device } from '../../services/api';
import OFRChart from '../Charts/OfrChart';
import WFRChart from '../Charts/WfrChart';
import GFRChart from '../Charts/GfrChart';
import MetricsCards from './MetricsCards';
import MapAndChart from './MapAndChart';
import AlarmsTable from './AlarmsTable';

interface DashboardContentProps {
  children?: React.ReactNode;
  selectedDevice?: Device | null;
  selectedHierarchy?: any | null;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  children, 
  selectedDevice, 
  selectedHierarchy 
}) => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<DeviceChartData | null>(null);
  const [hierarchyChartData, setHierarchyChartData] = useState<HierarchyChartData | null>(null);
  const [timeRange, setTimeRange] = useState('day');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load chart data when a device or hierarchy is selected
    if (selectedDevice && !selectedHierarchy) {
      loadDeviceChartData(String(selectedDevice.id));
      setHierarchyChartData(null); // Clear hierarchy data
    } else if (selectedHierarchy && !selectedDevice) {
      loadHierarchyChartData(String(selectedHierarchy.id));
      setChartData(null); // Clear device data
    }
  }, [selectedDevice, selectedHierarchy, timeRange, token]);

  const loadDeviceChartData = async (deviceId: string) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.getDeviceChartData(deviceId, timeRange, token);
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
      }
    } catch (error) {
      console.error('Failed to load hierarchy chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-2">
      {children || (
        <>
          <MetricsCards />
          
          {/* Time Range Selector for Charts */}
          {(selectedDevice || selectedHierarchy) && (
            <div className="mb-6">
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
                {selectedHierarchy && (
                  <div className={`px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#162345] border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <span className="text-sm font-medium">Selected {selectedHierarchy.level}: </span>
                    <span className="text-sm">{selectedHierarchy.name}</span>
                    {hierarchyChartData && (
                      <span className="text-xs ml-2 px-2 py-1 rounded-full bg-blue-500 text-white">
                        {hierarchyChartData.totalDevices} devices
                      </span>
                    )}
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
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center py-8 mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className={`ml-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Loading chart data...
              </span>
            </div>
          )}

          <MapAndChart />
          
          {/* Flow Rate Charts - Always show at bottom */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <OFRChart chartData={chartData} hierarchyChartData={hierarchyChartData} />
            <WFRChart chartData={chartData} hierarchyChartData={hierarchyChartData} />
            <GFRChart chartData={chartData} hierarchyChartData={hierarchyChartData} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardContent;