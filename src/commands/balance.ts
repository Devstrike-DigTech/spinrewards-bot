import { Context } from 'telegraf'
import { getWalletBalance } from '../api/backend'
import { playInlineButton } from '../keyboards/main'

export async function balanceCommand(ctx: Context) {
  const telegramId = String(ctx.from?.id)
  if (!telegramId) return

  try {
    const wallet = await getWalletBalance(telegramId)

    await ctx.reply(
      `💰 <b>Wallet Balance</b>\n\n` +
      `Coins: ₦${Number(wallet.coin_balance).toLocaleString()}\n` +
      `Cash:  ₦${Number(wallet.cash_balance).toLocaleString()}\n\n` +
      `<b>Total: ₦${Number(wallet.total_balance).toLocaleString()}</b>`,
      {
        parse_mode: 'HTML',
        // web_app inline button — opens mini app with initData injected,
        // so if the user has no stored token the auth flow runs automatically
        ...playInlineButton('🎡 Open App'),
      }
    )
  } catch {
    await ctx.reply(
      '💰 Could not fetch balance. Open the app to view your wallet.',
      { parse_mode: 'HTML', ...playInlineButton('💰 Open Wallet') }
    )
  }
}
