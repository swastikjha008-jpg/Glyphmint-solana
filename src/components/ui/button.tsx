import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[13px] font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080909] disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-emerald-400 text-emerald-950 shadow-[0_0_0_1px_rgba(52,211,153,0.5),0_8px_24px_-8px_rgba(16,185,129,0.6)] hover:bg-emerald-300 hover:-translate-y-px active:translate-y-0",
        wallet:
          "bg-emerald-100 text-emerald-950 hover:bg-white hover:-translate-y-px",
        outline:
          "border border-white/15 bg-white/[0.03] text-zinc-200 hover:bg-white/10 hover:text-white",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-10 px-3 sm:px-4",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = "Button"
