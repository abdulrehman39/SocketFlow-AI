import { HTMLAttributes, forwardRef } from "react";
import { cn } from "./Button";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("glass-card p-6", className)} {...props} />
  )
);
Card.displayName = "Card";

export { Card };
