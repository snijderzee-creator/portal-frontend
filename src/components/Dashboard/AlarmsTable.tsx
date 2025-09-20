import React from 'react';
import { FilterIcon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const AlarmsTable: React.FC = () => {
  const { theme } = useTheme();

  const alarmData = [
    {
      device: 'MPFM-00234',
      type: 'Pipeline Monitor',
      severity: 'Minor',
      severityColor: '#22C55E',
      time: '2025-09-01 08:15Z',
      status: 'Acked',
    },
    {
      device: 'MPFM-00211',
      type: 'Flow Low',
      severity: 'Major',
      severityColor: '#F59E0B',
      time: '2025-09-01 08:15Z',
      status: 'Unacked',
    },
    {
      device: 'MPFM-00245',
      type: 'Flow Analyzer',
      severity: 'Warning',
      severityColor: '#EF4444',
      time: '2025-09-01 08:15Z',
      status: 'Resolved',
    },
    {
      device: 'MPFM-00167',
      type: 'Separator Unit',
      severity: 'Critical',
      severityColor: '#4D3DF7',
      time: '2025-09-01 08:15Z',
      status: 'Active',
    },
  ];

  return (
    <div className="bg-[#2A2D47] rounded-lg border-none">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold tracking-wide text-white">
            Alarms
          </h2>
          <button className="h-9 px-4 border border-gray-600 rounded-lg flex items-center gap-2 transition-colors text-gray-300 hover:bg-[#3A3D57]">
            <FilterIcon className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4 font-light text-gray-400">
                  Device
                </th>
                <th className="text-left py-3 px-4 font-light text-gray-400">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-light text-gray-400">
                  Severity
                </th>
                <th className="text-left py-3 px-4 font-light text-gray-400">
                  Time
                </th>
                <th className="text-left py-3 px-4 font-light text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {alarmData.map((alarm, index) => (
                <tr
                  key={index}
                  className="border-b transition-colors border-gray-700 hover:bg-[#3A3D57]"
                >
                  <td className="py-4 px-4 font-medium text-white">
                    {alarm.device}
                  </td>
                  <td className="py-4 px-4 text-gray-300">
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
                  <td className="py-4 px-4 text-gray-300">
                    {alarm.time}
                  </td>
                  <td className="py-4 px-4 text-gray-300">
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