import { experimental } from "@freenow/wave";
import { format, parse, isValid } from "date-fns";
import { useState, useEffect } from "react";

const { DatePicker } = experimental;

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function DateInput({ label, value, onChange }: DateInputProps) {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    // Parse input string "DD/MM/YYYY" to Date
    if (value) {
      if (value === "Today") {
        setDate(new Date());
        return;
      }
      const parsed = parse(value, 'dd/MM/yyyy', new Date());
      if (isValid(parsed)) {
        setDate(parsed);
      } else {
        setDate(null);
      }
    } else {
      setDate(null);
    }
  }, [value]);

  const handleDateChange = (newDate: Date | null | undefined) => {
    // DatePicker might return undefined
    const validDate = newDate ?? null;
    setDate(validDate);
    if (validDate && isValid(validDate)) {
      onChange(format(validDate, 'dd/MM/yyyy'));
    } else {
      onChange('');
    }
  };

  return (
    <DatePicker
      label={label}
      value={date}
      onChange={(d) => handleDateChange(d)}
      mode="single"
      displayFormat="dd/MM/yyyy"
      placeholder="DD/MM/YYYY"
    />
  );
}