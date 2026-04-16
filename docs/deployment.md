# Deployment Guide — Spin Rewards Bot

---

## Railway (Recommended)

Railway is the simplest path — it reads the `Procfile`, injects environment variables, and gives you a public HTTPS URL for the webhook.

### Step 1 — Push to GitHub

Make sure the bot repo is pushed to GitHub before connecting to Railway.

```bash
cd spinrewards-bot
git init          # if not already a git repo
git add .
git commit -m "chore: initial bot setup"
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

### Step 2 — Create a Railway project

1. Go to [railway.app](https://railway.app) and log in
2. Click **New Project → Deploy from GitHub repo**
3. Select your bot repository
4. Railway detects the `Procfile` and creates a **web** service

No database or Redis plugin is needed for the bot — it is stateless (JWT store is in-memory).

---

### Step 3 — Set environment variables

In Railway → your service → **Variables**, add:

| Variable | Value |
|---|---|
| `BOT_TOKEN` | From BotFather |
| `BOT_USERNAME` | Your bot's username (without `@`) |
| `MINI_APP_URL` | Full URL of the deployed Mini App |
| `API_BASE_URL` | Backend API URL + `/api/v1` |
| `NODE_ENV` | `production` |
| `WEBHOOK_DOMAIN` | The Railway public URL (see step 4) |
| `NOTIFY_SECRET` | A strong random string (min 32 chars) |

Generate a strong `NOTIFY_SECRET`:
```bash
openssl rand -hex 32
```

`WEBHOOK_PORT` and `INTERNAL_PORT` do **not** need to be set — Railway injects `PORT` automatically for the main web process, and `INTERNAL_PORT` defaults to `3001`.

---

### Step 4 — Get the public URL

After the first deploy:

1. Go to Railway → your service → **Settings → Networking**
2. Click **Generate Domain**
3. Copy the URL (e.g., `https://spinrewards-bot-production.up.railway.app`)
4. Set this as `WEBHOOK_DOMAIN` in your environment variables

Railway will re-deploy automatically after you save the variable. On next boot the bot registers its webhook with Telegram automatically.

---

### Step 5 — Verify

Check the deploy logs — you should see:

```
[INFO] Bot running in webhook mode
[INFO] [NotifyServer] Listening on port 3001
```

Send `/start` to your bot in Telegram. If it responds, the webhook is working.

---

### Step 6 — Firewall the notify port (Important)

The internal notification server on port `3001` should only be reachable from the Django backend, not the public internet.

Railway does **not** expose internal ports publicly — only the port assigned via the `PORT` variable is publicly routed. Port `3001` is only reachable from other Railway services in the same project via the **private network**.

To use this:
1. Add the Django backend service to the **same Railway project**
2. In the backend's env vars, set the bot notification URL using Railway's private DNS:
   ```
   BOT_NOTIFY_URL=http://spinrewards-bot.railway.internal:3001
   ```
3. Railway handles private networking automatically within the same project

If the bot and backend are in separate Railway projects, you must firewall port `3001` yourself (not possible on Railway's managed tier — consider running both services in the same project).

---

## Webhook Registration

In production mode, Telegraf calls Telegram's `setWebhook` API automatically on startup with:

```
https://{WEBHOOK_DOMAIN}/webhook/{BOT_TOKEN}
```

You do not need to register it manually. If you ever need to check webhook status:

```bash
curl https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo
```

To delete the webhook (e.g., to switch back to polling):

```bash
curl https://api.telegram.org/bot<BOT_TOKEN>/deleteWebhook
```

---

## Docker (Self-hosted VPS)

### Build and run

```bash
docker build -t spinrewards-bot .

docker run -d \
  --name spinrewards-bot \
  --restart unless-stopped \
  -e BOT_TOKEN=your_token \
  -e BOT_USERNAME=SpinRewardsBot \
  -e MINI_APP_URL=https://app.spinrewards.com \
  -e API_BASE_URL=https://api.spinrewards.com/api/v1 \
  -e NODE_ENV=production \
  -e WEBHOOK_DOMAIN=https://bot.spinrewards.com \
  -e NOTIFY_SECRET=your_secret \
  -p 3000:3000 \
  spinrewards-bot
```

Port `3001` (internal notify server) is intentionally **not** published to the host. If the Django backend runs on the same host, it can reach the bot at `http://localhost:3001`. If it runs on a different server, open port `3001` only to the backend server's IP via your firewall (e.g., `ufw allow from <backend_ip> to any port 3001`).

### Nginx reverse proxy (for webhook)

Telegram requires HTTPS. Put Nginx in front:

```nginx
server {
    server_name bot.spinrewards.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Then get a certificate:
```bash
certbot --nginx -d bot.spinrewards.com
```

---

## Environment Checklist (Pre-deploy)

Before going live:

- [ ] `BOT_TOKEN` is the production token from BotFather
- [ ] `NODE_ENV=production`
- [ ] `WEBHOOK_DOMAIN` is set to the correct public HTTPS URL
- [ ] `NOTIFY_SECRET` is a strong random string (not the dev placeholder)
- [ ] `API_BASE_URL` points to the production backend
- [ ] `MINI_APP_URL` points to the deployed Mini App
- [ ] Port `3001` is not publicly accessible
- [ ] Webhook is confirmed via `getWebhookInfo`
- [ ] `/start` responds correctly in Telegram

---

## Switching Between Polling and Webhook

| Mode | `NODE_ENV` | Use case |
|---|---|---|
| Long polling | `development` (default) | Local dev — no public URL needed |
| Webhook | `production` | Deployed — lower latency, more reliable |

The bot picks the mode automatically at startup based on `NODE_ENV`. No code changes needed.

> **Note:** Never run two bot instances with the same `BOT_TOKEN` simultaneously — only one can receive updates at a time. Long polling and webhook mode will conflict.
