import { Buffer } from "buffer"

// @solana/spl-token and web3.js expect a global Buffer in the browser.
if (!(globalThis as { Buffer?: unknown }).Buffer) {
  ;(globalThis as { Buffer?: unknown }).Buffer = Buffer
}
