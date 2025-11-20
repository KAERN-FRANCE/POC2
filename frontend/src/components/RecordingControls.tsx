import { Mic, Square, Pause, Play } from 'lucide-react'
import { RecordingState } from '../types'

interface RecordingControlsProps {
  recordingState: RecordingState
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  disabled?: boolean
}

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

const RecordingControls = ({
  recordingState,
  onStart,
  onPause,
  onResume,
  onStop,
  disabled = false,
}: RecordingControlsProps) => {
  const { isRecording, isPaused, duration } = recordingState

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col items-center space-y-6">
        {/* Timer */}
        <div className="text-4xl font-mono font-bold text-gray-900">
          {formatDuration(duration)}
        </div>

        {/* Recording indicator */}
        {isRecording && !isPaused && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Enregistrement en cours</span>
          </div>
        )}

        {isPaused && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-sm font-medium text-gray-700">En pause</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center space-x-4">
          {!isRecording ? (
            <button
              onClick={onStart}
              disabled={disabled}
              className="flex items-center justify-center w-16 h-16 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              <Mic className="w-8 h-8" />
            </button>
          ) : (
            <>
              {/* Pause/Resume */}
              <button
                onClick={isPaused ? onResume : onPause}
                className="flex items-center justify-center w-14 h-14 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
              </button>

              {/* Stop */}
              <button
                onClick={onStop}
                className="flex items-center justify-center w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                <Square className="w-8 h-8" />
              </button>
            </>
          )}
        </div>

        {/* Instructions */}
        {!isRecording && (
          <p className="text-sm text-gray-500 text-center max-w-md">
            Cliquez sur le microphone pour démarrer l'enregistrement et la transcription en temps
            réel
          </p>
        )}
      </div>
    </div>
  )
}

export default RecordingControls
