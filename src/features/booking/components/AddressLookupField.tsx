import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { experimental } from '@freenow/wave';
import { LocationData } from '@/types';

const { ComboBox, ListBoxItem } = experimental;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBP0l1p4SS65c9tAz_4jGNcw1_jX15nNwE';

interface AddressLookupFieldProps {
  id: string;
  label: string;

  value: LocationData | null;
  onChange: (location: LocationData | null) => void;
  error?: string;
  icon?: React.ReactNode;
}

interface PlacePrediction extends Record<string, unknown> {
  id: string;
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
}

export function AddressLookupField({
  id,
  label,
  value,
  onChange,
  error,
  icon
}: AddressLookupFieldProps) {
  const [inputValue, setInputValue] = useState(value?.address || '');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);

  // Update input value when external value changes
  useEffect(() => {
    if (value?.address) {
      setInputValue(value.address);
    }
  }, [value?.address]);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle input changes and fetch predictions
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);

    if (newValue.length > 2) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://places.googleapis.com/v1/places:autocomplete`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY
              },
              body: JSON.stringify({
                input: newValue,
                includedRegionCodes: ['DE']
              })
            }
          );

          if (!response.ok) {
            console.warn('Places API error');
            setPredictions([]);
            return;
          }

          const data = await response.json();

          if (data.suggestions && data.suggestions.length > 0) {
            const convertedPredictions: PlacePrediction[] = data.suggestions
              .filter((s: any) => s.placePrediction)
              .map((s: any, index: number) => {
                const p = s.placePrediction;
                return {
                  id: `${id}_${p.placeId || `temp_${Date.now()}_${index}`}`,
                  place_id: p.placeId,
                  description: p.text?.text || newValue,
                  structured_formatting: {
                    main_text: p.structuredFormat?.mainText?.text || p.text?.text || newValue,
                    secondary_text: p.structuredFormat?.secondaryText?.text || ''
                  }
                };
              });

            setPredictions(convertedPredictions);
          } else {
            setPredictions([]);
          }
        } catch (error) {
          console.warn('Places API failed:', error);
          setPredictions([]);
        }
      }, 300); // 300ms debounce
    } else {
      setPredictions([]);
    }

    // If user clears input or types differently, we might want to clear the selected location object
    // but keep the text.
    if (value && newValue !== value.address) {
      onChange(null);
    }
  };

  const handleSelectionChange = async (key: React.Key | null) => {
    if (!key) return;

    const prediction = predictions.find(p => p.id === key);
    if (!prediction) return;

    const displayText = prediction.description;
    setInputValue(displayText);

    // Geocode to get coordinates, preferring place_id if available
    try {
      const queryParam = prediction.place_id
        ? `place_id=${prediction.place_id}`
        : `address=${encodeURIComponent(displayText)}`;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?${queryParam}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) throw new Error('Geocoding error');

      const data = await response.json();

      if (data.results && data.results[0]?.geometry?.location) {
        const loc = data.results[0].geometry.location;
        const locationData: LocationData = {
          address: data.results[0].formatted_address || displayText,
          coordinates: {
            lat: loc.lat,
            lng: loc.lng
          }
        };
        onChange(locationData);
      } else {
        // Fallback
        onChange({
          address: displayText,
          coordinates: { lat: 0, lng: 0 }
        });
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
      onChange({
        address: displayText,
        coordinates: { lat: 0, lng: 0 }
      });
    }
  };

  return (
    <ComboBox
      label={label}
      placeholder=""
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onSelectionChange={handleSelectionChange}
      allowsCustomValue={true}
      leadingIcon={icon}
      errorMessage={error}
    >
      {predictions.map((item) => (
        <ListBoxItem key={item.id as string} id={item.id as string} textValue={item.description as string}>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{item.structured_formatting?.main_text || item.description}</span>
            {item.structured_formatting?.secondary_text && (
              <span className="text-xs text-[var(--color-on-surface-variant)]">{item.structured_formatting.secondary_text}</span>
            )}
          </div>
        </ListBoxItem>
      ))}
    </ComboBox>
  );
}