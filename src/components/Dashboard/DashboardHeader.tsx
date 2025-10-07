import React from 'react';
import { Moon, Bell, User as UserIcon, Sun, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeTab,
  setActiveTab,
  toggleSidebar,
  isSidebarOpen,
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    { label: 'Dashboard' },
    { label: 'Devices' },
    { label: 'Alarms' },
  ];

  const logoSrcDark = '/logolight.png';
  const logoSrcLight = '/logodark.png';

  return (
    <header
      className={`w-full h-20 md:h-24 px-3 md:px-5 flex items-center justify-between border-b flex-shrink-0 ${
        theme === 'dark'
          ? 'bg-[#121429] border-none'
          : 'bg-white border-[#ececec]'
      }`}
    >
      {/* Left side: Mobile Menu + Logo + Navigation */}
      <div className="flex items-center gap-3 md:gap-8 lg:gap-28">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className={`md:hidden h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
            theme === 'dark'
              ? 'bg-[#1D2147] text-gray-400 hover:text-gray-200'
              : 'bg-[#EAEAEA] text-[#555758] hover:text-gray-900'
          }`}
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* Logo */}
        <div
          className={`flex items-center gap-4 py-1 px-3 md:px-4 rounded-full ${
            theme === 'dark'
              ? 'bg-[#1D2147]'
              : 'bg-[#fff] shadow-sm border border-[#ececec]'
          }`}
        >
          <img
            src={theme === 'dark' ? logoSrcDark : logoSrcLight}
            alt="Saher Logo"
            className={`w-auto transition-all duration-300 ${
              theme === 'dark' ? 'h-6 md:h-8' : 'h-8 md:h-10 lg:h-12'
            }`}
          />
        </div>

        {/* Navigation - Desktop Only */}
        <nav
          className={`hidden lg:flex relative items-center rounded-full h-12 p-1 ${
            theme === 'dark'
              ? 'bg-[#162345]'
              : 'bg-white shadow-sm border border-[#ececec]'
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
                  : 'text-[#555758] hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <nav
          className={`flex lg:hidden relative items-center rounded-full h-10 p-1 ${
            theme === 'dark'
              ? 'bg-[#162345]'
              : 'bg-white shadow-sm border border-[#ececec]'
          }`}
        >
          {/* Sliding background */}
          <div
            className={`absolute h-8 rounded-full transition-all duration-300 ease-in-out ${
              theme === 'dark' ? 'bg-[#6656F5]' : 'bg-[#F97316]'
            }`}
            style={{
              width: '70px',
              left:
                activeTab === 'Dashboard'
                  ? '4px'
                  : activeTab === 'Devices'
                  ? '78px'
                  : '152px',
            }}
          />

          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`relative z-10 h-8 w-[70px] flex items-center justify-center rounded-full text-xs font-medium transition-colors duration-300 ${
                activeTab === item.label
                  ? 'text-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-[#555758] hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Right side: Theme toggle, notifications, user */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center transition-colors ${
            theme === 'dark'
              ? 'hover:bg-[#2b3168] bg-[#1D2147] text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 bg-[#EAEAEA] text-[#555758] hover:text-gray-900'
          }`}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <Moon className="h-4 w-4 md:h-5 md:w-5" />
          )}
        </button>

        {/* Notifications */}
        <button
          className={`h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center relative transition-colors ${
            theme === 'dark'
              ? 'hover:bg-[#2b3168] bg-[#1D2147] text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 bg-[#EAEAEA] text-[#555758] hover:text-gray-900'
          }`}
        >
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
          <div
            className={`absolute -top-1 -right-1 h-2.5 w-2.5 md:h-3 md:w-3 rounded-full ${
              theme === 'dark' ? 'bg-[#6656F5]' : 'bg-[#F56C44]'
            }`}
          ></div>
        </button>

        {/* User Avatar */}
        <div
          className={`h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-[#2b3168]' : 'bg-gray-200'
          }`}
        >
          <UserIcon
            className={`h-4 w-4 md:h-5 md:w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-[#555758]'
            }`}
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
