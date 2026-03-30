import { useState } from 'react'
import type { ToolConfig } from '../../types'

type CellValue = '' | '○' | '×' | '△'

const CYCLE: CellValue[] = ['', '○', '×', '△']

interface Props {
  config?: ToolConfig
}

export default function ConditionTable({ config }: Props) {
  const rows = config?.rows ?? ['A', 'B', 'C', 'D']
  const cols = config?.cols ?? ['条件1', '条件2', '条件3']

  const [grid, setGrid] = useState<CellValue[][]>(() =>
    rows.map(() => cols.map(() => '' as CellValue))
  )

  const cycleCell = (r: number, c: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => [...row])
      const current = next[r][c]
      const idx = CYCLE.indexOf(current)
      next[r][c] = CYCLE[(idx + 1) % CYCLE.length]
      return next
    })
  }

  const resetAll = () => {
    setGrid(rows.map(() => cols.map(() => '' as CellValue)))
  }

  return (
    <div className="bg-library-paper text-library-dark p-3">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-library-brown/30 bg-library-cream p-2 min-w-[60px]" />
              {cols.map((col) => (
                <th
                  key={col}
                  className="border border-library-brown/30 bg-library-cream p-2 text-sm font-bold min-w-[60px]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row}>
                <td className="border border-library-brown/30 bg-library-cream p-2 text-sm font-bold text-center">
                  {row}
                </td>
                {cols.map((_, ci) => (
                  <td
                    key={ci}
                    className="border border-library-brown/30 p-0 text-center"
                  >
                    <button
                      type="button"
                      onClick={() => cycleCell(ri, ci)}
                      className="w-full min-h-[40px] min-w-[40px] flex items-center justify-center text-xl font-bold
                        active:bg-library-gold-light/40 transition-colors"
                    >
                      <span
                        className={
                          grid[ri][ci] === '○'
                            ? 'text-library-green'
                            : grid[ri][ci] === '×'
                              ? 'text-red-500'
                              : 'text-library-gold'
                        }
                      >
                        {grid[ri][ci]}
                      </span>
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-library-brown">
        <span>タップで切替: 空 → ○ → × → △</span>
        <button
          type="button"
          onClick={resetAll}
          className="px-3 py-1 rounded bg-library-cream border border-library-brown/30
            active:bg-library-gold-light/40 transition-colors"
        >
          リセット
        </button>
      </div>
    </div>
  )
}
