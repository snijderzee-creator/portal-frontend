import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { apiService, EnhancedDevice, DevicesResponse, HierarchyNode, Device } from '../../services/api';

interface DevicesPageProps {
  selectedHierarchy?: HierarchyNode | null;
  selectedDevice?: Device | null;
}

const DevicesPage: React.FC<DevicesPageProps> = ({ selectedHierarchy, selectedDevice }) => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const [devicesData, setDevicesData] = useState<DevicesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const itemsPerPage = 20;

  useEffect(() => {
    const loadDevices = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        let response;
        
        if (selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name) {
          // Load devices for specific hierarchy
          response = await apiService.getDevicesByHierarchy(parseInt(selectedHierarchy.id), token, {
            search: searchTerm || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            deviceType: deviceTypeFilter !== 'all' ? deviceTypeFilter : undefined,
          });
        } else {
          // Load all devices for company
          response = await apiService.getAllDevicesEnhanced(token, {
            search: searchTerm || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            deviceType: deviceTypeFilter !== 'all' ? deviceTypeFilter : undefined,
            page: currentPage,
            limit: itemsPerPage,
          });
        }
        
        if (response.success && response.data) {
          setDevicesData(response.data);
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
  }, [token, searchTerm, statusFilter, deviceTypeFilter, currentPage, selectedHierarchy]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDeviceTypeFilter = (deviceType: string) => {
    setDeviceTypeFilter(deviceType);
    setCurrentPage(1);
  };

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

  if (!devicesData) {
    return (
      <div className="p-4 rounded-lg bg-gray-900/20 text-gray-400">
        No device data available
      </div>
    );
  }

  const { devices, statistics, pagination, filters } = devicesData;

  return (
    <div className={`p-6 h-full overflow-y-auto ${
      theme === 'dark' ? 'bg-[#1E1F2E]' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name 
              ? `Devices in ${selectedHierarchy.name}` 
              : 'All Devices'
            }
          </h1>
          {selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name && (
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {selectedHierarchy.level}: {selectedHierarchy.name}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className={`flex items-center rounded-lg p-1 ${
            theme === 'dark' ? 'bg-[#2A2D47]' : 'bg-gray-200'
          }`}>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#6366F1] text-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'card'
                  ? 'bg-[#6366F1] text-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Card View
            </button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#6366F1] rounded-full"></div>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>Online</span>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {statistics.onlineDevices}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#EC4899] rounded-full"></div>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>Offline</span>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {statistics.offlineDevices}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366F1] ${
              theme === 'dark'
                ? 'bg-[#2A2D47] border-[#3A3D57] text-white placeholder-gray-400 focus:border-[#6366F1]'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#6366F1]'
            }`}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366F1] ${
            theme === 'dark'
              ? 'bg-[#2A2D47] border-[#3A3D57] text-white focus:border-[#6366F1]'
              : 'bg-white border-gray-300 text-gray-900 focus:border-[#6366F1]'
          }`}
        >
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>

        {/* Device Type Filter */}
        <select
          value={deviceTypeFilter}
          onChange={(e) => handleDeviceTypeFilter(e.target.value)}
          className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366F1] ${
            theme === 'dark'
              ? 'bg-[#2A2D47] border-[#3A3D57] text-white focus:border-[#6366F1]'
              : 'bg-white border-gray-300 text-gray-900 focus:border-[#6366F1]'
          }`}
        >
          <option value="all">All Types</option>
          {filters.availableDeviceTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className={`rounded-lg overflow-hidden ${
          theme === 'dark' ? 'bg-[#2A2D47]' : 'bg-white border border-gray-200'
        }`}>
          {/* Table Header */}
          <div className={`grid grid-cols-10 gap-4 px-6 py-4 border-b ${
            theme === 'dark' 
              ? 'bg-[#1E1F2E] border-[#3A3D57]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Device Name</div>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Well Name</div>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Serial</div>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Last Comm. Time</div>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>GVF(%)</div>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>WFR (bpd)</div>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>OFR(bpd)</div>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>GFR</div>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Status</div>
          </div>

          {/* Table Body */}
          <div className={`divide-y ${
            theme === 'dark' ? 'divide-[#3A3D57]' : 'divide-gray-200'
          }`}>
            {devices.map((device) => (
              <div key={device.deviceId} className={`grid grid-cols-10 gap-4 px-6 py-4 transition-colors ${
                theme === 'dark' ? 'hover:bg-[#3A3D57]' : 'hover:bg-gray-50'
              }`}>
                <div className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{device.deviceName}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>{device.wellName}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>{device.deviceSerial}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>{device.lastCommTime ? new Date(device.lastCommTime).toLocaleString() : 'N/A'}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>{device.flowData.gvf.toFixed(1)}%</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>{device.flowData.wfr.toFixed(0)}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>{device.flowData.ofr.toFixed(0)}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>{device.flowData.gfr.toFixed(0)}</div>
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
          {devices.map((device) => (
            <div
              key={device.deviceId}
              className={`rounded-lg p-6 border transition-colors hover:border-[#6366F1] ${
                theme === 'dark' ? 'bg-[#2A2D47] border-[#3A3D57]' : 'bg-white border-gray-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6366F1] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {device.deviceSerial.slice(-2)}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{device.deviceSerial}</h3>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{device.deviceName}</p>
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
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Well Name:</span>
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{device.wellName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Last Comm:</span>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{device.lastCommTime ? new Date(device.lastCommTime).toLocaleString() : 'N/A'}</span>
                </div>

                <div className={`grid grid-cols-2 gap-3 pt-2 border-t ${
                  theme === 'dark' ? 'border-[#3A3D57]' : 'border-gray-200'
                }`}>
                  <div>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>GVF</span>
                    <p className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{device.flowData.gvf.toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>WLR</span>
                    <p className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{device.flowData.wlr.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>WFR</span>
                    <p className={`font-semibold text-xs ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{device.flowData.wfr.toFixed(0)}</p>
                  </div>
                  <div>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>OFR</span>
                    <p className={`font-semibold text-xs ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{device.flowData.ofr.toFixed(0)}</p>
                  </div>
                  <div>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>GFR</span>
                    <p className={`font-semibold text-xs ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{device.flowData.gfr.toFixed(0)}</p>
                  </div>
                </div>

                <div className={`flex justify-between items-center pt-2 border-t ${
                  theme === 'dark' ? 'border-[#3A3D57]' : 'border-gray-200'
                }`}>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Location:</span>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{device.wellName || 'Not assigned'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} devices
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${
                theme === 'dark'
                  ? 'bg-[#2A2D47] border-[#3A3D57] text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              Previous
            </button>
            <span className={`px-3 py-2 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
              disabled={currentPage === pagination.pages}
              className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                currentPage === pagination.pages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${
                theme === 'dark'
                  ? 'bg-[#2A2D47] border-[#3A3D57] text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {devices.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className={`text-lg mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>No devices found</div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {searchTerm ? 'Try adjusting your search terms' : 'No devices available'}
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesPage;