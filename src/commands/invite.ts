import { Context } from 'telegraf'
import { getReferralInfo } from '../api/backend'

export async function inviteCommand(ctx: Context) {
  const telegramId = String(ctx.from?.id)
  if (!telegramId) return

  try {
    const referral = await getReferralInfo(telegramId)

    await ctx.reply(
      `👥 <b>Invite Friends</b>\n\n` +
      `Share your link and earn ₦500 for every friend who deposits!\n` +
      `Your friend also gets ₦200 bonus on their first deposit.\n\n` +
      `🔗 <b>Your Link:</b>\n<code>${referral.referral_link}</code>\n\n` +
      `📊 Total referrals: ${referral.total_referrals}\n` +
      `✅ Converted: ${referral.converted_referrals}\n` +
      `💰 Total earned: ₦${Number(referral.total_earned).toLocaleString()}`,
      { parse_mode: 'HTML' }
    )
  } catch {
    await ctx.reply(
      '👥 <b>Invite Friends</b>\n\nOpen the app to get your referral link.',
      { parse_mode: 'HTML' }
    )
  }
}
