/**
 * Internal HTTP server that the Django backend calls to trigger notifications.
 * This avoids the backend needing to call the Telegram Bot API directly.
 *
 * All requests must include: Authorization: Bearer <NOTIFY_SECRET>
 *
 * POST /notify
 * Body: { type, telegram_id, data }
 *
 * Restrict this port/endpoint to your backend's IP in production.
 */
import express, { Request, Response, NextFunction } from 'express'
import config from '../config'
import { Notifications } from './sender'

const app = express()
app.use(express.json())

// Auth middleware
function requireSecret(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization ?? ''
  const token = auth.replace('Bearer ', '')
  if (!config.notify.secret || token !== config.notify.secret) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}

app.post('/notify', requireSecret, async (req: Request, res: Response) => {
  const { type, telegram_id, data } = req.body

  if (!type || !telegram_id) {
    res.status(400).json({ error: 'type and telegram_id are required' })
    return
  }

  try {
    switch (type) {
      case 'deposit_success':
        await Notifications.depositSuccess(telegram_id, data.amount)
        break
      case 'withdrawal_processing':
        await Notifications.withdrawalProcessing(telegram_id, data.amount)
        break
      case 'withdrawal_complete':
        await Notifications.withdrawalComplete(telegram_id, data.amount)
        break
      case 'withdrawal_failed':
        await Notifications.withdrawalFailed(telegram_id, data.amount)
        break
      case 'kyc_approved':
        await Notifications.kycApproved(telegram_id)
        break
      case 'kyc_rejected':
        await Notifications.kycRejected(telegram_id, data.reason)
        break
      case 'spin_win':
        await Notifications.spinWin(telegram_id, data.amount)
        break
      default:
        res.status(400).json({ error: `Unknown notification type: ${type}` })
        return
    }

    res.json({ sent: true })
  } catch (err) {
    console.error('[NotifyServer] Error:', err)
    res.status(500).json({ error: 'Failed to send notification' })
  }
})

export function startNotifyServer() {
  app.listen(config.notify.port, () => {
    console.log(`[NotifyServer] Listening on port ${config.notify.port}`)
  })
}
