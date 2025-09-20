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
    <div className="flex-1 p-6 bg-[#2B2D42] min-h-screen">
      {children || (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-[#3C3F58] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🛢️</span>
                </div>
                <span className="text-gray-400 text-sm">Oil flow rate</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-white text-3xl font-bold">264.93</span>
                <span className="text-gray-400 text-lg">bpd</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm">+35%</span>
                <span className="text-gray-500 text-sm">vs last month</span>
              </div>
            </div>

            <div className="bg-[#3C3F58] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">💧</span>
                </div>
                <span className="text-gray-400 text-sm">Water flow rate</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-white text-3xl font-bold">264.93</span>
                <span className="text-gray-400 text-lg">bpd</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm">+35%</span>
                <span className="text-gray-500 text-sm">vs last month</span>
              </div>
            </div>

            <div className="bg-[#3C3F58] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🔥</span>
                </div>
                <span className="text-gray-400 text-sm">Gas flow rate</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-white text-3xl font-bold">264.93</span>
                <span className="text-gray-400 text-lg">bpd</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm">+35%</span>
                <span className="text-gray-500 text-sm">vs last month</span>
              </div>
            </div>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Top Regions Chart */}
            <div className="col-span-7">
              <TopRegionsChart />
            </div>
            
            {/* GVF/WLR Charts */}
            <div className="col-span-5">
              <GVFWLRCharts />
            </div>
          </div>

          {/* Production Map */}
          <div className="mb-6">
            <ProductionMap />
          </div>
          
          {/* Flow Rate Charts */}
          <FlowRateCharts chartData={chartData} hierarchyChartData={hierarchyChartData} />
        </>
      )}
    </div>
  );
};

export default DashboardContent;