import { Context } from 'telegraf'
import { Markup } from 'telegraf'
import { mainMenuKeyboard } from '../keyboards/main'
import config from '../config'

export async function startCommand(ctx: Context) {
  console.log('Received /start command from user:', ctx.from?.id)
  const user = ctx.from
  if (!user) return

  const firstName = user.first_name ?? 'there'

  // Telegraf exposes the payload after /start as ctx.startPayload
  const startPayload = (ctx as any).startPayload as string | undefined
  console.log('[Start] startPayload:', startPayload ?? '(none)')

  // If a referral code was passed, append it as startapp so the mini app
  // can read it from WebApp.initDataUnsafe.start_param
  const miniAppUrl = startPayload?.startsWith('SPIN-')
    ? `${config.miniApp.url}?startapp=${startPayload}`
    : config.miniApp.url

  // Send the play button as an inline button first (reliable on all clients)
  await ctx.reply(
    `Welcome to Spin Rewards, ${firstName}! 🎡\n\nPlay, win, and withdraw instantly.`,
    Markup.inlineKeyboard([Markup.button.webApp('🎡 Play Now', miniAppUrl)])
  )

  // Then set the reply keyboard for text navigation (Wallet, Invite, Help)
  await ctx.reply('Use the menu below to navigate:', mainMenuKeyboard)
}
