import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '../stores/gameStore'

const messages = [
  { speaker: 'narration', text: '放課後——。' },
  { speaker: 'narration', text: 'あなたは学校の裏手にある、見慣れない建物に気づいた。' },
  { speaker: 'you', text: 'あれ…こんなところに図書館なんてあったっけ？' },
  { speaker: 'narration', text: '古びた木製の扉を開けると、薄暗い館内に無数の本棚が並んでいた。' },
  { speaker: 'narration', text: '金色の光が本の背表紙からこぼれ、不思議な空気が漂っている。' },
  { speaker: 'you', text: 'すごい…✨ ちょっとだけ中を見てみよう。' },
  { speaker: 'narration', text: '——カチャン。' },
  { speaker: 'narration', text: '背後で扉が閉まる音がした。振り返ると、扉には鍵がかかっている。' },
  { speaker: 'you', text: 'えっ!? 閉じ込められた！？ 😨' },
  { speaker: 'narration', text: 'ふと足元を見ると、光る羊皮紙が落ちている。' },
  { speaker: 'book', text: '📜「この図書館から脱出するには、6つの書架に隠された"思考の鍵"を集めなさい。各書架の問題をすべて解けば、鍵が手に入るだろう。」' },
  { speaker: 'you', text: '6つの書架…問題を解けばいいんだね。やってみよう！ 🗝️' },
  { speaker: 'narration', text: 'こうして、不思議な図書館での脱出が始まった——。' },
]

type Speaker = 'narration' | 'you' | 'book'

function MessageBubble({ speaker, text }: { speaker: Speaker; text: string }) {
  if (speaker === 'narration') {
    return (
      <div className="text-center px-4 py-2">
        <p className="text-library-dark/60 text-sm italic leading-relaxed">{text}</p>
      </div>
    )
  }

  if (speaker === 'book') {
    return (
      <div className="flex justify-center px-2 py-1">
        <div className="bg-library-gold/15 border border-library-gold/40 rounded-xl px-4 py-3 max-w-[85%]">
          <p className="text-library-gold-light text-sm leading-relaxed">{text}</p>
        </div>
      </div>
    )
  }

  // speaker === 'you'
  return (
    <div className="flex justify-end px-2 py-1">
      <div className="bg-library-light/50 border border-library-light rounded-xl rounded-br-sm px-4 py-3 max-w-[80%]">
        <p className="text-library-dark text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

export default function PrologueScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const [visibleCount, setVisibleCount] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const isLast = visibleCount >= messages.length

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [visibleCount])

  const handleNext = () => {
    if (isLast) {
      useGameStore.setState({ prologueSeen: true })
      setScreen('map')
    } else {
      setVisibleCount((c) => c + 1)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-library-cream to-library-green/30">
      {/* Header */}
      <div className="py-3 px-4 border-b border-library-light flex items-center gap-2">
        <span className="text-lg">📖</span>
        <h2 className="text-library-gold text-sm font-bold tracking-wider">
          不思議な図書館
        </h2>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-3"
      >
        {messages.slice(0, visibleCount).map((msg, i) => (
          <div
            key={i}
            className="animate-[fadeSlideIn_0.4s_ease-out]"
          >
            <MessageBubble speaker={msg.speaker as Speaker} text={msg.text} />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Action button */}
      <div className="p-4 border-t border-library-light">
        <button
          onClick={handleNext}
          className={`w-full py-3.5 rounded-xl font-bold text-base tracking-wider active:scale-95 transition-transform ${
            isLast
              ? 'bg-gradient-to-r from-library-gold to-library-gold-light text-white shadow-lg'
              : 'bg-library-light/50 border-2 border-library-light text-library-dark'
          }`}
        >
          {isLast ? '🗝️ 図書館に入る' : '次へ ▶'}
        </button>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
