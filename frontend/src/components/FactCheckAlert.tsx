import { FactCheckAlert as AlertType } from '../types'
import { AlertTriangle, CheckCircle, XCircle, Info, FileText } from 'lucide-react'

interface FactCheckAlertProps {
  alert: AlertType
  onAcknowledge?: (alertId: string) => void
  onResolve?: (alertId: string) => void
  onDismiss?: (alertId: string) => void
}

const FactCheckAlert = ({
  alert,
  onAcknowledge,
  onResolve,
  onDismiss,
}: FactCheckAlertProps) => {
  const getSeverityConfig = () => {
    switch (alert.severity) {
      case 'critical':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-300',
          textColor: 'text-red-900',
          icon: <XCircle className="w-6 h-6 text-red-600" />,
          label: 'CRITIQUE',
        }
      case 'high':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-300',
          textColor: 'text-orange-900',
          icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
          label: 'ÉLEVÉ',
        }
      case 'medium':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-300',
          textColor: 'text-yellow-900',
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
          label: 'MOYEN',
        }
      case 'low':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-300',
          textColor: 'text-blue-900',
          icon: <Info className="w-6 h-6 text-blue-600" />,
          label: 'FAIBLE',
        }
    }
  }

  const config = getSeverityConfig()

  const formatTimestamp = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const s = seconds % 60
    const m = minutes % 60

    if (hours > 0) {
      return `${hours}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div
      className={`${config.bgColor} border-2 ${config.borderColor} rounded-lg p-4 mb-4 animate-pulse-slow`}
    >
      <div className="flex items-start space-x-3">
        {config.icon}

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${config.textColor} bg-white`}
              >
                {config.label}
              </span>
              <span className="text-sm font-mono text-gray-600">
                {formatTimestamp(alert.timestamp)}
              </span>
              <span className="text-xs text-gray-500">
                Confiance: {Math.round(alert.confidence * 100)}%
              </span>
            </div>

            {alert.status !== 'resolved' && (
              <div className="flex space-x-2">
                {alert.status === 'active' && onAcknowledge && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="text-xs bg-white hover:bg-gray-100 text-gray-700 px-3 py-1 rounded border border-gray-300 transition-colors"
                  >
                    Accuser réception
                  </button>
                )}
                {onResolve && (
                  <button
                    onClick={() => onResolve(alert.id)}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    Résoudre
                  </button>
                )}
                {onDismiss && (
                  <button
                    onClick={() => onDismiss(alert.id)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-3">
            {/* Déclaration */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Déclaration :</h4>
              <p className={`text-sm ${config.textColor} italic`}>"{alert.claimedStatement}"</p>
            </div>

            {/* Problème */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Problème détecté :</h4>
              <p className="text-sm text-gray-800">{alert.issue}</p>
            </div>

            {/* Information correcte */}
            {alert.correctInformation && (
              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-1 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Information correcte :</span>
                </h4>
                <p className="text-sm text-green-800 font-medium bg-green-100 p-2 rounded">
                  {alert.correctInformation}
                </p>
              </div>
            )}

            {/* Sources */}
            {alert.sources && alert.sources.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>Sources :</span>
                </h4>
                <ul className="text-xs text-gray-600 list-disc list-inside">
                  {alert.sources.map((source, idx) => (
                    <li key={idx}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Status badge */}
          {alert.status === 'acknowledged' && (
            <div className="mt-3">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                ✓ Accusé réception
              </span>
            </div>
          )}

          {alert.status === 'resolved' && (
            <div className="mt-3">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                ✓ Résolu
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FactCheckAlert
