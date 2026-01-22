import * as React from "react";
import { experimental } from "@freenow/wave";
import { cn } from "./utils";

const { Input: WaveInput } = experimental;

function Input({ className, type, ...props }: React.ComponentProps<typeof WaveInput>) {
  return (
    <WaveInput
      type={type}
      className={cn(className)}
      {...props}
    />
  );
}

export { Input };
