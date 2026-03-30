import { useState } from 'react'
import type { ToolConfig } from '../../types'

interface Props {
  config?: ToolConfig
}

export default function VennDiagram({ config }: Props) {
  const labels = config?.cols ?? ['犬のみ', '両方', '猫のみ']

  const [leftOnly, setLeftOnly] = useState('')
  const [overlap, setOverlap] = useState('')
  const [rightOnly, setRightOnly] = useState('')
  const [total, setTotal] = useState('')

  const leftNum = parseInt(leftOnly) || 0
  const overlapNum = parseInt(overlap) || 0
  const rightNum = parseInt(rightOnly) || 0
  const sum = leftNum + overlapNum + rightNum
  const totalNum = parseInt(total) || 0
  const neither = totalNum > 0 ? totalNum - sum : 0

  return (
    <div className="bg-library-paper text-library-dark p-3">
      {/* Venn diagram visual */}
      <div className="relative h-[180px] mx-auto w-[280px] my-2">
        {/* Left circle */}
        <div className="absolute left-[20px] top-[10px] w-[160px] h-[160px]
          rounded-full border-3 border-library-green bg-library-green/10" />
        {/* Right circle */}
        <div className="absolute right-[20px] top-[10px] w-[160px] h-[160px]
          rounded-full border-3 border-library-gold bg-library-gold/10" />

        {/* Left-only label + input */}
        <div className="absolute left-[30px] top-[60px] w-[70px] text-center z-10">
          <p className="text-xs font-bold text-library-green mb-1">{labels[0]}</p>
          <input
            type="number"
            inputMode="numeric"
            value={leftOnly}
            onChange={(e) => setLeftOnly(e.target.value)}
            className="w-full text-center text-lg font-bold bg-white/80 rounded
              border border-library-green/40 py-1 focus:outline-none focus:ring-2
              focus:ring-library-green/40"
            placeholder="0"
          />
        </div>

        {/* Overlap label + input */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[60px] w-[70px] text-center z-10">
          <p className="text-xs font-bold text-library-brown mb-1">{labels[1]}</p>
          <input
            type="number"
            inputMode="numeric"
            value={overlap}
            onChange={(e) => setOverlap(e.target.value)}
            className="w-full text-center text-lg font-bold bg-white/80 rounded
              border border-library-brown/40 py-1 focus:outline-none focus:ring-2
              focus:ring-library-brown/40"
            placeholder="0"
          />
        </div>

        {/* Right-only label + input */}
        <div className="absolute right-[30px] top-[60px] w-[70px] text-center z-10">
          <p className="text-xs font-bold text-library-gold mb-1">{labels[2]}</p>
          <input
            type="number"
            inputMode="numeric"
            value={rightOnly}
            onChange={(e) => setRightOnly(e.target.value)}
            className="w-full text-center text-lg font-bold bg-white/80 rounded
              border border-library-gold/40 py-1 focus:outline-none focus:ring-2
              focus:ring-library-gold/40"
            placeholder="0"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between bg-library-cream rounded-lg p-2">
          <span className="text-sm font-bold">合計（3区分）</span>
          <span className="text-lg font-bold text-library-green">{sum}</span>
        </div>

        <div className="flex items-center gap-2 bg-library-cream rounded-lg p-2">
          <label className="text-sm font-bold whitespace-nowrap">全体</label>
          <input
            type="number"
            inputMode="numeric"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="flex-1 text-center text-base font-bold bg-white rounded
              border border-library-brown/30 py-1 focus:outline-none focus:ring-2
              focus:ring-library-green/40"
            placeholder="人数"
          />
        </div>

        {totalNum > 0 && (
          <div className="flex items-center justify-between bg-library-cream rounded-lg p-2">
            <span className="text-sm font-bold">どちらでもない</span>
            <span className={`text-lg font-bold ${neither < 0 ? 'text-red-500' : 'text-library-dark'}`}>
              {neither}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
