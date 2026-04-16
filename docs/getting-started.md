# Getting Started — Spin Rewards Bot

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20+ | Use [nvm](https://github.com/nvm-sh/nvm) to manage versions |
| npm | 9+ | Comes with Node |
| Telegram account | Any | To test the bot |
| A Telegram Bot Token | — | From [@BotFather](https://t.me/BotFather) |

---

## Step 1 — Create your bot on Telegram

If you haven't already:

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Follow the prompts — choose a name and a username (must end in `bot`)
4. Copy the token BotFather gives you — this is your `BOT_TOKEN`

To enable the Mini App on your bot:
1. Send `/newapp` to BotFather
2. Select your bot
3. Set the Web App URL to your Mini App URL (or a placeholder for now)

---

## Step 2 — Clone and install

```bash
git clone <your-repo-url>
cd spinrewards-bot
npm install
```

---

## Step 3 — Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

```env
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
BOT_USERNAME=SpinRewardsBot
MINI_APP_URL=http://localhost:5173
API_BASE_URL=http://localhost:8000/api/v1
NODE_ENV=development
NOTIFY_SECRET=any-local-secret
```

For `API_BASE_URL`:
- Local backend: `http://localhost:8000/api/v1`
- Deployed backend: `https://api.spinrewards.com/api/v1`

---

## Step 4 — Start the bot

```bash
npm run dev
```

You should see:
```
[INFO] Bot running in polling mode
[INFO] [NotifyServer] Listening on port 3001
```

Open Telegram, find your bot by username, and send `/start`.

---

## Development Workflow

### Live reload

`npm run dev` uses `ts-node-dev` which watches for file changes and restarts automatically. No need to restart manually after edits.

### Type checking

```bash
npm run typecheck
```

Run this before committing to catch type errors without a full build.

### Building

```bash
npm run build
```

Compiles TypeScript to `dist/`. The output is what runs in production.

---

## Testing notifications locally

The internal notification server runs on port `3001`. You can test it with curl:

```bash
curl -X POST http://localhost:3001/notify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer any-local-secret" \
  -d '{
    "type": "deposit_success",
    "telegram_id": "YOUR_TELEGRAM_ID",
    "data": { "amount": "5000.00" }
  }'
```

Replace `YOUR_TELEGRAM_ID` with your actual Telegram user ID. You can find it by sending a message to [@userinfobot](https://t.me/userinfobot).

---

## Connecting to the backend

The bot fetches data (wallet balance, referral info) from the backend API on behalf of users. It stores JWTs per user in memory.

For this to work, the user must have been authenticated first (which happens when they open the Mini App). If the bot tries to fetch data for a user who hasn't authenticated yet, the API call will fail gracefully and a fallback message is shown.

> In practice this is fine — users open the Mini App first, authenticate there, and then use the bot for quick lookups.

---

## Next Steps

- [Environment Variables Reference](./environment-variables.md)
- [Architecture Overview](./architecture.md)
- [Deployment Guide](./deployment.md)
