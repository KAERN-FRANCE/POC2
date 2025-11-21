import express from 'express'
import * as factCheckController from '../controllers/factCheckController'

const router = express.Router()

// Routes pour le fact-checking
router.get('/config/:meetingId', factCheckController.getConfig)
router.post('/config', factCheckController.updateConfig)
router.post('/analyze', factCheckController.analyzeSegment)
router.get('/alerts/:meetingId', factCheckController.getAlerts)
router.put('/alerts/:alertId/status', factCheckController.updateAlertStatus)
router.delete('/alerts/:alertId', factCheckController.deleteAlert)

export default router
