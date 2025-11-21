export interface Meeting {
  id: string
  title: string
  date: string
  duration: number
  transcript: TranscriptSegment[]
  audioUrl?: string
  status: 'recording' | 'completed' | 'processing'
  factCheckingEnabled?: boolean
  alerts?: FactCheckAlert[]
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

// Documents de référence
export interface ReferenceDocument {
  id: string
  meetingId?: string
  title: string
  fileName: string
  fileType: string
  fileSize: number
  filePath?: string
  extractedText?: string
  uploadDate: string
  category?: string
  metadata?: Record<string, any>
}

// Alertes de fact-checking
export interface FactCheckAlert {
  id: string
  meetingId: string
  segmentId: string
  timestamp: number
  claimedStatement: string
  issue: string
  correctInformation?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  sources?: string[]
  status: 'active' | 'acknowledged' | 'resolved'
  createdAt: string
}

// Configuration du fact-checking
export interface FactCheckConfig {
  meetingId: string
  enabled: boolean
  sensitivity: 'low' | 'medium' | 'high'
  checkNumbers: boolean
  checkDates: boolean
  checkNames: boolean
  checkFinancials: boolean
  autoAlert: boolean
  minConfidence: number
}
