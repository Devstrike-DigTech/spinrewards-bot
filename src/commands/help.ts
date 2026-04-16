import { Context } from 'telegraf'
import { playInlineButton } from '../keyboards/main'

export async function helpCommand(ctx: Context) {
  await ctx.reply(
    `❓ <b>How to use Spin Rewards</b>\n\n` +
    `<b>Commands:</b>\n` +
    `/start — Open main menu\n` +
    `/balance — Check your wallet balance\n` +
    `/spin — Open the spin game\n` +
    `/invite — Get your referral link\n` +
    `/help — Show this message\n\n` +
    `<b>How it works:</b>\n` +
    `1. Fund your wallet via the app\n` +
    `2. Choose a stake and spin the wheel\n` +
    `3. Win up to 20x your stake\n` +
    `4. Withdraw winnings to your bank\n\n` +
    `<b>Need support?</b> Contact us at @SpinRewardsSupport`,
    { parse_mode: 'HTML', ...playInlineButton('🎡 Open App') }
  )
}
