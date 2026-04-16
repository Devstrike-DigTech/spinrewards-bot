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
        ...playInlineButton('🎡 Spin Now'),
      }
    )
  } catch {
    await ctx.reply(
      '💰 <b>Wallet Balance</b>\n\nOpen the app to view your balance.',
      { parse_mode: 'HTML', ...playInlineButton('💰 Open Wallet') }
    )
  }
}
