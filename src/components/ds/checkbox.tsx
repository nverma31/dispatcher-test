import * as React from "react";
import { experimental } from "@freenow/wave";
import { cn } from "./utils";

const { Checkbox: WaveCheckbox } = experimental;

interface CheckboxProps extends React.ComponentProps<typeof WaveCheckbox> {
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
}

const Checkbox = ({
  className,
  checked,
  onCheckedChange,
  ...props
}: CheckboxProps) => {
  return (
    <WaveCheckbox
      isSelected={checked === true}
      isIndeterminate={checked === "indeterminate"}
      onChange={(isSelected) => onCheckedChange?.(isSelected)}
      className={cn(className)}
      {...props}
    />
  );
};

export { Checkbox };
