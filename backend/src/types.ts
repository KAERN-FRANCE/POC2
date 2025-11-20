export interface Meeting {
  id: string
  title: string
  date: string
  duration: number
  audioUrl?: string
  status: 'recording' | 'completed' | 'processing'
  transcript: TranscriptSegment[]
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
