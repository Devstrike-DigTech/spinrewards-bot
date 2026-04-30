import { Markup } from 'telegraf'
import config from '../config'

// Reply keyboard — text navigation only, no webApp buttons (unreliable on mobile)
export const mainMenuKeyboard = Markup.keyboard([
  [Markup.button.text('💰 Wallet'), Markup.button.text('👥 Invite')],
  [Markup.button.text('❓ Help')],
]).resize()

// Inline web_app button — the only reliable way to open the Mini App on mobile
export const playInlineButton = (label = '🎡 Open Spin Rewards') =>
  Markup.inlineKeyboard([
    Markup.button.webApp(label, config.miniApp.url),
  ])
