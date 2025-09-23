import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { apiService, HierarchyNode, Device, EnhancedDevice } from '../../services/api';
import { Activity, Wifi, Power, Cpu, Tablet, Monitor } from 'lucide-react';

// Fix for default markers in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon issue
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom marker icons
const createCustomIcon = (color: string, hasAlarms: boolean) => {
  const svgIcon = `
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" fill="${color}" stroke="white" stroke-width="2"/>
      ${hasAlarms ? '<circle cx="15" cy="5" r="3" fill="#e0043b" />' : ''}
    </svg>
  `;
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

// Component to handle map bounds updates
const MapBoundsUpdater: React.FC<{ bounds: [number, number][] | null }> = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      try {
        if (bounds.length === 1) {
          // Single point - center and zoom
          map.setView(bounds[0], 10);
        } else {
          // Multiple points - fit bounds
          map.fitBounds(bounds as [number, number][], {
            padding: [20, 20],
            maxZoom: 12
          });
        }
      } catch (error) {
        console.warn('Error updating map bounds:', error);
      }
    }
  }, [map, bounds]);

  return null;
};

interface ProductionMapProps {
  selectedHierarchy?: HierarchyNode | null;
  selectedDevice?: Device | null;
}

const ProductionMap: React.FC<ProductionMapProps> = ({ selectedHierarchy, selectedDevice }) => {
  const { theme } = useTheme();
  const { token } = useAuth();
  const [devices, setDevices] = useState<EnhancedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalDevices: 0,
    onlineDevices: 0,
    offlineDevices: 0,
    activeAlarms: 0
  });

  // Load devices based on selected hierarchy or all devices
  useEffect(() => {
    const loadDevices = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        let response;
        
        if (selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name) {
          // Load devices for specific hierarchy
          response = await apiService.getDevicesByHierarchy(parseInt(selectedHierarchy.id), token);
        } else {
          // Load all devices for company
          response = await apiService.getAllDevicesEnhanced(token);
        }
        
        if (response.success && response.data) {
          setDevices(response.data.devices);
          setStatistics({
            totalDevices: response.data.statistics.totalDevices,
            onlineDevices: response.data.statistics.onlineDevices,
            offlineDevices: response.data.statistics.offlineDevices,
            activeAlarms: 0 // Will be updated when we integrate alarms
          });
        }
      } catch (error) {
        console.error('Failed to load devices for map:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDevices();
  }, [token, selectedHierarchy]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        // Reload devices data
        const loadDevices = async () => {
          try {
            let response;
            
            if (selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name) {
              response = await apiService.getDevicesByHierarchy(parseInt(selectedHierarchy.id), token);
            } else {
              response = await apiService.getAllDevicesEnhanced(token);
            }
            
            if (response.success && response.data) {
              setDevices(response.data.devices);
              setStatistics({
                totalDevices: response.data.statistics.totalDevices,
                onlineDevices: response.data.statistics.onlineDevices,
                offlineDevices: response.data.statistics.offlineDevices,
                activeAlarms: 0
              });
            }
          } catch (error) {
            console.error('Failed to refresh devices data:', error);
          }
        };
        
        loadDevices();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [token, selectedHierarchy]);

  // Calculate map bounds based on devices with valid coordinates
  const mapBounds = useMemo(() => {
    const devicesWithCoords = devices.filter(device => 
      device.location?.latitude && 
      device.location?.longitude &&
      !isNaN(device.location.latitude) &&
      !isNaN(device.location.longitude)
    );

    if (devicesWithCoords.length === 0) {
      // Default to Saudi Arabia center if no devices with coordinates
      return [[24.7136, 46.6753]];
    }

    return devicesWithCoords.map(device => [
      device.location.latitude!,
      device.location.longitude!
    ]);
  }, [devices]);

  // Default center (Saudi Arabia)
  const defaultCenter: [number, number] = [24.7136, 46.6753];

  if (isLoading) {
    return (
      <div className={`rounded-lg p-6 ${
        theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Loading map data...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg ${
        theme === 'dark' ? 'bg-[#162345]' : 'bg-white border border-gray-200'
      }`}
    >
      <div
        className={`flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#b4c9e37d]`}
      >
        <h2
          className={`text-xl font-medium ${
            theme === 'dark' ? 'text-[#fff]' : 'text-[#0f0f0f]'
          }`}
        >
          Production Map
          {selectedHierarchy && selectedHierarchy.id !== selectedHierarchy.name && (
            <span className="text-sm font-normal ml-2">
              - {selectedHierarchy.name}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full dark:bg-[#6366F1] bg-[#38BF9D]"></div>
            <span
              className={`text-base ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Online
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full dark:bg-[#EC4899] bg-[#F56C44]"></div>
            <span
              className={`text-base ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Offline
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Map */}
        <div
          className={`col-span-2 relative h-80 rounded-bl-lg overflow-hidden ${
            theme === 'dark' ? 'bg-[#21212b]' : 'bg-gray-100'
          }`}
        >
          <MapContainer
            center={mapBounds.length > 0 ? mapBounds[0] as [number, number] : defaultCenter}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
            scrollWheelZoom={true}
          >
            <TileLayer
              url={
                theme === 'dark'
                  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
              }
            />
            
            <MapBoundsUpdater bounds={mapBounds as [number, number][]} />

            {devices
              .filter(device => 
                device.location?.latitude && 
                device.location?.longitude &&
                !isNaN(device.location.latitude) &&
                !isNaN(device.location.longitude)
              )
              .map((device) => (
                <Marker
                  key={device.deviceId}
                  position={[device.location.latitude!, device.location.longitude!]}
                  icon={createCustomIcon(
                    device.status === 'Online' 
                      ? (theme === 'dark' ? '#6366F1' : '#38BF9D')
                      : (theme === 'dark' ? '#EC4899' : '#F56C44'),
                    false // TODO: Add alarm status when available
                  )}
                >
                  <Popup className="dark-popup">
                    <div
                      className={`p-2 ${
                        theme === 'dark'
                          ? 'text-white bg-[#1623456e]'
                          : 'text-gray-900 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-lg mb-2">{device.deviceSerial}</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            Device:
                          </span>
                          <span className="font-medium">{device.deviceName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            Well:
                          </span>
                          <span className="font-medium">{device.wellName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            Status:
                          </span>
                          <span
                            className={`font-medium ${
                              device.status === 'Online' ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {device.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            Company:
                          </span>
                          <span className="font-medium">{device.companyName}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        {/* Statistics */}
        <div className="space-y-4 p-4">
          <div className="">
            <div
              className={`lg:text-6xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {statistics.totalDevices}
            </div>
            <div
              className={`text-base italic mt-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Total Devices
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-5 border-l-2 py-2 border-[#46B8E9] pl-3 rounded-l-md">
              <Wifi className="text-[#555867] dark:text-white" />
              <span
                className={`font-bold text-lg ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {statistics.activeAlarms}
              </span>
              <span
                className={`text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-600'
                } ml-2`}
              >
                Active Alarms
              </span>
            </div>

            <div className="flex items-center gap-5 border-l-2 py-2 border-[#1AF83B] pl-3 rounded-l-md">
              <Monitor className="text-[#555867] dark:text-white" />
              <span
                className={`font-bold text-lg ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {statistics.onlineDevices}
              </span>
              <span
                className={`text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-600'
                } ml-2`}
              >
                Online
              </span>
            </div>
            
            <div className="flex items-center gap-5 border-l-2 py-2 border-[#919DC2] pl-3 rounded-l-md">
              <Power className="text-[#555867] dark:text-white" />
              <span
                className={`font-bold text-lg ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {statistics.offlineDevices}
              </span>
              <span
                className={`text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-600'
                } ml-2`}
              >
                Offline
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionMap;