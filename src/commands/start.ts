import { Context } from 'telegraf'
import { mainMenuKeyboard, playInlineButton } from '../keyboards/main'

export async function startCommand(ctx: Context) {
  console.log('Received /start command from user:', ctx.from?.id)
  const user = ctx.from
  if (!user) return

  const firstName = user.first_name ?? 'there'

  // Send the play button as an inline button first (reliable on all clients)
  await ctx.reply(
    `Welcome to Spin Rewards, ${firstName}! 🎡\n\nPlay, win, and withdraw instantly.`,
    playInlineButton('🎡 Play Now')
  )

  // Then set the reply keyboard for text navigation (Wallet, Invite, Help)
  await ctx.reply('Use the menu below to navigate:', mainMenuKeyboard)
}
