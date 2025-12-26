// ============================================================================
// PIXELFORGE PRO - TOOL OPTIONS PANEL
// ============================================================================

import { useState, useEffect } from 'react'
import { useEditorStore } from '../../stores'

/**
 * Tool options panel that displays context-specific options for the active tool
 */
export default function ToolOptionsPanel() {
  const activeTool = useEditorStore((state: any) => state.activeTool)
  const primaryColor = useEditorStore((state: any) => state.primaryColor)
  const setPrimaryColor = useEditorStore((state: any) => state.setPrimaryColor)

  // Brush/Pencil/Eraser options
  const [brushSize, setBrushSize] = useState(10)
  const [brushOpacity, setBrushOpacity] = useState(100)

  // Text options
  const [fontSize, setFontSize] = useState(32)
  const [fontFamily, setFontFamily] = useState('Arial')

  // Shape options
  const [strokeWidth, setStrokeWidth] = useState(2)

  const renderToolOptions = () => {
    switch (activeTool) {
      case 'brush':
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Size:</label>
              <input
                type="range"
                min="1"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-xs text-neutral-300 w-8">{brushSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Opacity:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={brushOpacity}
                onChange={(e) => setBrushOpacity(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-xs text-neutral-300 w-8">{brushOpacity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Color:</label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-8 h-8 rounded border border-neutral-600"
              />
            </div>
          </div>
        )

      case 'pencil':
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Size:</label>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-xs text-neutral-300 w-8">{brushSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Color:</label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-8 h-8 rounded border border-neutral-600"
              />
            </div>
          </div>
        )

      case 'eraser':
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Size:</label>
              <input
                type="range"
                min="5"
                max="200"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-xs text-neutral-300 w-8">{brushSize}px</span>
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Font:</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="px-2 py-1 bg-neutral-700 text-neutral-100 text-xs rounded border border-neutral-600"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Size:</label>
              <input
                type="number"
                min="8"
                max="200"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-neutral-700 text-neutral-100 text-xs rounded border border-neutral-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Color:</label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-8 h-8 rounded border border-neutral-600"
              />
            </div>
          </div>
        )

      case 'rectangle':
      case 'ellipse':
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Stroke:</label>
              <input
                type="range"
                min="0"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-xs text-neutral-300 w-8">{strokeWidth}px</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Fill:</label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-8 h-8 rounded border border-neutral-600"
              />
            </div>
          </div>
        )

      case 'rectangular-marquee':
      case 'elliptical-marquee':
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400">Mode:</label>
              <select className="px-2 py-1 bg-neutral-700 text-neutral-100 text-xs rounded border border-neutral-600">
                <option value="new">New Selection</option>
                <option value="add">Add to Selection</option>
                <option value="subtract">Subtract from Selection</option>
                <option value="intersect">Intersect with Selection</option>
              </select>
            </div>
          </div>
        )

      case 'move':
        return (
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-400">
              Select and transform objects on the canvas
            </span>
          </div>
        )

      default:
        return (
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-400">Select a tool to see options</span>
          </div>
        )
    }
  }

  return (
    <div className="h-12 bg-neutral-800 border-b border-neutral-700 px-4 flex items-center">
      {renderToolOptions()}
    </div>
  )
}
