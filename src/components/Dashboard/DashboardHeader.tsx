import React, { useState, useEffect } from 'react';
import { Moon, Bell, User } from 'lucide-react';
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
    { label: 'Dashboard', active: true },
    { label: 'Devices', active: false },
    { label: 'Alarms', active: false },
  ];

  return (
    <header className={`w-full h-16 px-6 flex items-center justify-between border-b ${
      theme === 'dark' 
        ? 'bg-[#1E1F2E] border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Left side: Logo + Navigation */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-white' : 'bg-[#1E1F2E]'
          }`}>
            <span className={`font-bold text-sm ${
              theme === 'dark' ? 'text-[#1E1F2E]' : 'text-white'
            }`}>S</span>
          </div>
          <span className={`font-semibold text-lg ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>SAHER</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === item.label
                  ? 'bg-[#6366F1] text-white shadow-lg'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Right side: Time + Controls */}
      <div className="flex items-center gap-6">
        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-400 hover:text-white'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <Moon className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-400 hover:text-white'
              : 'bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}>
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#6366F1] rounded-full"></div>
          </button>

          {/* User Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <User className={`h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;