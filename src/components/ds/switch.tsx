import * as React from "react";
import { Toggle } from "@freenow/wave";
import { cn } from "./utils";

interface SwitchProps extends Omit<React.ComponentProps<typeof Toggle>, 'onToggle' | 'toggled'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <Toggle
      // @ts-ignore
      ref={ref}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={cn(className)}
      {...props}
    />
  )
);
Switch.displayName = "Switch";

export { Switch };
