import React from 'react';
import { useState, useEffect } from 'react';
import { FilterIcon, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { apiService, DeviceAlarm, AlarmsResponse, HierarchyNode, Device } from '../../services/api';

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
  const [filters, setFilters] = useState({
    severity: 'all',
    status_id: 'all',
    sort_by: 'created_at',
    sort_order: 'DESC'
  });

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
        
        // Add hierarchy filter if selected
        if (selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name) {
          alarmFilters.hierarchy_id = parseInt(selectedHierarchy.id);
        }
        
        // Add device filter if selected
        if (selectedDevice) {
          alarmFilters.device_serial = selectedDevice.serial_number;
        }
        
        const response = await apiService.getAlarms(token, {
          severity: filters.severity !== 'all' ? filters.severity : undefined,
          status_id: filters.status_id !== 'all' ? parseInt(filters.status_id) : undefined,
          sort_by: filters.sort_by,
          sort_order: filters.sort_order,
          limit: 20,
          page: 1,
        });
        
        if (response.success && response.data) {
          setAlarmsData(response.data);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError('Failed to load alarms');
        console.error('Failed to load alarms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlarms();
  }, [token, filters, selectedHierarchy, selectedDevice]);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#EF4444';
      case 'major':
        return '#F59E0B';
      case 'minor':
        return '#22C55E';
      case 'warning':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <XCircle className="w-4 h-4" />;
      case 'major':
        return <AlertTriangle className="w-4 h-4" />;
      case 'minor':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleAcknowledgeAlarm = async (alarmId: number) => {
    if (!token) return;
    
    try {
      const response = await apiService.updateAlarmStatus(alarmId, 2, token); // 2 = Acknowledged
      if (response.success) {
        // Reload alarms
        const alarmsResponse = await apiService.getAlarms(token, {
          severity: filters.severity !== 'all' ? filters.severity : undefined,
          status_id: filters.status_id !== 'all' ? parseInt(filters.status_id) : undefined,
          sort_by: filters.sort_by,
          sort_order: filters.sort_order,
          limit: 20,
          page: 1,
        });
        
        if (alarmsResponse.success && alarmsResponse.data) {
          setAlarmsData(alarmsResponse.data);
        }
      }
    } catch (error) {
      console.error('Failed to acknowledge alarm:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className={`ml-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Loading alarms...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${
        theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
      }`}>
        Error: {error}
      </div>
    );
  }

  if (!alarmsData) {
    return (
      <div className="p-4 rounded-lg bg-gray-900/20 text-gray-400">
        No alarm data available
      </div>
    );
  }

  const { alarms, statistics } = alarmsData;

  return (
    <div className={`p-6 min-h-full ${
      theme === 'dark' ? 'bg-[#1E1F2E]' : 'bg-gray-50'
    }`}>
      <div className={`rounded-lg h-full ${
        theme === 'dark' ? 'bg-[#2A2D47]' : 'bg-white border border-gray-200'
      }`}>
        <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-lg font-semibold tracking-wide ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name 
                ? `Alarms in ${selectedHierarchy.name} (${statistics.total})` 
                : selectedDevice
                ? `Alarms for ${selectedDevice.serial_number} (${statistics.total})`
                : `All Alarms (${statistics.total})`
              }
            </h2>
            {(selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name) && (
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {selectedHierarchy.level}: {selectedHierarchy.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Statistics */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  Active: {statistics.active}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  Acknowledged: {statistics.acknowledged}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  Resolved: {statistics.resolved}
                </span>
              </div>
            </div>
            
            {/* Filters */}
            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
              className={`h-9 px-3 border rounded-lg text-sm ${
                theme === 'dark'
                  ? 'bg-[#2A2D47] border-gray-600 text-gray-300'
                  : 'bg-white border-gray-300 text-gray-600'
              }`}
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Major">Major</option>
              <option value="Minor">Minor</option>
              <option value="Warning">Warning</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <th className={`text-left py-3 px-4 font-light ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Device
                </th>
                <th className={`text-left py-3 px-4 font-light ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Type
                </th>
                <th className={`text-left py-3 px-4 font-light ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Severity
                </th>
                <th className={`text-left py-3 px-4 font-light ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Time
                </th>
                <th className={`text-left py-3 px-4 font-light ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Status
                </th>
                <th className={`text-left py-3 px-4 font-light ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {alarms.map((alarm) => (
                <tr
                  key={alarm.id}
                  className={`border-b transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-700 hover:bg-[#3A3D57]'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <td className={`py-4 px-4 font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {alarm.deviceSerial}
                  </td>
                  <td className={`py-4 px-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {alarm.alarmType.name}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div style={{ color: getSeverityColor(alarm.severity) }}>
                        {getSeverityIcon(alarm.severity)}
                      </div>
                      <span
                        className="font-medium"
                        style={{ color: getSeverityColor(alarm.severity) }}
                      >
                        {alarm.severity}
                      </span>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {new Date(alarm.createdAt).toLocaleString()}
                  </td>
                  <td className={`py-4 px-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      alarm.alarmStatus.name === 'Active'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : alarm.alarmStatus.name === 'Acknowledged'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {alarm.alarmStatus.name}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {alarm.alarmStatus.name === 'Active' && (
                      <button
                        onClick={() => handleAcknowledgeAlarm(alarm.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        Acknowledge
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {alarms.length === 0 && (
            <div className="text-center py-8">
              <div className={`text-lg mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>No alarms found</div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                All systems are operating normally
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