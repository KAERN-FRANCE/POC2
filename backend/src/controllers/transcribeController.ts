import { Request, Response } from 'express'
import fs from 'fs'
import { transcribeWithWhisperAPI } from '../services/whisperService'

export const transcribeWithWhisper = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier audio fourni' })
    }

    // Vérifier que l'API key OpenAI est configurée
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key non configurée. Veuillez ajouter OPENAI_API_KEY dans le fichier .env',
      })
    }

    const filePath = req.file.path

    try {
      // Transcrire avec l'API Whisper
      const transcription = await transcribeWithWhisperAPI(filePath)

      // Supprimer le fichier temporaire
      fs.unlinkSync(filePath)

      res.json({ text: transcription })
    } catch (error: any) {
      // Supprimer le fichier temporaire en cas d'erreur
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      console.error('Erreur Whisper:', error)
      res.status(500).json({
        error: 'Erreur lors de la transcription avec Whisper',
        details: error.message,
      })
    }
  } catch (error) {
    console.error('Erreur transcribeWithWhisper:', error)
    res.status(500).json({ error: 'Erreur lors de la transcription' })
  }
}
