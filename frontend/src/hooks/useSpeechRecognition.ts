import { useState, useRef, useCallback, useEffect } from 'react'
import { TranscriptSegment } from '../types'

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

export const useSpeechRecognition = (language: string = 'fr-FR') => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([])
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const startTimeRef = useRef<number>(0)

  // Vérifier le support de l'API Web Speech
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = language
      recognition.maxAlternatives = 1

      // Événement de résultat
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = ''
        let final = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcriptText = result[0].transcript

          if (result.isFinal) {
            final += transcriptText + ' '
          } else {
            interim += transcriptText
          }
        }

        if (interim) {
          setInterimTranscript(interim)
        }

        if (final) {
          const segment: TranscriptSegment = {
            id: `segment-${Date.now()}-${Math.random()}`,
            text: final.trim(),
            timestamp: Date.now() - startTimeRef.current,
            confidence: event.results[event.resultIndex]?.[0]?.confidence || 0,
          }

          setTranscript((prev) => [...prev, segment])
          setInterimTranscript('')
        }
      }

      // Événement d'erreur
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Erreur de reconnaissance vocale:', event.error)

        if (event.error === 'no-speech') {
          // Pas d'erreur critique, continuer d'écouter
          return
        }

        if (event.error === 'network') {
          setError('Erreur réseau. Vérifiez votre connexion internet.')
        } else if (event.error === 'not-allowed') {
          setError('Accès au microphone refusé. Veuillez autoriser l\'accès.')
        } else {
          setError(`Erreur: ${event.error}`)
        }

        setIsListening(false)
      }

      // Événement de fin
      recognition.onend = () => {
        if (isListening) {
          // Redémarrer automatiquement si on écoute toujours
          recognition.start()
        }
      }

      recognitionRef.current = recognition
    } else {
      setIsSupported(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language, isListening])

  // Démarrer l'écoute
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      setError('La reconnaissance vocale n\'est pas supportée par votre navigateur.')
      return false
    }

    try {
      setError(null)
      setTranscript([])
      setInterimTranscript('')
      startTimeRef.current = Date.now()
      recognitionRef.current.start()
      setIsListening(true)
      return true
    } catch (error) {
      console.error('Erreur lors du démarrage de la reconnaissance:', error)
      setError('Impossible de démarrer la reconnaissance vocale.')
      return false
    }
  }, [isSupported])

  // Arrêter l'écoute
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  // Réinitialiser la transcription
  const resetTranscript = useCallback(() => {
    setTranscript([])
    setInterimTranscript('')
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}
