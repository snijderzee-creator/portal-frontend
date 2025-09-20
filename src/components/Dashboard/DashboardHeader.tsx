import React from 'react';
import { SearchIcon, BellIcon, UserIcon, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    { label: 'Dashboard' },
    { label: 'Devices' },
    { label: 'Alarms' },
  ];

  return (
    <header className="w-full h-20 bg-[#2A2D47] px-8 flex items-center justify-between">
      {/* Left side: Logo + Navigation */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#2A2D47] font-bold text-sm">S</span>
          </div>
          <span className="text-white font-semibold text-lg">SAHER</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center bg-[#1E1F2E] rounded-full p-1">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === item.label
                  ? 'bg-[#6366F1] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-[#1E1F2E] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-full bg-[#1E1F2E] flex items-center justify-center text-gray-400 hover:text-white transition-colors relative">
          <BellIcon className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#6366F1] rounded-full"></div>
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#1E1F2E] flex items-center justify-center">
          <UserIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;