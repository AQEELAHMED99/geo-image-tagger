import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Search, Crosshair, MapPin, Globe, Loader2, Navigation } from 'lucide-react';
import { searchAddress, PRESET_LOCATIONS } from '../utils/geoUtils';

export default function InteractiveMap({
  selectedLocation,
  onSelectCoordinates,
  onCloseInteractive
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLat = selectedLocation ? selectedLocation.lat : 20.0;
    const initialLng = selectedLocation ? selectedLocation.lng : 0.0;
    const initialZoom = selectedLocation ? 10 : 2;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false
    });

    // Add zoom control top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // CartoDB Dark Matter tiles for beautiful dark theme matching the screenshot
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Custom glowing cyan marker icon
    const customIcon = L.divIcon({
      className: 'custom-leaflet-pin',
      html: `
        <div style="position: relative; width: 28px; height: 38px; transform: translate(-14px, -38px);">
          <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(56, 189, 248, 0.4); animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <svg viewBox="0 0 24 32" style="width: 28px; height: 38px; filter: drop-shadow(0 0 8px #38bdf8);">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill="#0284c7" />
            <circle cx="12" cy="11" r="5" fill="#ffffff" />
          </svg>
        </div>
      `,
      iconSize: [28, 38],
      iconAnchor: [14, 38],
      popupAnchor: [0, -38]
    });

    const marker = L.marker([initialLat, initialLng], {
      icon: customIcon,
      draggable: true
    }).addTo(map);

    marker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      onSelectCoordinates(parseFloat(position.lat.toFixed(6)), parseFloat(position.lng.toFixed(6)));
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onSelectCoordinates(parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6)));
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
    };
  }, []);

  // Update marker position when selectedLocation changes from outside
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !selectedLocation) return;
    const { lat, lng } = selectedLocation;
    markerRef.current.setLatLng([lat, lng]);
    mapInstanceRef.current.setView([lat, lng], Math.max(mapInstanceRef.current.getZoom(), 8));
  }, [selectedLocation]);

  // Handle address search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await searchAddress(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectSearchResult = (result) => {
    onSelectCoordinates(result.lat, result.lng);
    setSearchResults([]);
    setSearchQuery(result.name);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([result.lat, result.lng], 13);
    }
  };

  // Get current device location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        onSelectCoordinates(parseFloat(latitude.toFixed(6)), parseFloat(longitude.toFixed(6)));
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 14);
        }
      },
      (err) => {
        setIsLocating(false);
        alert(`Location access denied or unavailable: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[360px] md:h-[390px] bg-[#0c1527] border border-[#1a294b] rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Top Search and Action bar */}
      <div className="absolute top-3 left-3 right-12 z-[1000] flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, address, landmark..."
              className="w-full bg-[#0b1326]/90 backdrop-blur-md border border-[#1f3159] focus:border-[#38bdf8] text-white text-xs sm:text-sm rounded-lg pl-8 pr-16 py-2 outline-none transition-all placeholder:text-slate-400 shadow-md"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1.5 px-2.5 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs rounded font-medium transition-colors"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Find'}
            </button>
          </form>

          {/* Current GPS button */}
          <button
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            title="Locate my position"
            className="p-2 rounded-lg bg-[#0b1326]/90 hover:bg-[#152345] border border-[#1f3159] text-sky-400 hover:text-white transition-all shadow-md flex items-center justify-center"
          >
            {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          </button>

          {/* Back to Global View */}
          <button
            onClick={onCloseInteractive}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-[#0b1326]/90 hover:bg-[#152345] border border-[#1f3159] text-slate-200 text-xs font-medium transition-all shadow-md"
          >
            <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="hidden sm:inline">Overview</span>
          </button>
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="bg-[#0b1326] border border-[#1f3159] rounded-lg shadow-2xl max-h-48 overflow-y-auto divide-y divide-[#162547]">
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSearchResult(item)}
                className="p-2.5 hover:bg-[#162547] cursor-pointer text-xs text-slate-200 flex items-start gap-2 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preset pills row at bottom */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pointer-events-auto">
        <span className="text-[10px] text-slate-300 font-semibold uppercase bg-slate-900/80 px-2 py-1 rounded backdrop-blur border border-slate-700">
          Presets:
        </span>
        {PRESET_LOCATIONS.map((loc) => (
          <button
            key={loc.name}
            onClick={() => onSelectCoordinates(loc.lat, loc.lng)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-md bg-[#0b1326]/90 hover:bg-[#0284c7] hover:text-white border border-[#1f3159] text-slate-300 transition-all font-medium backdrop-blur shadow-sm"
          >
            {loc.name.split(',')[0]}
          </button>
        ))}
      </div>

      {/* Leaflet Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />
    </div>
  );
}
