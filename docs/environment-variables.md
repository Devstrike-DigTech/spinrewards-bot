# Environment Variables Reference

All variables are loaded from `.env` in the project root.
Copy `.env.example` to `.env` — never commit the real `.env`.

---

## Telegram

| Variable | Required | Description |
|---|---|---|
| `BOT_TOKEN` | Yes | Your bot token from BotFather. Format: `123456789:ABCdef...` |
| `BOT_USERNAME` | No | Your bot's username without `@`. Used to build referral links. Default: `SpinRewardsBot` |

---

## Mini App

| Variable | Required | Description |
|---|---|---|
| `MINI_APP_URL` | Yes | Full URL of the deployed Mini App. This is the URL that opens when a user taps the Play button. e.g., `https://app.spinrewards.com` |

---

## Backend API

| Variable | Required | Description |
|---|---|---|
| `API_BASE_URL` | Yes | Backend API base URL including `/api/v1`. e.g., `https://api.spinrewards.com/api/v1` |

---

## Environment

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Set to `production` to enable webhook mode instead of long polling |

---

## Webhook (Production only)

Only needed when `NODE_ENV=production`.

| Variable | Required | Description |
|---|---|---|
| `WEBHOOK_DOMAIN` | Yes (prod) | The public HTTPS URL the bot server is reachable at. e.g., `https://bot.spinrewards.com`. Telegram will POST updates to `{WEBHOOK_DOMAIN}/webhook/{BOT_TOKEN}` |
| `WEBHOOK_PORT` | No | Port the webhook HTTP server listens on. Default: `3000`. Railway sets this via `PORT` automatically |

---

## Internal Notification Server

| Variable | Required | Description |
|---|---|---|
| `NOTIFY_SECRET` | Yes | A strong random secret string. The backend must include this in `Authorization: Bearer <secret>` when calling `POST /notify`. Keeps the endpoint private |
| `INTERNAL_PORT` | No | Port the internal notification server listens on. Default: `3001`. In production, this should NOT be publicly accessible — firewall it to backend IP only |

---

## Example `.env` for Local Development

```env
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
BOT_USERNAME=SpinRewardsTestBot
MINI_APP_URL=http://localhost:5173
API_BASE_URL=http://localhost:8000/api/v1
NODE_ENV=development
NOTIFY_SECRET=dev-secret-change-in-prod
INTERNAL_PORT=3001
```

## Example `.env` for Production

```env
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
BOT_USERNAME=SpinRewardsBot
MINI_APP_URL=https://app.spinrewards.com
API_BASE_URL=https://api.spinrewards.com/api/v1
NODE_ENV=production
WEBHOOK_DOMAIN=https://bot.spinrewards.com
WEBHOOK_PORT=3000
NOTIFY_SECRET=a-very-long-random-secret-string
INTERNAL_PORT=3001
```
