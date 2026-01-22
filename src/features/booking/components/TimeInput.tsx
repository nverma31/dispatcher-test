import { experimental } from "@freenow/wave";
import { Time, parseTime } from "@internationalized/date";
import { useState, useEffect } from "react";

const { TimeField } = experimental;

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function TimeInput({ label, value, onChange }: TimeInputProps) {
  const [time, setTime] = useState<Time | null>(null);

  useEffect(() => {
    // Parse "HH:MM" string to Time object
    if (value) {
      if (value === "Now") {
        const now = new Date();
        setTime(new Time(now.getHours(), now.getMinutes()));
        return;
      }
      try {
        const parsed = parseTime(value);
        setTime(parsed);
      } catch (e) {
        // Invalid time format
        setTime(null);
      }
    } else {
      setTime(null);
    }
  }, [value]);

  const handleTimeChange = (newTime: Time | null) => {
    setTime(newTime);
    if (newTime) {
      // Format back to HH:MM
      const hour = newTime.hour.toString().padStart(2, '0');
      const minute = newTime.minute.toString().padStart(2, '0');
      onChange(`${hour}:${minute}`);
    } else {
      onChange('');
    }
  };

  return (
    <TimeField
      label={label}
      value={time}
      onChange={handleTimeChange}
    />
  );
}