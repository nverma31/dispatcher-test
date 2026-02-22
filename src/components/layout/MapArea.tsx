import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ds/button';
import { RefreshCw, ChevronDown } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { MapMarker, MarkerType, DriverStatus } from './MapMarker';

interface LocationData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface MapAreaProps {
  pickupLocation: LocationData | null;
  dropoffLocation: LocationData | null;
  onLocationSelect: (type: 'pickup' | 'dropoff', locationData: LocationData) => void;
}

interface Driver {
  id: string;
  location: { lat: number, lng: number };
  status: DriverStatus;
  fleet: 'freenow' | 'local';
  licensePlate: string;
}

const MOCK_DRIVERS: Driver[] = [
  { id: '1', location: { lat: 53.5550, lng: 9.9900 }, status: 'available', fleet: 'local', licensePlate: 'HH-NN3542' },
  { id: '2', location: { lat: 53.5520, lng: 9.9910 }, status: 'available', fleet: 'freenow', licensePlate: 'HH-NK1337' },
  { id: '3', location: { lat: 53.5490, lng: 9.9950 }, status: 'in_trip', fleet: 'local', licensePlate: 'HH-NN3444' },
  { id: '4', location: { lat: 53.5480, lng: 9.9880 }, status: 'in_trip', fleet: 'local', licensePlate: 'HH-NN4000' },
  { id: '6', location: { lat: 53.5540, lng: 10.0050 }, status: 'available', fleet: 'freenow', licensePlate: 'HH-TX4876' },
  { id: '7', location: { lat: 53.5450, lng: 9.9850 }, status: 'approaching', fleet: 'freenow', licensePlate: 'HH-XY9876' },
  { id: '8', location: { lat: 53.5500, lng: 10.0000 }, status: 'available', fleet: 'local', licensePlate: 'HH-AB1234' },
];

const ICONS = {
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  car: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
};

type Fleet = 'all' | 'freenow' | 'local' | 'dispatcher';

const GOOGLE_MAPS_API_KEY = typeof process !== 'undefined' && process.env?.REACT_APP_GOOGLE_MAPS_API_KEY
  ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  : 'AIzaSyBP0l1p4SS65c9tAz_4jGNcw1_jX15nNwE';

function StatusDot({ color, label, active, onClick }: { color: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[4px] relative shrink-0 transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
    >
      <div className="flex items-center justify-center size-[20px] shrink-0" data-name="dot">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="5" cy="5" r="5" fill={color} />
        </svg>
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: '#1e1a1a', whiteSpace: 'nowrap' }}>
        {label}
      </div>
    </button>
  );
}

// Figma sm shadow: 3 layered drop shadows
const SM_SHADOW = '0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px 0px rgba(0,15,31,0.14), 0px 1px 3px 0px rgba(0,15,31,0.2)';

function StatusIndicator({ statusFilters, onToggle }: { statusFilters: Record<DriverStatus, boolean>; onToggle: (status: DriverStatus) => void }) {
  return (
    <div
      style={{
        background: '#fcfcfc',
        display: 'flex',
        gap: 12,
        height: 40,
        alignItems: 'center',
        padding: '0 12px',
        borderRadius: 12,
        boxShadow: SM_SHADOW,
        flexShrink: 0,
        pointerEvents: 'auto',
      }}
      data-name="online-Chip"
    >
      <StatusDot color="#2C7C30" label="Available" active={statusFilters.available} onClick={() => onToggle('available')} />
      <StatusDot color="#1a5db6" label="In trip" active={statusFilters.in_trip} onClick={() => onToggle('in_trip')} />
      <StatusDot color="#F4880A" label="Approaching" active={statusFilters.approaching} onClick={() => onToggle('approaching')} />
    </div>
  );
}

