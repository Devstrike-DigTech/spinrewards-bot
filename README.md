# Spin Rewards — Telegram Bot

The Telegram Bot for the Spin Rewards platform. Built with Telegraf and TypeScript.

---

## What This Service Does

The bot is the **entry point** into the platform. It handles:

- Welcoming users and launching the Mini App
- Responding to commands (`/start`, `/balance`, `/spin`, `/invite`, `/help`)
- Reply keyboard navigation (Wallet, Invite, Help buttons)
- Sending proactive notifications to users (deposit confirmed, withdrawal processed, KYC approved, etc.)
- Parsing referral codes from deep links (`/start ref_CODE`)

The bot does **not** contain any game logic, wallet calculations, or financial operations. All of that lives in the backend.

---

## Stack

| Component | Technology |
|---|---|
| Language | TypeScript (strict mode) |
| Bot Framework | Telegraf v4 |
| HTTP Client | Axios |
| Notification Server | Express |
| Runtime | Node.js 20 |
| Build | tsc |

---

## Quick Start

### Requirements

- Node.js 20+
- A Telegram Bot Token from [@BotFather](https://t.me/BotFather)
- The backend API running (locally or on Railway)

### 1. Install dependencies

```bash
cd spinrewards-bot
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and set:

| Variable | Where to get it |
|---|---|
| `BOT_TOKEN` | [@BotFather](https://t.me/BotFather) → `/newbot` |
| `MINI_APP_URL` | Your deployed Mini App URL (or `http://localhost:5173` for dev) |
| `API_BASE_URL` | Your backend URL + `/api/v1` |

### 3. Run in development

```bash
npm run dev
```

The bot starts in **long polling** mode — no webhook or public URL needed. Open Telegram, find your bot, and send `/start`.

### 4. Build for production

```bash
npm run build
npm start
```

---

## Project Structure

```
spinrewards-bot/
├── src/
│   ├── index.ts                  # Bot init, command registration, launch logic
│   ├── config.ts                 # Typed env var loader with validation
│   ├── api/
│   │   ├── client.ts             # Axios instances, JWT store, auto token refresh
│   │   └── backend.ts            # Typed API calls (auth, wallet, referral)
│   ├── commands/
│   │   ├── start.ts              # /start — welcome message + referral handling
│   │   ├── balance.ts            # /balance — fetch and display wallet
│   │   ├── spin.ts               # /spin — prompt to open Mini App
│   │   ├── invite.ts             # /invite — referral link and stats
│   │   └── help.ts               # /help — usage instructions
│   ├── handlers/
│   │   └── buttons.ts            # Handles reply keyboard text button presses
│   ├── keyboards/
│   │   └── main.ts               # Main menu keyboard and inline buttons
│   ├── notifications/
│   │   ├── sender.ts             # All notification message templates
│   │   └── server.ts             # Internal Express server (backend → bot)
│   └── utils/
│       └── logger.ts             # Simple logger
├── docs/                         # Developer documentation
├── Dockerfile
├── Procfile
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Commands

| Command | Description |
|---|---|
| `/start` | Welcome message + main menu keyboard. Parses `?start=ref_CODE` for referrals |
| `/balance` | Fetches wallet from backend and displays coin + cash balance |
| `/spin` | Sends an inline button to open the Mini App |
| `/invite` | Fetches referral link and stats from backend |
| `/help` | Shows usage instructions |

---

## Notifications

The bot sends proactive Telegram messages when backend events occur. The backend calls the bot's internal notification server:

```
POST http://bot-service:3001/notify
Authorization: Bearer <NOTIFY_SECRET>

{
  "type": "deposit_success",
  "telegram_id": "123456789",
  "data": { "amount": "5000.00" }
}
```

| Type | Trigger |
|---|---|
| `deposit_success` | Payment webhook confirmed |
| `withdrawal_processing` | Withdrawal request created |
| `withdrawal_complete` | Payout sent |
| `withdrawal_failed` | Payout failed, funds reversed |
| `kyc_approved` | Admin approved KYC |
| `kyc_rejected` | Admin rejected KYC |
| `spin_win` | User won a spin (optional) |

---

## Environment Variables

See [`docs/environment-variables.md`](docs/environment-variables.md) for a full reference.

---

## Documentation

| Document | Contents |
|---|---|
| [`docs/getting-started.md`](docs/getting-started.md) | Full setup, dev workflow, BotFather setup |
| [`docs/environment-variables.md`](docs/environment-variables.md) | Every env variable explained |
| [`docs/architecture.md`](docs/architecture.md) | How the bot fits into the system, notification flow |
| [`docs/deployment.md`](docs/deployment.md) | Railway deployment, webhook registration |

---

## Scripts

```bash
npm run dev        # Start with live reload (long polling)
npm run build      # Compile TypeScript → dist/
npm start          # Run compiled output
npm run typecheck  # Type-check without compiling
```
