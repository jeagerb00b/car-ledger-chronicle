import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const automotiveCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow transition-all duration-200",
  {
    variants: {
      variant: {
        default: "shadow-sm hover:shadow-md",
        elevated: "shadow-md hover:shadow-lg hover:scale-[1.02]",
        interactive: "shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer border-border/50 hover:border-primary/50",
        danger: "border-crime-alert/30 shadow-crime-alert/10 hover:shadow-crime-alert/20",
        success: "border-success/30 shadow-success/10 hover:shadow-success/20",
        glow: "shadow-lg shadow-primary/20 border-primary/20 animate-glow",
        automotive: "bg-gradient-to-br from-card to-muted/30 border-automotive-accent/20 shadow-lg hover:shadow-xl hover:scale-[1.02]",
      },
      padding: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        none: "p-0",
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface AutomotiveCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof automotiveCardVariants> {}

const AutomotiveCard = React.forwardRef<HTMLDivElement, AutomotiveCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(automotiveCardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
AutomotiveCard.displayName = "AutomotiveCard"

const AutomotiveCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
AutomotiveCardHeader.displayName = "AutomotiveCardHeader"

const AutomotiveCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
AutomotiveCardTitle.displayName = "AutomotiveCardTitle"

const AutomotiveCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AutomotiveCardDescription.displayName = "AutomotiveCardDescription"

const AutomotiveCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
AutomotiveCardContent.displayName = "AutomotiveCardContent"

const AutomotiveCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
AutomotiveCardFooter.displayName = "AutomotiveCardFooter"

export {
  AutomotiveCard,
  AutomotiveCardHeader,
  AutomotiveCardFooter,
  AutomotiveCardTitle,
  AutomotiveCardDescription,
  AutomotiveCardContent,
}