import { useState, useEffect } from 'react'
import { FactCheckAlert as AlertType } from '../types'
import { factCheckApi } from '../services/api'
import FactCheckAlert from './FactCheckAlert'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface AlertsPanelProps {
  meetingId: string
  realTimeAlerts?: AlertType[]
}

const AlertsPanel = ({ meetingId, realTimeAlerts = [] }: AlertsPanelProps) => {
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all')
  const [loading, setLoading] = useState(true)

  // Charger les alertes
  useEffect(() => {
    loadAlerts()
  }, [meetingId])

  // Ajouter les alertes en temps réel
  useEffect(() => {
    if (realTimeAlerts.length > 0) {
      setAlerts((prev) => {
        // Éviter les doublons
        const newAlerts = realTimeAlerts.filter(
          (newAlert) => !prev.some((a) => a.id === newAlert.id)
        )
        return [...newAlerts, ...prev]
      })
    }
  }, [realTimeAlerts])

  const loadAlerts = async () => {
    try {
      setLoading(true)
      const data = await factCheckApi.getAlerts(meetingId)
      setAlerts(data)
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledge = async (alertId: string) => {
    try {
      await factCheckApi.updateAlertStatus(alertId, 'acknowledged')
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
        )
      )
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const handleResolve = async (alertId: string) => {
    try {
      await factCheckApi.updateAlertStatus(alertId, 'resolved')
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === alertId ? { ...alert, status: 'resolved' } : alert))
      )
    } catch (error) {
      console.error('Erreur lors de la résolution:', error)
    }
  }

  const handleDismiss = async (alertId: string) => {
    try {
      await factCheckApi.deleteAlert(alertId)
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true
    return alert.status === filter
  })

  const stats = {
    total: alerts.length,
    active: alerts.filter((a) => a.status === 'active').length,
    acknowledged: alerts.filter((a) => a.status === 'acknowledged').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
    critical: alerts.filter((a) => a.severity === 'critical' && a.status === 'active').length,
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Chargement des alertes...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header & Stats */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <span>Alertes de Fact-Checking</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-gray-50 rounded p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="bg-red-50 rounded p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <div className="text-xs text-red-700">Critiques</div>
          </div>
          <div className="bg-orange-50 rounded p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
            <div className="text-xs text-orange-700">Actives</div>
          </div>
          <div className="bg-blue-50 rounded p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.acknowledged}</div>
            <div className="text-xs text-blue-700">Reconnues</div>
          </div>
          <div className="bg-green-50 rounded p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-xs text-green-700">Résolues</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            filter === 'active'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Actives
        </button>
        <button
          onClick={() => setFilter('acknowledged')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            filter === 'acknowledged'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Reconnues
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            filter === 'resolved'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Résolues
        </button>
      </div>

      {/* Liste des alertes */}
      <div className="max-h-[600px] overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">
              {filter === 'all'
                ? 'Aucune alerte pour cette réunion'
                : `Aucune alerte ${filter === 'active' ? 'active' : filter === 'acknowledged' ? 'reconnue' : 'résolue'}`}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <FactCheckAlert
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
              onDismiss={handleDismiss}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default AlertsPanel
