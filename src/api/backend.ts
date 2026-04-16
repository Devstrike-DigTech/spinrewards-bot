import { publicClient, createAuthClient, setTokens } from './client'

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    telegram_id: string
    username: string
    first_name: string
    kyc_status: string
    referral_code: string
  }
}

export interface WalletBalance {
  coin_balance: string
  cash_balance: string
  total_balance: string
}

export interface ReferralInfo {
  referral_code: string
  referral_link: string
  total_referrals: number
  converted_referrals: number
  total_earned: string
}

// Authenticate user via Telegram initData
export async function authenticateUser(initData: string): Promise<AuthResponse> {
  const res = await publicClient.post('/auth/telegram/', { init_data: initData })
  const data: AuthResponse = res.data.data
  setTokens(data.user.telegram_id, {
    access: data.access_token,
    refresh: data.refresh_token,
  })
  return data
}

// Get wallet balance
export async function getWalletBalance(telegramId: string): Promise<WalletBalance> {
  const client = createAuthClient(telegramId)
  const res = await client.get('/wallet/')
  return res.data.data
}

// Get referral info
export async function getReferralInfo(telegramId: string): Promise<ReferralInfo> {
  const client = createAuthClient(telegramId)
  const res = await client.get('/referral/')
  return res.data.data
}
