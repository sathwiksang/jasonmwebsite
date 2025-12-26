// ============================================================================
// PIXELFORGE PRO - CANVAS TOOLBAR
// ============================================================================

import { useEditorStore } from '../../stores'
import {
  Move,
  Square,
  Circle,
  Type,
  PenTool,
  Eraser,
  Hand,
  ZoomIn,
  Crop,
  Grid3x3,
  Ruler,
} from 'lucide-react'
import type { ToolType } from '../../types'

interface ToolButton {
  type: ToolType
  icon: any
  label: string
  shortcut?: string
}

const tools: ToolButton[] = [
  { type: 'move', icon: Move, label: 'Move', shortcut: 'V' },
  { type: 'rectangular-marquee', icon: Square, label: 'Rectangle Select', shortcut: 'M' },
  { type: 'elliptical-marquee', icon: Circle, label: 'Ellipse Select' },
  { type: 'brush', icon: PenTool, label: 'Brush', shortcut: 'B' },
  { type: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
  { type: 'text', icon: Type, label: 'Text', shortcut: 'T' },
  { type: 'rectangle', icon: Square, label: 'Rectangle' },
  { type: 'ellipse', icon: Circle, label: 'Ellipse' },
  { type: 'hand', icon: Hand, label: 'Hand', shortcut: 'H' },
  { type: 'zoom', icon: ZoomIn, label: 'Zoom', shortcut: 'Z' },
  { type: 'crop', icon: Crop, label: 'Crop', shortcut: 'C' },
]

export default function CanvasToolbar() {
  const activeTool = useEditorStore((state: any) => state.activeTool)
  const setActiveTool = useEditorStore((state: any) => state.setActiveTool)
  const canvasState = useEditorStore((state: any) => state.canvasState)
  const { toggleGrid, toggleRulers } = useEditorStore()

  return (
    <div className="flex flex-col gap-2 p-2 panel h-full overflow-y-auto">
      {/* Tools */}
      <div className="flex flex-col gap-1">
        {tools.map((tool) => {
          const Icon = tool.icon
          const isActive = activeTool === tool.type

          return (
            <button
              key={tool.type}
              onClick={() => setActiveTool(tool.type)}
              className={`
                p-2.5 rounded transition-colors relative group
                ${
                  isActive
                    ? 'bg-editor-accent-primary text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
              title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
            >
              <Icon size={20} />

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {tool.label}
                {tool.shortcut && <span className="ml-2 text-gray-400">{tool.shortcut}</span>}
              </div>
            </button>
          )
        })}
      </div>

      {/* Separator */}
      <div className="h-px bg-gray-300 dark:bg-gray-700 my-2" />

      {/* View Options */}
      <div className="flex flex-col gap-1">
        <button
          onClick={toggleGrid}
          className={`
            p-2.5 rounded transition-colors
            ${
              canvasState.showGrid
                ? 'bg-editor-accent-primary text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
          title="Toggle Grid"
        >
          <Grid3x3 size={20} />
        </button>

        <button
          onClick={toggleRulers}
          className={`
            p-2.5 rounded transition-colors
            ${
              canvasState.showRulers
                ? 'bg-editor-accent-primary text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
          title="Toggle Rulers"
        >
          <Ruler size={20} />
        </button>
      </div>
    </div>
  )
}
