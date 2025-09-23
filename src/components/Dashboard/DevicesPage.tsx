import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Wifi, WifiOff, Filter, RefreshCw, Download, MapPin, Settings, Eye } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);
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
          setError(null);
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
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDeviceTypeFilter = (deviceType: string) => {
    setDeviceTypeFilter(deviceType);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDeviceTypeFilter('all');
    setCurrentPage(1);
  };

  const handleExport = () => {
    console.log('Export devices data');
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 rounded-lg ${
        theme === 'dark' ? 'bg-[#2A2D47]' : 'bg-white border border-gray-200'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Loading devices...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg ${
        theme === 'dark' ? 'bg-red-900/20 text-red-400 border border-red-800' : 'bg-red-50 text-red-600 border border-red-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <WifiOff className="w-5 h-5" />
          <span className="font-medium">Error Loading Devices</span>
        </div>
        <p className="text-sm">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Try Again
        </button>
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
      theme === 'dark' ? 'bg-[#121429]' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name 
              ? `Devices in ${selectedHierarchy.name}` 
              : 'All Devices'
            }
          </h1>
          <p className={`text-sm mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Total: {statistics.totalDevices} devices
            {(selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name) && (
              <span className="ml-2">• {selectedHierarchy.level}: {selectedHierarchy.name}</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className={`flex items-center rounded-lg p-1 ${
            theme === 'dark' ? 'bg-[#162345]' : 'bg-gray-200'
          }`}>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'list'
                  ? 'bg-[#6366F1] text-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'card'
                  ? 'bg-[#6366F1] text-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-4 h-4" />
              Cards
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-[#3A3D57] hover:bg-[#4A4D67] text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-[#3A3D57] hover:bg-[#4A4D67] text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            title="Export"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#6366F1] rounded-full"></div>
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Online</span>
          </div>
          <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {statistics.onlineDevices}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#EC4899] rounded-full"></div>
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Offline</span>
          </div>
          <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {statistics.offlineDevices}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Device Types</span>
          </div>
          <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {statistics.deviceTypes}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total</span>
          </div>
          <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {statistics.totalDevices}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search devices by name, serial, or well..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] ${
              theme === 'dark'
                ? 'bg-[#2A2D47] border-[#3A3D57] text-white placeholder-gray-400 focus:border-[#6366F1]'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#6366F1]'
            }`}
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors ${
            theme === 'dark'
              ? 'border-[#3A3D57] text-gray-300 hover:bg-[#2A2D47]'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          } ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className={`p-4 rounded-lg mb-6 border ${
          theme === 'dark' ? 'bg-[#2A2D47] border-[#3A3D57]' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] ${
                  theme === 'dark'
                    ? 'bg-[#3A3D57] border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Device Type
              </label>
              <select
                value={deviceTypeFilter}
                onChange={(e) => handleDeviceTypeFilter(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] ${
                  theme === 'dark'
                    ? 'bg-[#3A3D57] border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Types</option>
                {filters.availableDeviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'list' ? (
        <div className={`rounded-xl overflow-hidden shadow-lg ${
          theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'
        }`}>
          {/* Table Header */}
          <div className={`grid grid-cols-11 gap-4 px-6 py-4 border-b ${
            theme === 'dark' 
              ? 'bg-[#1a2847] border-[#4A4D67]' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Device Name</div>
            <div className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Well Name</div>
            <div className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Serial</div>
            <div className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Last Comm. Time</div>
            <div className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Water Cut (%)</div>
            <div className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>GVF(%)</div>
            <div className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>WFR (bpd)</div>
            <div className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>OFR(bpd)</div>
            <div className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>GFR</div>
            <div className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Status</div>
           
          </div>

          {/* Table Body */}
          <div className={`divide-y ${
            theme === 'dark' ? 'divide-[#1a2847]' : 'divide-gray-200'
          }`}>
            {devices.map((device) => (
              <div key={device.deviceId} className={`grid grid-cols-11 gap-4 px-6 py-4 transition-colors ${
                theme === 'dark' ? 'hover:bg-[#1a2847]' : 'hover:bg-gray-50'
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
                }`}>{device.flowData.wlr.toFixed(1)}%</div>
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
                    {device.status === 'Online' ? (
                      <Wifi className="w-3 h-3 mr-1" />
                    ) : (
                      <WifiOff className="w-3 h-3 mr-1" />
                    )}
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
              className={`rounded-xl p-6 border transition-all duration-200 hover:shadow-lg ${
                theme === 'dark'
                  ? 'bg-[#162345] border-[#1a2847] hover:border-[#6366F1]'
                  : 'bg-white border-gray-200 hover:border-[#6366F1] hover:shadow-xl'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg">
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
                <div className="flex justify-between items-center">
                  <span className={`text-xs flex items-center gap-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <MapPin className="w-3 h-3" />
                    Well Name:
                  </span>
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

                <div className={`grid grid-cols-2 gap-3 pt-3 border-t ${
                  theme === 'dark' ? 'border-[#1a2847]' : 'border-gray-200'
                }`}>
                  <div className="text-center">
                    <span className={`text-xs block ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>GVF</span>
                    <p className={`font-bold text-lg ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{device.flowData.gvf.toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <span className={`text-xs block ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Water Cut</span>
                    <p className={`font-bold text-lg ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{device.flowData.wlr.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="text-center">
                    <span className={`text-xs block ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>WFR</span>
                    <p className={`font-semibold text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{device.flowData.wfr.toFixed(0)}</p>
                  </div>
                  <div className="text-center">
                    <span className={`text-xs block ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>OFR</span>
                    <p className={`font-semibold text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{device.flowData.ofr.toFixed(0)}</p>
                  </div>
                  <div className="text-center">
                    <span className={`text-xs block ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>GFR</span>
                    <p className={`font-semibold text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{device.flowData.gfr.toFixed(0)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={`flex justify-between items-center pt-3 border-t ${
                  theme === 'dark' ? 'border-[#1a2847]' : 'border-gray-200'
                }`}>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Company: {device.companyName}</span>
                  <div className="flex gap-2">
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' 
                          ? 'hover:bg-[#1a2847] text-gray-400 hover:text-white' 
                          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' 
                          ? 'hover:bg-[#1a2847] text-gray-400 hover:text-white' 
                          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} devices
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${
                theme === 'dark'
                  ? 'bg-[#162345] border-[#1a2847] text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              Previous
            </button>
            <span className={`px-4 py-2 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
              disabled={currentPage === pagination.pages}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                currentPage === pagination.pages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${
                theme === 'dark'
                  ? 'bg-[#162345] border-[#1a2847] text-white'
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