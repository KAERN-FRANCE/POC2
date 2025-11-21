import { Request, Response } from 'express'
import {
  getFactCheckConfig,
  upsertFactCheckConfig,
  analyzeSegmentWithChatGPT,
  createFactCheckAlert,
  getAlertsForMeeting,
  updateAlertStatus,
} from '../services/factCheckService'
import { FactCheckConfig } from '../types'
import db from '../database'

// Récupérer la configuration de fact-checking
export const getConfig = (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params

    let config = getFactCheckConfig(meetingId)

    // Si pas de config, créer une config par défaut
    if (!config) {
      config = {
        meetingId,
        enabled: true,
        sensitivity: 'medium',
        checkNumbers: true,
        checkDates: true,
        checkNames: true,
        checkFinancials: true,
        autoAlert: true,
        minConfidence: 0.7,
      }
      upsertFactCheckConfig(config)
    }

    res.json(config)
  } catch (error) {
    console.error('Erreur getConfig:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération de la configuration' })
  }
}

// Mettre à jour la configuration
export const updateConfig = (req: Request, res: Response) => {
  try {
    const config: FactCheckConfig = req.body

    if (!config.meetingId) {
      return res.status(400).json({ error: 'meetingId est requis' })
    }

    upsertFactCheckConfig(config)

    // Activer/désactiver le fact-checking sur la réunion
    db.prepare('UPDATE meetings SET fact_checking_enabled = ? WHERE id = ?').run(
      config.enabled ? 1 : 0,
      config.meetingId
    )

    res.json(config)
  } catch (error) {
    console.error('Erreur updateConfig:', error)
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la configuration' })
  }
}

// Analyser un segment de transcription
export const analyzeSegment = async (req: Request, res: Response) => {
  try {
    const { meetingId, segmentId, segmentText, timestamp } = req.body

    if (!meetingId || !segmentId || !segmentText) {
      return res.status(400).json({ error: 'meetingId, segmentId et segmentText sont requis' })
    }

    // Vérifier que l'API key est configurée
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key non configurée. Veuillez ajouter OPENAI_API_KEY dans le fichier .env',
      })
    }

    const config = getFactCheckConfig(meetingId)

    if (!config || !config.enabled) {
      return res.json({
        hasIssue: false,
        message: 'Fact-checking désactivé pour cette réunion',
      })
    }

    // Analyser avec ChatGPT
    const result = await analyzeSegmentWithChatGPT(segmentText, meetingId, config)

    // Si problème détecté et auto-alert, créer une alerte
    let alert = null
    if (result.hasIssue && config.autoAlert && result.confidence >= config.minConfidence) {
      alert = createFactCheckAlert(meetingId, segmentId, timestamp || 0, segmentText, result)
    }

    res.json({
      ...result,
      alert,
    })
  } catch (error: any) {
    console.error('Erreur analyzeSegment:', error)
    res.status(500).json({
      error: 'Erreur lors de l\'analyse du segment',
      details: error.message,
    })
  }
}

// Récupérer toutes les alertes d'une réunion
export const getAlerts = (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params

    const alerts = getAlertsForMeeting(meetingId)

    res.json(alerts)
  } catch (error) {
    console.error('Erreur getAlerts:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des alertes' })
  }
}

// Mettre à jour le statut d'une alerte
export const updateAlertStatus = (req: Request, res: Response) => {
  try {
    const { alertId } = req.params
    const { status } = req.body

    if (!['active', 'acknowledged', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' })
    }

    updateAlertStatus(alertId, status)

    res.json({ success: true })
  } catch (error) {
    console.error('Erreur updateAlertStatus:', error)
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' })
  }
}

// Supprimer une alerte
export const deleteAlert = (req: Request, res: Response) => {
  try {
    const { alertId } = req.params

    const result = db.prepare('DELETE FROM fact_check_alerts WHERE id = ?').run(alertId)

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Alerte non trouvée' })
    }

    res.status(204).send()
  } catch (error) {
    console.error('Erreur deleteAlert:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'alerte' })
  }
}
