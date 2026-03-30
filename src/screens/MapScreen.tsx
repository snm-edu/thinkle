import { useGameStore } from '../stores/gameStore'
import { areas } from '../data/areas'

export default function MapScreen() {
  const escapePercent = useGameStore((s) => s.escapePercent)
  const areaProgress = useGameStore((s) => s.areas)
  const setCurrentArea = useGameStore((s) => s.setCurrentArea)
  const setScreen = useGameStore((s) => s.setScreen)

  const handleAreaTap = (areaId: number) => {
    const progress = areaProgress[areaId]
    if (!progress?.unlocked) return
    setCurrentArea(areaId)
    setScreen('area')
  }

  return (
    <div className="flex-1 flex flex-col bg-library-cream">
      {/* Top bar */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button
          onClick={() => setScreen('title')}
          className="text-sm text-library-gold-light hover:text-library-gold transition-colors shrink-0"
        >
          &larr; タイトルへ
        </button>
        <div className="flex-1" />
      </div>

      {/* Escape progress */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-library-gold text-sm font-bold tracking-wide">
            脱出率
          </span>
          <span className="text-library-gold-light text-lg font-bold">
            {escapePercent}%
          </span>
        </div>
        <div className="w-full h-3 bg-library-light/40 rounded-full overflow-hidden border border-library-gold/30">
          <div
            className="h-full bg-gradient-to-r from-library-gold to-library-gold-light rounded-full transition-all duration-700 ease-out"
            style={{ width: `${escapePercent}%` }}
          />
        </div>
      </div>

      {/* Title */}
      <div className="px-4 pb-3">
        <h2 className="text-library-dark text-center text-lg font-bold tracking-wider">
          図書館フロアマップ
        </h2>
        <p className="text-library-gold-light/60 text-center text-xs mt-1">
          書架を選んで謎を解こう
        </p>
      </div>

      {/* Area grid */}
      <div className="flex-1 px-4 pb-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {areas.map((area) => {
            const progress = areaProgress[area.id]
            const isLocked = !progress?.unlocked
            const isCleared = progress?.cleared

            // Count correct answers
            const questions = progress?.questions ?? {}
            const correctCount = Object.values(questions).filter(
              (q) => q.correct
            ).length
            const totalCount = area.questionIds.length

            // Sum stars
            const totalStars = Object.values(questions).reduce(
              (sum, q) => sum + q.stars,
              0
            )
            const maxStars = totalCount * 3

            return (
              <button
                key={area.id}
                onClick={() => handleAreaTap(area.id)}
                disabled={isLocked}
                className={`
                  relative rounded-xl p-3 text-left transition-all duration-200
                  border-2
                  ${
                    isLocked
                      ? 'bg-library-light/20 border-library-light/30 opacity-50 cursor-not-allowed'
                      : isCleared
                        ? 'bg-library-green/30 border-library-gold/50 shadow-lg shadow-library-gold/10'
                        : 'bg-library-paper border-library-light active:scale-95 hover:border-library-gold/60 hover:bg-library-green/20'
                  }
                `}
              >
                {/* Cleared badge */}
                {isCleared && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-library-correct rounded-full flex items-center justify-center border-2 border-library-cream shadow">
                    <span className="text-white text-sm">&#10003;</span>
                  </div>
                )}

                {/* Lock overlay */}
                {isLocked && (
                  <div className="absolute inset-0 rounded-xl flex items-center justify-center z-10">
                    <span className="text-3xl opacity-60">🔒</span>
                  </div>
                )}

                {/* Emoji */}
                <div className="text-3xl mb-1.5">{area.emoji}</div>

                {/* Name */}
                <div
                  className={`text-sm font-bold mb-1 ${
                    isLocked ? 'text-library-dark/40' : 'text-library-dark'
                  }`}
                >
                  {area.name}
                </div>

                {/* Description */}
                <div
                  className={`text-xs mb-2 leading-snug ${
                    isLocked
                      ? 'text-library-dark/20'
                      : 'text-library-dark/50'
                  }`}
                >
                  {area.description}
                </div>

                {/* Progress row */}
                {!isLocked && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-library-gold-light">
                      🔑 {correctCount}/{totalCount}
                    </span>
                    <span className="text-xs text-library-gold">
                      {'★'.repeat(Math.min(totalStars, maxStars))}
                      {'☆'.repeat(Math.max(maxStars - totalStars, 0))}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
