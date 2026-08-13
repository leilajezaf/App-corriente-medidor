import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-white hover:bg-opacity-90",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-slate-300 bg-transparent hover:bg-slate-100 text-text-main",
        secondary: "bg-brand-secondary text-white hover:bg-opacity-80",
        ghost: "hover:bg-slate-100 text-text-main",
        link: "text-brand-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={twMerge(clsx(buttonVariants({ variant, size, className })))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"