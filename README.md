<div align="center">

# ◈ GlyphMint

### ✨ Mint something memorable.

**Your token. Your vision. Your Solana Devnet.**

A sleek, dark-themed launchpad for creating Solana SPL tokens. Configure your token, preview its details in real time, connect your wallet, and create your mint through a simple, guided interface.

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-Fast%20Builds-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

<p>
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana&logoColor=white" alt="Solana Devnet" />
  <img src="https://img.shields.io/badge/Package_Manager-pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
</p>

---

### 🟢 CREATE &nbsp; · &nbsp; ⚡ MINT &nbsp; · &nbsp; 🚀 EXPLORE

</div>

## 💎 About GlyphMint

**GlyphMint** brings a clean, intuitive experience to SPL token creation on Solana Devnet.

Designed with a monochrome ASCII-inspired background, emerald accents, and a live token preview, GlyphMint combines a distinctive visual identity with practical blockchain functionality.

> 🧪 Built for learning, experimenting, and exploring token creation on Solana **Devnet**.

## ✨ Features

| Feature | Description |
|---|---|
| 🪙 **SPL Token Creation** | Create token mint accounts on Solana Devnet. |
| 🔗 **Wallet Connection** | Connect a compatible Solana wallet and approve transactions. |
| ⚙️ **Custom Configuration** | Set token name, symbol, decimals, and initial supply. |
| 👁️ **Live Preview** | See your token details update as you configure them. |
| 🔒 **Fixed Supply Option** | Revoke mint authority after the initial supply is minted. |
| ❄️ **No Freeze Authority** | Created mints have no freeze authority configured. |
| 🎨 **Distinctive Interface** | Dark surfaces, emerald accents, and responsive layouts. |
| 📦 **Production Build** | Generate optimized static assets using Vite. |

## 🧰 Tech Stack

<div align="center">

| Category | Technology |
|---|---|
| ⚛️ Frontend | React, TypeScript |
| ⚡ Build Tool | Vite |
| 🎨 Styling | Tailwind CSS v4 |
| 🧩 UI Structure | shadcn-style components |
| ⛓️ Blockchain | Solana Web3.js, SPL Token |
| 👛 Wallet Integration | Solana Wallet Adapter |
| 📦 Package Manager | pnpm |

</div>

## 🚀 Getting Started

### 📋 Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
- A compatible Solana wallet configured for Devnet
- Devnet SOL for transaction fees

### 1. 📥 Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/GlyphMint.git
cd GlyphMint
```

Replace the placeholder URL with your actual repository URL.

### 2. 📦 Install dependencies

```bash
pnpm install
```

### 3. ⚡ Start the development server

```bash
pnpm dev
```

Open **http://localhost:5173** in your browser.

### 4. 🏗️ Build for production

```bash
pnpm build
```

The production build is generated in the `dist/` directory.

To preview the production build locally:

```bash
pnpm preview
```

## 🔄 How It Works

<ol>
  <li><strong>Configure</strong> — Enter your token name, symbol, decimals, and initial supply.</li>
  <li><strong>Preview</strong> — Review your token details before creating the mint.</li>
  <li><strong>Connect</strong> — Connect your Solana wallet on Devnet.</li>
  <li><strong>Approve</strong> — Review and approve the transaction in your wallet.</li>
  <li><strong>Create</strong> — The transaction creates the mint and, when the initial supply is greater than zero, creates your associated token account and mints the requested supply.</li>
  <li><strong>Finalize</strong> — When Fixed supply is enabled, mint authority is revoked in the same transaction.</li>
</ol>

The creation flow uses a single atomic Devnet transaction. If it fails, the transaction's instructions do not partially succeed on-chain.

## 🔐 Token Authorities & Metadata

| Setting | Behavior |
|---|---|
| 🪙 Network | Solana Devnet |
| 🔑 Mint Authority | Your wallet, unless revoked using Fixed supply |
| ❄️ Freeze Authority | None |
| 📝 Token Name & Symbol | Preview only |
| 🖼️ Token Image | Preview only |
| 🌐 On-chain Metadata | Not currently published |

**Important:** Token name, symbol, and image are not published as on-chain metadata by the current implementation. Tokens created through GlyphMint are on Devnet, not Mainnet.

Always verify the network and review wallet transaction details before approving. Never share your private key or recovery phrase.

## ⚙️ Configuration

GlyphMint uses Solana Devnet by default. To use a custom Devnet RPC endpoint, create a `.env` file in the project root:

```env
VITE_SOLANA_RPC_URL=https://your-devnet-rpc-url
```

Replace the example URL with your provider's actual endpoint.

> ⚠️ **Security note:** Environment variables prefixed with `VITE_` are exposed to the browser. Never put private keys, seed phrases, or secret credentials in them.

## 🌐 Deployment

Deploy GlyphMint using a static hosting provider such as [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or [Cloudflare Pages](https://pages.cloudflare.com/).

| Setting | Value |
|---|---|
| 📦 Install Command | `pnpm install` |
| 🏗️ Build Command | `pnpm build` |
| 📁 Output Directory | `dist` |
| 🔧 Optional Environment Variable | `VITE_SOLANA_RPC_URL` |

Configure the environment variable in your hosting provider's project settings if you use a custom RPC endpoint.

---

<div align="center">

## ◈ GlyphMint

**Create boldly. Mint carefully. Explore Solana.**

<p>
  <img src="https://img.shields.io/badge/BUILT_ON-SOLANA-9945FF?style=for-the-badge&logo=solana&logoColor=white" alt="Built on Solana" />
  <img src="https://img.shields.io/badge/NETWORK-DEVNET-14F195?style=for-the-badge&logoColor=white" alt="Devnet" />
</p>

<sub>Made for experimenting with SPL tokens on Solana Devnet.</sub>

</div>
