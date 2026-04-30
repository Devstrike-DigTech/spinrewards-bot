import { Telegraf } from 'telegraf'
import config from './config'
import { logger } from './utils/logger'

import { startCommand } from './commands/start'
import { balanceCommand } from './commands/balance'
import { spinCommand } from './commands/spin'
import { inviteCommand } from './commands/invite'
import { helpCommand } from './commands/help'
import { handleTextButton } from './handlers/buttons'
import { startNotifyServer } from './notifications/server'

const bot = new Telegraf(config.bot.token)

// ── Commands ──────────────────────────────────────────────────────────────────
bot.start(startCommand)
bot.command('balance', balanceCommand)
bot.command('spin', spinCommand)
bot.command('invite', inviteCommand)
bot.command('help', helpCommand)

// ── Reply keyboard button handler ─────────────────────────────────────────────
bot.on('text', handleTextButton)

// ── Error handler ─────────────────────────────────────────────────────────────
bot.catch((err: any, ctx) => {
  logger.error(`Error for ${ctx.updateType}: ${err?.message ?? err}`)
  logger.error(err?.stack ?? '')
  ctx.reply('Something went wrong. Please try again.').catch(() => {})
})

// ── Launch ────────────────────────────────────────────────────────────────────
async function launch() {
  logger.info(`NODE_ENV=${config.env} | isProduction=${config.isProduction}`)
  logger.info(`MINI_APP_URL=${config.miniApp.url}`)
  logger.info(`WEBHOOK_DOMAIN=${config.webhook.domain} | PORT=${config.webhook.port} | process.env.PORT=${process.env.PORT}`)

  // Start internal notification server (for backend → bot messages)
  startNotifyServer()

  if (config.isProduction && config.webhook.domain) {
    const webhookPath = `/webhook/${config.bot.token}`
    const webhookUrl = `${config.webhook.domain}${webhookPath}`
    logger.info(`Starting webhook mode: ${webhookUrl}`)

    await bot.launch({
      webhook: {
        domain: config.webhook.domain,
        port: config.webhook.port,
        path: webhookPath,
      },
    })

    logger.info(`Bot running in webhook mode: ${webhookUrl}`)
  } else {
    logger.info('Starting long polling mode')
    await bot.launch()
    logger.info('Bot running in polling mode')
  }
}

launch().catch((err) => {
  logger.error('Failed to launch bot:', err)
  process.exit(1)
})

// ── Graceful shutdown ─────────────────────────────────────────────────────────
process.once('SIGINT', () => {
  logger.info('SIGINT received — shutting down')
  bot.stop('SIGINT')
  process.exit(0)
})

process.once('SIGTERM', () => {
  logger.info('SIGTERM received — shutting down')
  bot.stop('SIGTERM')
  process.exit(0)
})
