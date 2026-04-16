import { Context } from 'telegraf'
import { balanceCommand } from '../commands/balance'
import { inviteCommand } from '../commands/invite'
import { helpCommand } from '../commands/help'
import { playInlineButton } from '../keyboards/main'

// Handles text button presses from the reply keyboard
export async function handleTextButton(ctx: Context) {
  const text = (ctx.message as any)?.text as string | undefined
  if (!text) return

  switch (text) {
    case '💰 Wallet':
      await balanceCommand(ctx)
      break
    case '👥 Invite':
      await inviteCommand(ctx)
      break
    case '❓ Help':
      await helpCommand(ctx)
      break
    default:
      // Unknown text — prompt to use the app
      await ctx.reply(
        'Use the menu buttons below, or tap Play to open the app.',
        playInlineButton('🎡 Play')
      )
  }
}
