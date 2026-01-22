import React from 'react';
import { experimental } from '@freenow/wave';

const { TextField: WaveTextField } = experimental;

interface TextFieldProps {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  className?: string;
  errorMessage?: string;
  description?: string;
  maxLength?: number;
  type?: 'text' | 'tel' | 'email' | 'number' | 'url';
  disabled?: boolean;
  required?: boolean;
  slotLeft?: React.ReactNode;
  slotRight?: React.ReactNode;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    const {
      label,
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      placeholder,
      className,
      errorMessage,
      description,
      maxLength,
      type,
      disabled,
      required,
      slotLeft,
      slotRight,
    } = props;

    return (
      <WaveTextField
        // @ts-ignore - ref might be handled differently by react-aria
        ref={ref}
        label={label}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        errorMessage={errorMessage}
        description={description}
        maxLength={maxLength}
        type={type}
        isDisabled={disabled}
        isRequired={required}
        leadingIcon={slotLeft}
        actionIcon={slotRight}
        className={className}
      />
    );
  }
);

TextField.displayName = 'TextField';
