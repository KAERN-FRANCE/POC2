import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { meetingsApi } from '../services/api'
import { Meeting } from '../types'
import { Clock, Calendar, Mic, Trash2, Search } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les réunions
  useEffect(() => {
    loadMeetings()
  }, [])

  const loadMeetings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await meetingsApi.getMeetings()
      setMeetings(data)
      setFilteredMeetings(data)
    } catch (err) {
      console.error('Erreur lors du chargement:', err)
      setError('Impossible de charger les réunions')
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrer les réunions
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMeetings(meetings)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = meetings.filter((meeting) =>
        meeting.title.toLowerCase().includes(query) ||
        meeting.transcript.some((segment) => segment.text.toLowerCase().includes(query))
      )
      setFilteredMeetings(filtered)
    }
  }, [searchQuery, meetings])

  // Supprimer une réunion
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réunion ?')) {
      return
    }

    try {
      await meetingsApi.deleteMeeting(id)
      setMeetings(meetings.filter((m) => m.id !== id))
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      alert('Impossible de supprimer la réunion')
    }
  }

  // Formater la durée
  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    if (h > 0) {
      return `${h}h ${m}m`
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
        <p className="mt-4 text-gray-600">Chargement des réunions...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes réunions</h1>
          <p className="text-gray-600 mt-1">
            {meetings.length} réunion{meetings.length !== 1 ? 's' : ''} enregistrée
            {meetings.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Link
          to="/record"
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
        >
          <Mic className="w-5 h-5" />
          <span>Nouvelle réunion</span>
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher dans les réunions..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Liste des réunions */}
      {filteredMeetings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Mic className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'Aucune réunion trouvée' : 'Aucune réunion enregistrée'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Essayez avec d\'autres mots-clés'
              : 'Commencez par enregistrer votre première réunion'}
          </p>
          {!searchQuery && (
            <Link
              to="/record"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Mic className="w-5 h-5" />
              <span>Nouvelle réunion</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <Link to={`/meetings/${meeting.id}`} className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {meeting.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
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
                      <span className="text-gray-500">
                        {meeting.transcript.length} segment{meeting.transcript.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {meeting.transcript.length > 0 && (
                    <p className="mt-3 text-gray-700 line-clamp-2">
                      {meeting.transcript.slice(0, 3).map((s) => s.text).join(' ')}
                    </p>
                  )}
                </Link>

                <button
                  onClick={() => handleDelete(meeting.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MeetingsPage
