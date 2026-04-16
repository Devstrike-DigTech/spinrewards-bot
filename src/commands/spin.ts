import { Context } from 'telegraf'
import { playInlineButton } from '../keyboards/main'

export async function spinCommand(ctx: Context) {
  await ctx.reply(
    '🎡 <b>Ready to spin?</b>\n\nTap the button below to open Spin Rewards and place your stake.',
    { parse_mode: 'HTML', ...playInlineButton('🎡 Play Now') }
  )
}
