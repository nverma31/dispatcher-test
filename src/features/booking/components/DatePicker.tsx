import React from 'react';
import { experimental } from '@freenow/wave';

const { DatePicker: WaveDatePicker } = experimental;

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function DatePicker({ label, value, onChange }: DatePickerProps) {
  // Convert string value (YYYY-MM-DD or 'Today') to Date object
  const getDateObject = (dateStr: string): Date | null => {
    if (!dateStr) return null;

    // Handle 'Today'
    if (dateStr === 'Today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    }

    // Handle "DD.MM.YYYY" format which might come from other parts of the app
    if (dateStr.includes('.')) {
      const parts = dateStr.split('.');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return isNaN(date.getTime()) ? null : date;
      }
    }

    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      onChange('');
      return;
    }

    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
  };

  return (
    <WaveDatePicker
      label={label}
      value={getDateObject(value)}
      onChange={handleDateChange}
      mode="single"
      placeholder={label} // Use label as placeholder if needed
    />
  );
}