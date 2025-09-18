import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useTheme } from '../../hooks/useTheme';
import 'leaflet/dist/leaflet.css';

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
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
      ${hasAlarms ? '<circle cx="24" cy="8" r="4" fill="#ef4444" stroke="white" stroke-width="1"/>' : ''}
    </svg>
  `;
  // btoa is available in browser; OK for client-side
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Safe FitBounds: accepts an array of [lat, lng] tuples
const FitBounds: React.FC<{ bounds?: [number, number][] | null; padding?: number }> = ({ bounds, padding = 20 }) => {
  const map = useMap();

  React.useEffect(() => {
    const isValid = Array.isArray(bounds) &&
      bounds.length > 0 &&
      bounds.every(b => Array.isArray(b) && b.length === 2 && Number.isFinite(b[0]) && Number.isFinite(b[1]));

    if (!isValid) {
      if (bounds && bounds.length === 0) console.warn('FitBounds: bounds is an empty array; skipping fitBounds.');
      else if (bounds) console.warn('FitBounds: bounds malformed, skipping fitBounds:', bounds);
      return;
    }

    try {
      map.fitBounds(bounds as [number, number][], { padding: [padding, padding] });
    } catch (err) {
      console.warn('FitBounds: map.fitBounds threw an error', err);
    }
    // JSON.stringify so shallow array changes trigger effect; map is stable
  }, [map, JSON.stringify(bounds), padding]);

  return null;
};

const InteractiveMap: React.FC = () => {
  const { theme } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Saudi Arabia locations with accurate coordinates
  const locations = [
    { id: '1', lat: 24.7136, lng: 46.6753, name: 'Riyadh Region', alarms: 0, production: '15,200m³', company: 'Saudi arabco', devices: 12 },
    { id: '2', lat: 26.4207, lng: 50.0888, name: 'Eastern Province', alarms: 2, production: '18,500m³', company: 'Saudi arabco', devices: 18 },
    { id: '3', lat: 21.3891, lng: 39.8579, name: 'Makkah Region', alarms: 0, production: '12,800m³', company: 'SABIC', devices: 8 },
    { id: '4', lat: 26.3274, lng: 43.9750, name: 'Al-Qassim', alarms: 1, production: '9,200m³', company: 'ADNOC', devices: 6 },
    { id: '5', lat: 18.2465, lng: 42.5326, name: 'Asir Region', alarms: 0, production: '16,450m³', company: 'Saudi arabco', devices: 14 },
  ];

  // Build an array of [lat, lng] pairs for fitBounds
  const boundsArray = useMemo(() => locations.map(l => [l.lat, l.lng] as [number, number]), [locations]);

  // Map tile URL based on theme
  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  // CSS for Leaflet controls/popups injected safely (no styled-jsx)
  const injectedCss = `
    .leaflet-control-zoom { border: none !important; }
    .leaflet-control-zoom a {
      background-color: ${theme === 'dark' ? '#1E293B' : 'white'} !important;
      color: ${theme === 'dark' ? '#e2e8f0' : '#374151'} !important;
      border: 1px solid ${theme === 'dark' ? '#374151' : '#d1d5db'} !important;
    }
    .leaflet-control-zoom a:hover {
      background-color: ${theme === 'dark' ? '#334155' : '#f9fafb'} !important;
    }
    .leaflet-popup-content-wrapper {
      background-color: ${theme === 'dark' ? '#1f2937' : 'white'} !important;
      color: ${theme === 'dark' ? 'white' : '#111827'} !important;
      border-radius: 8px !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
    }
    .leaflet-popup-tip {
      background-color: ${theme === 'dark' ? '#1f2937' : 'white'} !important;
    }
    .leaflet-container { font-family: 'Poppins', sans-serif !important; }
  `;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Production Map - Saudi Arabia
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Alarms</span>
          </div>
        </div>
      </div>

      <div className={`relative h-80 rounded-lg border overflow-hidden ${theme === 'dark' ? 'bg-[#0F172A] border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
        <MapContainer center={[24.7136, 46.6753]} zoom={6} style={{ height: '100%', width: '100%' }} className="z-10">
          <TileLayer url={tileUrl} attribution={attribution} />
          <FitBounds bounds={boundsArray} padding={30} />

          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(location.alarms > 0 ? '#ef4444' : '#22c55e', location.alarms > 0)}
              eventHandlers={{ click: () => setSelectedLocation(location.id) }}
            >
              <Popup className={theme === 'dark' ? 'dark-popup' : 'light-popup'}>
                <div className={`p-2 min-w-[200px] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <div className="font-semibold text-lg mb-2">{location.name}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Company:</span><span className="font-medium">{location.company}</span></div>
                    <div className="flex justify-between"><span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Production:</span><span className="font-medium text-blue-500">{location.production}</span></div>
                    <div className="flex justify-between"><span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Devices:</span><span className="font-medium">{location.devices}</span></div>
                    <div className="flex justify-between"><span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Status:</span><span className={`font-medium ${location.alarms > 0 ? 'text-red-500' : 'text-green-500'}`}>{location.alarms > 0 ? `${location.alarms} Active Alarms` : 'Normal'}</span></div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Inject CSS without styled-jsx */}
        <style dangerouslySetInnerHTML={{ __html: injectedCss }} />
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#1E293B]' : 'bg-white border border-gray-200'}`}>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Locations</div>
          <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{locations.length}</div>
        </div>

        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#1E293B]' : 'bg-white border border-gray-200'}`}>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Devices</div>
          <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{locations.reduce((sum, loc) => sum + loc.devices, 0)}</div>
        </div>

        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#1E293B]' : 'bg-white border border-gray-200'}`}>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Active Alarms</div>
          <div className="text-xl font-bold text-red-500">{locations.reduce((sum, loc) => sum + loc.alarms, 0)}</div>
        </div>

        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#1E293B]' : 'bg-white border border-gray-200'}`}>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Operational</div>
          <div className="text-xl font-bold text-green-500">{locations.filter(loc => loc.alarms === 0).length}/{locations.length}</div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
