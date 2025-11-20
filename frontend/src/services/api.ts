import axios from 'axios'
import { Meeting, TranscriptSegment } from '../types'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const meetingsApi = {
  // Créer une nouvelle réunion
  createMeeting: async (title: string): Promise<Meeting> => {
    const response = await api.post('/meetings', { title })
    return response.data
  },

  // Récupérer toutes les réunions
  getMeetings: async (): Promise<Meeting[]> => {
    const response = await api.get('/meetings')
    return response.data
  },

  // Récupérer une réunion par ID
  getMeeting: async (id: string): Promise<Meeting> => {
    const response = await api.get(`/meetings/${id}`)
    return response.data
  },

  // Mettre à jour une réunion
  updateMeeting: async (id: string, data: Partial<Meeting>): Promise<Meeting> => {
    const response = await api.put(`/meetings/${id}`, data)
    return response.data
  },

  // Supprimer une réunion
  deleteMeeting: async (id: string): Promise<void> => {
    await api.delete(`/meetings/${id}`)
  },

  // Ajouter un segment de transcription
  addTranscriptSegment: async (
    meetingId: string,
    segment: Omit<TranscriptSegment, 'id'>
  ): Promise<TranscriptSegment> => {
    const response = await api.post(`/meetings/${meetingId}/transcript`, segment)
    return response.data
  },

  // Upload audio
  uploadAudio: async (meetingId: string, audioBlob: Blob): Promise<string> => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')
    const response = await api.post(`/meetings/${meetingId}/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.audioUrl
  },

  // Transcrire avec Whisper
  transcribeWithWhisper: async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'audio.webm')
    const response = await api.post('/transcribe/whisper', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.text
  },

  // Exporter la transcription
  exportTranscript: async (meetingId: string, format: 'txt' | 'json' | 'pdf'): Promise<Blob> => {
    const response = await api.get(`/meetings/${meetingId}/export/${format}`, {
      responseType: 'blob',
    })
    return response.data
  },
}

export default api
