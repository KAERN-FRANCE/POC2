export interface Meeting {
  id: string
  title: string
  date: string
  duration: number
  transcript: TranscriptSegment[]
  audioUrl?: string
  status: 'recording' | 'completed' | 'processing'
}

export interface TranscriptSegment {
  id: string
  text: string
  timestamp: number
  confidence?: number
  speaker?: string
}

export interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioLevel: number
}

export interface TranscriptionConfig {
  mode: 'webspeech' | 'whisper'
  language: string
  continuous: boolean
}
