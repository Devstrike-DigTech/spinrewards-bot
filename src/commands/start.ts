import { Context } from 'telegraf'
import { mainMenuKeyboard } from '../keyboards/main'

export async function startCommand(ctx: Context) {
  const user = ctx.from
  if (!user) return

  const firstName = user.first_name ?? 'there'

  // Note: we do NOT call the backend here.
  // The bot has no access to Telegram WebApp initData, so it cannot produce
  // a valid HMAC signature. User registration happens automatically when
  // the user opens the Mini App for the first time — that's where real
  // initData (with a valid hash) is available.
  await ctx.reply(
    `Welcome to Spin Rewards, ${firstName}! 🎡\n\nPlay, win, and withdraw instantly.\n\n👇 Get started below`,
    mainMenuKeyboard
  )
}
