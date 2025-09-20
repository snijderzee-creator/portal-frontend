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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className={`min-h-screen w-full ${theme === 'dark' ? 'bg-[#1E1F2E]' : 'bg-gray-50'}`}>
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Switch content based on activeTab */}
      {activeTab === 'Dashboard' && (
        <div className="flex h-[calc(100vh-4rem)] relative">
          <SidebarDrawer 
            onDeviceSelect={handleDeviceSelect}
            onHierarchySelect={handleHierarchySelect}
            onInitialHierarchyLoad={handleInitialHierarchyLoad}
            selectedDeviceId={selectedDevice?.id}
            selectedHierarchyId={selectedHierarchy?.id}
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
          />
          <div className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
          }`}>
            <DashboardContent 
              selectedDevice={selectedDevice} 
              selectedHierarchy={selectedHierarchy}
            />
          </div>
        </div>
      )}
      
      {activeTab === 'Devices' && (
        <div className="flex h-[calc(100vh-4rem)] relative">
          <SidebarDrawer 
            onDeviceSelect={handleDeviceSelect}
            onHierarchySelect={handleHierarchySelect}
            selectedDeviceId={selectedDevice?.id}
            selectedHierarchyId={selectedHierarchy?.id}
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
          />
          <div className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
          }`}>
            <DevicesPage />
          </div>
        </div>
      )}
      
      {activeTab === 'Alarms' && (
        <div className="flex h-[calc(100vh-4rem)] relative">
          <SidebarDrawer 
            onDeviceSelect={handleDeviceSelect}
            onHierarchySelect={handleHierarchySelect}
            selectedDeviceId={selectedDevice?.id}
            selectedHierarchyId={selectedHierarchy?.id}
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
          />
          <div className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
          }`}>
            <div className={`p-6 min-h-full ${theme === 'dark' ? 'bg-[#1E1F2E]' : 'bg-gray-50'}`}>
              <AlarmsTable />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;