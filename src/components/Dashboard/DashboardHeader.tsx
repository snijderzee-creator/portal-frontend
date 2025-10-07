import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Moon, Bell, User as UserIcon, Sun, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const navigationItems = [
  { label: 'Dashboard' },
  { label: 'Devices' },
  { label: 'Alarms' },
];

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeTab,
  setActiveTab,
  toggleSidebar,
  isSidebarOpen,
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const desktopNavRef = useRef<HTMLElement | null>(null);
  const mobileNavRef = useRef<HTMLElement | null>(null);

  const [sliderStyle, setSliderStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const [mobileSliderStyle, setMobileSliderStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const measureSlider = (container: HTMLElement | null) => {
    if (!container) return { left: 0, width: 0 };
    const containerRect = container.getBoundingClientRect();
    const activeBtn = container.querySelector<HTMLButtonElement>('button[data-active="true"]') || container.querySelector<HTMLButtonElement>('button');
    if (!activeBtn) return { left: 0, width: 0 };
    const rect = activeBtn.getBoundingClientRect();
    const left = Math.max(2, rect.left - containerRect.left + 4);
    const width = Math.max(24, rect.width - 8);
    return { left, width };
  };

  const updateSliders = () => {
    const desktopContainer = desktopNavRef.current;
    if (desktopContainer) {
      const measured = measureSlider(desktopContainer);
      setSliderStyle(measured);
      requestAnimationFrame(() => {
        const measured2 = measureSlider(desktopContainer);
        setSliderStyle(measured2);
      });
    }

    const mobileContainer = mobileNavRef.current;
    if (mobileContainer) {
      const measuredM = measureSlider(mobileContainer);
      setMobileSliderStyle(measuredM);
      requestAnimationFrame(() => {
        const measuredM2 = measureSlider(mobileContainer);
        setMobileSliderStyle(measuredM2);
      });
    }
  };

  useLayoutEffect(() => {
    updateSliders();
    const t = setTimeout(updateSliders, 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, theme]);

  useEffect(() => {
    updateSliders();
    const onResize = () => updateSliders();
    window.addEventListener('resize', onResize);

    let desktopObserver: ResizeObserver | null = null;
    let mobileObserver: ResizeObserver | null = null;

    try {
      if (desktopNavRef.current) {
        desktopObserver = new ResizeObserver(() => updateSliders());
        desktopObserver.observe(desktopNavRef.current);
      }
      if (mobileNavRef.current) {
        mobileObserver = new ResizeObserver(() => updateSliders());
        mobileObserver.observe(mobileNavRef.current);
      }
    } catch (e) {
      // ignore if ResizeObserver unsupported
    }

    return () => {
      window.removeEventListener('resize', onResize);
      desktopObserver?.disconnect();
      mobileObserver?.disconnect();
    };
  }, []);

  const logoSrcDark = '/logolight.png';
  const logoSrcLight = '/logodark.png';

  return (
    <header
      className={`w-full h-20 px-4 md:px-6 flex items-center justify-between border-b flex-shrink-0 ${
        theme === 'dark' ? 'bg-[#121429] border-none' : 'bg-white border-[#ececec]'
      }`}
    >
      {/* Left group: Mobile menu + Logo (in curved rectangle) + Desktop nav */}
      <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className={`md:hidden flex items-center justify-center transition-colors ${
            theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-[#555758] hover:text-gray-900'
          }`}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo inside curved rectangle */}
        <div
          className={`flex items-center rounded-2xl p-1.5 ${
            theme === 'dark' ? 'bg-[#101428]/60' : 'bg-white shadow-sm border border-[#ececec]'
          }`}
          style={{ paddingLeft: 8, paddingRight: 12 }}
        >
          <img
            src={theme === 'dark' ? logoSrcDark : logoSrcLight}
            alt="Saher Logo"
            className="h-8 w-auto transition-all duration-300"
          />
        </div>

        {/* Desktop Navigation - now uses same background pill as mobile */}
        <nav
          ref={desktopNavRef as any}
          className={`hidden lg:flex relative items-center rounded-full h-11 p-0.5 overflow-hidden lg:ml-10 ${
            theme === 'dark' ? 'bg-[#162345]' : 'bg-white shadow-sm border border-[#ececec]'
          }`}
          aria-label="Primary navigation"
        >
          {/* desktop slider: vertically centered and sized to container */}
          <div
            aria-hidden
            className={`absolute rounded-full transition-all duration-250 ease-in-out pointer-events-none ${
              theme === 'dark' ? 'bg-[#6656F5]' : 'bg-[#F97316]'
            }`}
            style={{
              left: sliderStyle.left,
              width: sliderStyle.width,
              top: '50%',
              transform: 'translateY(-50%)',
              height: 'calc(100% - 8px)', // slightly inset so it doesn't overflow
            }}
          />

          {navigationItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                data-active={isActive ? 'true' : 'false'}
                className={`relative z-10 h-9 px-6 flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                  isActive
                    ? 'text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-[#555758] hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Navigation: compact, same visual base */}
        <nav
          ref={mobileNavRef as any}
          className={`flex lg:hidden relative items-center rounded-full h-10 p-0.5 overflow-hidden ${
            theme === 'dark' ? 'bg-[#162345]' : 'bg-white shadow-sm border border-[#ececec]'
          }`}
        >
          <div
            aria-hidden
            className={`absolute rounded-full transition-all duration-200 ease-in-out pointer-events-none ${
              theme === 'dark' ? 'bg-[#6656F5]' : 'bg-[#F97316]'
            }`}
            style={{
              left: mobileSliderStyle.left,
              width: mobileSliderStyle.width,
              top: '50%',
              transform: 'translateY(-50%)',
              height: 'calc(100% - 8px)',
            }}
          />

          {navigationItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                data-active={isActive ? 'true' : 'false'}
                className={`relative z-10 h-9 px-3 flex items-center justify-center rounded-full text-xs font-medium transition-colors duration-300 whitespace-nowrap ${
                  isActive
                    ? 'text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-[#555758] hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right side: Theme toggle, notifications, user */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleTheme}
          className={`h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center transition-colors ${
            theme === 'dark'
              ? 'hover:bg-[#2b3168] bg-[#1D2147] text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 bg-[#EAEAEA] text-[#555758] hover:text-gray-900'
          }`}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
        </button>

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
          />
        </button>

        <div className={`h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-[#2b3168]' : 'bg-gray-200'}`}>
          <UserIcon className={`h-4 w-4 md:h-5 md:w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-[#555758]'}`} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
