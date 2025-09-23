import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const automotiveButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-95",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Automotive-specific variants
        admin: 
          "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 active:scale-95 font-semibold",
        viewer: 
          "bg-automotive-dark text-white shadow-lg hover:bg-automotive-darker hover:scale-105 active:scale-95 border border-automotive-accent/20",
        danger: 
          "bg-crime-alert text-white shadow-lg shadow-crime-alert/25 hover:shadow-crime-alert/40 hover:scale-105 active:scale-95 font-semibold",
        success: 
          "bg-success text-white shadow-lg shadow-success/25 hover:shadow-success/40 hover:scale-105 active:scale-95",
        glow:
          "bg-primary text-primary-foreground shadow-lg animate-glow hover:scale-105 active:scale-95 font-semibold",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface AutomotiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof automotiveButtonVariants> {
  asChild?: boolean
}

const AutomotiveButton = React.forwardRef<HTMLButtonElement, AutomotiveButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(automotiveButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
AutomotiveButton.displayName = "AutomotiveButton"

export { AutomotiveButton, automotiveButtonVariants }