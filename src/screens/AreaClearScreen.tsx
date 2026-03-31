import { useGameStore } from '../stores/gameStore'
import { areas as areaData } from '../data/areas'

export default function AreaClearScreen() {
  const currentAreaId = useGameStore((s) => s.currentAreaId)
  const areasProgress = useGameStore((s) => s.areas)
  const setScreen = useGameStore((s) => s.setScreen)

  const area = areaData.find((a) => a.id === currentAreaId)
  const areaProgress = currentAreaId ? areasProgress[currentAreaId] : null

  // Calculate stars for this area
  const areaStars = areaProgress
    ? Object.values(areaProgress.questions).reduce((sum, q) => sum + q.stars, 0)
    : 0
  const maxStars = 15

  // Check if all 6 areas are cleared
  const allCleared = areaData.every((a) => areasProgress[a.id]?.cleared)

  if (!area) {
    return (
      <div className="flex-1 flex items-center justify-center bg-library-cream text-library-dark">
        <p>エリアが見つかりません</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-b from-library-cream via-library-green/20 to-library-cream relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <span className="absolute top-[10%] left-[15%] text-3xl animate-bounce" style={{ animationDelay: '0s' }}>🗝️</span>
        <span className="absolute top-[8%] right-[12%] text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>✨</span>
        <span className="absolute top-[25%] left-[8%] text-xl animate-bounce" style={{ animationDelay: '0.6s' }}>🗝️</span>
        <span className="absolute top-[20%] right-[20%] text-3xl animate-bounce" style={{ animationDelay: '0.9s' }}>✨</span>
        <span className="absolute bottom-[30%] left-[10%] text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>🗝️</span>
        <span className="absolute bottom-[25%] right-[15%] text-xl animate-bounce" style={{ animationDelay: '0.7s' }}>✨</span>
      </div>

      {/* Key animation */}
      <div className="relative z-10 text-7xl mb-6 animate-bounce">
        🗝️
      </div>

      {/* Area name + success */}
      <div className="relative z-10 text-center mb-6">
        <p className="text-library-gold-light text-sm tracking-[0.2em] mb-2 opacity-80">
          {area.emoji} {area.name}
        </p>
        <h1 className="text-3xl font-bold text-library-gold drop-shadow-lg mb-2">
          脱出成功！
        </h1>
        <div className="w-48 h-px bg-gradient-to-r from-transparent via-library-gold to-transparent mx-auto my-4" />
      </div>

      {/* Stars earned */}
      <div className="relative z-10 bg-library-paper border border-library-light rounded-xl px-6 py-5 mb-8 text-center shadow w-full max-w-xs">
        <p className="text-library-dark/60 text-xs font-bold tracking-wider mb-3">
          獲得した星
        </p>
        <div className="flex justify-center gap-1 flex-wrap mb-3">
          {Array.from({ length: maxStars }, (_, i) => (
            <span key={i} className={`text-xl ${i < areaStars ? 'text-library-gold' : 'text-library-light'}`}>
              {i < areaStars ? '★' : '☆'}
            </span>
          ))}
        </div>
        <p className="text-library-gold-light text-lg font-bold">
          {areaStars} / {maxStars}
        </p>
      </div>

      {/* All areas cleared message */}
      {allCleared && (
        <div className="relative z-10 bg-library-gold/15 border border-library-gold/40 rounded-xl px-6 py-4 mb-6 text-center">
          <p className="text-3xl mb-2">🏆</p>
          <p className="text-library-gold font-bold text-xl tracking-wider">
            全エリア脱出！
          </p>
          <p className="text-library-dark/60 text-sm mt-1">
            おめでとう！すべての書架をクリアしました！
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="relative z-10 flex flex-col items-center gap-3 w-full max-w-xs">
        {allCleared ? (
          <button
            onClick={() => setScreen('ending')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-library-gold to-library-gold-light text-library-dark font-bold text-lg tracking-wider shadow-lg active:scale-95 transition-transform"
          >
            🏆 エンディングへ
          </button>
        ) : (
          <button
            onClick={() => setScreen('map')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-library-gold to-library-gold-light text-library-dark font-bold text-lg tracking-wider shadow-lg active:scale-95 transition-transform"
          >
            🗺️ マップへ戻る
          </button>
        )}
      </div>
    </div>
  )
}
