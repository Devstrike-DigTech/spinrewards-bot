# Architecture Overview

## Role in the System

```
User (Telegram)
      │
      ▼
Telegram Bot  ──────────────────────▶  Backend API
  (this service)                         (Django)
      │                                     │
      │  opens                              │  credits wallet
      ▼                                     │  sends notification hook
Telegram Mini App ◀──────────────────────────
  (React)
```

The bot is a **thin communication layer**. It:
- Receives user commands and routes them
- Displays data fetched from the backend
- Sends notifications triggered by backend events

It does **not** contain any business logic, wallet state, or game outcomes.

---

## Internal Structure

### `src/index.ts` — Entry Point

Initialises the Telegraf bot, registers all commands and handlers, then launches in either polling or webhook mode depending on `NODE_ENV`.

Also starts the internal notification server on a separate port.

### `src/config.ts` — Configuration

Loads and validates all environment variables at startup. Any missing required variable throws immediately — no silent failures.

### `src/api/` — Backend Communication

**`client.ts`**
- Maintains a per-user JWT store (in-memory `Map`)
- `publicClient` — unauthenticated Axios instance for `/auth/*`
- `createAuthClient(telegramId)` — returns an Axios instance that automatically injects the stored JWT for that user, and silently refreshes it on 401

**`backend.ts`**
- Typed functions for each backend call: `authenticateUser`, `getWalletBalance`, `getReferralInfo`
- All other modules import from here — they never touch Axios directly

### `src/commands/` — Command Handlers

One file per command. Each exports a single async function that accepts a Telegraf `Context`.

| File | Command | What it does |
|---|---|---|
| `start.ts` | `/start` | Sends welcome message + main menu keyboard. Parses referral code from deep link payload |
| `balance.ts` | `/balance` | Calls backend for wallet balance, formats and sends it |
| `spin.ts` | `/spin` | Sends an inline WebApp button to open the Mini App |
| `invite.ts` | `/invite` | Fetches referral info and sends formatted message with link |
| `help.ts` | `/help` | Sends static help message |

### `src/handlers/buttons.ts` — Reply Keyboard Handler

The main menu uses a Telegram reply keyboard (persistent buttons below the text input). When a user taps one of these buttons, Telegram sends a regular text message with the button's label. This handler intercepts all `text` messages and routes them to the right command.

### `src/keyboards/main.ts` — Keyboard Definitions

- `mainMenuKeyboard` — the 2×2 reply keyboard shown after `/start`. The Play button is a `webApp` button type that opens the Mini App directly without leaving Telegram
- `playInlineButton` — an inline keyboard for attaching a Mini App button to any message

### `src/notifications/sender.ts` — Notification Templates

Plain functions for each notification type. Each calls the Telegram Bot API's `sendMessage` method directly via HTTP. Failures are logged but never crash the process.

### `src/notifications/server.ts` — Internal HTTP Server

A small Express server on a separate port (`INTERNAL_PORT`, default 3001). The Django backend calls this to trigger user notifications without the backend needing to manage Telegram Bot API calls itself.

```
Django backend
    │
    │  POST /notify
    │  Authorization: Bearer <NOTIFY_SECRET>
    │  { type, telegram_id, data }
    ▼
Bot notification server (port 3001)
    │
    │  calls Telegram Bot API
    ▼
User's Telegram app
```

**Security:** The endpoint requires a `NOTIFY_SECRET` bearer token. In production, this port should be firewalled to only accept connections from the backend server's IP.

---

## Launch Modes

### Development (long polling)

```
NODE_ENV=development
```

Telegraf polls Telegram's servers for updates. No public URL or webhook registration needed. Best for local development.

### Production (webhook)

```
NODE_ENV=production
WEBHOOK_DOMAIN=https://bot.spinrewards.com
```

Telegram pushes updates to `{WEBHOOK_DOMAIN}/webhook/{BOT_TOKEN}`. Lower latency and more reliable than polling. Requires a public HTTPS URL.

The webhook is registered automatically when the bot starts via `bot.launch({ webhook: ... })`.

---

## JWT Token Lifecycle

```
User opens Mini App
  → Mini App authenticates via POST /auth/telegram/ with Telegram initData
  → Backend returns access_token + refresh_token
  → Mini App stores tokens in localStorage

User sends /balance to bot
  → Bot calls backend GET /wallet/ with stored token
  → If 401: bot auto-calls POST /auth/refresh/ and retries
  → If refresh fails: shows fallback message (user must open Mini App again)
```

Tokens are stored in-memory in the bot process. On bot restart, tokens are lost and users must open the Mini App again to re-authenticate. This is acceptable — balance lookups fail gracefully.

---

## What the Bot Must Never Do

- Generate spin outcomes
- Calculate or modify wallet balances
- Store financial state between restarts
- Trust user-provided amounts or game results
- Expose the `NOTIFY_SECRET` or `BOT_TOKEN` in any message or log
