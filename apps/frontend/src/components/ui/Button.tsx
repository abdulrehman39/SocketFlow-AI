import { type ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "vip-button",
          {
            "vip-button-primary": variant === "primary",
            "vip-button-secondary": variant === "secondary",
            "bg-transparent hover:bg-surface-hover text-muted hover:text-foreground": variant === "ghost",
            "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50": variant === "danger",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
