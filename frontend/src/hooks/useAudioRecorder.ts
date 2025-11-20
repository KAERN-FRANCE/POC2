import { useState, useRef, useCallback, useEffect } from 'react'
import { RecordingState } from '../types'

export const useAudioRecorder = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioLevel: 0,
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)
  const timerIntervalRef = useRef<NodeJS.Timeout>()

  // Mesurer le niveau audio
  const measureAudioLevel = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length
    const normalizedLevel = Math.min(average / 128, 1)

    setRecordingState((prev) => ({
      ...prev,
      audioLevel: normalizedLevel,
    }))

    animationFrameRef.current = requestAnimationFrame(measureAudioLevel)
  }, [])

  // Démarrer l'enregistrement
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      streamRef.current = stream

      // Configuration du MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Configuration de l'analyseur audio
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)

      analyser.fftSize = 256
      source.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      // Démarrer l'enregistrement
      mediaRecorder.start(100) // Capture de données toutes les 100ms
      startTimeRef.current = Date.now()

      // Démarrer le timer
      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000)
        setRecordingState((prev) => ({
          ...prev,
          duration: elapsed,
        }))
      }, 1000)

      setRecordingState((prev) => ({
        ...prev,
        isRecording: true,
        isPaused: false,
      }))

      measureAudioLevel()

      return true
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error)
      return false
    }
  }, [measureAudioLevel])

  // Mettre en pause
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      pausedTimeRef.current = Date.now() - startTimeRef.current
      setRecordingState((prev) => ({
        ...prev,
        isPaused: true,
      }))

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Reprendre
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      startTimeRef.current = Date.now() - pausedTimeRef.current
      setRecordingState((prev) => ({
        ...prev,
        isPaused: false,
      }))

      measureAudioLevel()
    }
  }, [measureAudioLevel])

  // Arrêter l'enregistrement
  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(new Blob())
        return
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        resolve(audioBlob)

        // Nettoyage
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }

        if (audioContextRef.current) {
          audioContextRef.current.close()
          audioContextRef.current = null
        }

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }

        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current)
        }

        audioChunksRef.current = []
        setRecordingState({
          isRecording: false,
          isPaused: false,
          duration: 0,
          audioLevel: 0,
        })
      }

      mediaRecorderRef.current.stop()
    })
  }, [])

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  return {
    recordingState,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  }
}
