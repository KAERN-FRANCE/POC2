import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { meetingsApi } from '../services/api'
import { Meeting } from '../types'
import {
  ArrowLeft,
  Download,
  Clock,
  Calendar,
  FileText,
  Trash2,
  Play,
  AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import TranscriptDisplay from '../components/TranscriptDisplay'

const MeetingDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    if (id) {
      loadMeeting(id)
    }
  }, [id])

  const loadMeeting = async (meetingId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await meetingsApi.getMeeting(meetingId)
      setMeeting(data)
    } catch (err) {
      console.error('Erreur lors du chargement:', err)
      setError('Impossible de charger la réunion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!meeting || !confirm('Êtes-vous sûr de vouloir supprimer cette réunion ?')) {
      return
    }

    try {
      await meetingsApi.deleteMeeting(meeting.id)
      navigate('/meetings')
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      alert('Impossible de supprimer la réunion')
    }
  }

  const handleExport = async (format: 'txt' | 'json' | 'pdf') => {
    if (!meeting) return

    try {
      setIsExporting(true)
      const blob = await meetingsApi.exportTranscript(meeting.id, format)

      // Télécharger le fichier
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${meeting.title.replace(/[^a-z0-9]/gi, '_')}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Erreur lors de l\'export:', err)
      alert('Impossible d\'exporter la transcription')
    } finally {
      setIsExporting(false)
    }
  }

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    if (h > 0) {
      return `${h}h ${m}m ${s}s`
    }
    if (m > 0) {
      return `${m}m ${s}s`
    }
    return `${s}s`
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Chargement de la réunion...</p>
      </div>
    )
  }

  if (error || !meeting) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-red-800">Erreur</h3>
            <p className="text-red-700 mt-1">{error || 'Réunion introuvable'}</p>
            <Link
              to="/meetings"
              className="inline-flex items-center space-x-1 mt-4 text-red-600 hover:text-red-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux réunions</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link
            to="/meetings"
            className="inline-flex items-center space-x-1 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux réunions</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">{meeting.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(meeting.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(meeting.duration)}</span>
            </div>

            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>
                {meeting.transcript.length} segment{meeting.transcript.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Actions</h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExport('txt')}
            disabled={isExporting}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export TXT</span>
          </button>

          <button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

          {meeting.audioUrl && (
            <a
              href={meeting.audioUrl}
              download
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Télécharger l'audio</span>
            </a>
          )}
        </div>

        {isExporting && (
          <p className="mt-4 text-sm text-gray-600">Export en cours...</p>
        )}
      </div>

      {/* Transcription */}
      <TranscriptDisplay segments={meeting.transcript} showTimestamps={true} />

      {/* Message si pas de transcription */}
      {meeting.transcript.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <FileText className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            Aucune transcription disponible
          </h3>
          <p className="text-yellow-800">
            Cette réunion n'a pas de transcription enregistrée.
          </p>
        </div>
      )}
    </div>
  )
}

export default MeetingDetailPage
