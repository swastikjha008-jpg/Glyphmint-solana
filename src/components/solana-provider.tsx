import { useMemo, type ReactNode } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"

/** Devnet only. Override the RPC with VITE_SOLANA_RPC_URL if the public endpoint is rate limited. */
export const DEVNET_RPC: string =
  (import.meta.env.VITE_SOLANA_RPC_URL as string | undefined) || clusterApiUrl("devnet")

export function SolanaProvider({ children }: { children: ReactNode }) {
  // Wallet Standard wallets (Phantom, Solflare, Backpack…) are detected automatically.
  const wallets = useMemo(() => [], [])
  return (
    <ConnectionProvider endpoint={DEVNET_RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
