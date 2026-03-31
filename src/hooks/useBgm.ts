import { useEffect, useRef, useCallback } from 'react'
import { useGameStore } from '../stores/gameStore'
import type { ScreenType } from '../types'

const BASE = import.meta.env.BASE_URL

// Screen → BGM file mapping
// map/area share the same BGM, quiz/explanation share the same BGM
const screenBgmMap: Record<ScreenType, string> = {
  title: `${BASE}audio/title-bgm.mp3`,
  prologue: `${BASE}audio/Story-bgm.mp3`,
  map: `${BASE}audio/map-bgm.mp3`,
  area: `${BASE}audio/map-bgm.mp3`,
  quiz: `${BASE}audio/quiz-bgm.mp3`,
  explanation: `${BASE}audio/quiz-bgm.mp3`,
  areaClear: `${BASE}audio/clear-bgm.mp3`,
  ending: `${BASE}audio/end-bgm.mp3`,
}

// Fade out duration in ms
const FADE_MS = 600
const FADE_STEP = 30

export function useBgm() {
  const screen = useGameStore((s) => s.screen)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentSrcRef = useRef<string>('')
  const userInteractedRef = useRef(false)

  // Attempt to play (browsers require user gesture first)
  const tryPlay = useCallback((audio: HTMLAudioElement) => {
    audio.play().catch(() => {
      // Autoplay blocked — will start on next user interaction
    })
  }, [])

  // Enable audio after first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      userInteractedRef.current = true
      if (audioRef.current && audioRef.current.paused) {
        tryPlay(audioRef.current)
      }
      // Remove after first interaction
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
    window.addEventListener('click', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [tryPlay])

  // Switch BGM when screen changes
  useEffect(() => {
    const newSrc = screenBgmMap[screen]
    if (!newSrc || newSrc === currentSrcRef.current) return

    const prevAudio = audioRef.current

    // Fade out previous BGM, then start new one
    const startNew = () => {
      const audio = new Audio(newSrc)
      audio.loop = true
      audio.volume = 0
      audioRef.current = audio
      currentSrcRef.current = newSrc

      if (userInteractedRef.current) {
        tryPlay(audio)
      }

      // Fade in
      let vol = 0
      const fadeIn = setInterval(() => {
        vol = Math.min(vol + FADE_STEP / FADE_MS, 1)
        audio.volume = vol
        if (vol >= 1) clearInterval(fadeIn)
      }, FADE_STEP)
    }

    if (prevAudio && !prevAudio.paused) {
      // Fade out
      let vol = prevAudio.volume
      const fadeOut = setInterval(() => {
        vol = Math.max(vol - FADE_STEP / FADE_MS, 0)
        prevAudio.volume = vol
        if (vol <= 0) {
          clearInterval(fadeOut)
          prevAudio.pause()
          prevAudio.src = ''
          startNew()
        }
      }, FADE_STEP)
    } else {
      if (prevAudio) {
        prevAudio.pause()
        prevAudio.src = ''
      }
      startNew()
    }

    return () => {
      // Cleanup only on unmount
    }
  }, [screen, tryPlay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])
}
