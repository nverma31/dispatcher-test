import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { experimental } from '@freenow/wave';
import { LocationData } from '@/types';

const { ComboBox, ListBoxItem } = experimental;

interface AddressLookupFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: LocationData | null;
  onChange: (location: LocationData | null) => void;
  error?: string;
  icon?: React.ReactNode;
}

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
}

export function AddressLookupField({
  id,
  label,
  placeholder,
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

  // Handle input changes and fetch predictions
  const handleInputChange = async (newValue: string) => {
    setInputValue(newValue);

    if (newValue.length > 2) {
      try {
        const response = await fetch(
          `https://places.googleapis.com/v1/places:searchText`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': 'AIzaSyBP0l1p4SS65c9tAz_4jGNcw1_jX15nNwE', // Note: API Key should ideally be in env vars
              'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.id'
            },
            body: JSON.stringify({
              textQuery: newValue,
              regionCode: 'DE',
              maxResultCount: 5
            })
          }
        );

        if (!response.ok) {
          // Silent fail or console warn
          console.warn('Places API error');
          setPredictions([]);
          return;
        }

        const data = await response.json();

        if (data.places && data.places.length > 0) {
          const convertedPredictions: PlacePrediction[] = data.places.map((place: any, index: number) => ({
            description: place.formattedAddress || place.displayName?.text || newValue,
            place_id: place.id || `temp_${Date.now()}_${index}`,
            structured_formatting: {
              main_text: place.displayName?.text || place.formattedAddress || newValue,
              secondary_text: place.formattedAddress !== place.displayName?.text ? place.formattedAddress : ''
            }
          }));

          setPredictions(convertedPredictions);
        } else {
          setPredictions([]);
        }
      } catch (error) {
        console.warn('Places API failed:', error);
        setPredictions([]);
      }
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

    const prediction = predictions.find(p => p.place_id === key);
    if (!prediction) return;

    const displayText = prediction.description;
    setInputValue(displayText);

    // Geocode to get coordinates
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(displayText)}&key=AIzaSyBP0l1p4SS65c9tAz_4jGNcw1_jX15nNwE`
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
      placeholder={placeholder}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onSelectionChange={handleSelectionChange}
      items={predictions}
      leadingIcon={icon}
      errorMessage={error}
    >
      {(item: PlacePrediction) => (
        <ListBoxItem key={item.place_id} id={item.place_id} textValue={item.description}>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{item.structured_formatting?.main_text || item.description}</span>
            {item.structured_formatting?.secondary_text && (
              <span className="text-xs text-[var(--color-on-surface-variant)]">{item.structured_formatting.secondary_text}</span>
            )}
          </div>
        </ListBoxItem>
      )}
    </ComboBox>
  );
}