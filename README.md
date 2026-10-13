# GlyphMint

Solana SPL token launchpad (Devnet). Vite + React + TypeScript + Tailwind CSS v4 + shadcn-style `@/components/ui`.

## Run
```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # type-check + production build -> dist/
pnpm preview
```
Deploy: Vercel/Netlify/Cloudflare Pages. Build command `pnpm build`, output `dist`. Optional env: `VITE_SOLANA_RPC_URL`.

## Token creation
One atomic Devnet transaction: create mint, then (if supply > 0) create your associated token account and mint the supply, then optionally revoke mint authority.
- Mint authority: your wallet (revoked if "Fixed supply" is checked). Freeze authority: none.
- Name/symbol/image are preview only; no on-chain metadata is published.
