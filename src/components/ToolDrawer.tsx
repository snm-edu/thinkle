import { useEffect } from 'react'
import type { ToolType, ToolConfig } from '../types'
import ConditionTable from './tools/ConditionTable'
import SeatMap from './tools/SeatMap'
import PatternMemo from './tools/PatternMemo'
import CalcPad from './tools/CalcPad'
import VennDiagram from './tools/VennDiagram'
import ShapeViewer from './tools/ShapeViewer'

interface Props {
  isOpen: boolean
  onClose: () => void
  toolType: ToolType
  toolConfig?: ToolConfig
}

const TOOL_NAMES: Record<ToolType, string> = {
  conditionTable: '条件整理表',
  seatMap: '配置マップ',
  patternMemo: 'パターンメモ',
  calcPad: '計算メモ',
  vennDiagram: 'ベン図',
  shapeViewer: '図形ビューワー',
}

function ToolContent({ toolType, toolConfig }: { toolType: ToolType; toolConfig?: ToolConfig }) {
  switch (toolType) {
    case 'conditionTable':
      return <ConditionTable config={toolConfig} />
    case 'seatMap':
      return <SeatMap config={toolConfig} />
    case 'patternMemo':
      return <PatternMemo config={toolConfig} />
    case 'calcPad':
      return <CalcPad config={toolConfig} />
    case 'vennDiagram':
      return <VennDiagram config={toolConfig} />
    case 'shapeViewer':
      return <ShapeViewer config={toolConfig} />
  }
}

export default function ToolDrawer({ isOpen, onClose, toolType, toolConfig }: Props) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '70vh' }}
      >
        <div className="bg-library-light rounded-t-2xl shadow-lg flex flex-col"
          style={{ maxHeight: '70vh' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-library-brown/20 shrink-0">
            <h3 className="text-base font-bold text-library-dark">
              {TOOL_NAMES[toolType]}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full
                bg-library-cream text-library-dark text-lg font-bold
                active:bg-library-brown/20 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1">
            <ToolContent toolType={toolType} toolConfig={toolConfig} />
          </div>
        </div>
      </div>
    </>
  )
}
