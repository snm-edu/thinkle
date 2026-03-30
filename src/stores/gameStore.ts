import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, ScreenType, AreaProgress, QuestionProgress } from '../types'
import { areas } from '../data/areas'

function createInitialAreas(): Record<number, AreaProgress> {
  const result: Record<number, AreaProgress> = {}
  for (const area of areas) {
    const questions: Record<number, QuestionProgress> = {}
    for (const qId of area.questionIds) {
      questions[qId] = { answered: false, correct: false, attempts: 0, stars: 0 }
    }
    result[area.id] = {
      unlocked: area.id === 1,
      cleared: false,
      questions,
    }
  }
  return result
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: 'title' as ScreenType,
      currentAreaId: null,
      currentQuestionId: null,
      areas: createInitialAreas(),
      escapePercent: 0,
      prologueSeen: false,

      setScreen: (screen) => set({ screen }),

      setCurrentArea: (areaId) => set({ currentAreaId: areaId }),

      setCurrentQuestion: (questionId) => set({ currentQuestionId: questionId }),

      answerQuestion: (questionId, areaId, correct) => {
        const state = get()
        const areaProgress = { ...state.areas[areaId] }
        const qProgress = { ...areaProgress.questions[questionId] }

        qProgress.attempts += 1
        if (correct) {
          qProgress.answered = true
          qProgress.correct = true
          qProgress.stars = Math.max(4 - qProgress.attempts, 1)
        }

        areaProgress.questions = { ...areaProgress.questions, [questionId]: qProgress }

        // Check if area is cleared (all 5 questions answered correctly)
        const allCorrect = Object.values(areaProgress.questions).every(q => q.correct)
        if (allCorrect) {
          areaProgress.cleared = true
        }

        const newAreas = { ...state.areas, [areaId]: areaProgress }

        // Unlock next area
        if (areaProgress.cleared && areaId < 6) {
          const nextArea = { ...newAreas[areaId + 1] }
          nextArea.unlocked = true
          newAreas[areaId + 1] = nextArea
        }

        const escapePercent = computeEscape(newAreas)

        set({ areas: newAreas, escapePercent })
      },

      resetGame: () => set({
        screen: 'title',
        currentAreaId: null,
        currentQuestionId: null,
        areas: createInitialAreas(),
        escapePercent: 0,
        prologueSeen: false,
      }),

      computeEscapePercent: () => {
        return computeEscape(get().areas)
      },
    }),
    {
      name: 'thinking-escape-save',
    }
  )
)

function computeEscape(areas: Record<number, AreaProgress>): number {
  let total = 0
  let correct = 0
  for (const area of Object.values(areas)) {
    for (const q of Object.values(area.questions)) {
      total++
      if (q.correct) correct++
    }
  }
  return total > 0 ? Math.round((correct / total) * 100) : 0
}
