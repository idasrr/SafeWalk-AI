'use client'
import { useEffect, useRef, useCallback } from 'react'

export default function KeywordListener({ keyword, onDetected, active }) {
  const recogRef   = useRef(null)
  const activeRef  = useRef(active)
  const restartRef = useRef(null)

  useEffect(() => { activeRef.current = active }, [active])

  const startListening = useCallback(() => {
    if (!active || !keyword) return
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recog = new SpeechRecognition()
    recog.lang        = 'id-ID'
    recog.continuous  = true
    recog.interimResults = true
    recogRef.current  = recog

    recog.onresult = (e) => {
      let transcript = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript.toLowerCase()
      }
      const kw = keyword.toLowerCase().trim()
      if (transcript.includes(kw)) {
        recog.stop()
        onDetected(transcript)
      }
    }

    recog.onend = () => {
      if (activeRef.current) {
        restartRef.current = setTimeout(startListening, 800)
      }
    }

    recog.onerror = () => {
      if (activeRef.current) {
        restartRef.current = setTimeout(startListening, 1500)
      }
    }

    try { recog.start() } catch (_) {}
  }, [active, keyword, onDetected])

  useEffect(() => {
    if (active && keyword) {
      startListening()
    } else {
      recogRef.current?.stop()
      clearTimeout(restartRef.current)
    }
    return () => {
      recogRef.current?.stop()
      clearTimeout(restartRef.current)
    }
  }, [active, keyword, startListening])

  return null
}
