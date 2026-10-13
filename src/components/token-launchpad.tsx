import { useMemo, useState, type FormEvent } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Loader2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlyphMark } from "@/components/glyph-logo"
import { cn } from "@/lib/utils"
import {
  EMPTY_FORM,
  createToken,
  explorerAddress,
  explorerTx,
  formatSupply,
  friendlyError,
  validate,
  type CreateResult,
  type FieldErrors,
  type Phase,
  type TokenForm,
} from "@/lib/token"

const PHASE_LABEL: Record<Phase, string> = {
  idle: "",
  preparing: "Preparing transaction…",
  approving: "Approve in your wallet…",
  confirming: "Confirming on Devnet…",
  done: "Done",
}
const STEPS: Phase[] = ["preparing", "approving", "confirming"]

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-[11px] text-red-300">
      {message}
    </p>
  )
}

export function TokenLaunchpad() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { setVisible } = useWalletModal()

  const [form, setForm] = useState<TokenForm>(EMPTY_FORM)
  const [touched, setTouched] = useState(false)
  const [phase, setPhase] = useState<Phase>("idle")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CreateResult | null>(null)
  const [imgFailed, setImgFailed] = useState<string | null>(null)

  const errors: FieldErrors = useMemo(() => validate(form), [form])
  const busy = phase !== "idle" && phase !== "done"
  const showErr = (k: keyof FieldErrors) => (touched ? errors[k] : undefined)

  const set =
    <K extends keyof TokenForm>(key: K) =>
    (value: TokenForm[K]) => {
      setForm((f) => ({ ...f, [key]: value }))
      if (result) setResult(null)
      if (error) setError(null)
    }

  const reset = () => {
    setForm(EMPTY_FORM)
    setTouched(false)
    setPhase("idle")
    setError(null)
    setResult(null)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!wallet.connected || !wallet.publicKey) {
      setVisible(true)
      return
    }
    setTouched(true)
    if (Object.keys(errors).length) return
    setError(null)
    setResult(null)
    try {
      const res = await createToken(
        connection,
        {
          publicKey: wallet.publicKey,
          sendTransaction: wallet.sendTransaction,
          signTransaction: wallet.signTransaction,
        },
        form,
        setPhase
      )
      setResult(res)
    } catch (err) {
      setError(friendlyError(err))
      setPhase("idle")
    }
  }

  const image = form.image.trim()
  const showImage = image && !errors.image && imgFailed !== image
  const buttonLabel = !wallet.connected
    ? "Connect wallet to create"
    : busy
      ? PHASE_LABEL[phase]
      : "Create token"

  return (
    <section
      aria-label="Token launchpad"
      className="w-full max-w-[980px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d0c]/80 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
    >
      <div className="grid lg:grid-cols-[1.45fr_0.85fr]">
        {/* ── Form ── */}
        <form onSubmit={onSubmit} noValidate className="p-5 sm:px-7 sm:py-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-zinc-400">01 / TOKEN SETUP</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">Token configuration</h2>
            </div>
            <span className="font-mono text-[10px] text-zinc-500">* Required</span>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Token name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="e.g. Solana Nova"
                maxLength={32}
                autoComplete="off"
                aria-invalid={!!showErr("name")}
                aria-describedby="name-err"
                disabled={busy}
              />
              <FieldError id="name-err" message={showErr("name")} />
            </div>

            <div className="grid grid-cols-[1fr_7.5rem] gap-3.5 sm:grid-cols-[2fr_1fr]">
              <div>
                <Label htmlFor="symbol">Token symbol *</Label>
                <Input
                  id="symbol"
                  value={form.symbol}
                  onChange={(e) =>
                    set("symbol")(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                  }
                  placeholder="NOVA"
                  maxLength={10}
                  autoComplete="off"
                  aria-invalid={!!showErr("symbol")}
                  aria-describedby="symbol-err"
                  disabled={busy}
                />
                <FieldError id="symbol-err" message={showErr("symbol")} />
              </div>
              <div>
                <Label htmlFor="decimals">Decimals *</Label>
                <select
                  id="decimals"
                  value={form.decimals}
                  onChange={(e) => set("decimals")(e.target.value)}
                  disabled={busy}
                  className="h-10 w-full cursor-pointer rounded-lg border border-white/10 bg-black/40 px-3 font-mono text-[13px] text-white outline-none transition-colors hover:border-white/20 focus-visible:border-emerald-400/70 focus-visible:ring-2 focus-visible:ring-emerald-400/25"
                >
                  {[9, 8, 6, 4, 2, 0].map((d) => (
                    <option key={d} value={d} className="bg-zinc-900">
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="supply">Initial supply *</Label>
              <Input
                id="supply"
                value={form.supply}
                onChange={(e) => set("supply")(e.target.value.replace(/[^\d.,]/g, ""))}
                inputMode="decimal"
                placeholder="1000000"
                autoComplete="off"
                aria-invalid={!!showErr("supply")}
                aria-describedby="supply-err"
                disabled={busy}
              />
              <FieldError id="supply-err" message={showErr("supply")} />
            </div>

            <div>
              <Label htmlFor="image">
                Token image URL <span className="ml-1 font-mono text-[10px] font-normal text-zinc-500">optional</span>
              </Label>
              <Input
                id="image"
                type="url"
                value={form.image}
                onChange={(e) => set("image")(e.target.value)}
                placeholder="https://example.com/token.png"
                autoComplete="off"
                aria-invalid={!!showErr("image")}
                aria-describedby="image-err"
                disabled={busy}
              />
              <FieldError id="image-err" message={showErr("image")} />
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-[12px] leading-snug text-zinc-300 transition-colors hover:border-white/20">
              <input
                type="checkbox"
                checked={form.fixedSupply}
                onChange={(e) => set("fixedSupply")(e.target.checked)}
                disabled={busy}
                className="mt-0.5 size-4 shrink-0 cursor-pointer accent-emerald-400"
              />
              <span>
                <span className="font-semibold text-white">Fixed supply</span> — revoke mint authority
                after minting so no more tokens can ever be created.
              </span>
            </label>
          </div>

          <div className="mt-4 flex gap-2.5">
            <Button variant="outline" onClick={reset} disabled={busy} className="px-4">
              <RotateCcw /> Reset
            </Button>
            <Button type="submit" disabled={busy} className="flex-1" aria-live="polite">
              {busy && <Loader2 className="animate-spin" />}
              {buttonLabel}
              {!busy && <ArrowRight />}
            </Button>
          </div>

          {busy && (
            <ol className="mt-3 flex gap-1.5" aria-label="Transaction progress">
              {STEPS.map((s) => (
                <li
                  key={s}
                  className={cn(
                    "h-1 flex-1 rounded-full bg-white/10 transition-colors",
                    STEPS.indexOf(s) <= STEPS.indexOf(phase) && "bg-emerald-400"
                  )}
                />
              ))}
            </ol>
          )}

          {error && (
            <div role="alert" className="mt-3 flex gap-2 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-[12px] text-red-200">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <div>
                {error}
                {/Devnet SOL/.test(error) && (
                  <>
                    {" "}
                    <a href="https://faucet.solana.com" target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
                      Open faucet
                    </a>
                  </>
                )}
              </div>
            </div>
          )}

          {result && (
            <div role="status" className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3 text-[12px] text-emerald-100">
              <p className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="size-4" /> Token created on Devnet
              </p>
              <p className="mt-1.5 break-all font-mono text-[11px] text-emerald-200/80">{result.mint}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-semibold">
                <a href={explorerAddress(result.mint)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2">
                  View mint <ExternalLink className="size-3" />
                </a>
                <a href={explorerTx(result.signature)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2">
                  View transaction <ExternalLink className="size-3" />
                </a>
                {result.tokenAccount && (
                  <a href={explorerAddress(result.tokenAccount)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2">
                    Token account <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-zinc-400">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
            <span>
              Your wallet asks you to approve the transaction. Never share your recovery phrase.{" "}
              Mint authority stays with your wallet{form.fixedSupply ? " until it is revoked in the same transaction" : " unless you choose Fixed supply"}; freeze authority is not set.
            </span>
          </p>
        </form>

        {/* ── Live preview ── */}
        <aside className="border-t border-white/10 bg-black/25 p-5 sm:px-7 sm:py-6 lg:border-l lg:border-t-0">
          <p className="font-mono text-[10px] tracking-[0.14em] text-zinc-400">LIVE PREVIEW</p>
          <div className="mt-4 flex size-[88px] items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/20 to-emerald-950/40">
            {showImage ? (
              <img
                src={image}
                alt={`${form.name || "Token"} logo preview`}
                onError={() => setImgFailed(image)}
                className="size-full object-cover"
              />
            ) : (
              <GlyphMark size={52} />
            )}
          </div>
          <h3 className="mt-4 break-words text-2xl font-bold leading-tight tracking-tight">
            {form.name.trim() || "Your token"}
          </h3>
          <p className="mt-1 font-mono text-xs font-medium tracking-wider text-emerald-400">
            {form.symbol || "SYMBOL"}
          </p>

          <dl className="mt-5 space-y-3.5 border-t border-white/10 pt-4">
            <div>
              <dt className="font-mono text-[10px] tracking-[0.12em] text-zinc-500">INITIAL SUPPLY</dt>
              <dd className="mt-1 break-all font-mono text-base font-medium">{formatSupply(form.supply)}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-[0.12em] text-zinc-500">DECIMALS</dt>
              <dd className="mt-1 font-mono text-base font-medium">{form.decimals}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-[0.12em] text-zinc-500">SUPPLY TYPE</dt>
              <dd className="mt-1 font-mono text-base font-medium">{form.fixedSupply ? "Fixed" : "Mintable"}</dd>
            </div>
          </dl>

          <p className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-zinc-400">
            Name, symbol and image are preview details only. On-chain metadata is not published.
          </p>
        </aside>
      </div>
    </section>
  )
}
