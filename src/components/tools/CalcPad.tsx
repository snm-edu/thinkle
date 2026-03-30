import { useState } from 'react'
import type { ToolConfig } from '../../types'

interface Props {
  config?: ToolConfig
}

export default function CalcPad({ config: _config }: Props) {
  const [memo, setMemo] = useState('')
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [resetNext, setResetNext] = useState(false)

  const handleNumber = (n: string) => {
    if (resetNext) {
      setDisplay(n)
      setResetNext(false)
    } else {
      setDisplay((prev) => (prev === '0' ? n : prev + n))
    }
  }

  const handleOperator = (op: string) => {
    const current = parseFloat(display)
    if (prevValue !== null && operator && !resetNext) {
      const result = calculate(prevValue, current, operator)
      setDisplay(String(result))
      setPrevValue(result)
    } else {
      setPrevValue(current)
    }
    setOperator(op)
    setResetNext(true)
  }

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b
      case '−': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : 0
      default: return b
    }
  }

  const handleEquals = () => {
    if (prevValue === null || !operator) return
    const current = parseFloat(display)
    const result = calculate(prevValue, current, operator)
    setDisplay(String(result))
    setPrevValue(null)
    setOperator(null)
    setResetNext(true)
  }

  const handleClear = () => {
    setDisplay('0')
    setPrevValue(null)
    setOperator(null)
    setResetNext(false)
  }

  const handleInsert = () => {
    setMemo((prev) => (prev ? prev + '\n' + display : display))
  }

  const handleDot = () => {
    if (resetNext) {
      setDisplay('0.')
      setResetNext(false)
    } else if (!display.includes('.')) {
      setDisplay((prev) => prev + '.')
    }
  }

  const clearAll = () => {
    setMemo('')
    handleClear()
  }

  const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.']
  const operators = ['+', '−', '×', '÷']

  return (
    <div className="bg-library-paper text-library-dark p-3">
      {/* Memo textarea */}
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="計算メモを書き込もう..."
        className="w-full h-28 p-3 rounded-lg border border-library-brown/30
          bg-library-cream/50 text-library-dark font-mono text-sm
          resize-y focus:outline-none focus:ring-2 focus:ring-library-green/40"
      />

      {/* Calculator */}
      <div className="mt-3 rounded-lg border border-library-brown/30 bg-library-cream/80 p-2">
        {/* Display */}
        <div className="bg-white rounded p-2 mb-2 text-right font-mono text-lg
          border border-library-brown/20 min-h-[40px] flex items-center justify-end overflow-hidden">
          {operator && (
            <span className="text-library-brown text-sm mr-2">{prevValue} {operator}</span>
          )}
          <span className="font-bold">{display}</span>
        </div>

        {/* Button grid */}
        <div className="grid grid-cols-4 gap-1.5">
          {/* Number pad (3x4 area, spanning first 3 cols) and operators (last col) */}
          {numbers.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => n === '.' ? handleDot() : handleNumber(n)}
              className={`
                min-h-[40px] rounded font-bold text-base transition-colors
                bg-white border border-library-brown/20 active:bg-library-gold-light/40
                ${n === '0' ? '' : ''}
              `}
            >
              {n}
            </button>
          ))}
          {/* = button in number grid area */}
          <button
            type="button"
            onClick={handleEquals}
            className="min-h-[40px] rounded font-bold text-base
              bg-library-green text-white active:bg-library-green/80 transition-colors"
          >
            =
          </button>
        </div>

        {/* Operator row */}
        <div className="grid grid-cols-5 gap-1.5 mt-1.5">
          {operators.map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => handleOperator(op)}
              className={`
                min-h-[40px] rounded font-bold text-base transition-colors
                border active:bg-library-gold-light/60
                ${operator === op
                  ? 'bg-library-gold text-white border-library-gold'
                  : 'bg-library-gold-light border-library-gold/40 text-library-dark'
                }
              `}
            >
              {op}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="min-h-[40px] rounded font-bold text-sm
              bg-red-100 border border-red-300 text-red-600
              active:bg-red-200 transition-colors"
          >
            AC
          </button>
        </div>

        {/* Insert button */}
        <button
          type="button"
          onClick={handleInsert}
          className="w-full mt-2 py-2 rounded font-bold text-sm
            bg-library-green/10 border border-library-green/40 text-library-green
            active:bg-library-green/20 transition-colors"
        >
          ↑ メモに挿入
        </button>
      </div>

      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={clearAll}
          className="px-3 py-1 rounded bg-library-cream border border-library-brown/30
            text-sm active:bg-library-gold-light/40 transition-colors"
        >
          クリア
        </button>
      </div>
    </div>
  )
}
