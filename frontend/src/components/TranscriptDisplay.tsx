import { TranscriptSegment } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface TranscriptDisplayProps {
  segments: TranscriptSegment[]
  interimText?: string
  showTimestamps?: boolean
}

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

const TranscriptDisplay = ({
  segments,
  interimText,
  showTimestamps = true,
}: TranscriptDisplayProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Transcription</h3>

      {segments.length === 0 && !interimText && (
        <p className="text-gray-500 italic text-center py-8">
          La transcription apparaîtra ici en temps réel...
        </p>
      )}

      <div className="space-y-3">
        {segments.map((segment) => (
          <div key={segment.id} className="flex gap-3">
            {showTimestamps && (
              <span className="text-xs text-gray-500 font-mono whitespace-nowrap mt-1">
                {formatTimestamp(segment.timestamp)}
              </span>
            )}
            <p className="text-gray-800 flex-1">
              {segment.text}
              {segment.confidence !== undefined && (
                <span className="ml-2 text-xs text-gray-400">
                  ({Math.round(segment.confidence * 100)}%)
                </span>
              )}
            </p>
          </div>
        ))}

        {interimText && (
          <div className="flex gap-3 opacity-60">
            {showTimestamps && (
              <span className="text-xs text-gray-500 font-mono whitespace-nowrap mt-1">
                ...
              </span>
            )}
            <p className="text-gray-600 italic flex-1">{interimText}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TranscriptDisplay
