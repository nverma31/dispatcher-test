import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ds/button';
import { Plus, Minus, RefreshCw } from 'lucide-react';

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

// Use environment variable or fallback to hardcoded key
const GOOGLE_MAPS_API_KEY = typeof process !== 'undefined' && process.env?.REACT_APP_GOOGLE_MAPS_API_KEY 
  ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY 
  : 'AIzaSyBP0l1p4SS65c9tAz_4jGNcw1_jX15nNwE';

export function MapArea({ pickupLocation, dropoffLocation, onLocationSelect }: MapAreaProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const pickupMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const dropoffMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const retryLoad = () => {
    setIsLoading(true);
    setError(null);
    
    // Remove existing script if any
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Clear window callback
    if ((window as any).initGoogleMap) {
      delete (window as any).initGoogleMap;
    }
    
    // Reload component
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  useEffect(() => {
    let cleanup = false;

    const initMap = (retryCount = 0) => {
      if (cleanup) {
        return;
      }
      
      // Check if the DOM element exists
      if (!mapRef.current) {
        // Retry up to 5 times with increasing delays
        if (retryCount < 5) {
          const delay = (retryCount + 1) * 200; // 200ms, 400ms, 600ms, etc.
          setTimeout(() => initMap(retryCount + 1), delay);
          return;
        } else {
          setError('Map container not found after multiple attempts');
          setIsLoading(false);
          return;
        }
      }
      
      // Verify the element is properly attached to the DOM
      if (!mapRef.current.offsetParent && mapRef.current !== document.body) {
        if (retryCount < 3) {
          setTimeout(() => initMap(retryCount + 1), 300);
          return;
        }
      }
      
      try {
        // Check if google.maps is available
        if (!window.google || !window.google.maps) {
          setError('Google Maps API not loaded');
          setIsLoading(false);
          return;
        }
        
        // Ensure the container has proper dimensions
        if (mapRef.current.offsetWidth === 0 || mapRef.current.offsetHeight === 0) {
          mapRef.current.style.width = '100%';
          mapRef.current.style.height = '400px';
          mapRef.current.style.minHeight = '400px';
        }
        
        // Create a simple map
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 53.5511, lng: 9.9937 }, // Hamburg
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          backgroundColor: '#f0f0f0', // Fallback background
          mapId: 'DEMO_MAP_ID' // Required for AdvancedMarkerElement
        });

        // Store map instance
        mapInstanceRef.current = map;
        
        // Wait for map to be ready
        const mapReadyHandler = () => {
          setIsLoading(false);
          setError(null);
        };
        
        google.maps.event.addListenerOnce(map, 'idle', mapReadyHandler);

        // Set a timeout as fallback
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
      // Check if Google Maps is already available
      if (window.google && window.google.maps) {
        // Use requestAnimationFrame to ensure DOM is ready even for already loaded maps
        requestAnimationFrame(() => {
          setTimeout(() => initMap(0), 50);
        });
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        if (existingScript.hasAttribute('data-loaded')) {
          requestAnimationFrame(() => {
            setTimeout(() => initMap(0), 50);
          });
        } else {
          existingScript.addEventListener('load', () => {
            existingScript.setAttribute('data-loaded', 'true');
            requestAnimationFrame(() => {
              setTimeout(() => initMap(0), 50);
            });
          });
          existingScript.addEventListener('error', () => {
            setError('Failed to load Google Maps script');
            setIsLoading(false);
          });
        }
        return;
      }
      
      // Create unique callback name
      const callbackName = `initGoogleMap_${Date.now()}`;
      
      // Set up global callback with DOM readiness check
      (window as any)[callbackName] = () => {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          // Additional small delay to ensure React rendering is complete
          setTimeout(() => {
            initMap(0);
          }, 50);
        });
      };

      // Create and load the script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=${callbackName}&libraries=places,marker&loading=async`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        script.setAttribute('data-loaded', 'true');
      };

      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        setError('Failed to load Google Maps script. Please check your API key and internet connection.');
        setIsLoading(false);
      };

      document.head.appendChild(script);
      
      // Set a timeout to detect if the script fails to load
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

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.map = null;
      pickupMarkerRef.current = null;
    }
    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.map = null;
      dropoffMarkerRef.current = null;
    }

    // Clear existing route
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }

    const bounds = new google.maps.LatLngBounds();
    let hasLocations = false;

    // Create custom marker elements
    const createMarkerElement = (color: string, isPickup: boolean) => {
      const markerElement = document.createElement('div');
      markerElement.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid #FFFFFF;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
        position: relative;
      `;
      
      // Add a small inner dot for better visibility
      const innerDot = document.createElement('div');
      innerDot.style.cssText = `
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #FFFFFF;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `;
      markerElement.appendChild(innerDot);
      
      return markerElement;
    };

    // Add pickup marker
    if (pickupLocation && window.google && window.google.maps && window.google.maps.marker) {
      try {
        const pickupElement = createMarkerElement('#791518', true); // Primary color
        pickupMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
          position: pickupLocation.coordinates,
          map: mapInstanceRef.current,
          title: 'Pickup Location',
          content: pickupElement,
        });
        bounds.extend(pickupLocation.coordinates);
        hasLocations = true;
      } catch (error) {
        console.warn('Failed to create AdvancedMarkerElement for pickup, falling back to regular marker:', error);
        // Fallback to regular marker if AdvancedMarkerElement fails
        const fallbackMarker = new google.maps.Marker({
          position: pickupLocation.coordinates,
          map: mapInstanceRef.current,
          title: 'Pickup Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#791518',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
          },
        });
        pickupMarkerRef.current = fallbackMarker as any;
        bounds.extend(pickupLocation.coordinates);
        hasLocations = true;
      }
    }

    // Add dropoff marker
    if (dropoffLocation && window.google && window.google.maps && window.google.maps.marker) {
      try {
        const dropoffElement = createMarkerElement('#B44B61', false); // Accent color
        dropoffMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
          position: dropoffLocation.coordinates,
          map: mapInstanceRef.current,
          title: 'Dropoff Location',
          content: dropoffElement,
        });
        bounds.extend(dropoffLocation.coordinates);
        hasLocations = true;
      } catch (error) {
        console.warn('Failed to create AdvancedMarkerElement for dropoff, falling back to regular marker:', error);
        // Fallback to regular marker if AdvancedMarkerElement fails
        const fallbackMarker = new google.maps.Marker({
          position: dropoffLocation.coordinates,
          map: mapInstanceRef.current,
          title: 'Dropoff Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#B44B61',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
          },
        });
        dropoffMarkerRef.current = fallbackMarker as any;
        bounds.extend(dropoffLocation.coordinates);
        hasLocations = true;
      }
    }

    // Show route if both locations are available
    if (pickupLocation && dropoffLocation) {
      const directionsService = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // Use our custom markers
        polylineOptions: {
          strokeColor: '#791518',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });
      
      directionsRendererRef.current.setMap(mapInstanceRef.current);

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
    } else if (hasLocations) {
      // Fit map to show all markers
      mapInstanceRef.current.fitBounds(bounds);
      mapInstanceRef.current.setZoom(Math.min(mapInstanceRef.current.getZoom() || 15, 15));
    }
  }, [pickupLocation, dropoffLocation]);

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

  return (
    <div className="w-full lg:flex-1 bg-[var(--color-surface-highest)] rounded-[var(--radius-card)] relative overflow-hidden min-h-[300px] lg:min-h-[400px]">
      {/* Google Maps Container - Always render this div so mapRef.current exists */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ 
          minHeight: '300px',
          height: '100%',
          width: '100%',
          position: 'relative'
        }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[var(--color-surface-highest)]/95 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Google Maps...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-[var(--color-surface-highest)]/95 backdrop-blur-sm flex items-center justify-center">
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

      {/* Zoom Controls - Only show when map is ready */}
      {!isLoading && !error && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col bg-[var(--color-surface-highest)] rounded-[var(--radius)] shadow-sm border border-border">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-b-none h-10 w-10"
            onClick={zoomIn}
          >
            <Plus className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-t-none border-t h-10 w-10"
            onClick={zoomOut}
          >
            <Minus className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}