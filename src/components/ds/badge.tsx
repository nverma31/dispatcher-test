import * as React from "react";
import styled from "styled-components";
import { experimental } from "@freenow/wave";

const { getSemanticValue } = experimental;

interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "positive";
}

const StyledBadge = styled.span<{ $variant: BadgeProps["variant"] }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-label, 4px);
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
  white-space: nowrap;
  
  ${({ $variant }) => {
    switch ($variant) {
      case "secondary":
        return `
          background-color: ${getSemanticValue("surface-variant")};
          color: ${getSemanticValue("on-surface-variant")};
        `;
      case "destructive":
        return `
          background-color: ${getSemanticValue("negative-container")};
          color: ${getSemanticValue("on-negative-container")};
        `;
      case "positive":
        return `
          background-color: ${getSemanticValue("positive-container")};
          color: ${getSemanticValue("on-positive-container")};
        `;
      case "outline":
        return `
          border: 1px solid ${getSemanticValue("divider")};
          color: ${getSemanticValue("on-surface")};
        `;
      case "default":
      default:
        return `
          background-color: ${getSemanticValue("accent")};
          color: ${getSemanticValue("on-accent")};
        `;
    }
  }}
`;

function Badge({ variant = "default", ...props }: BadgeProps) {
  return <StyledBadge $variant={variant} {...props} />;
}

export { Badge };
