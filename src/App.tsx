import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { LogOut } from "lucide-react"
import { AsciiBackground } from "@/components/ascii-background"
import { GlyphLogo } from "@/components/glyph-logo"
import { TokenLaunchpad } from "@/components/token-launchpad"
import { Button } from "@/components/ui/button"

function WalletButton() {
  const { publicKey, connected, connecting, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const addr = publicKey?.toBase58()
  return connected && addr ? (
    <Button variant="wallet" size="sm" onClick={() => void disconnect()} title="Disconnect wallet">
      <span className="font-mono">{addr.slice(0, 4)}…{addr.slice(-4)}</span>
      <LogOut />
    </Button>
  ) : (
    <Button variant="wallet" size="sm" onClick={() => setVisible(true)} disabled={connecting}>
      {connecting ? "Connecting…" : "Connect wallet"}
    </Button>
  )
}

export default function App() {
  return (
    <main id="top" className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[#080909] text-white">
      <AsciiBackground />

      <header className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-3 sm:px-8">
        <GlyphLogo />
        <div className="flex items-center gap-2.5 sm:gap-4">
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] sm:gap-2 sm:text-[11px] text-zinc-200">
            <i className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            Devnet
          </span>
          <WalletButton />
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 pb-4 pt-0 sm:px-8">
        <div className="text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.7)]">
          <p className="font-mono text-[10px] tracking-[0.35em] text-zinc-300 sm:text-[11px]">
            CREATE ON SOLANA <span className="mx-1 text-emerald-400">✦</span> DEVNET
          </p>
          <h1 className="mt-2 text-[clamp(34px,5.2vw,58px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
            Mint something <span className="text-emerald-400">memorable.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-300">
            Create your own SPL token with a clean, deliberate launch experience.
          </p>
        </div>
        <TokenLaunchpad />
      </div>

      <footer className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-1 border-t border-white/10 px-5 py-2.5 font-mono text-[10px] tracking-wider text-zinc-400 sm:flex-row sm:px-8">
        <span>GLYPHMINT / SOLANA DEVNET</span>
        <span>Review every wallet request before approving.</span>
      </footer>
    </main>
  )
}
