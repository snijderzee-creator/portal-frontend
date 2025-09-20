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
    <header
      className={`w-full h-24 relative px-5 z-30 ${
        theme === 'dark' ? 'bg-[#121429]' : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side: Logo + Navigation */}
        <div className="flex items-center gap-28">
          {/* Logo */}
          <div
            className={`flex items-center gap-4 py-1 px-4 rounded-full ${
              theme === 'dark'
                ? ' bg-[#1D2147]'
                : ' bg-white shadow-sm border border-gray-200'
            }`}
          >
            <img
              src="https://res.cloudinary.com/drnak5yb2/image/upload/v1756278804/light_mode_logo_saher_btbdos.svg"
              alt="Saher Flow Solutions"
              className="h-8"
            />
          </div>

          {/* Navigation */}
          <nav
            className={`relative flex items-center rounded-full h-12 p-1 ${
              theme === 'dark'
                ? 'bg-[#162345]'
                : 'bg-white shadow-sm border border-gray-200'
            }`}
          >
            {/* Sliding background */}
            <div
              className={`absolute h-10 rounded-full transition-all duration-300 ease-in-out ${
                theme === 'dark' ? 'bg-[#6656F5]' : 'bg-[#F97316]'
              }`}
              style={{
                width: '120px',
                left:
                  activeTab === 'Dashboard'
                    ? '4px'
                    : activeTab === 'Devices'
                    ? '128px'
                    : '252px',
              }}
            />

            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`relative z-10 h-10 w-[120px] flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-300 ${
                  activeTab === item.label
                    ? 'text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
              theme === 'dark'
                ? 'hover:bg-[#2b3168] bg-[#1D2147] text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 bg-[#EAEAEA] text-gray-600 hover:text-gray-900'
            }`}
          >
            <SearchIcon className="h-5 w-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
              theme === 'dark'
                ? 'hover:bg-[#2b3168] bg-[#1D2147] text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 bg-[#EAEAEA] text-gray-600 hover:text-gray-900'
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <button
            className={`h-10 w-10 rounded-full flex items-center justify-center relative transition-colors ${
              theme === 'dark'
                ? 'hover:bg-[#2b3168] bg-[#1D2147] text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 bg-[#EAEAEA] text-gray-600 hover:text-gray-900'
            }`}
          >
            <BellIcon className="h-5 w-5" />
            <div
              className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${
                theme === 'dark' ? 'bg-[#6656F5]' : 'bg-[#F56C44]'
              }`}
            ></div>
          </button>

          {/* User Avatar */}
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-[#2b3168]' : 'bg-gray-200'
            }`}
          >
            <UserIcon
              className={`h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;