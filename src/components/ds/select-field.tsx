import React from 'react';
import { experimental } from '@freenow/wave';

const { Select: WaveSelect, ListBoxItem } = experimental;

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  slotLeft?: React.ReactNode;
  errorMessage?: string;
  description?: string;
}

export const SelectField = React.forwardRef<HTMLDivElement, SelectFieldProps>(
  (props, ref) => {
    const {
      label,
      value,
      options,
      onChange,
      placeholder,
      className,
      disabled,
      required,
      slotLeft,
      errorMessage,
      description,
    } = props;

    return (
      <WaveSelect
        // @ts-ignore - ref might be handled differently by react-aria
        ref={ref}
        label={label}
        selectedKey={value}
        onSelectionChange={(key) => onChange?.(key as string)}
        placeholder={placeholder}
        isDisabled={disabled}
        isRequired={required}
        leadingIcon={slotLeft}
        errorMessage={errorMessage}
        description={description}
        className={className}
      >
        {options.map((option) => (
          <ListBoxItem key={option.value} id={option.value}>
            {option.label}
          </ListBoxItem>
        ))}
      </WaveSelect>
    );
  }
);

SelectField.displayName = 'SelectField';
