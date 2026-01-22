import * as React from "react";
import { experimental } from "@freenow/wave";

const { Divider } = experimental;

interface SeparatorProps extends React.ComponentProps<typeof Divider> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  className?: string; // Add className explicitly
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <Divider
      // @ts-ignore - Divider type doesn't include vertical but implementation handles it
      vertical={orientation === "vertical"}
      // @ts-ignore - Divider type doesn't include className but styled-components handles it
      className={className}
      {...props}
    />
  );
}

export { Separator };
