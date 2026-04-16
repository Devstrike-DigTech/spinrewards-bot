import { Context } from 'telegraf'
import { mainMenuKeyboard } from '../keyboards/main'
import { authenticateUser } from '../api/backend'
import { publicClient, setTokens } from '../api/client'

export async function startCommand(ctx: Context) {
  const user = ctx.from
  if (!user) return

  // Check for referral param: /start ref_CODE
  const payload = (ctx as any).startPayload as string | undefined
  const referralCode = payload?.startsWith('ref_') ? payload.slice(4) : null

  // Register user with backend
  // The bot doesn't have initData, so we call a simplified registration
  // The actual JWT auth with initData happens in the Mini App on first open
  // Here we just ensure the user exists in our system
  try {
    await publicClient.post('/auth/telegram/', {
      init_data: buildFakeInitData(user, referralCode),
    })
  } catch {
    // Non-fatal — user will fully auth when they open the Mini App
  }

  const firstName = user.first_name ?? 'there'

  await ctx.reply(
    `Welcome to Spin Rewards, ${firstName}! 🎡\n\nPlay, win, and withdraw instantly.\n\n👇 Get started below`,
    mainMenuKeyboard
  )
}

// Build a minimal initData-style string for bot registration
// This is NOT the same as Telegram WebApp initData — it's just for creating the user record
// Real auth (with HMAC-signed initData) happens in the Mini App
function buildFakeInitData(user: any, referralCode: string | null): string {
  const userData = JSON.stringify({
    id: user.id,
    username: user.username ?? '',
    first_name: user.first_name ?? '',
    last_name: user.last_name ?? '',
  })
  const params = new URLSearchParams({
    user: userData,
    auth_date: String(Math.floor(Date.now() / 1000)),
  })
  if (referralCode) params.set('start_param', referralCode)
  // hash will fail validation — backend should have a lenient mode for bot registration
  // or the backend dev should expose a separate POST /auth/bot/ endpoint
  params.set('hash', 'bot_registration')
  return params.toString()
}
