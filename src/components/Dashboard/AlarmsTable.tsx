import React from 'react';
import { FilterIcon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const AlarmsTable: React.FC = () => {
  const { theme } = useTheme();

  const alarmData = [
    {
      device: "MPFM-00234",
      type: "Pipeline Monitor",
      severity: "Minor",
      severityColor: theme === 'dark' ? "#22C55E" : "#10B981",
      time: "2025-09-01 08:15Z",
      status: "Acked",
    },
    {
      device: "MPFM-00211",
      type: "Flow Low",
      severity: "Major",
      severityColor: theme === 'dark' ? "#F59E0B" : "#F97316",
      time: "2025-09-01 08:15Z",
      status: "Unacked",
    },
    {
      device: "MPFM-00245",
      type: "Flow Analyzer",
      severity: "Warning",
      severityColor: theme === 'dark' ? "#EF4444" : "#DC2626",
      time: "2025-09-01 08:15Z",
      status: "Resolved",
    },
    {
      device: "MPFM-00167",
      type: "Separator Unit",
      severity: "Critical",
      severityColor: theme === 'dark' ? "#DC2626" : "#B91C1C",
      time: "2025-09-01 08:15Z",
      status: "Active",
    },
  ];

  return (
    <div className={`rounded-lg border ${
      theme === 'dark' 
        ? 'bg-[#1E293B] border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-lg font-semibold tracking-wide ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Alarms
          </h2>
          <button className={`h-9 px-4 border rounded-lg flex items-center gap-2 transition-colors ${
            theme === 'dark' 
              ? 'border-gray-600 text-gray-300 hover:bg-[#1a2847]' 
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}>
            <FilterIcon className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <th className={`text-left py-3 px-4 font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Device
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Type
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Severity
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Time
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {alarmData.map((alarm, index) => (
                <tr 
                  key={index} 
                  className={`border-b transition-colors ${
                    theme === 'dark' 
                      ? 'border-gray-700 hover:bg-[#1a2847]' 
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <td className={`py-4 px-4 font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {alarm.device}
                  </td>
                  <td className={`py-4 px-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {alarm.type}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: alarm.severityColor }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: alarm.severityColor }}
                      >
                        {alarm.severity}
                      </span>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {alarm.time}
                  </td>
                  <td className={`py-4 px-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {alarm.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlarmsTable;