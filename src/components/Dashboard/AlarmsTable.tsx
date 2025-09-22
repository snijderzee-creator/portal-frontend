// src/components/Dashboard/AlarmsTable.tsx
import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
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
  const [filters, setFilters] = useState({
    severity: 'all',
    status_id: 'all',
    sort_by: 'created_at',
    sort_order: 'DESC',
  });

  // -----------------------
  // Helpers (defensive)
  // -----------------------
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
      case 'critical': return '#6B5CF6' /* purple dot in your screenshot */;
      case 'major':    return '#F59E0B';
      case 'minor':    return '#22C55E';
      case 'warning':  return '#EF4444'; // red in screenshot mapping (you can tweak)
      default:         return '#6B7280';
    }
  };

  const getSeverityIcon = (severity?: string | null) => {
    const s = normalizeString(severity);
    switch (s) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'major':    return <AlertTriangle className="w-4 h-4" />;
      case 'minor':    return <CheckCircle className="w-4 h-4" />;
      case 'warning':  return <Clock className="w-4 h-4" />;
      default:         return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // SelectedDevice serial helper (avoids TS errors)
  const getSelectedDeviceSerial = (d?: Device | null): string | undefined => {
    if (!d) return undefined;
    const x = d as any;
    return x.device_serial ?? x.serial_number ?? x.serial ?? x.serialNumber ?? undefined;
  };

  // getters matching your API response shape
  const getDeviceSerial = (alarm: any) => alarm?.device_serial ?? 'Unknown';
  const getAlarmTypeName = (alarm: any) => alarm?.alarm_type?.name ?? 'Unknown';
  const getSeverityValue = (alarm: any) => alarm?.alarm_type?.severity ?? alarm?.severity ?? '';
  const getCreatedAt = (alarm: any) => alarm?.created_at ?? alarm?.createdAt ?? null;
  const getStatusName = (alarm: any) => alarm?.status?.name ?? alarm?.status_name ?? 'Unknown';

  // -----------------------
  // Load alarms
  // -----------------------
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
          // Quick debug log to inspect payload shape (remove later)
          console.log('alarms sample:', response.data.alarms?.[0] ?? response.data.alarms ?? response.data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filters, selectedHierarchy, selectedDevice]);

  // -----------------------
  // Render states
  // -----------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        <span className={`ml-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Loading alarms...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
        Error: {error}
      </div>
    );
  }

  if (!alarmsData) {
    return <div className="p-4 rounded-lg bg-gray-900/20 text-gray-400">No alarm data available</div>;
  }

  const { alarms, statistics } = alarmsData;
  const safeAlarms = Array.isArray(alarms) ? alarms.filter(Boolean) : [];

  return (
    <div className={`p-6 min-h-full ${theme === 'dark' ? 'bg-[#1E1F2E]' : 'bg-gray-50'}`}>
      <div className={`rounded-lg h-full ${theme === 'dark' ? 'bg-[#2A2D47]' : 'bg-white border border-gray-200'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className={`text-lg font-semibold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name
                  ? `Alarms in ${selectedHierarchy.name} (${statistics?.total ?? 0})`
                  : selectedDevice
                  ? `Alarms for ${getSelectedDeviceSerial(selectedDevice) ?? 'Unknown'} (${statistics?.total ?? 0})`
                  : `All Alarms (${statistics?.total ?? 0})`}
              </h2>
              {(selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name) && (
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedHierarchy.level}: {selectedHierarchy.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Active: {statistics?.active ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Acknowledged: {statistics?.acknowledged ?? 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Resolved: {statistics?.resolved ?? 0}</span>
                </div>
              </div>

              <select
                value={filters.severity}
                onChange={(e) => setFilters((prev) => ({ ...prev, severity: e.target.value }))}
                className={`h-9 px-3 border rounded-lg text-sm ${
                  theme === 'dark' ? 'bg-[#2A2D47] border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-600'
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
                <tr className={`border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 font-light ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Device</th>
                  <th className={`text-left py-3 px-4 font-light ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Type</th>
                  <th className={`text-left py-3 px-4 font-light ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Severity</th>
                  <th className={`text-left py-3 px-4 font-light ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time</th>
                  <th className={`text-left py-3 px-4 font-light ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
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
                        theme === 'dark' ? 'border-gray-700 hover:bg-[#3A3D57]' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <td className={`py-4 px-4 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {getDeviceSerial(alarm)}
                      </td>

                      <td className={`py-4 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {getAlarmTypeName(alarm)}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div style={{ color: getSeverityColor(severityVal) }}>{getSeverityIcon(severityVal)}</div>
                          <span className="font-medium" style={{ color: getSeverityColor(severityVal) }}>
                            {severityVal || 'Unknown'}
                          </span>
                        </div>
                      </td>

                      <td className={`py-4 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {created ? new Date(created).toLocaleString() : 'Unknown'}
                      </td>

                      <td className={`py-4 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
              <div className="text-center py-8">
                <div className={`text-lg mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No alarms found</div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>All systems are operating normally</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmsTable;
