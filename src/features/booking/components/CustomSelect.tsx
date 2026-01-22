import { SelectField, SelectOption } from '@/components/ds/select-field';

interface CustomSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

export function CustomSelect({ label, value, options, onChange, placeholder, icon }: CustomSelectProps) {
  return (
    <SelectField
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      slotLeft={icon}
    />
  );
}

export type { SelectOption };
