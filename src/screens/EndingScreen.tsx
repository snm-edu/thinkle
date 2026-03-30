import { useMemo } from 'react'
import { useGameStore } from '../stores/gameStore'

export default function EndingScreen() {
  const areas = useGameStore((s) => s.areas)
  const setScreen = useGameStore((s) => s.setScreen)

  const { totalStars, maxStars } = useMemo(() => {
    let total = 0
    let max = 0
    for (const area of Object.values(areas)) {
      for (const q of Object.values(area.questions)) {
        total += q.stars
        max += 3
      }
    }
    return { totalStars: total, maxStars: max }
  }, [areas])

  const starRatio = maxStars > 0 ? totalStars / maxStars : 0

  const grade =
    starRatio >= 0.9
      ? { label: 'S', comment: '完璧な脱出！天才司書の素質あり！ 👑', color: 'text-library-gold' }
      : starRatio >= 0.7
        ? { label: 'A', comment: 'すばらしい！見事な思考力です！ ✨', color: 'text-library-gold-light' }
        : starRatio >= 0.5
          ? { label: 'B', comment: 'よくがんばりました！ 📖', color: 'text-library-light' }
          : { label: 'C', comment: '脱出おめでとう！もう一度挑戦してみよう！ 💪', color: 'text-library-dark/70' }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-b from-library-cream via-library-green/20 to-library-cream relative overflow-hidden">
      {/* Sparkle decorations */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-lg animate-pulse"
            style={{
              top: `${8 + (i * 7) % 80}%`,
              left: `${5 + ((i * 13 + 7) % 90)}%`,
              animationDelay: `${(i * 0.3) % 2}s`,
              opacity: 0.15 + (i % 3) * 0.1,
            }}
          >
            {['✨', '🌟', '⭐', '💫'][i % 4]}
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Trophy icon */}
        <p className="text-6xl mb-4 drop-shadow-lg">🏆</p>

        <h1 className="text-2xl font-bold text-library-gold mb-2 drop-shadow">
          脱出成功！
        </h1>
        <p className="text-library-dark/70 text-sm mb-8">
          不思議な図書館から脱出した！
        </p>

        {/* Grade */}
        <div className="mb-6">
          <div className={`text-6xl font-black ${grade.color} drop-shadow-lg mb-2`}>
            {grade.label}
          </div>
          <p className="text-library-dark/60 text-sm">{grade.comment}</p>
        </div>

        {/* Stars summary */}
        <div className="bg-library-paper border border-library-light rounded-2xl px-6 py-5 mb-8 inline-block shadow">
          <p className="text-library-gold-light text-xs tracking-wider mb-3">
            獲得スター
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl">⭐</span>
            <span className="text-library-gold text-4xl font-black">{totalStars}</span>
            <span className="text-library-dark/40 text-lg">/ {maxStars}</span>
          </div>
        </div>

        {/* Per-area breakdown */}
        <div className="w-full max-w-xs mx-auto mb-8 space-y-2">
          {Object.entries(areas).map(([areaId, area]) => {
            const areaStars = Object.values(area.questions).reduce((sum, q) => sum + q.stars, 0)
            const areaMax = Object.keys(area.questions).length * 3
            return (
              <div
                key={areaId}
                className="flex items-center justify-between bg-library-green/15 rounded-lg px-3 py-2 text-sm"
              >
                <span className="text-library-dark/60">書架{areaId}</span>
                <span className="text-library-gold font-bold">
                  ⭐ {areaStars} / {areaMax}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => setScreen('title')}
        className="relative z-10 w-full max-w-xs py-4 rounded-xl bg-gradient-to-r from-library-gold to-library-gold-light text-library-dark font-bold text-base tracking-wider shadow-lg active:scale-95 transition-transform"
      >
        📖 タイトルへ戻る
      </button>
    </div>
  )
}
