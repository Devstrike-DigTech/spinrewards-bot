import { Markup } from 'telegraf'
import config from '../config'

// Persistent reply keyboard shown after /start
export const mainMenuKeyboard = Markup.keyboard([
  [
    Markup.button.webApp('🎡 Play', config.miniApp.url),
    Markup.button.text('💰 Wallet'),
  ],
  [
    Markup.button.text('👥 Invite'),
    Markup.button.text('❓ Help'),
  ],
]).resize()

export const playInlineButton = (label = '🎡 Open Spin Rewards') =>
  Markup.inlineKeyboard([
    Markup.button.webApp(label, config.miniApp.url),
  ])
