import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { apiService, DeviceChartData, HierarchyChartData, Device } from '../../services/api';
import MetricsCards from './MetricsCards';
import TopRegionsChart from './TopRegionsChart';
import GVFWLRCharts from './GVFWLRCharts';
import ProductionMap from './ProductionMap';
import FlowRateCharts from './FlowRateCharts';

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
    <div
      className={`h-full p-4 overflow-y-auto ${
        theme === 'dark' ? 'bg-[#121429]' : 'bg-gray-50'
      }`}
    >
      {children || (
        <>
          {/* Metrics Cards */}
          <MetricsCards />

          {/* Main Content Grid */}
          <div className="flex gap-4 mb-4">
            {/* Top Regions Chart */}
            <div className="flex-1">
              <div
                className={`rounded-lg p-2 h-full ${
                  theme === 'dark'
                    ? 'bg-[#162345]'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <TopRegionsChart />
              </div>
            </div>

            {/* GVF/WLR Charts */}
            <div className="flex-1">
              <div
                className={`rounded-lg p-2 h-full ${
                  theme === 'dark'
                    ? 'bg-[#162345]'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <GVFWLRCharts />
              </div>
            </div>
          </div>

          {/* Production Map */}
          <div className="mb-4">
            <ProductionMap />
          </div>

          {/* Flow Rate Charts */}
          <FlowRateCharts
            chartData={chartData}
            hierarchyChartData={hierarchyChartData}
          />
        </>
      )}
    </div>
  );
};

export default DashboardContent;