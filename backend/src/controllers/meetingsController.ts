import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import db from '../database'
import { Meeting, TranscriptSegment, CreateMeetingDTO, UpdateMeetingDTO, AddTranscriptSegmentDTO } from '../types'
import * as exportService from '../services/exportService'
import { checkSegmentAndAlert } from '../services/factCheckService'

// Récupérer toutes les réunions
export const getAllMeetings = (req: Request, res: Response) => {
  try {
    const meetings = db
      .prepare(
        `SELECT id, title, date, duration, audio_url as audioUrl, status
         FROM meetings
         ORDER BY date DESC`
      )
      .all() as any[]

    // Ajouter les transcriptions pour chaque réunion
    const meetingsWithTranscripts = meetings.map((meeting) => {
      const transcript = db
        .prepare(
          `SELECT id, text, timestamp, confidence, speaker
           FROM transcript_segments
           WHERE meeting_id = ?
           ORDER BY timestamp ASC`
        )
        .all(meeting.id) as TranscriptSegment[]

      return { ...meeting, transcript }
    })

    res.json(meetingsWithTranscripts)
  } catch (error) {
    console.error('Erreur getAllMeetings:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des réunions' })
  }
}

// Récupérer une réunion par ID
export const getMeeting = (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const meeting = db
      .prepare(
        `SELECT id, title, date, duration, audio_url as audioUrl, status
         FROM meetings
         WHERE id = ?`
      )
      .get(id) as any

    if (!meeting) {
      return res.status(404).json({ error: 'Réunion non trouvée' })
    }

    const transcript = db
      .prepare(
        `SELECT id, text, timestamp, confidence, speaker
         FROM transcript_segments
         WHERE meeting_id = ?
         ORDER BY timestamp ASC`
      )
      .all(id) as TranscriptSegment[]

    res.json({ ...meeting, transcript })
  } catch (error) {
    console.error('Erreur getMeeting:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération de la réunion' })
  }
}

// Créer une nouvelle réunion
export const createMeeting = (req: Request, res: Response) => {
  try {
    const { title }: CreateMeetingDTO = req.body

    if (!title) {
      return res.status(400).json({ error: 'Le titre est requis' })
    }

    const id = uuidv4()
    const date = new Date().toISOString()

    db.prepare(
      `INSERT INTO meetings (id, title, date, duration, status)
       VALUES (?, ?, ?, 0, 'recording')`
    ).run(id, title, date)

    const meeting: Meeting = {
      id,
      title,
      date,
      duration: 0,
      status: 'recording',
      transcript: [],
    }

    res.status(201).json(meeting)
  } catch (error) {
    console.error('Erreur createMeeting:', error)
    res.status(500).json({ error: 'Erreur lors de la création de la réunion' })
  }
}

