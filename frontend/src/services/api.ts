import axios from 'axios'
import { Meeting, TranscriptSegment, ReferenceDocument, FactCheckAlert, FactCheckConfig } from '../types'

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

// API pour les documents de référence
export const documentsApi = {
  // Récupérer tous les documents
  getAllDocuments: async (): Promise<ReferenceDocument[]> => {
    const response = await api.get('/documents')
    return response.data
  },

  // Récupérer les documents d'une réunion
  getDocumentsByMeeting: async (meetingId: string): Promise<ReferenceDocument[]> => {
    const response = await api.get(`/documents/meeting/${meetingId}`)
    return response.data
  },

  // Récupérer un document
  getDocument: async (documentId: string): Promise<ReferenceDocument> => {
    const response = await api.get(`/documents/${documentId}`)
    return response.data
  },

  // Upload un document
  uploadDocument: async (
    file: File,
    meetingId?: string,
    title?: string,
    category?: string
  ): Promise<ReferenceDocument> => {
    const formData = new FormData()
    formData.append('document', file)
    if (meetingId) formData.append('meetingId', meetingId)
    if (title) formData.append('title', title)
    if (category) formData.append('category', category)

    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Supprimer un document
  deleteDocument: async (documentId: string): Promise<void> => {
    await api.delete(`/documents/${documentId}`)
  },
}

// API pour le fact-checking
export const factCheckApi = {
  // Récupérer la configuration
  getConfig: async (meetingId: string): Promise<FactCheckConfig> => {
    const response = await api.get(`/fact-check/config/${meetingId}`)
    return response.data
  },

  // Mettre à jour la configuration
  updateConfig: async (config: FactCheckConfig): Promise<FactCheckConfig> => {
    const response = await api.post('/fact-check/config', config)
    return response.data
  },

  // Analyser un segment
  analyzeSegment: async (
    meetingId: string,
    segmentId: string,
    segmentText: string,
    timestamp: number
  ): Promise<any> => {
    const response = await api.post('/fact-check/analyze', {
      meetingId,
      segmentId,
      segmentText,
      timestamp,
    })
    return response.data
  },

  // Récupérer les alertes d'une réunion
  getAlerts: async (meetingId: string): Promise<FactCheckAlert[]> => {
    const response = await api.get(`/fact-check/alerts/${meetingId}`)
    return response.data
  },

  // Mettre à jour le statut d'une alerte
  updateAlertStatus: async (
    alertId: string,
    status: 'active' | 'acknowledged' | 'resolved'
  ): Promise<void> => {
    await api.put(`/fact-check/alerts/${alertId}/status`, { status })
  },

  // Supprimer une alerte
  deleteAlert: async (alertId: string): Promise<void> => {
    await api.delete(`/fact-check/alerts/${alertId}`)
  },
}

export default api
