<div align="center">

# ◈ GlyphMint

### Mint something memorable.

A clean, dark-themed launchpad for creating **Solana SPL tokens on Devnet**. Configure a token, preview its details, connect your wallet, and create the mint in a guided flow.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-powered-646CFF?logo=vite&logoColor=white" />
  <img alt="Tailwind CSS v4" src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Solana Devnet" src="https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana&logoColor=white" />
</p>

</div>

---

## ✦ About

**GlyphMint** makes the SPL token creation flow approachable with a focused interface and live token preview. It is designed for experimentation and learning on Solana **Devnet**, not for launching assets directly on Mainnet.

## ✨ Features

- **SPL token mint creation** — create a new mint on Solana Devnet.
- **Wallet connection** — connect a compatible Solana wallet and approve transactions yourself.
- **Configurable token details** — set a name, symbol, decimal precision, and initial supply.
- **Live preview** — review token details as you fill in the form.
- **Optional fixed supply** — optionally revoke mint authority after minting the initial supply.
- **No freeze authority** — the created mint has no freeze authority.
- **Responsive interface** — a dark, minimal UI with emerald accents.
- **Build-ready** — Vite production output is generated in `dist/`.

## 🧰 Tech Stack

| Area | Technology |
|---|---|
| UI | React + TypeScript |
| Development server & bundler | Vite |
| Styling | Tailwind CSS v4 |
| UI organization | shadcn-style components and `@/components/ui` imports |
| Solana integration | Solana Web3.js, SPL Token, and wallet-adapter tooling |
| Package manager | pnpm |
| Blockchain network | Solana Devnet |

## 🚀 Getting Started

### Prerequisites

- Node.js compatible with the project's dependencies
- [pnpm](https://pnpm.io/installation)
- A compatible Solana wallet configured for **Devnet**
- Devnet SOL to pay transaction fees

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/GlyphMint.git
cd GlyphMint
```

Replace `YOUR_USERNAME/GlyphMint` with your actual repository URL.

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the development server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

### 4. Create a production build

```bash
pnpm build
```

The build script runs the project's type-check and production build. The generated site is written to `dist/`.

### 5. Preview the production build

```bash
pnpm preview
```

## ⚙️ Configuration

GlyphMint uses Solana Devnet by default. You can optionally provide a custom RPC endpoint with `VITE_SOLANA_RPC_URL`.

Create a `.env` file in the project root:

```env
VITE_SOLANA_RPC_URL=https://your-solana-devnet-rpc.example
```

Replace the example value with a valid Devnet RPC URL from your chosen provider.

**Security note:** Variables prefixed with `VITE_` are exposed to the client bundle. Never store private keys, seed phrases, or secret API credentials in them.

## 🔁 How Token Creation Works

1. Enter the token details and review the live preview.
2. Connect a Solana wallet configured for Devnet.
3. Submit the form and review the transaction in your wallet.
4. Approve the transaction to create the mint.
5. If the initial supply is greater than zero, the transaction also creates your associated token account and mints the requested supply.
6. If **Fixed supply** is enabled, mint authority is revoked as part of the flow.

The creation flow uses one atomic Devnet transaction. If it fails, its instructions do not partially succeed on-chain.

## 🔐 Authority & Metadata

- **Mint authority:** Initially assigned to your wallet. If Fixed supply is enabled, mint authority is revoked after the initial mint operation.
- **Freeze authority:** None is configured for the created mint.
- **Name, symbol, and image:** Used for the interface preview only.
- **On-chain metadata:** Token name, symbol, and image metadata are not currently published on-chain.
- **Network:** Tokens created through this setup are on Devnet, not Solana Mainnet.

Always inspect wallet prompts and verify the network before approving transactions. Never share your recovery phrase or private key.

## 🌐 Deployment

GlyphMint can be deployed to static hosting providers such as **Vercel, Netlify, or Cloudflare Pages**.

| Setting | Value |
|---|---|
| Install command | `pnpm install` |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Optional environment variable | `VITE_SOLANA_RPC_URL` |

Configure the optional environment variable in your hosting provider's project settings if you use a custom RPC endpoint.

## 🗂️ Project Structure

The frontend follows a Vite + React + TypeScript structure, with reusable UI components organized in a shadcn-style `components/ui` directory.

```text
GlyphMint/
├── public/              # Static public assets
├── src/                 # Application source
├── components/
│   └── ui/              # Reusable UI components
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

*Note: This is a conceptual structure. Keep the actual paths and aliases used in your repository if they differ.*

<div align="center">

**GlyphMint** · Built for learning and experimenting on Solana Devnet.

<sub>Review every wallet request before approving.</sub>

</div>
