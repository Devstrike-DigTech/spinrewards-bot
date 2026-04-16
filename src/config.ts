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
    username: process.env.BOT_USERNAME ?? 'SpinRewardsBot',
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
    port: parseInt(process.env.WEBHOOK_PORT ?? '3000', 10),
  },
  notify: {
    secret: process.env.NOTIFY_SECRET ?? '',
    port: parseInt(process.env.INTERNAL_PORT ?? '3001', 10),
  },
}

export default config
