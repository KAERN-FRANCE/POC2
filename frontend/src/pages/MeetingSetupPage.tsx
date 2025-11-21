import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { meetingsApi } from '../services/api'
import { Meeting } from '../types'
import DocumentsManager from '../components/DocumentsManager'
import FactCheckConfig from '../components/FactCheckConfig'
import { ArrowLeft, Play, FileText, Settings } from 'lucide-react'

const MeetingSetupPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'documents' | 'config'>('documents')

  useEffect(() => {
    if (id) {
      loadMeeting(id)
    }
  }, [id])

  const loadMeeting = async (meetingId: string) => {
    try {
      setLoading(true)
      const data = await meetingsApi.getMeeting(meetingId)
      setMeeting(data)
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      alert('Impossible de charger la réunion')
      navigate('/meetings')
    } finally {
      setLoading(false)
    }
  }

  const handleStartRecording = () => {
    if (meeting) {
      navigate(`/record/${meeting.id}`)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Chargement de la réunion...</p>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Réunion introuvable</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <button
            onClick={() => navigate('/meetings')}
            className="inline-flex items-center space-x-1 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux réunions</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900">{meeting.title}</h1>
          <p className="text-gray-600 mt-2">
            Configuration du fact-checking et documents de référence
          </p>
        </div>

        <button
          onClick={handleStartRecording}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105"
        >
          <Play className="w-5 h-5" />
          <span>Démarrer la réunion</span>
        </button>
      </div>

      {/* Informations importantes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Préparation de la réunion</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • <strong>Étape 1 :</strong> Uploadez vos documents de référence (rapports financiers,
            présentations, données...)
          </li>
          <li>
            • <strong>Étape 2 :</strong> Configurez la sensibilité et les types de vérifications
          </li>
          <li>
            • <strong>Étape 3 :</strong> Lancez l'enregistrement - l'IA analysera en temps réel !
          </li>
        </ul>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'documents'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Documents de référence</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'config'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configuration</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'documents' ? (
        <DocumentsManager meetingId={meeting.id} />
      ) : (
        <FactCheckConfig meetingId={meeting.id} />
      )}
    </div>
  )
}

export default MeetingSetupPage
