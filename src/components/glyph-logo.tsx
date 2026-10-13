import { useId } from "react"
import { cn } from "@/lib/utils"

/** Geometric emerald hexagon with a stylised "G" / mint-slot mark. */
export function GlyphMark({ size = 34, className }: { size?: number; className?: string }) {
  const id = useId()
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      aria-hidden="true"
      className={cn("shrink-0 drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]", className)}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="1" y2="0">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#6ee7b7" />
        </linearGradient>
      </defs>
      <path d="M21 2.8 37.6 12v18L21 39.2 4.4 30V12L21 2.8Z" fill={`url(#${id})`} />
      <path
        d="M29.2 14.6A10 10 0 1 0 29.2 27.4V21.2H21.6"
        fill="none"
        stroke="#04130d"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="29.2" cy="21.2" r="1.7" fill="#04130d" />
    </svg>
  )
}

export function GlyphLogo({ className }: { className?: string }) {
  return (
    <a
      href="#top"
      aria-label="GlyphMint home"
      className={cn(
        "inline-flex items-center gap-2 rounded-md text-lg sm:gap-2.5 sm:text-[21px] font-extrabold tracking-tight text-white outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
        className
      )}
    >
      <GlyphMark />
      <span>
        Glyph<span className="text-emerald-400">Mint</span>
      </span>
    </a>
  )
}
