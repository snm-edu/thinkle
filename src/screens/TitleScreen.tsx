import { useGameStore } from '../stores/gameStore'

export default function TitleScreen() {
  const prologueSeen = useGameStore((s) => s.prologueSeen)
  const escapePercent = useGameStore((s) => s.escapePercent)
  const setScreen = useGameStore((s) => s.setScreen)
  const resetGame = useGameStore((s) => s.resetGame)

  const handleStart = () => {
    if (prologueSeen) {
      setScreen('map')
    } else {
      setScreen('prologue')
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-b from-library-cream via-library-green/30 to-library-cream relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <span className="absolute top-[8%] left-[10%] text-2xl opacity-30 animate-pulse">📖</span>
        <span className="absolute top-[15%] right-[12%] text-xl opacity-25 animate-pulse" style={{ animationDelay: '0.5s' }}>✨</span>
        <span className="absolute top-[35%] left-[5%] text-lg opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>🗝️</span>
        <span className="absolute top-[55%] right-[8%] text-2xl opacity-25 animate-pulse" style={{ animationDelay: '1.5s' }}>📚</span>
        <span className="absolute bottom-[25%] left-[15%] text-xl opacity-20 animate-pulse" style={{ animationDelay: '0.8s' }}>🔮</span>
        <span className="absolute bottom-[15%] right-[18%] text-lg opacity-30 animate-pulse" style={{ animationDelay: '1.2s' }}>✨</span>
      </div>

      {/* Title area */}
      <div className="relative z-10 text-center mb-10">
        <p className="text-library-gold-light text-sm tracking-[0.3em] mb-3 opacity-80">
          ~ 脱出ゲーム ~
        </p>
        <h1 className="text-3xl font-bold text-library-gold leading-tight mb-2 drop-shadow-lg">
          シンキング・エスケープ
        </h1>
        <div className="w-48 h-px bg-gradient-to-r from-transparent via-library-gold to-transparent mx-auto my-3" />
        <p className="text-xl text-library-dark font-medium leading-relaxed">
          不思議な図書館からの脱出
        </p>
        <p className="text-4xl mt-4 mb-2">📖🗝️✨</p>
      </div>

      {/* Escape progress */}
      {prologueSeen && escapePercent > 0 && (
        <div className="relative z-10 w-full max-w-xs mb-8">
          <p className="text-library-gold-light text-xs text-center mb-2 tracking-wide">
            脱出進捗
          </p>
          <div className="w-full h-3 bg-library-light/40 rounded-full overflow-hidden border border-library-gold/30">
            <div
              className="h-full bg-gradient-to-r from-library-gold to-library-gold-light rounded-full transition-all duration-700"
              style={{ width: `${escapePercent}%` }}
            />
          </div>
          <p className="text-library-gold text-sm text-center mt-1 font-bold">
            {escapePercent}%
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-xs">
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-library-gold to-library-gold-light text-library-dark font-bold text-lg tracking-wider shadow-lg active:scale-95 transition-transform"
        >
          {prologueSeen ? '📖 はじめる' : '✨ はじめる'}
        </button>

        {prologueSeen && (
          <button
            onClick={() => setScreen('map')}
            className="w-full py-3 rounded-xl border-2 border-library-gold/60 text-library-gold font-bold text-base tracking-wider active:scale-95 transition-transform hover:bg-library-gold/10"
          >
            📚 つづきから
          </button>
        )}
      </div>

      {/* Reset button */}
      <button
        onClick={resetGame}
        className="relative z-10 mt-12 text-library-dark/30 text-xs underline underline-offset-2 active:text-library-dark/50 transition-colors"
      >
        リセット
      </button>
    </div>
  )
}
