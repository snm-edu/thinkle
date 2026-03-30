import { useState, useCallback } from 'react'
import { useGameStore } from '../stores/gameStore'
import { questions } from '../data/questions'
import { areas as areaData } from '../data/areas'
import ToolDrawer from '../components/ToolDrawer'

function renderTextWithBreaksAndTables(text: string) {
  const lines = text.split('\n')
  const blocks: { type: 'text' | 'table'; lines: string[] }[] = []
  let current: { type: 'text' | 'table'; lines: string[] } | null = null

  for (const line of lines) {
    const isTableLine = line.trim().startsWith('|') && line.trim().endsWith('|')
    if (isTableLine) {
      if (!current || current.type !== 'table') {
        current = { type: 'table', lines: [] }
        blocks.push(current)
      }
      current.lines.push(line)
    } else {
      if (!current || current.type !== 'text') {
        current = { type: 'text', lines: [] }
        blocks.push(current)
      }
      current.lines.push(line)
    }
  }

  return blocks.map((block, bi) => {
    if (block.type === 'table') {
      const rows = block.lines
        .filter((l) => !l.trim().match(/^\|[\s-|]+\|$/))
        .map((l) =>
          l
            .split('|')
            .filter((_, i, arr) => i > 0 && i < arr.length - 1)
            .map((cell) => cell.trim())
        )
      return (
        <div key={bi} className="overflow-x-auto my-3">
          <table className="mx-auto border-collapse text-sm">
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`border border-library-brown/30 px-3 py-1.5 ${
                        ri === 0
                          ? 'bg-library-gold/15 font-bold text-library-dark'
                          : 'text-library-dark/80'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    return (
      <span key={bi}>
        {block.lines.map((line, li) => (
          <span key={li}>
            {line}
            {li < block.lines.length - 1 && <br />}
          </span>
        ))}
      </span>
    )
  })
}

export default function QuizScreen() {
  const currentAreaId = useGameStore((s) => s.currentAreaId)
  const currentQuestionId = useGameStore((s) => s.currentQuestionId)
  const areasProgress = useGameStore((s) => s.areas)
  const setScreen = useGameStore((s) => s.setScreen)
  const answerQuestion = useGameStore((s) => s.answerQuestion)

  const [localAttempts, setLocalAttempts] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [flashState, setFlashState] = useState<'none' | 'correct' | 'wrong'>('none')
  const [hintText, setHintText] = useState<string | null>(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [locked, setLocked] = useState(false)
  const [toolOpen, setToolOpen] = useState(false)

  const area = areaData.find((a) => a.id === currentAreaId)
  const question = questions.find((q) => q.id === currentQuestionId)

  const areaProgress = currentAreaId ? areasProgress[currentAreaId] : null
  const solvedCount = areaProgress
    ? Object.values(areaProgress.questions).filter((q) => q.correct).length
    : 0
  const totalCount = area ? area.questionIds.length : 5

  const handleAnswer = useCallback(
    (label: string) => {
      if (locked || !question || !currentAreaId) return
      setSelectedChoice(label)

      if (label === question.correctAnswer) {
        setFlashState('correct')
        setLocked(true)
        answerQuestion(question.id, currentAreaId, true)
        setTimeout(() => {
          setScreen('explanation')
        }, 800)
      } else {
        const newAttempts = localAttempts + 1
        setLocalAttempts(newAttempts)
        setFlashState('wrong')
        answerQuestion(question.id, currentAreaId, false)

        if (newAttempts >= 3) {
          setLocked(true)
          setShowCorrect(true)
          setHintText(null)
          setTimeout(() => {
            setScreen('explanation')
          }, 1500)
        } else {
          const hintIndex = Math.min(newAttempts - 1, question.hints.length - 1)
          if (hintIndex >= 0 && question.hints[hintIndex]) {
            setHintText(question.hints[hintIndex])
          }
          setTimeout(() => {
            setFlashState('none')
            setSelectedChoice(null)
          }, 600)
        }
      }
    },
    [locked, question, currentAreaId, localAttempts, answerQuestion, setScreen]
  )

  const handleThinkingTool = () => {
    setToolOpen(true)
  }

  if (!question || !area) {
    return (
      <div className="flex-1 flex items-center justify-center bg-library-cream text-library-dark">
        <p>問題が見つかりません</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-library-cream via-library-green/20 to-library-cream relative">
      {/* Correct flash overlay */}
      {flashState === 'correct' && (
        <div className="absolute inset-0 bg-library-correct/20 z-50 pointer-events-none animate-pulse" />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-library-paper/80 border-b border-library-light">
        <button
          onClick={() => setScreen('area')}
          className="text-library-gold text-sm font-bold px-2 py-1 rounded active:bg-library-gold/10 transition-colors"
        >
          ← 戻る
        </button>
        <div className="text-library-dark text-sm font-bold tracking-wide">
          {area.name} {area.emoji} {solvedCount}/{totalCount}
        </div>
        <div className="w-12" />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Book page card */}
        <div className="bg-library-paper rounded-lg shadow-lg border border-library-brown/20 p-5 mb-5">
          <div className="text-library-dark text-[15px] leading-relaxed whitespace-pre-wrap">
            {renderTextWithBreaksAndTables(question.text)}
          </div>
          {question.figure?.type === 'image' && (
            <div className="mt-4 flex justify-center">
              <img
                src={`${import.meta.env.BASE_URL}${question.figure.content}`}
                alt="問題の図"
                className="max-w-full h-auto rounded border border-library-brown/10"
              />
            </div>
          )}
        </div>

        {/* Hint display */}
        {hintText && (
          <div className="bg-library-hint/20 border border-library-hint/40 rounded-lg px-4 py-3 mb-4">
            <p className="text-library-hint text-xs font-bold mb-1">
              💡 ヒント {localAttempts}/{Math.min(question.hints.length, 2)}
            </p>
            <p className="text-library-dark text-sm leading-relaxed">{hintText}</p>
          </div>
        )}

        {/* Choices */}
        <div className="flex flex-col gap-3 mb-20">
          {question.choices.map((choice) => {
            const isSelected = selectedChoice === choice.label
            const isCorrectAnswer = choice.label === question.correctAnswer

            let btnClass =
              'w-full text-left px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all active:scale-[0.98]'

            if (showCorrect && isCorrectAnswer) {
              btnClass +=
                ' bg-library-correct/15 border-library-correct text-library-dark shadow-md'
            } else if (isSelected && flashState === 'wrong') {
              btnClass +=
                ' bg-library-wrong/15 border-library-wrong text-library-dark'
            } else if (isSelected && flashState === 'correct') {
              btnClass +=
                ' bg-library-correct/15 border-library-correct text-library-dark shadow-md'
            } else {
              btnClass +=
                ' bg-library-paper border-library-light text-library-dark hover:border-library-gold/60 hover:bg-library-green/15'
            }

            return (
              <button
                key={choice.label}
                onClick={() => handleAnswer(choice.label)}
                disabled={locked}
                className={btnClass}
              >
                <span className="inline-block w-7 h-7 leading-7 text-center rounded-full bg-library-gold/20 text-library-gold font-bold text-xs mr-3">
                  {choice.label}
                </span>
                {choice.text}
              </button>
            )
          })}
        </div>
      </div>

      {/* Thinking tool floating button */}
      <button
        onClick={handleThinkingTool}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-library-gold to-library-gold-light text-library-dark font-bold text-xs shadow-lg flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        🛠️
        <span className="sr-only">思考ツール</span>
      </button>

      {/* Tool Drawer */}
      <ToolDrawer
        isOpen={toolOpen}
        onClose={() => setToolOpen(false)}
        toolType={question.toolType}
        toolConfig={question.toolConfig}
      />
    </div>
  )
}