function FilterChip({
  value,
  options,
  onChange
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedLabel = options.find(o => o.value === value)?.label || options[0].label;

  return (
    <div className="relative pointer-events-auto" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#fcfcfc',
          display: 'flex',
          gap: 4,
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 12px',
          height: 40,
          borderRadius: 12,
          border: 'none',
          cursor: 'pointer',
          boxShadow: SM_SHADOW,
          flexShrink: 0,
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f0f0'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#fcfcfc'}
        data-name="Chip"
      >
        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: '#1e1a1a', whiteSpace: 'nowrap' }}>
          {selectedLabel}
        </span>
        <div className="flex items-center justify-center size-[20px] shrink-0">
          <ChevronDown className="w-[14px] h-[14px] stroke-[2.5]" color="#675B5B" />
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 min-w-[160px] rounded-[12px] overflow-hidden z-[1000] py-1"
          style={{ backgroundColor: 'white', boxShadow: SM_SHADOW }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                textAlign: 'left',
                fontSize: 14,
                fontWeight: 500,
                color: '#1e1a1a',
                background: value === option.value ? '#f0f0f0' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = value === option.value ? '#f0f0f0' : 'transparent'}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MapArea({ pickupLocation, dropoffLocation, onLocationSelect }: MapAreaProps) {

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  // Marker Refs
  const pickupMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const dropoffMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const driverMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [driverFilter, setDriverFilter] = useState('all');
  const [fleetFilter, setFleetFilter] = useState<Fleet>('all');
  const [statusFilters, setStatusFilters] = useState<Record<DriverStatus, boolean>>({
    available: true,
    in_trip: true,
    approaching: true,
  });

  const retryLoad = () => {
    setIsLoading(true);
    setError(null);

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) existingScript.remove();

    if ((window as any).initGoogleMap) delete (window as any).initGoogleMap;

    setTimeout(() => { window.location.reload(); }, 1000);
  };

  useEffect(() => {
    let cleanup = false;

    const initMap = (retryCount = 0) => {
      if (cleanup) return;

      if (!mapRef.current) {
        if (retryCount < 5) {
          setTimeout(() => initMap(retryCount + 1), (retryCount + 1) * 200);
          return;
        } else {
          setError('Map container not found after multiple attempts');
          setIsLoading(false);
          return;
        }
      }

      if (!mapRef.current.offsetParent && mapRef.current !== document.body) {
        if (retryCount < 3) {
          setTimeout(() => initMap(retryCount + 1), 300);
          return;
        }
      }

      try {
        if (!window.google || !window.google.maps) {
          setError('Google Maps API not loaded');
          setIsLoading(false);
          return;
        }

        if (mapRef.current.offsetWidth === 0 || mapRef.current.offsetHeight === 0) {
          mapRef.current.style.width = '100%';
          mapRef.current.style.height = '400px';
          mapRef.current.style.minHeight = '400px';
        }

        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 53.5511, lng: 9.9937 }, // Hamburg
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          backgroundColor: '#f0f0f0',
          mapId: 'DEMO_MAP_ID'
        });

        mapInstanceRef.current = map;

        // Add click listener to reverse geocode and pinpoint pickup
        map.addListener('click', async (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();

          try {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ location: { lat, lng } });

            let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`; // fallback
            if (response.results && response.results[0]) {
              address = response.results[0].formatted_address;
            }

            onLocationSelect('pickup', {
              address,
              coordinates: { lat, lng }
            });
          } catch (err) {
            console.error('Reverse geocoding failed', err);
            onLocationSelect('pickup', {
              address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, // fallback
              coordinates: { lat, lng }
            });
          }
        });

        google.maps.event.addListenerOnce(map, 'idle', () => {
          setIsLoading(false);
          setError(null);
        });

        setTimeout(() => {
          if (isLoading && !error) {
            setIsLoading(false);
            setError(null);
          }
        }, 3000);

      } catch (err) {
        console.error('Error initializing map:', err);
        setError(`Map initialization failed: ${err}`);
        setIsLoading(false);
      }
    };

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        requestAnimationFrame(() => setTimeout(() => initMap(0), 50));
        return;
      }

      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        if (existingScript.hasAttribute('data-loaded')) {
          requestAnimationFrame(() => setTimeout(() => initMap(0), 50));
        } else {
          existingScript.addEventListener('load', () => {
            existingScript.setAttribute('data-loaded', 'true');
            requestAnimationFrame(() => setTimeout(() => initMap(0), 50));
          });
          existingScript.addEventListener('error', () => {
            setError('Failed to load Google Maps script');
            setIsLoading(false);
          });
        }
        return;
      }

      const callbackName = `initGoogleMap_${Date.now()}`;

      (window as any)[callbackName] = () => {
        requestAnimationFrame(() => setTimeout(() => initMap(0), 50));
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=${callbackName}&libraries=places,marker&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => script.setAttribute('data-loaded', 'true');
      script.onerror = () => {
        setError('Failed to load Google Maps script. Please check your API key.');
        setIsLoading(false);
      };

      document.head.appendChild(script);

      setTimeout(() => {
        if (isLoading && !window.google) {
          setError('Google Maps script load timeout. Please check your API key.');
          setIsLoading(false);
        }
      }, 10000);
    };

    loadGoogleMaps();

    return () => {
      cleanup = true;
    };
  }, []);

  // Sync user route and mock drivers to Map
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || isLoading) return;

    const map = mapInstanceRef.current;
    const bounds = new google.maps.LatLngBounds();
    let hasLocations = false;

    // Helper to render MapMarker component to a DOM element
    const renderMarkerElement = (props: React.ComponentProps<typeof MapMarker>) => {
      const el = document.createElement('div');
      const root = createRoot(el);
      root.render(<MapMarker {...props} />);
      return el;
    };

    // 1. Pickup Marker (Black Pill)
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.map = null;
      pickupMarkerRef.current = null;
    }
    if (pickupLocation && window.google.maps.marker) {
      const el = renderMarkerElement({ type: 'pickup', label: 'Pickup' });
      pickupMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
        position: pickupLocation.coordinates,
        map,
        title: 'Pickup Location',
        content: el,
      });
      bounds.extend(pickupLocation.coordinates);
      hasLocations = true;
    }

    // 2. Dropoff Marker (Red/Pink Pill)
    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.map = null;
      dropoffMarkerRef.current = null;
    }
    if (dropoffLocation && window.google.maps.marker) {
      const el = renderMarkerElement({ type: 'dropoff', label: 'Dropoff' });
      dropoffMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
        position: dropoffLocation.coordinates,
        map,
        title: 'Dropoff Location',
        content: el,
      });
      bounds.extend(dropoffLocation.coordinates);
      hasLocations = true;
    }

    // 3. Clear existing driver markers
    driverMarkersRef.current.forEach(m => { m.map = null; });
    driverMarkersRef.current = [];

    // 4. Render Mock Driver Markers based on filters
    // 4. Render Mock Driver Markers based on filters
    const filteredDrivers = MOCK_DRIVERS.filter(driver => {
      const mappedFleetFilter = fleetFilter === 'dispatcher' ? 'local' : fleetFilter;
      if (mappedFleetFilter !== 'all' && driver.fleet !== mappedFleetFilter) return false;
      if (!statusFilters[driver.status]) return false;
      if (driverFilter !== 'all' && driver.status !== driverFilter) return false;
      return true;
    });

    filteredDrivers.forEach(driver => {
      const el = renderMarkerElement({
        type: 'driver',
        label: driver.licensePlate,
        status: driver.status,
        fleet: driver.fleet
      });

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: driver.location,
        map,
        title: `Driver ${driver.id} (${driver.fleet})`,
        content: el,
      });

      driverMarkersRef.current.push(marker);
      if (!hasLocations) {
        // only expand bounds for drivers if no pickup/dropoff are present to keep focus on user selection
        bounds.extend(driver.location);
      }
    });

    // 5. Directions/Route Line
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }

    if (pickupLocation && dropoffLocation) {
      const directionsService = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // we use custom ones
        polylineOptions: {
          strokeColor: '#0A58CA', // Bright blue like Figma
          strokeWeight: 4,
          strokeOpacity: 0.9,
        },
      });

      directionsRendererRef.current.setMap(map);
      directionsService.route(
        {
          origin: pickupLocation.coordinates,
          destination: dropoffLocation.coordinates,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && directionsRendererRef.current) {
            directionsRendererRef.current.setDirections(result);
          }
        }
      );
    } else if (hasLocations || filteredDrivers.length > 0) {
      map.fitBounds(bounds);
      const zoom = map.getZoom();
      map.setZoom(Math.min(zoom || 14, 15)); // Cap the zoom
    }

  }, [pickupLocation, dropoffLocation, isLoading, fleetFilter, statusFilters, driverFilter]);

  const zoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 12;
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 12;
      mapInstanceRef.current.setZoom(Math.max(currentZoom - 1, 1));
    }
  };

  const toggleStatusFilter = (status: DriverStatus) => {
    setStatusFilters(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  return (
    <div className="w-full lg:basis-1/2 lg:flex-[1_1_50%] bg-[var(--color-surface-highest)] rounded-[var(--radius-card)] relative overflow-hidden min-h-[300px] lg:min-h-[400px]">

      {/* Google Maps Container */}
      <div
        ref={mapRef}
        className="absolute inset-0 z-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* ── Top filter overlays ── */}
      {!isLoading && !error && (
        <>
          {/* Left: driver + fleet chips + status dots */}
          <div
            style={{
              position: 'absolute', top: 16, left: 16,
              zIndex: 100,
              display: 'flex', alignItems: 'center', gap: 8,
              pointerEvents: 'auto',
              flexWrap: 'nowrap',
            }}
            onMouseDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
            onDoubleClick={e => e.stopPropagation()}
          >
            <FilterChip
              value={driverFilter}
              onChange={setDriverFilter}
              options={[
                { label: 'All drivers', value: 'all' },
                { label: 'Available', value: 'available' },
                { label: 'In trip', value: 'in_trip' },
                { label: 'In-approach', value: 'approaching' },
              ]}
            />
            <FilterChip
              value={fleetFilter}
              onChange={(val) => setFleetFilter(val as Fleet)}
              options={[
                { label: 'All fleets', value: 'all' },
                { label: 'FreeNow', value: 'freenow' },
                { label: 'Dispatcher', value: 'dispatcher' },
              ]}
            />
            <StatusIndicator statusFilters={statusFilters} onToggle={toggleStatusFilter} />
          </div>

        </>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-[var(--color-surface-highest)]/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Google Maps...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-[var(--color-surface-highest)]/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <p className="text-destructive mb-2">Google Maps Error</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={retryLoad}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Loading
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}