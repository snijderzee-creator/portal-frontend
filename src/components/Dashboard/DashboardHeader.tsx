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
    { label: 'Charts' },
  ];

  return (
    <header
      className={`w-full h-16 border-b relative z-30 ${
        theme === 'dark'
          ? 'bg-[#1E293B] border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
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
              ? 'bg-[#1E293B]'
              : 'bg-white shadow-sm border border-gray-200'
          }`}
        >
          {/* Sliding background */}
          <div
            className={`absolute h-10 rounded-full transition-all duration-300 ease-in-out ${
              theme === 'dark' ? 'bg-[#3B82F6]' : 'bg-[#F97316]'
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
              className={`relative z-10 h-10 px-8 rounded-full text-sm font-medium transition-colors duration-300 ${
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

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <SearchIcon className="h-5 w-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
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
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <BellIcon className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full"></div>
          </button>

          {/* User Avatar */}
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            <UserIcon
              className={`h-4 w-4 ${
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
