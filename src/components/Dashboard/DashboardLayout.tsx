import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';

// Add your new pages
import ChartsPage from '../ChartsPage';
import DevicesPage from '../DevicesPage';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Dashboard'); // <-- moved here

  return (
    <div
      className={`min-h-screen w-full ${
        theme === 'dark' ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'
      }`}
    >
      {/* Pass state + setter to header */}
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex">
        <DashboardSidebar />

        {/* Switch content based on activeTab */}
        <div className="flex-1 p-6">
          {activeTab === 'Dashboard' && <DashboardContent />}
          {activeTab === 'Charts' && <ChartsPage />}
          {activeTab === 'Devices' && <DevicesPage />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
