/**
 * Utility functions for coordinate conversions, formatting, and geocoding.
 */

export function decimalToDMS(decimal, isLatitude) {
  if (decimal === null || decimal === undefined || isNaN(decimal)) {
    return { degrees: 0, minutes: 0, seconds: 0, direction: isLatitude ? 'N' : 'E', formatted: '' };
  }

  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = parseFloat(((minutesNotTruncated - minutes) * 60).toFixed(2));

  let direction = '';
  if (isLatitude) {
    direction = decimal >= 0 ? 'N' : 'S';
  } else {
    direction = decimal >= 0 ? 'E' : 'W';
  }

  const formatted = `${degrees}° ${minutes}' ${seconds.toFixed(2)}" ${direction}`;

  return {
    degrees,
    minutes,
    seconds,
    direction,
    formatted
  };
}

export function dmsToDecimal(degrees, minutes, seconds, direction) {
  const deg = parseFloat(degrees) || 0;
  const min = parseFloat(minutes) || 0;
  const sec = parseFloat(seconds) || 0;
  let dec = deg + (min / 60) + (sec / 3600);

  if (direction === 'S' || direction === 'W') {
    dec = -dec;
  }

  return parseFloat(dec.toFixed(6));
}

export async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'GeoTaggingImagesTool/1.0'
        }
      }
    );
    if (!response.ok) throw new Error('Geocoding network error');
    const data = await response.json();
    return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

export async function searchAddress(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'GeoTaggingImagesTool/1.0'
        }
      }
    );
    if (!response.ok) throw new Error('Search network error');
    const results = await response.json();
    return results.map(item => ({
      name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type
    }));
  } catch (err) {
    console.warn('Address search error:', err);
    return [];
  }
}

export const PRESET_LOCATIONS = [
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964 },
  { name: 'San Francisco, USA', lat: 37.7749, lng: -122.4194 }
];
