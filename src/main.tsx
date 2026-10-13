import "./polyfills"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@solana/wallet-adapter-react-ui/styles.css"
import "./index.css"
import App from "./App"
import { SolanaProvider } from "@/components/solana-provider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SolanaProvider>
      <App />
    </SolanaProvider>
  </StrictMode>
)
