import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../hooks/useTheme';

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
    { id: '2', lat: 26.4207, lng: 50.0888, name: 'Eastern Province', color: '#FE44CC' },
    { id: '3', lat: 21.3891, lng: 39.8579, name: 'Makkah', color: '#FE44CC' },
    { id: '4', lat: 26.3274, lng: 43.9750, name: 'Al-Qassim', color: '#FE44CC' },
    { id: '5', lat: 18.2465, lng: 42.5326, name: 'Asir', color: '#FE44CC' },
  ];

  return (
    <div className={`rounded-lg p-6 ${
      theme === 'dark' ? 'bg-[#2A2D47]' : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-base font-medium ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Production Map - Saudi Arabia</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#6366F1]"></div>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#EC4899]"></div>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Signal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Map */}
        <div className={`col-span-2 relative h-64 rounded-lg overflow-hidden ${
          theme === 'dark' ? 'bg-[#1E1F2E]' : 'bg-gray-100'
        }`}>
          <MapContainer
            center={[24.7136, 46.6753]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
          >
            <TileLayer
              url={theme === 'dark' 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              }
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {locations.map((location) => (
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                icon={createCustomIcon(location.color)}
              >
                <Popup className="dark-popup">
                  <div className={`p-2 ${
                    theme === 'dark' ? 'text-white bg-[#1E1F2E]' : 'text-gray-900 bg-white'
                  }`}>
                    <div className="font-semibold">{location.name}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              theme === 'dark' 
                ? 'bg-[#2A2D47] text-white hover:bg-[#3A3D57]' 
                : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
            }`}>
              +
            </button>
            <button className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              theme === 'dark' 
                ? 'bg-[#2A2D47] text-white hover:bg-[#3A3D57]' 
                : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
            }`}>
              ⛶
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>25</div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Total Devices</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#6366F1] rounded"></div>
              <span className={`font-bold text-lg ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>15</span>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Active Alarms</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#10B981] rounded"></div>
              <span className={`font-bold text-lg ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>15</span>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Online</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-600 rounded"></div>
              <span className={`font-bold text-lg ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>15</span>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionMap;