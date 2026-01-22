import * as React from "react";
import { experimental } from "@freenow/wave";
import { cn } from "./utils";

const { Button: WaveButton } = experimental;

interface ButtonProps extends React.ComponentProps<typeof WaveButton> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size, asChild, ...props }, ref) => {
    // Map Shadcn variants to Wave emphasis
    let emphasis: "primary" | "secondary" | "textButton" = "primary";

    if (variant === "secondary" || variant === "outline") {
      emphasis = "secondary";
    } else if (variant === "ghost" || variant === "link") {
      emphasis = "textButton";
    }

    // Note: Wave experimental Button doesn't have a direct 'danger' emphasis yet.
    // We'll use primary for destructive for now or custom styling if needed.

    return (
      <WaveButton
        // @ts-ignore - ref might be handled differently by react-aria
        ref={ref}
        emphasis={emphasis}
        className={cn(className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
