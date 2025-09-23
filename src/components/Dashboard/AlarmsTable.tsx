// src/components/Dashboard/AlarmsTable.tsx
import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, XCircle, Filter, Search, RefreshCw, Download, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { apiService, AlarmsResponse, HierarchyNode, Device } from '../../services/api';

interface AlarmsTableProps {
  selectedHierarchy?: HierarchyNode | null;
  selectedDevice?: Device | null;
}

const AlarmsTable: React.FC<AlarmsTableProps> = ({ selectedHierarchy, selectedDevice }) => {
  const { token } = useAuth();
  const { theme } = useTheme();

  const [alarmsData, setAlarmsData] = useState<AlarmsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    severity: 'all',
    status_id: 'all',
    sort_by: 'created_at',
    sort_order: 'DESC',
  });

  // Helper functions
  const normalizeString = (v?: any) => {
    try {
      if (v === null || v === undefined) return '';
      const s = typeof v === 'string' ? v : String(v);
      return s.trim().toLowerCase();
    } catch {
      return '';
    }
  };

  const getSeverityColor = (severity?: string | null) => {
    const s = normalizeString(severity);
    if (!s) return '#6B7280';
    switch (s) {
      case 'critical': return theme === 'dark' ? '#DC2626' : '#EF4444';
      case 'major': return theme === 'dark' ? '#F59E0B' : '#F97316';
      case 'minor': return theme === 'dark' ? '#10B981' : '#22C55E';
      case 'warning': return theme === 'dark' ? '#F59E0B' : '#EAB308';
      default: return '#6B7280';
    }
  };

  const getSeverityIcon = (severity?: string | null) => {
    const s = normalizeString(severity);
    const color = getSeverityColor(severity);
    switch (s) {
      case 'critical': return <XCircle className="w-4 h-4" style={{ color }} />;
      case 'major': return <AlertTriangle className="w-4 h-4" style={{ color }} />;
      case 'minor': return <CheckCircle className="w-4 h-4" style={{ color }} />;
      case 'warning': return <Clock className="w-4 h-4" style={{ color }} />;
      default: return <AlertTriangle className="w-4 h-4" style={{ color }} />;
    }
  };

  const getSelectedDeviceSerial = (d?: Device | null): string | undefined => {
    if (!d) return undefined;
    const x = d as any;
    return x.device_serial ?? x.serial_number ?? x.serial ?? x.serialNumber ?? undefined;
  };

  const getDeviceSerial = (alarm: any) => alarm?.device_serial ?? 'Unknown';
  const getAlarmTypeName = (alarm: any) => alarm?.alarm_type?.name ?? 'Unknown';
  const getSeverityValue = (alarm: any) => alarm?.alarm_type?.severity ?? alarm?.severity ?? '';
  const getCreatedAt = (alarm: any) => alarm?.created_at ?? alarm?.createdAt ?? null;
  const getStatusName = (alarm: any) => alarm?.status?.name ?? alarm?.status_name ?? 'Unknown';

  // Load alarms
  useEffect(() => {
    const loadAlarms = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const alarmFilters: any = {
          severity: filters.severity !== 'all' ? filters.severity : undefined,
          status_id: filters.status_id !== 'all' ? parseInt(filters.status_id) : undefined,
          sort_by: filters.sort_by,
          sort_order: filters.sort_order,
          limit: 20,
          page: 1,
        };

        if (selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name) {
          alarmFilters.hierarchy_id = isNaN(Number(selectedHierarchy.id))
            ? selectedHierarchy.id
            : Number(selectedHierarchy.id);
        }

        const deviceSerial = getSelectedDeviceSerial(selectedDevice);
        if (deviceSerial) alarmFilters.device_serial = deviceSerial;

        const response = await apiService.getAlarms(token, alarmFilters);

        if (response?.success && response.data) {
          setAlarmsData(response.data);
          setError(null);
        } else {
          setAlarmsData(null);
          setError(response?.message ?? 'Failed to fetch alarms');
        }
      } catch (err) {
        console.error('Failed to load alarms:', err);
        setAlarmsData(null);
        setError('Failed to load alarms');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlarms();
  }, [token, filters, selectedHierarchy, selectedDevice]);

  const handleRefresh = () => {
    setFilters(prev => ({ ...prev })); // Trigger reload
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Export alarms data');
  };

  // Filter alarms by search term
  const filteredAlarms = alarmsData?.alarms?.filter(alarm => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      getDeviceSerial(alarm).toLowerCase().includes(searchLower) ||
      getAlarmTypeName(alarm).toLowerCase().includes(searchLower) ||
      getSeverityValue(alarm).toLowerCase().includes(searchLower)
    );
  }) || [];

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 rounded-lg ${
        theme === 'dark' ? 'bg-[#2A2D47]' : 'bg-white border border-gray-200'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Loading alarms...</span>
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
          <XCircle className="w-5 h-5" />
          <span className="font-medium">Error Loading Alarms</span>
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

  const { alarms, statistics } = alarmsData || {};
  const safeAlarms = Array.isArray(filteredAlarms) ? filteredAlarms.filter(Boolean) : [];

  return (
    <div className={`p-6 min-h-full ${theme === 'dark' ? 'bg-[#121429]' : 'bg-gray-50'}`}>
      <div className={`rounded-xl h-full shadow-lg ${theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className={`text-2xl font-bold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name
                  ? `Alarms in ${selectedHierarchy.name}`
                  : selectedDevice
                  ? `Alarms for ${getSelectedDeviceSerial(selectedDevice) ?? 'Unknown'}`
                  : 'All Alarms'}
              </h2>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Total: {statistics?.total ?? 0} alarms
                {(selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name) && (
                  <span className="ml-2">• {selectedHierarchy.level}: {selectedHierarchy.name}</span>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
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
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#1a2847]' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Active</span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {statistics?.active ?? 0}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#1a2847]' : 'bg-yellow-50'}`}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Acknowledged</span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {statistics?.acknowledged ?? 0}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#1a2847]' : 'bg-green-50'}`}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Resolved</span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {statistics?.resolved ?? 0}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#1a2847]' : 'bg-blue-50'}`}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total</span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {statistics?.total ?? 0}
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
                placeholder="Search alarms by device, type, or severity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-[#1a2847] border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-[#3A3D57]'
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
              theme === 'dark' ? 'bg-[#3A3D57] border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Severity
                  </label>
                  <select
                    value={filters.severity}
                    onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-[#2A2D47] border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                    <option value="Warning">Warning</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Status
                  </label>
                  <select
                    value={filters.status_id}
                    onChange={(e) => setFilters(prev => ({ ...prev, status_id: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-[#2A2D47] border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">All Statuses</option>
                    <option value="1">Active</option>
                    <option value="2">Acknowledged</option>
                    <option value="3">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Sort By
                  </label>
                  <select
                    value={filters.sort_by}
                    onChange={(e) => setFilters(prev => ({ ...prev, sort_by: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-[#2A2D47] border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="created_at">Time Created</option>
                    <option value="severity">Severity</option>
                    <option value="device_serial">Device</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
            <table className="w-full">
              <thead>
                <tr className={`${
                  theme === 'dark' ? 'bg-[#1a2847]' : 'bg-gray-50'
                }`}>
                  <th className={`text-left py-4 px-6 font-semibold ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Device</th>
                  <th className={`text-left py-4 px-6 font-semibold ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Type</th>
                  <th className={`text-left py-4 px-6 font-semibold ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Severity</th>
                  <th className={`text-left py-4 px-6 font-semibold ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Time</th>
                  <th className={`text-left py-4 px-6 font-semibold ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Status</th>
                  
                </tr>
              </thead>
              <tbody>
                {safeAlarms.map((alarm: any, idx: number) => {
                  const id = alarm?.id ?? idx;
                  const severityVal = getSeverityValue(alarm);
                  const created = getCreatedAt(alarm);
                  const statusName = getStatusName(alarm);

                  return (
                    <tr
                      key={id}
                      className={`border-b transition-colors ${
                        theme === 'dark' 
                          ? 'border-gray-700 hover:bg-[#1a2847]' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <td className={`py-4 px-6 font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {getDeviceSerial(alarm)}
                      </td>

                      <td className={`py-4 px-6 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {getAlarmTypeName(alarm)}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(severityVal)}
                          <span className="font-medium" style={{ color: getSeverityColor(severityVal) }}>
                            {severityVal || 'Unknown'}
                          </span>
                        </div>
                      </td>

                      <td className={`py-4 px-6 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {created ? new Date(created).toLocaleString() : 'Unknown'}
                      </td>

                      <td className={`py-4 px-6 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            statusName === 'Active'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : statusName === 'Acknowledged'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}
                        >
                          {statusName || 'Unknown'}
                        </span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>

            {safeAlarms.length === 0 && (
              <div className="text-center py-12">
                <div className={`text-lg mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {searchTerm ? 'No alarms match your search' : 'No alarms found'}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  {searchTerm 
                    ? 'Try adjusting your search terms or filters' 
                    : 'All systems are operating normally'
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmsTable;