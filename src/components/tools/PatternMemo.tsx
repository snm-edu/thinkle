import { useState } from 'react'
import type { ToolConfig } from '../../types'

interface Props {
  config?: ToolConfig
}

export default function PatternMemo({ config }: Props) {
  const [text, setText] = useState('')
  const rows = config?.rows
  const cols = config?.cols

  return (
    <div className="bg-library-paper text-library-dark p-3">
      {/* Reference grid if config provides rows/cols */}
      {rows && cols && (
        <div className="overflow-x-auto mb-3">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-library-brown/30 bg-library-cream p-1.5" />
                {cols.map((col) => (
                  <th
                    key={col}
                    className="border border-library-brown/30 bg-library-cream p-1.5 font-bold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  <td className="border border-library-brown/30 bg-library-cream p-1.5 font-bold text-center">
                    {row}
                  </td>
                  {cols.map((col) => (
                    <td
                      key={col}
                      className="border border-library-brown/30 p-1.5 text-center min-w-[40px] min-h-[32px]"
                    >
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Memo textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="パターンやメモを書き込もう..."
        className="w-full h-40 p-3 rounded-lg border border-library-brown/30
          bg-library-cream/50 text-library-dark font-mono text-sm
          resize-y focus:outline-none focus:ring-2 focus:ring-library-green/40"
      />

      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={() => setText('')}
          className="px-3 py-1 rounded bg-library-cream border border-library-brown/30
            text-sm active:bg-library-gold-light/40 transition-colors"
        >
          クリア
        </button>
      </div>
    </div>
  )
}
