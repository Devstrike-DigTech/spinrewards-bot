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

// Inline button — uses the registered t.me deep link so web.telegram.org
// also injects initData (raw URL web_app buttons skip it in the web client)
export const playInlineButton = (label = '🎡 Open Spin Rewards') =>
  Markup.inlineKeyboard([
    Markup.button.url(label, config.miniApp.tgLink),
  ])
