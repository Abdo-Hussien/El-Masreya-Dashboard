"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/Utils"

const buttonVariants = cva(
  "flex items-center font-bold text-sm cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br border border-primary from-primary via-primary/85 to-primary/90 shadow-primary hover:bg-primary/70 text-primary-foreground"
        ,
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:ring-destructive/20 dark:hover:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-gradient-to-br border font-normal from-background to-accent text-muted-foreground shadow-xs hover:border-ring hover:ring-ring/5 hover:ring-[3px] hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        tonal:
          "bg-primary-foreground/60 text-primary hover:bg-primary-foreground/80",

        ghost:
          "hover:bg-muted text-gray-700 cursor-pointer hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-accent-foreground/60 font-normal underline-offset-4 hover:text-accent-foreground hover:bg-muted/40",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  componentVariants,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  } & { componentVariants?: VariantProps<typeof buttonVariants> }) {
  const Comp = asChild ? Slot : "button"
  const variants = componentVariants ? componentVariants : buttonVariants({ variant, size })

  return (
    <Comp
      data-slot="button"
      className={cn(variants, className)}
      {...props}
    />
  )
}

export default Button

