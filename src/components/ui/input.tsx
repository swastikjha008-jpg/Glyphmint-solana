import * as React from "react"
import { cn } from "@/lib/utils"

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3.5 font-mono text-[13px] text-white placeholder:text-zinc-500 outline-none transition-colors",
        "hover:border-white/20 focus-visible:border-emerald-400/70 focus-visible:ring-2 focus-visible:ring-emerald-400/25",
        "aria-[invalid=true]:border-red-400/70 disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
)
Input.displayName = "Input"
