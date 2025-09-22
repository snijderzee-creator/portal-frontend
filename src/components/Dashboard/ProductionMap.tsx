import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../hooks/useTheme';
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
const createCustomIcon = (color: string) => {
  const svgIcon = `
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" fill="${color}" stroke="white" stroke-width="2"/>
    </svg>
  `;
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

const ProductionMap: React.FC = () => {
  const { theme } = useTheme();

  const locations = [
    { id: '1', lat: 24.7136, lng: 46.6753, name: 'Riyadh', color: '#FE44CC' },
    {
      id: '2',
      lat: 26.4207,
      lng: 50.0888,
      name: 'Eastern Province',
      color: '#F56C44',
    },
    { id: '3', lat: 21.3891, lng: 39.8579, name: 'Makkah', color: '#38BF9D' },
    { id: '4', lat: 26.3274, lng: 43.975, name: 'Al-Qassim', color: '#FE44CC' },
    { id: '5', lat: 18.2465, lng: 42.5326, name: 'Asir', color: '#FE44CC' },
  ];

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
          Production Map - Saudi Arabia
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full dark:bg-[#6366F1] bg-[#38BF9D]"></div>
            <span
              className={`text-base ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Normal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full dark:bg-[#EC4899] bg-[#F56C44]"></div>
            <span
              className={`text-base ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Signal
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
            center={[24.7136, 46.6753]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
            scrollWheelZoom={false}
          >
            <TileLayer
              url={
                theme === 'dark'
                  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
              }
            />

            {locations.map((location) => (
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                icon={createCustomIcon(location.color)}
              >
                <Popup className="dark-popup">
                  <div
                    className={`p-2 ${
                      theme === 'dark'
                        ? 'text-white bg-[#1623456e]'
                        : 'text-gray-900 bg-white'
                    }`}
                  >
                    <div className="font-semibold">{location.name}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                theme === 'dark'
                  ? 'bg-[#1623456e] text-white hover:bg-[#3A3D57]'
                  : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              +
            </button>
            <button
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                theme === 'dark'
                  ? 'bg-[#2A2D47] text-white hover:bg-[#3A3D57]'
                  : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              ⛶
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-4 p-4">
          <div className="">
            <div
              className={`lg:text-6xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              25
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
                15
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
                15
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
                15
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