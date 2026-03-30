import { useGameStore } from '../stores/gameStore'
import { areas } from '../data/areas'
import { questions } from '../data/questions'

export default function AreaScreen() {
  const currentAreaId = useGameStore((s) => s.currentAreaId)
  const areaProgress = useGameStore((s) => s.areas)
  const setCurrentQuestion = useGameStore((s) => s.setCurrentQuestion)
  const setScreen = useGameStore((s) => s.setScreen)

  const area = areas.find((a) => a.id === currentAreaId)
  if (!area) return null

  const progress = areaProgress[area.id]
  const areaQuestions = area.questionIds.map((qId) => {
    const question = questions.find((q) => q.id === qId)
    const qProgress = progress?.questions[qId]
    return { question, qProgress, id: qId }
  })

  const correctCount = areaQuestions.filter(
    (q) => q.qProgress?.correct
  ).length

  const handleQuestionTap = (questionId: number) => {
    setCurrentQuestion(questionId)
    setScreen('quiz')
  }

  const renderStars = (stars: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`text-sm ${
              i <= stars ? 'text-library-gold' : 'text-library-green/50'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-library-cream">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button
          onClick={() => setScreen('map')}
          className="text-sm text-library-gold-light hover:text-library-gold transition-colors shrink-0"
        >
          &larr; マップへ戻る
        </button>
        <div className="flex-1" />
        <span className="text-sm text-library-gold-light font-bold">
          🔑 {correctCount}/{area.questionIds.length}
        </span>
      </div>

      {/* Area info */}
      <div className="px-4 pt-2 pb-4 text-center">
        <div className="text-4xl mb-2">{area.emoji}</div>
        <h2 className="text-library-dark text-xl font-bold tracking-wide">
          {area.name}
        </h2>
        <p className="text-library-dark/50 text-xs mt-1">
          {area.description}
        </p>
      </div>

      {/* Bookshelf divider */}
      <div className="px-4 pb-2">
        <div className="h-px bg-gradient-to-r from-transparent via-library-gold/40 to-transparent" />
      </div>

      {/* Question list (books on shelf) */}
      <div className="flex-1 px-4 pb-6 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {areaQuestions.map((item, index) => {
            const isCorrect = item.qProgress?.correct
            const hasAttempted =
              item.qProgress && item.qProgress.attempts > 0
            const stars = item.qProgress?.stars ?? 0

            return (
              <button
                key={item.id}
                onClick={() => handleQuestionTap(item.id)}
                className={`
                  relative flex items-center gap-4 rounded-xl p-4 text-left
                  transition-all duration-200 border-2
                  ${
                    isCorrect
                      ? 'bg-library-green/25 border-library-correct/40 hover:border-library-correct/60'
                      : 'bg-library-paper border-library-light hover:border-library-gold/50 hover:bg-library-green/15'
                  }
                  active:scale-[0.98]
                `}
              >
                {/* Book number badge */}
                <div
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                    font-bold text-lg
                    ${
                      isCorrect
                        ? 'bg-library-correct/20 text-library-correct'
                        : 'bg-library-gold/15 text-library-gold'
                    }
                  `}
                >
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-sm font-bold ${
                        isCorrect
                          ? 'text-library-dark'
                          : 'text-library-dark/90'
                      }`}
                    >
                      第{index + 1}問
                    </span>
                    {isCorrect && (
                      <span className="text-xs text-library-correct font-bold">
                        正解済み
                      </span>
                    )}
                    {hasAttempted && !isCorrect && (
                      <span className="text-xs text-library-hint font-bold">
                        挑戦中
                      </span>
                    )}
                  </div>

                  {/* Stars or status */}
                  {isCorrect ? (
                    renderStars(stars)
                  ) : (
                    <span className="text-xs text-library-dark/40">
                      タップして挑戦
                    </span>
                  )}
                </div>

                {/* Arrow */}
                <div className="text-library-gold/50 text-lg shrink-0">
                  &#8250;
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