// Mettre à jour une réunion
export const updateMeeting = (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData: UpdateMeetingDTO = req.body

    // Vérifier que la réunion existe
    const existing = db.prepare('SELECT id FROM meetings WHERE id = ?').get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Réunion non trouvée' })
    }

    // Construire la requête de mise à jour dynamiquement
    const fields: string[] = []
    const values: any[] = []

    if (updateData.title !== undefined) {
      fields.push('title = ?')
      values.push(updateData.title)
    }
    if (updateData.duration !== undefined) {
      fields.push('duration = ?')
      values.push(updateData.duration)
    }
    if (updateData.status !== undefined) {
      fields.push('status = ?')
      values.push(updateData.status)
    }

    if (fields.length > 0) {
      values.push(id)
      db.prepare(`UPDATE meetings SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    }

    // Si des segments de transcription sont fournis, les ajouter
    if (updateData.transcript && updateData.transcript.length > 0) {
      const insertStmt = db.prepare(
        `INSERT INTO transcript_segments (id, meeting_id, text, timestamp, confidence, speaker)
         VALUES (?, ?, ?, ?, ?, ?)`
      )

      for (const segment of updateData.transcript) {
        const segmentId = segment.id || uuidv4()
        insertStmt.run(
          segmentId,
          id,
          segment.text,
          segment.timestamp,
          segment.confidence || null,
          segment.speaker || null
        )
      }
    }

    // Récupérer la réunion mise à jour
    const updatedMeeting = db
      .prepare(
        `SELECT id, title, date, duration, audio_url as audioUrl, status
         FROM meetings
         WHERE id = ?`
      )
      .get(id) as any

    const transcript = db
      .prepare(
        `SELECT id, text, timestamp, confidence, speaker
         FROM transcript_segments
         WHERE meeting_id = ?
         ORDER BY timestamp ASC`
      )
      .all(id) as TranscriptSegment[]

    res.json({ ...updatedMeeting, transcript })
  } catch (error) {
    console.error('Erreur updateMeeting:', error)
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la réunion' })
  }
}

// Supprimer une réunion
export const deleteMeeting = (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const result = db.prepare('DELETE FROM meetings WHERE id = ?').run(id)

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Réunion non trouvée' })
    }

    // Les segments sont supprimés automatiquement grâce à ON DELETE CASCADE

    res.status(204).send()
  } catch (error) {
    console.error('Erreur deleteMeeting:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression de la réunion' })
  }
}

// Ajouter un segment de transcription
export const addTranscriptSegment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const segmentData: AddTranscriptSegmentDTO = req.body

    // Vérifier que la réunion existe
    const existing = db.prepare('SELECT id, fact_checking_enabled FROM meetings WHERE id = ?').get(id) as any
    if (!existing) {
      return res.status(404).json({ error: 'Réunion non trouvée' })
    }

    const segmentId = uuidv4()

    db.prepare(
      `INSERT INTO transcript_segments (id, meeting_id, text, timestamp, confidence, speaker)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      segmentId,
      id,
      segmentData.text,
      segmentData.timestamp,
      segmentData.confidence || null,
      segmentData.speaker || null
    )

    // Analyse en temps réel avec ChatGPT (si activé)
    let alert = null
    if (existing.fact_checking_enabled === 1 && process.env.OPENAI_API_KEY) {
      try {
        alert = await checkSegmentAndAlert(id, segmentId, segmentData.text, segmentData.timestamp)
      } catch (error) {
        console.error('Erreur lors du fact-checking:', error)
        // On ne bloque pas l'ajout du segment si le fact-checking échoue
      }
    }

    const segment: TranscriptSegment = {
      id: segmentId,
      text: segmentData.text,
      timestamp: segmentData.timestamp,
      confidence: segmentData.confidence,
      speaker: segmentData.speaker,
    }

    res.status(201).json({
      segment,
      alert, // Inclure l'alerte si elle a été créée
    })
  } catch (error) {
    console.error('Erreur addTranscriptSegment:', error)
    res.status(500).json({ error: 'Erreur lors de l\'ajout du segment' })
  }
}

// Upload audio
export const uploadAudio = (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' })
    }

    // Vérifier que la réunion existe
    const existing = db.prepare('SELECT id FROM meetings WHERE id = ?').get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Réunion non trouvée' })
    }

    // Construire l'URL du fichier audio
    const audioUrl = `/uploads/${req.file.filename}`

    // Mettre à jour la réunion avec l'URL de l'audio
    db.prepare('UPDATE meetings SET audio_url = ? WHERE id = ?').run(audioUrl, id)

    res.json({ audioUrl })
  } catch (error) {
    console.error('Erreur uploadAudio:', error)
    res.status(500).json({ error: 'Erreur lors de l\'upload de l\'audio' })
  }
}

// Exporter la transcription
export const exportTranscript = async (req: Request, res: Response) => {
  try {
    const { id, format } = req.params

    if (!['txt', 'json', 'pdf'].includes(format)) {
      return res.status(400).json({ error: 'Format non supporté' })
    }

    // Récupérer la réunion
    const meeting = db
      .prepare(
        `SELECT id, title, date, duration, audio_url as audioUrl, status
         FROM meetings
         WHERE id = ?`
      )
      .get(id) as any

    if (!meeting) {
      return res.status(404).json({ error: 'Réunion non trouvée' })
    }

    const transcript = db
      .prepare(
        `SELECT id, text, timestamp, confidence, speaker
         FROM transcript_segments
         WHERE meeting_id = ?
         ORDER BY timestamp ASC`
      )
      .all(id) as TranscriptSegment[]

    const fullMeeting: Meeting = { ...meeting, transcript }

    // Exporter selon le format
    if (format === 'txt') {
      const content = exportService.exportToTxt(fullMeeting)
      res.setHeader('Content-Type', 'text/plain')
      res.setHeader('Content-Disposition', `attachment; filename="${meeting.title}.txt"`)
      res.send(content)
    } else if (format === 'json') {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', `attachment; filename="${meeting.title}.json"`)
      res.json(fullMeeting)
    } else if (format === 'pdf') {
      const pdfBuffer = await exportService.exportToPdf(fullMeeting)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${meeting.title}.pdf"`)
      res.send(pdfBuffer)
    }
  } catch (error) {
    console.error('Erreur exportTranscript:', error)
    res.status(500).json({ error: 'Erreur lors de l\'export de la transcription' })
  }
}
