import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';
import { Device } from '../../services/api';

// Add your new pages
import ChartsPage from '../ChartsPage';
import DevicesPage from '../DevicesPage';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Dashboard'); // <-- moved here
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedHierarchy, setSelectedHierarchy] = useState<any>(null);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setSelectedHierarchy(null); // Clear hierarchy selection when device is selected
    // Switch to Charts tab when a device is selected
    setActiveTab('Charts');
  };

  const handleHierarchySelect = (hierarchy: any) => {
    setSelectedHierarchy(hierarchy);
    setSelectedDevice(null); // Clear device selection when hierarchy is selected
    // Switch to Charts tab when a hierarchy is selected
    setActiveTab('Charts');
  };

  return (
    <div
      className={`min-h-screen w-full ${
        theme === 'dark' ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'
      }`}
    >
      {/* Pass state + setter to header */}
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex">
        <DashboardSidebar 
          onDeviceSelect={handleDeviceSelect}
          onHierarchySelect={handleHierarchySelect}
          selectedDeviceId={selectedDevice?.id}
          selectedHierarchyId={selectedHierarchy?.id}
        />

        {/* Switch content based on activeTab */}
        <div className="flex-1 p-6">
          {activeTab === 'Dashboard' && <DashboardContent />}
          {activeTab === 'Charts' && (
            <ChartsPage 
              selectedDevice={selectedDevice} 
              selectedHierarchy={selectedHierarchy}
            />
          )}
          {activeTab === 'Devices' && <DevicesPage />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
