export interface Meeting {
  id: string
  title: string
  date: string
  duration: number
  audioUrl?: string
  status: 'recording' | 'completed' | 'processing'
  transcript: TranscriptSegment[]
  factCheckingEnabled?: boolean
  alerts?: FactCheckAlert[]
}

export interface TranscriptSegment {
  id: string
  meetingId?: string
  text: string
  timestamp: number
  confidence?: number
  speaker?: string
}

export interface CreateMeetingDTO {
  title: string
}

export interface UpdateMeetingDTO {
  title?: string
  duration?: number
  status?: 'recording' | 'completed' | 'processing'
  transcript?: TranscriptSegment[]
}

export interface AddTranscriptSegmentDTO {
  text: string
  timestamp: number
  confidence?: number
  speaker?: string
}

// Documents de référence
export interface ReferenceDocument {
  id: string
  meetingId?: string
  title: string
  fileName: string
  fileType: string
  fileSize: number
  filePath: string
  extractedText: string
  uploadDate: string
  category?: string
  metadata?: Record<string, any>
}

export interface UploadDocumentDTO {
  meetingId?: string
  title?: string
  category?: string
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
