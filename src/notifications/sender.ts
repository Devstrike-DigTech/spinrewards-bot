import axios from 'axios'
import config from '../config'

const telegramApi = (method: string) =>
  `https://api.telegram.org/bot${config.bot.token}/${method}`

async function sendMessage(telegramId: string, text: string): Promise<void> {
  try {
    await axios.post(telegramApi('sendMessage'), {
      chat_id: telegramId,
      text,
      parse_mode: 'HTML',
    })
  } catch (err) {
    console.error(`[Notification] Failed to send to ${telegramId}:`, err)
  }
}

export const Notifications = {
  depositSuccess: (telegramId: string, amount: string) =>
    sendMessage(
      telegramId,
      `✅ <b>Deposit Successful</b>\n\n₦${amount} has been added to your wallet.\n\nTap Play to spin now!`
    ),

  withdrawalProcessing: (telegramId: string, amount: string) =>
    sendMessage(
      telegramId,
      `💸 <b>Withdrawal Processing</b>\n\nYour request of ₦${amount} is being processed.`
    ),

  withdrawalComplete: (telegramId: string, amount: string) =>
    sendMessage(
      telegramId,
      `✅ <b>Withdrawal Sent</b>\n\n₦${amount} has been sent to your bank account.`
    ),

  withdrawalFailed: (telegramId: string, amount: string) =>
    sendMessage(
      telegramId,
      `❌ <b>Withdrawal Failed</b>\n\nYour request of ₦${amount} could not be processed. Your funds have been returned to your wallet.`
    ),

  kycApproved: (telegramId: string) =>
    sendMessage(
      telegramId,
      `✅ <b>KYC Approved</b>\n\nYour identity has been verified. You can now withdraw your winnings!`
    ),

  kycRejected: (telegramId: string, reason: string) =>
    sendMessage(
      telegramId,
      `❌ <b>KYC Rejected</b>\n\nReason: ${reason}\n\nPlease resubmit your information.`
    ),

  spinWin: (telegramId: string, amount: string) =>
    sendMessage(
      telegramId,
      `🎉 <b>You won ₦${amount}!</b>\n\nKeep spinning to win more.`
    ),
}
