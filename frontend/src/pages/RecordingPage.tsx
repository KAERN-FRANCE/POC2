import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import RecordingControls from '../components/RecordingControls'
import AudioVisualizer from '../components/AudioVisualizer'
import TranscriptDisplay from '../components/TranscriptDisplay'
import { meetingsApi } from '../services/api'
import { Meeting } from '../types'
import { Save, AlertCircle } from 'lucide-react'

const RecordingPage = () => {
  const navigate = useNavigate()
  const [meetingTitle, setMeetingTitle] = useState('')
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTitleInput, setShowTitleInput] = useState(true)

  const {
    recordingState,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useAudioRecorder()

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition('fr-FR')

  // Démarrer l'enregistrement et la transcription
  const handleStart = async () => {
    if (!meetingTitle.trim()) {
      setError('Veuillez donner un nom à votre réunion')
      return
    }

    try {
      setError(null)

      // Créer la réunion
      const meeting = await meetingsApi.createMeeting(meetingTitle)
      setCurrentMeeting(meeting)
      setShowTitleInput(false)

      // Démarrer l'enregistrement audio
      const audioStarted = await startRecording()
      if (!audioStarted) {
        setError('Impossible d\'accéder au microphone. Veuillez vérifier les autorisations.')
        return
      }

      // Démarrer la transcription
      if (isSupported) {
        const speechStarted = startListening()
        if (!speechStarted) {
          setError('Impossible de démarrer la transcription vocale.')
        }
      } else {
        setError(
          'La reconnaissance vocale n\'est pas supportée par votre navigateur. L\'enregistrement audio continuera.'
        )
      }
    } catch (err) {
      console.error('Erreur lors du démarrage:', err)
      setError('Une erreur est survenue lors du démarrage de l\'enregistrement.')
    }
  }

  // Arrêter l'enregistrement
  const handleStop = async () => {
    try {
      setIsSaving(true)

      // Arrêter la transcription
      stopListening()

      // Arrêter l'enregistrement et obtenir le blob audio
      const audioBlob = await stopRecording()

      if (currentMeeting) {
        // Sauvegarder la transcription
        const updatedMeeting = await meetingsApi.updateMeeting(currentMeeting.id, {
          transcript,
          duration: recordingState.duration,
          status: 'completed',
        })

        // Upload l'audio
        if (audioBlob.size > 0) {
          await meetingsApi.uploadAudio(currentMeeting.id, audioBlob)
        }

        // Rediriger vers la page de détails
        navigate(`/meetings/${currentMeeting.id}`)
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
      setError('Une erreur est survenue lors de la sauvegarde de l\'enregistrement.')
    } finally {
      setIsSaving(false)
    }
  }

  // Synchroniser les segments de transcription avec le backend
  useEffect(() => {
    if (currentMeeting && transcript.length > 0) {
      const lastSegment = transcript[transcript.length - 1]
      meetingsApi
        .addTranscriptSegment(currentMeeting.id, {
          text: lastSegment.text,
          timestamp: lastSegment.timestamp,
          confidence: lastSegment.confidence,
        })
        .catch((err) => {
          console.error('Erreur lors de la synchronisation:', err)
        })
    }
  }, [transcript, currentMeeting])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Enregistrement de réunion</h1>
        <p className="text-gray-600 mt-2">
          Enregistrez et transcrivez votre réunion en temps réel
        </p>
      </div>

      {/* Erreurs */}
      {(error || speechError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <p className="text-sm text-red-700 mt-1">{error || speechError}</p>
          </div>
        </div>
      )}

      {/* Titre de la réunion */}
      {showTitleInput && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la réunion
          </label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="Ex: Réunion d'équipe - 20/11/2024"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleStart()
              }
            }}
          />
        </div>
      )}

      {currentMeeting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800">
            Réunion en cours : {currentMeeting.title}
          </h3>
        </div>
      )}

      {/* Visualiseur audio */}
      {recordingState.isRecording && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <AudioVisualizer
            audioLevel={recordingState.audioLevel}
            isRecording={recordingState.isRecording && !recordingState.isPaused}
          />
        </div>
      )}

      {/* Contrôles d'enregistrement */}
      <RecordingControls
        recordingState={recordingState}
        onStart={handleStart}
        onPause={pauseRecording}
        onResume={resumeRecording}
        onStop={handleStop}
        disabled={isSaving}
      />

      {/* Transcription */}
      {recordingState.isRecording && (
        <TranscriptDisplay segments={transcript} interimText={interimTranscript} />
      )}

      {/* Bouton de sauvegarde (si en cours d'enregistrement) */}
      {isSaving && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <Save className="w-5 h-5 animate-pulse" />
            <span>Sauvegarde en cours...</span>
          </div>
        </div>
      )}

      {/* Informations sur la compatibilité */}
      {!isSupported && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note :</strong> La transcription en temps réel n'est pas supportée par votre
            navigateur. L'enregistrement audio fonctionnera, mais la transcription devra être faite
            après coup avec l'API Whisper.
          </p>
        </div>
      )}
    </div>
  )
}

export default RecordingPage
