import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { apiService, DeviceChartData, HierarchyChartData, Device } from '../../services/api';
import MetricsCards from './MetricsCards';
import GVFWLRCharts from './GVFWLRCharts';
import ProductionMap from './ProductionMap';
import FlowRateCharts from './FlowRateCharts';
import FractionsChart from './FractionsChart';

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
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const startAutoRefresh = () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      refreshIntervalRef.current = setInterval(() => {
        setLastRefresh(new Date());
        
        // Refresh chart data without changing selections
        if (selectedDevice && !selectedHierarchy) {
          loadDeviceChartData(selectedDevice.deviceId || selectedDevice.id);
        } else if (selectedHierarchy && !selectedDevice) {
          loadHierarchyChartData(selectedHierarchy.id);
        } else {
          // No selection: optionally refresh global/hydrated data if you have an endpoint
          // For now we just keep FractionsChart able to render using whatever data is available
        }
      }, 5000);
    };

    startAutoRefresh();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [selectedDevice, selectedHierarchy, token]);

  const loadDeviceChartData = async (deviceId: number | string) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const deviceIdNumber = typeof deviceId === 'string' ? parseInt(deviceId) : deviceId;
      const response = await apiService.getDeviceChartDataEnhanced(deviceIdNumber, timeRange, token);
      if (response.success && response.data) {
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

  // --- CHANGE: Always show FractionsChart (render it regardless of selection) ---
  // Previously this was conditional; now FractionsChart is rendered permanently.

  return (
    <div className={`h-full overflow-y-auto ${
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
            lastRefresh={lastRefresh}
          />

          {/* Main Content Grid */}
          <div className="flex gap-4 mb-4">
            {/* FractionsChart is now always visible */}
            <div className="flex-1">
              <div
                className={`rounded-lg p-2 h-full ${
                  theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'
                }`}
              >
                <FractionsChart 
                  chartData={chartData}
                  hierarchyChartData={hierarchyChartData}
                />
              </div>
            </div>

            {/* GVF/WLR Charts */}
            <div className="flex-1">
              <div
                className={`rounded-lg p-2 h-full ${
                  theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'
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
            <ProductionMap 
              selectedHierarchy={selectedHierarchy}
              selectedDevice={selectedDevice}
            />
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
