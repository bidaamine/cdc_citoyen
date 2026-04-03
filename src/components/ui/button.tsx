import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] px-5 py-2.5 text-white hover:bg-[var(--primary-strong)]",
        secondary: "bg-white px-5 py-2.5 text-[var(--foreground)] ring-1 ring-black/10 hover:bg-[var(--muted)]",
        outline: "border border-[var(--border)] px-5 py-2.5 text-[var(--foreground)] hover:bg-[var(--muted)]",
        ghost: "px-3 py-2 text-[var(--muted-foreground)] hover:bg-white/70 hover:text-[var(--foreground)]",
        destructive: "bg-[var(--destructive)] px-5 py-2.5 text-white hover:opacity-90",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
