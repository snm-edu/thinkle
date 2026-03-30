export type ScreenType =
  | 'title'
  | 'prologue'
  | 'map'
  | 'area'
  | 'quiz'
  | 'explanation'
  | 'areaClear'
  | 'ending'

export type ToolType =
  | 'conditionTable'
  | 'seatMap'
  | 'patternMemo'
  | 'calcPad'
  | 'vennDiagram'
  | 'shapeViewer'

export interface Choice {
  label: string
  text: string
}

export interface FigureData {
  type: 'svg' | 'table' | 'image' | 'text'
  content: string
}

export interface ToolConfig {
  rows?: string[]
  cols?: string[]
  seatType?: 'circle' | 'grid' | 'room'
  seatLabels?: string[]
  seatSlots?: number
}

export interface Question {
  id: number
  areaId: number
  text: string
  figure?: FigureData
  choices: Choice[]
  correctAnswer: string
  explanation: string
  toolType: ToolType
  toolConfig?: ToolConfig
  hints: string[]
}

export interface Area {
  id: number
  name: string
  emoji: string
  description: string
  questionIds: number[]
  color: string
}

export interface QuestionProgress {
  answered: boolean
  correct: boolean
  attempts: number
  stars: number // 3=1st try, 2=2nd, 1=3rd
}

export interface AreaProgress {
  unlocked: boolean
  cleared: boolean
  questions: Record<number, QuestionProgress>
}

export interface GameState {
  screen: ScreenType
  currentAreaId: number | null
  currentQuestionId: number | null
  areas: Record<number, AreaProgress>
  escapePercent: number
  prologueSeen: boolean
  setScreen: (screen: ScreenType) => void
  setCurrentArea: (areaId: number | null) => void
  setCurrentQuestion: (questionId: number | null) => void
  answerQuestion: (questionId: number, areaId: number, correct: boolean) => void
  resetGame: () => void
  computeEscapePercent: () => number
}
