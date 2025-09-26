import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import SidebarDrawer from '../Shared/SidebarDrawer';
import DashboardContent from './DashboardContent';
import DevicesPage from './DevicesPage';
import AlarmsTable from './AlarmsTable';
import { Device, HierarchyNode } from '../../services/api';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedHierarchy, setSelectedHierarchy] = useState<HierarchyNode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setSelectedHierarchy(null);
    // Don't automatically switch to Dashboard - stay on current tab
  };

  const handleHierarchySelect = (hierarchy: HierarchyNode) => {
    setSelectedHierarchy(hierarchy);
    setSelectedDevice(null);
    // Don't automatically switch to Dashboard - stay on current tab
  };

  const handleInitialHierarchyLoad = (hierarchy: HierarchyNode) => {
    setSelectedHierarchy(hierarchy);
    setSelectedDevice(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`min-h-screen flex flex-col w-full ${
        theme === 'dark' ? 'bg-[#0F172A]' : 'bg-[#F7F7F7]'
      }`}
    >
      {/* Header - make it sticky so content scrolls under it instead of pushing layout */}
      <div className="sticky top-0 z-30">
        <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main area: sidebar + content. Use flex-1 and overflow-hidden so children manage their own scrolling */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar - fixed width, doesn't shrink, fill parent's height */}
        <aside className="w-80 flex-shrink-0 h-full">
          <SidebarDrawer
            onDeviceSelect={handleDeviceSelect}
            onHierarchySelect={handleHierarchySelect}
            onInitialHierarchyLoad={handleInitialHierarchyLoad}
            selectedDeviceId={selectedDevice?.id}
            selectedHierarchyId={selectedHierarchy?.id}
          />
        </aside>

        {/* Content Area - takes remaining space and scrolls internally */}
        <section className="flex-1 h-full overflow-auto p-4">
          {/* Switch content based on activeTab */}
          {activeTab === 'Dashboard' && (
            <DashboardContent
              selectedDevice={selectedDevice}
              selectedHierarchy={selectedHierarchy}
            />
          )}

          {activeTab === 'Devices' && (
            <DevicesPage
              selectedHierarchy={selectedHierarchy}
              selectedDevice={selectedDevice}
            />
          )}

          {activeTab === 'Alarms' && (
            <AlarmsTable
              selectedHierarchy={selectedHierarchy}
              selectedDevice={selectedDevice}
            />
          )}

          {/* If you want to render children passed into layout */}
          {children}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
