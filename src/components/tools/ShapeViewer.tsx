import { useState } from 'react'
import type { ToolConfig } from '../../types'

interface Props {
  config?: ToolConfig
}

export default function ShapeViewer({ config: _config }: Props) {
  const [scale, setScale] = useState(1)

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 3))
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5))
  const resetZoom = () => setScale(1)

  return (
    <div className="bg-library-paper text-library-dark p-3">
      {/* Zoom controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={zoomOut}
            className="w-10 h-10 rounded-lg bg-library-cream border border-library-brown/30
              font-bold text-lg active:bg-library-gold-light/40 transition-colors"
          >
            −
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="px-3 h-10 rounded-lg bg-library-cream border border-library-brown/30
              text-sm font-bold active:bg-library-gold-light/40 transition-colors"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            type="button"
            onClick={zoomIn}
            className="w-10 h-10 rounded-lg bg-library-cream border border-library-brown/30
              font-bold text-lg active:bg-library-gold-light/40 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Grid paper area */}
      <div className="overflow-auto rounded-lg border border-library-brown/30 bg-white"
        style={{ maxHeight: '300px' }}
      >
        <div
          className="relative min-h-[250px] min-w-[250px] transition-transform duration-200 origin-top-left"
          style={{
            transform: `scale(${scale})`,
            width: `${250}px`,
            height: `${250}px`,
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        >
          {/* Placeholder message */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <p className="text-sm text-library-brown/60 text-center leading-relaxed">
              この問題の図形は<br />問題文を参照してください
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-library-brown mt-2 text-center">
        +/− で拡大縮小できます
      </p>
    </div>
  )
}
