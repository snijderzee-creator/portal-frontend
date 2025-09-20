import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { apiService, Device } from '../../services/api';

interface DeviceData extends Device {
  wellName?: string;
  lastCommTime?: string;
  waterCut?: number;
  gvf?: number;
  wfr?: number;
  ofr?: number;
  gfr?: number;
  status?: 'Online' | 'Offline';
}

const DevicesPage: React.FC = () => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<DeviceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  useEffect(() => {
    const loadDevices = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const response = await apiService.getAllDevices(token);
        if (response.success && response.data) {
          // Mock additional data for demonstration
          const enhancedDevices: DeviceData[] = response.data.devices.map((device, index) => ({
            ...device,
            wellName: `Pipe${String(index + 1).padStart(3, '0')}-01`,
            lastCommTime: '2025-09-01 08:15Z',
            waterCut: Math.floor(Math.random() * 30) + 10,
            gvf: Math.floor(Math.random() * 30) + 10,
            wfr: Math.floor(Math.random() * 5000) + 1000,
            ofr: Math.floor(Math.random() * 5000) + 1000,
            gfr: Math.floor(Math.random() * 20000) + 5000,
            status: Math.random() > 0.3 ? 'Online' : 'Offline'
          }));
          setDevices(enhancedDevices);
          setFilteredDevices(enhancedDevices);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError('Failed to load devices');
        console.error('Failed to load devices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDevices();
  }, [token]);

  useEffect(() => {
    const filtered = devices.filter(device =>
      device.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.wellName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDevices(filtered);
  }, [searchTerm, devices]);

  const onlineCount = filteredDevices.filter(d => d.status === 'Online').length;
  const offlineCount = filteredDevices.filter(d => d.status === 'Offline').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-white">Loading devices...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-900/20 text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#1E1F2E] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Device List</h1>
        
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center bg-[#2A2D47] rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#6366F1] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'card'
                  ? 'bg-[#6366F1] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Card View
            </button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#6366F1] rounded-full"></div>
              <span className="text-sm text-gray-300">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#EC4899] rounded-full"></div>
              <span className="text-sm text-gray-300">Offline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#2A2D47] border border-[#3A3D57] rounded-lg text-white placeholder-gray-400 focus:border-[#6366F1] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
        />
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="bg-[#2A2D47] rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-10 gap-4 px-6 py-4 bg-[#1E1F2E] border-b border-[#3A3D57]">
            <div className="text-sm font-medium text-gray-400">Device Name</div>
            <div className="text-sm font-medium text-gray-400">Well Name</div>
            <div className="text-sm font-medium text-gray-400">Serial</div>
            <div className="text-sm font-medium text-gray-400">Last Comm. Time</div>
            <div className="text-sm font-medium text-gray-400">Water Cut(%)</div>
            <div className="text-sm font-medium text-gray-400">GVF(%)</div>
            <div className="text-sm font-medium text-gray-400">WFR (bpd)</div>
            <div className="text-sm font-medium text-gray-400">OFR(bpd)</div>
            <div className="text-sm font-medium text-gray-400">GFR</div>
            <div className="text-sm font-medium text-gray-400">Status</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#3A3D57]">
            {filteredDevices.map((device, index) => (
              <div key={device.id} className="grid grid-cols-10 gap-4 px-6 py-4 hover:bg-[#3A3D57] transition-colors">
                <div className="text-sm text-white font-medium">{device.serial_number}</div>
                <div className="text-sm text-gray-300">{device.wellName}</div>
                <div className="text-sm text-gray-300">{device.serial_number}</div>
                <div className="text-sm text-gray-300">{device.lastCommTime}</div>
                <div className="text-sm text-gray-300">{device.waterCut}%</div>
                <div className="text-sm text-gray-300">{device.gvf}%</div>
                <div className="text-sm text-gray-300">{device.wfr}</div>
                <div className="text-sm text-gray-300">{device.ofr}</div>
                <div className="text-sm text-gray-300">{device.gfr}</div>
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      device.status === 'Online'
                        ? 'bg-[#6366F1] text-white'
                        : 'bg-[#EC4899] text-white'
                    }`}
                  >
                    {device.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDevices.map((device) => (
            <div
              key={device.id}
              className="bg-[#2A2D47] rounded-lg p-6 border border-[#3A3D57] hover:border-[#6366F1] transition-colors"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6366F1] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {device.serial_number.slice(-2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{device.serial_number}</h3>
                    <p className="text-gray-400 text-xs">{device.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {device.status === 'Online' ? (
                    <Wifi className="w-4 h-4 text-[#6366F1]" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-[#EC4899]" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      device.status === 'Online' ? 'text-[#6366F1]' : 'text-[#EC4899]'
                    }`}
                  >
                    {device.status}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs">Well Name:</span>
                  <span className="text-white text-xs font-medium">{device.wellName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs">Last Comm:</span>
                  <span className="text-white text-xs">{device.lastCommTime}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#3A3D57]">
                  <div>
                    <span className="text-gray-400 text-xs">Water Cut</span>
                    <p className="text-white font-semibold">{device.waterCut}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">GVF</span>
                    <p className="text-white font-semibold">{device.gvf}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div>
                    <span className="text-gray-400 text-xs">WFR</span>
                    <p className="text-white font-semibold text-xs">{device.wfr}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">OFR</span>
                    <p className="text-white font-semibold text-xs">{device.ofr}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">GFR</span>
                    <p className="text-white font-semibold text-xs">{device.gfr}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#3A3D57]">
                  <span className="text-gray-400 text-xs">Location:</span>
                  <span className="text-white text-xs">{device.location || 'Not assigned'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No devices found</div>
          <div className="text-gray-500 text-sm">
            {searchTerm ? 'Try adjusting your search terms' : 'No devices available'}
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesPage;