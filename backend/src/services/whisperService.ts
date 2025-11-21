import OpenAI from 'openai'
import fs from 'fs'

// Initialiser le client OpenAI seulement si la clé est présente
let openai: OpenAI | null = null

const getOpenAIClient = (): OpenAI => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key non configurée. Ajoutez OPENAI_API_KEY dans le fichier .env')
  }

  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  return openai
}

export const transcribeWithWhisperAPI = async (audioFilePath: string): Promise<string> => {
  try {
    // Vérifier que le fichier existe
    if (!fs.existsSync(audioFilePath)) {
      throw new Error('Fichier audio introuvable')
    }

    // Créer un ReadStream pour l'upload
    const audioStream = fs.createReadStream(audioFilePath)

    // Appeler l'API Whisper
    const client = getOpenAIClient()
    const transcription = await client.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-1',
      language: 'fr', // Français par défaut
      response_format: 'text',
    })

    return transcription
  } catch (error: any) {
    console.error('Erreur lors de la transcription Whisper:', error)

    if (error.response) {
      throw new Error(`Erreur API OpenAI: ${error.response.status} - ${error.response.data}`)
    }

    throw new Error(`Erreur lors de la transcription: ${error.message}`)
  }
}

// Fonction alternative avec timestamps (si besoin de segments détaillés)
export const transcribeWithWhisperDetailed = async (
  audioFilePath: string
): Promise<{ text: string; segments?: any[] }> => {
  try {
    if (!fs.existsSync(audioFilePath)) {
      throw new Error('Fichier audio introuvable')
    }

    const audioStream = fs.createReadStream(audioFilePath)

    // Appeler l'API Whisper avec format JSON verbeux
    const client = getOpenAIClient()
    const transcription = await client.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-1',
      language: 'fr',
      response_format: 'verbose_json',
    })

    return {
      text: (transcription as any).text,
      segments: (transcription as any).segments || [],
    }
  } catch (error: any) {
    console.error('Erreur lors de la transcription Whisper détaillée:', error)
    throw new Error(`Erreur lors de la transcription: ${error.message}`)
  }
}
