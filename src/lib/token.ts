import {
  AuthorityType,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token"
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  type Connection,
} from "@solana/web3.js"

export const MAX_U64 = 18_446_744_073_709_551_615n

export interface TokenForm {
  name: string
  symbol: string
  decimals: string
  supply: string
  image: string
  fixedSupply: boolean
}

export type FieldErrors = Partial<Record<"name" | "symbol" | "supply" | "image", string>>

export const EMPTY_FORM: TokenForm = {
  name: "",
  symbol: "",
  decimals: "9",
  supply: "1000000",
  image: "",
  fixedSupply: false,
}

/**
 * Converts a human-readable supply ("1000.5") to base units without floating point.
 * Returns null when the string is not a valid non-negative decimal within the decimals limit.
 */
export function toBaseUnits(supply: string, decimals: number): bigint | null {
  const clean = supply.replace(/,/g, "").trim()
  const m = /^(\d+)(?:\.(\d+))?$/.exec(clean)
  if (!m) return null
  const [, whole, frac = ""] = m
  if (frac.length > decimals) return null
  const padded = frac.padEnd(decimals, "0")
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(padded || "0")
}

export function formatSupply(supply: string): string {
  const clean = supply.replace(/,/g, "").trim()
  const m = /^(\d*)(?:\.(\d*))?$/.exec(clean)
  if (!m || (!m[1] && !m[2])) return "0"
  const whole = (m[1] || "0").replace(/^0+(?=\d)/, "")
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return m[2] ? `${grouped}.${m[2]}` : grouped
}

export function validate(form: TokenForm): FieldErrors {
  const errors: FieldErrors = {}
  const decimals = Number(form.decimals)
  if (!form.name.trim()) errors.name = "Enter a token name."
  else if (form.name.trim().length > 32) errors.name = "Keep the name to 32 characters."
  if (!form.symbol.trim()) errors.symbol = "Enter a symbol."
  else if (!/^[A-Z0-9]{1,10}$/.test(form.symbol)) errors.symbol = "Use 1–10 letters or numbers."

  const base = toBaseUnits(form.supply, decimals)
  if (!form.supply.trim()) errors.supply = "Enter an initial supply (0 to skip minting)."
  else if (base === null)
    errors.supply = `Use a positive number with at most ${decimals} decimal place${decimals === 1 ? "" : "s"}.`
  else if (base > MAX_U64) errors.supply = "Supply exceeds the on-chain maximum (2⁶⁴ − 1 base units)."

  if (form.image.trim()) {
    try {
      const u = new URL(form.image.trim())
      if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error()
    } catch {
      errors.image = "Enter a valid http(s) image URL."
    }
  }
  return errors
}

export const explorerTx = (sig: string) => `https://explorer.solana.com/tx/${sig}?cluster=devnet`
export const explorerAddress = (addr: string) =>
  `https://explorer.solana.com/address/${addr}?cluster=devnet`

export type Phase = "idle" | "preparing" | "approving" | "confirming" | "done"

export interface CreateResult {
  mint: string
  signature: string
  tokenAccount: string | null
  minted: boolean
  authorityRevoked: boolean
}

interface WalletLike {
  publicKey: PublicKey
  signTransaction?: (tx: Transaction) => Promise<Transaction>
  sendTransaction: (
    tx: Transaction,
    connection: Connection,
    options?: { signers?: Keypair[]; minContextSlot?: number }
  ) => Promise<string>
}

/**
 * Creates a new SPL mint on Devnet in ONE atomic transaction:
 *  1. allocate + initialize the mint (mint authority = connected wallet, freeze authority = none)
 *  2. if supply > 0: create the wallet's associated token account and mint the supply to it
 *  3. optionally revoke the mint authority so supply is permanently fixed
 */
export async function createToken(
  connection: Connection,
  wallet: WalletLike,
  form: TokenForm,
  onPhase: (p: Phase) => void
): Promise<CreateResult> {
  const decimals = Number(form.decimals)
  const amount = toBaseUnits(form.supply, decimals)
  if (amount === null || amount > MAX_U64) throw new Error("Invalid supply.")

  onPhase("preparing")
  const payer = wallet.publicKey
  const mint = Keypair.generate()
  const lamports = await getMinimumBalanceForRentExemptMint(connection)

  const tx = new Transaction()
  tx.add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMint2Instruction(mint.publicKey, decimals, payer, null, TOKEN_PROGRAM_ID)
  )

  let ata: PublicKey | null = null
  if (amount > 0n) {
    ata = getAssociatedTokenAddressSync(mint.publicKey, payer)
    tx.add(
      createAssociatedTokenAccountIdempotentInstruction(payer, ata, payer, mint.publicKey),
      createMintToInstruction(mint.publicKey, ata, payer, amount)
    )
  }
  if (form.fixedSupply) {
    tx.add(createSetAuthorityInstruction(mint.publicKey, payer, AuthorityType.MintTokens, null))
  }

  // A wallet extension can be configured with a different RPC endpoint than the
  // app. Sign with the wallet, then submit through *this* connection so the
  // blockhash, preflight, and confirmation all use the same Devnet RPC.
  // `processed` gives us the newest valid hash, leaving the largest signing window.
  const latest = await connection.getLatestBlockhashAndContext("processed")
  tx.feePayer = payer
  tx.recentBlockhash = latest.value.blockhash
  tx.lastValidBlockHeight = latest.value.lastValidBlockHeight

  onPhase("approving")
  let signature: string
  if (wallet.signTransaction) {
    tx.partialSign(mint)
    const signed = await wallet.signTransaction(tx)
    onPhase("confirming")
    signature = await connection.sendRawTransaction(signed.serialize(), {
      maxRetries: 3,
      minContextSlot: latest.context.slot,
      preflightCommitment: "processed",
    })
  } else {
    // Kept for wallets that only expose sendTransaction.
    signature = await wallet.sendTransaction(tx, connection, {
      signers: [mint],
      minContextSlot: latest.context.slot,
    })
    onPhase("confirming")
  }

  const res = await connection.confirmTransaction(
    {
      signature,
      blockhash: latest.value.blockhash,
      lastValidBlockHeight: latest.value.lastValidBlockHeight,
    },
    "confirmed"
  )
  if (res.value.err) throw new Error(`Transaction failed on-chain: ${JSON.stringify(res.value.err)}`)

  onPhase("done")
  return {
    mint: mint.publicKey.toBase58(),
    signature,
    tokenAccount: ata ? ata.toBase58() : null,
    minted: amount > 0n,
    authorityRevoked: form.fixedSupply,
  }
}

export function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e)
  if (/reject|denied|declined|cancel/i.test(msg)) return "Request cancelled in your wallet. Nothing was created."
  if (/insufficient|0x1\b|debit an account|no record of a prior credit/i.test(msg))
    return "Not enough Devnet SOL to pay rent and fees. Get free Devnet SOL from the faucet and try again."
  if (/blockhash|expired|block height/i.test(msg)) return "The transaction expired before it confirmed. Please try again."
  if (/429|rate limit|too many requests/i.test(msg))
    return "The public Devnet RPC is rate-limited. Wait a moment and retry."
  return msg.length > 200 ? `${msg.slice(0, 200)}…` : msg
}
