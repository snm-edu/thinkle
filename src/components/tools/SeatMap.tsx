import { useState } from 'react'
import type { ToolConfig } from '../../types'

interface Props {
  config?: ToolConfig
}

const DEFAULT_LABELS = ['太郎', '花子', '次郎', '美咲', '健太', '愛']

export default function SeatMap({ config }: Props) {
  const seatType = config?.seatType ?? 'circle'
  const labels = config?.seatLabels ?? DEFAULT_LABELS
  const slotCount = config?.seatSlots ?? (seatType === 'circle' ? 6 : 6)

  // placements: seatIndex -> label
  const [placements, setPlacements] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<string | null>(null)

  const placedLabels = new Set(Object.values(placements))
  const availableLabels = labels.filter((l) => !placedLabels.has(l))

  const handleChipTap = (label: string) => {
    setSelected((prev) => (prev === label ? null : label))
  }

  const handleSeatTap = (seatIdx: number) => {
    if (!selected) return

    setPlacements((prev) => {
      const next = { ...prev }
      // Remove selected from any existing seat
      for (const key of Object.keys(next)) {
        if (next[Number(key)] === selected) {
          delete next[Number(key)]
        }
      }
      // If seat was occupied, that person goes back to chips
      next[seatIdx] = selected
      return next
    })
    setSelected(null)
  }

  const reset = () => {
    setPlacements({})
    setSelected(null)
  }

  const seatContent = (idx: number, label?: string) => {
    const occupant = placements[idx]
    return (
      <button
        key={idx}
        type="button"
        onClick={() => handleSeatTap(idx)}
        className={`
          flex items-center justify-center rounded-lg border-2 text-sm font-bold
          min-w-[48px] min-h-[48px] px-2 transition-colors
          ${occupant
            ? 'bg-library-gold-light border-library-gold text-library-dark'
            : selected
              ? 'bg-library-cream border-library-green border-dashed cursor-pointer'
              : 'bg-library-cream border-library-brown/30'
          }
        `}
      >
        {occupant || label || ''}
      </button>
    )
  }

  // Circle layout
  const renderCircle = () => {
    const count = slotCount
    const radius = 80
    return (
      <div className="relative w-[220px] h-[220px] mx-auto my-4">
        {/* Center table */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-16 h-16 rounded-full bg-library-brown/20 border-2 border-library-brown/40
          flex items-center justify-center text-xs text-library-brown">
          テーブル
        </div>
        {Array.from({ length: count }).map((_, i) => {
          const angle = (2 * Math.PI * i) / count - Math.PI / 2
          const x = 110 + radius * Math.cos(angle) - 24
          const y = 110 + radius * Math.sin(angle) - 24
          return (
            <div
              key={i}
              className="absolute"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              {seatContent(i, `${i + 1}`)}
            </div>
          )
        })}
      </div>
    )
  }

  // Grid layout
  const renderGrid = () => {
    return (
      <div className="my-4">
        <div className="text-center text-sm font-bold text-library-brown mb-2 py-1
          bg-library-brown/10 rounded">
          教壇
        </div>
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
          {Array.from({ length: slotCount }).map((_, i) =>
            seatContent(i, `${i + 1}`)
          )}
        </div>
      </div>
    )
  }

  // Room layout
  const renderRoom = () => {
    const roomLabels = ['201', '202', '203', '101', '102', '103']
    return (
      <div className="my-4">
        <div className="text-center text-xs text-library-brown mb-1">2F</div>
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mb-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="text-center">
              <div className="text-xs text-library-brown mb-1">{roomLabels[i]}</div>
              {seatContent(i)}
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-library-brown mb-1">1F</div>
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
          {[3, 4, 5].map((i) => (
            <div key={i} className="text-center">
              <div className="text-xs text-library-brown mb-1">{roomLabels[i]}</div>
              {seatContent(i)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-library-paper text-library-dark p-3">
      {seatType === 'circle' && renderCircle()}
      {seatType === 'grid' && renderGrid()}
      {seatType === 'room' && renderRoom()}

      {/* Name chips */}
      <div className="flex flex-wrap gap-2 justify-center mt-3 mb-2">
        {availableLabels.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => handleChipTap(label)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-bold transition-colors min-h-[36px]
              ${selected === label
                ? 'bg-library-green text-white ring-2 ring-library-green/50'
                : 'bg-library-gold-light text-library-dark border border-library-gold'
              }
            `}
          >
            {label}
          </button>
        ))}
        {availableLabels.length === 0 && !selected && (
          <span className="text-xs text-library-brown">全員配置済み</span>
        )}
      </div>

      {selected && (
        <p className="text-center text-xs text-library-green font-bold mb-2">
          「{selected}」を配置先にタップしてください
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={reset}
          className="px-3 py-1 rounded bg-library-cream border border-library-brown/30
            text-sm active:bg-library-gold-light/40 transition-colors"
        >
          リセット
        </button>
      </div>
    </div>
  )
}
