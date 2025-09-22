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
      loadDeviceChartData(selectedDevice.deviceId || selectedDevice.id);
      setHierarchyChartData(null); // Clear hierarchy data
    } else if (selectedHierarchy && !selectedDevice) {
      loadHierarchyChartData(selectedHierarchy.id);
      setChartData(null); // Clear device data
    }
  }, [selectedDevice, selectedHierarchy, timeRange, token]);

  const loadDeviceChartData = async (deviceId: number | string) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      // Use the correct property name based on the Device interface
      const deviceIdNumber = typeof deviceId === 'string' ? parseInt(deviceId) : deviceId;
      const response = await apiService.getDeviceChartDataEnhanced(deviceIdNumber, timeRange, token);
      if (response.success && response.data) {
        // Transform the enhanced API response to match the existing interface
        const transformedData: DeviceChartData = {
          device: {
            id: response.data.device.deviceId?.toString() || deviceId.toString(),
            serial_number: response.data.device.deviceSerial,
            type: response.data.device.deviceName,
            logo: response.data.device.deviceLogo,
            metadata: response.data.device.metadata,
            created_at: response.data.device.createdAt || new Date().toISOString(),
            location: response.data.device.wellName,
            company: response.data.device.companyName || 'Unknown'
          },
          chartData: response.data.chartData.map(point => ({
            timestamp: point.timestamp,
            gfr: point.gfr,
            gor: point.gor,
            gvf: point.gvf,
            ofr: point.ofr,
            wfr: point.wfr,
            wlr: point.wlr,
            pressure: point.pressure,
            temperature: point.temperature
          })),
          latestData: response.data.latestData,
          timeRange: response.data.timeRange,
          totalDataPoints: response.data.totalDataPoints
        };
        setChartData(transformedData);
      }
    } catch (error) {
      console.error('Failed to load device chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHierarchyChartData = async (hierarchyId: number | string) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.getHierarchyChartDataEnhanced(Number(hierarchyId), timeRange, token);
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
          <MetricsCards 
            selectedHierarchy={selectedHierarchy}
            selectedDevice={selectedDevice}
            chartData={chartData}
            hierarchyChartData={hierarchyChartData}
          />

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
                <GVFWLRCharts 
                  chartData={chartData}
                  hierarchyChartData={hierarchyChartData}
                />
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