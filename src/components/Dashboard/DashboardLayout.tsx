import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import SidebarDrawer from '../Shared/SidebarDrawer';
import DashboardContent from './DashboardContent';
import DevicesPage from './DevicesPage';
import AlarmsTable from './AlarmsTable';
import { Device } from '../../services/api';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedHierarchy, setSelectedHierarchy] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setSelectedHierarchy(null);
    setActiveTab('Dashboard');
  };

  const handleHierarchySelect = (hierarchy: any) => {
    setSelectedHierarchy(hierarchy);
    setSelectedDevice(null);
    setActiveTab('Dashboard');
  };

  const handleInitialHierarchyLoad = (hierarchy: any) => {
    setSelectedHierarchy(hierarchy);
    setSelectedDevice(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`min-h-screen w-full relative ${theme === 'dark' ? 'bg-[#1E1F2E]' : 'bg-gray-50'}`}>
      {/* Sidebar Drawer - Always present */}
      <SidebarDrawer 
        onDeviceSelect={handleDeviceSelect}
        onHierarchySelect={handleHierarchySelect}
        onInitialHierarchyLoad={handleInitialHierarchyLoad}
        selectedDeviceId={selectedDevice?.id}
        selectedHierarchyId={selectedHierarchy?.id}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />

      {/* Main Content Container */}
      <div className="w-full flex flex-col">
        {/* Header */}
        <DashboardHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onToggleSidebar={toggleSidebar}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* Switch content based on activeTab */}
          {activeTab === 'Dashboard' && (
            <DashboardContent 
              selectedDevice={selectedDevice} 
              selectedHierarchy={selectedHierarchy}
            />
          )}
          
          {activeTab === 'Devices' && (
            <DevicesPage />
          )}
          
          {activeTab === 'Alarms' && (
            <div className={`p-6 min-h-full ${theme === 'dark' ? 'bg-[#1E1F2E]' : 'bg-gray-50'}`}>
              <AlarmsTable />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;



