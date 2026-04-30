import dotenv from 'dotenv'
dotenv.config()

function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

const config = {
  bot: {
    token: required('BOT_TOKEN'),
    username: process.env.BOT_USERNAME ?? 'SpinRewardsGameBot',
  },
  miniApp: {
    url: required('MINI_APP_URL'),
  },
  api: {
    baseUrl: required('API_BASE_URL'),
  },
  env: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
  webhook: {
    domain: process.env.WEBHOOK_DOMAIN ?? '',
    // Use Railway's injected PORT; fall back to 3000 for local dev
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
  notify: {
    secret: process.env.NOTIFY_SECRET ?? '',
    port: parseInt(process.env.INTERNAL_PORT ?? '3001', 10),
  },
}

export default config
