import { useGameStore } from '../stores/gameStore'
import { questions } from '../data/questions'
import { areas as areaData } from '../data/areas'

function starsDisplay(stars: number): string {
  if (stars >= 3) return '★★★'
  if (stars === 2) return '★★☆'
  return '★☆☆'
}

function starsLabel(stars: number): string {
  if (stars >= 3) return '1回目で正解！'
  if (stars === 2) return '2回目で正解！'
  return '3回目で正解'
}

export default function ExplanationScreen() {
  const currentAreaId = useGameStore((s) => s.currentAreaId)
  const currentQuestionId = useGameStore((s) => s.currentQuestionId)
  const areasProgress = useGameStore((s) => s.areas)
  const setScreen = useGameStore((s) => s.setScreen)
  const setCurrentQuestion = useGameStore((s) => s.setCurrentQuestion)

  const area = areaData.find((a) => a.id === currentAreaId)
  const question = questions.find((q) => q.id === currentQuestionId)
  const areaProgress = currentAreaId ? areasProgress[currentAreaId] : null
  const qProgress =
    areaProgress && currentQuestionId
      ? areaProgress.questions[currentQuestionId]
      : null

  const isCorrect = qProgress?.correct ?? false
  const stars = qProgress?.stars ?? 0
  const attempts = qProgress?.attempts ?? 0

  const handleNext = () => {
    if (!area || !areaProgress) return

    // Find next unsolved question in this area
    const nextUnsolved = area.questionIds.find(
      (qId) => !areaProgress.questions[qId]?.correct
    )

    if (nextUnsolved) {
      setCurrentQuestion(nextUnsolved)
      setScreen('quiz')
    } else {
      setScreen('areaClear')
    }
  }

  if (!question || !area) {
    return (
      <div className="flex-1 flex items-center justify-center bg-library-cream text-library-dark">
        <p>データが見つかりません</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-library-cream via-library-green/20 to-library-cream">
      {/* Header */}
      <div className="px-4 py-3 bg-library-paper/80 border-b border-library-light">
        <h2 className="text-library-gold text-center font-bold text-lg tracking-wider">
          📖 解説
        </h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Result badge */}
        <div className="text-center mb-5">
          {isCorrect ? (
            <>
              <div className="text-4xl text-library-gold mb-2">
                {starsDisplay(stars)}
              </div>
              <p className="text-library-correct font-bold text-lg">正解！</p>
              <p className="text-library-dark/60 text-sm mt-1">
                {starsLabel(stars)}
              </p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-2">😔</div>
              <p className="text-library-wrong font-bold text-lg">不正解</p>
              <p className="text-library-dark/60 text-sm mt-1">
                {attempts}回挑戦しました
              </p>
            </>
          )}
        </div>

        {/* Correct answer */}
        <div className="bg-library-gold/10 border border-library-gold/30 rounded-lg px-4 py-3 mb-4 text-center">
          <p className="text-library-gold-light text-xs font-bold mb-1">
            正解
          </p>
          <p className="text-library-gold font-bold text-lg">
            {question.correctAnswer}
            {(() => {
              const correctChoice = question.choices.find(
                (c) => c.label === question.correctAnswer
              )
              return correctChoice ? ` : ${correctChoice.text}` : ''
            })()}
          </p>
        </div>

        {/* Book page explanation card */}
        <div className="bg-library-paper rounded-lg shadow-lg border border-library-brown/20 p-5 mb-6">
          <div className="text-library-dark text-[15px] leading-relaxed">
            {question.explanation.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < question.explanation.split('\n').length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 pb-6">
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-library-gold to-library-gold-light text-library-dark font-bold text-base tracking-wider shadow-lg active:scale-95 transition-transform"
          >
            次の問題へ →
          </button>
          <button
            onClick={() => setScreen('area')}
            className="w-full py-3 rounded-xl border-2 border-library-gold/50 text-library-gold font-bold text-sm tracking-wider active:scale-95 transition-transform hover:bg-library-gold/10"
          >
            エリアに戻る
          </button>
        </div>
      </div>
    </div>
  )
}
