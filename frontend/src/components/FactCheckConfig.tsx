import { useState, useEffect } from 'react'
import { FactCheckConfig as ConfigType } from '../types'
import { factCheckApi } from '../services/api'
import { Settings, Save, AlertCircle } from 'lucide-react'

interface FactCheckConfigProps {
  meetingId: string
  onConfigChange?: (config: ConfigType) => void
}

const FactCheckConfig = ({ meetingId, onConfigChange }: FactCheckConfigProps) => {
  const [config, setConfig] = useState<ConfigType>({
    meetingId,
    enabled: true,
    sensitivity: 'medium',
    checkNumbers: true,
    checkDates: true,
    checkNames: true,
    checkFinancials: true,
    autoAlert: true,
    minConfidence: 0.7,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadConfig()
  }, [meetingId])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const data = await factCheckApi.getConfig(meetingId)
      setConfig(data)
      onConfigChange?.(data)
    } catch (error) {
      console.error('Erreur lors du chargement de la config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)
      const updated = await factCheckApi.updateConfig(config)
      setConfig(updated)
      onConfigChange?.(updated)
      setMessage({ type: 'success', text: 'Configuration sauvegardée avec succès' })

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde de la configuration' })
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (updates: Partial<ConfigType>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Configuration du Fact-Checking</span>
        </h3>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <Save className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Activer/Désactiver */}
        <div className="flex items-center justify-between pb-6 border-b">
          <div>
            <h4 className="font-medium text-gray-900">Activer le fact-checking</h4>
            <p className="text-sm text-gray-600 mt-1">
              Analyser automatiquement les déclarations avec l'IA
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => updateConfig({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Sensibilité */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Sensibilité de détection</h4>
          <div className="grid grid-cols-3 gap-3">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => updateConfig({ sensitivity: level })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  config.sensitivity === level
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium capitalize">
                  {level === 'low' ? 'Faible' : level === 'medium' ? 'Moyenne' : 'Élevée'}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {level === 'low'
                    ? 'Erreurs flagrantes uniquement'
                    : level === 'medium'
                    ? 'Incohérences importantes'
                    : 'Toutes les incohérences'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Types de vérifications */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Types de vérifications</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.checkNumbers}
                onChange={(e) => updateConfig({ checkNumbers: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">Chiffres et statistiques</div>
                <div className="text-sm text-gray-600">
                  Vérifier l'exactitude des nombres et pourcentages
                </div>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.checkDates}
                onChange={(e) => updateConfig({ checkDates: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">Dates et périodes</div>
                <div className="text-sm text-gray-600">
                  Vérifier l'exactitude des dates et chronologies
                </div>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.checkNames}
                onChange={(e) => updateConfig({ checkNames: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">Noms et identités</div>
                <div className="text-sm text-gray-600">
                  Vérifier les noms de personnes et d'entreprises
                </div>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.checkFinancials}
                onChange={(e) => updateConfig({ checkFinancials: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">Données financières</div>
                <div className="text-sm text-gray-600">
                  Vérifier revenus, coûts, marges, et autres métriques financières
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Options avancées */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Options avancées</h4>

          <label className="flex items-center space-x-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={config.autoAlert}
              onChange={(e) => updateConfig({ autoAlert: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <div className="font-medium text-gray-900">Alertes automatiques</div>
              <div className="text-sm text-gray-600">
                Créer automatiquement des alertes pour les problèmes détectés
              </div>
            </div>
          </label>

          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Confiance minimum : {Math.round(config.minConfidence * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.minConfidence}
              onChange={(e) => updateConfig({ minConfidence: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Moins strict</span>
              <span>Plus strict</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Les alertes ne seront créées que si l'IA est confiant à plus de{' '}
              {Math.round(config.minConfidence * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FactCheckConfig
