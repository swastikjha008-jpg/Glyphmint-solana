import { useEffect, useRef } from "react"
import { AsciiArt } from "@/components/ui/all-about-the-benjamins"

/**
 * Full-page decorative background using the exact 21st.dev ASCII video.
 * The video keeps its original colours – the overlays below are neutral black only.
 */
export function AsciiBackground() {
  const ref = useRef<HTMLDivElement>(null)

  // Respect reduced motion: pause the video (the poster frame stays visible).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => {
      const video = ref.current?.querySelector("video")
      if (!video) return
      if (mq.matches) video.pause()
      else void video.play().catch(() => {})
    }
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#080909]"
    >
      <AsciiArt className="h-full w-full object-cover object-center" />
      {/* Neutral dimming so the UI stays legible */}
      <div className="absolute inset-0 bg-black/35" />
      {/* Neutral vignette: keeps the artwork bright in the middle, dark at the edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,transparent_0%,transparent_35%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  )
}
