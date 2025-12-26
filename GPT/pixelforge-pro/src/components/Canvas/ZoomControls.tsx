// ============================================================================
// PIXELFORGE PRO - ZOOM CONTROLS
// ============================================================================

import { useEditorStore } from '../../stores'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

export default function ZoomControls() {
  const canvasState = useEditorStore((state: any) => state.canvasState)
  const setZoom = useEditorStore((state: any) => state.setZoom)
  const setPan = useEditorStore((state: any) => state.setPan)

  const zoomPresets = [
    { label: 'Fit', value: 'fit' },
    { label: '25%', value: 0.25 },
    { label: '50%', value: 0.5 },
    { label: '100%', value: 1.0 },
    { label: '200%', value: 2.0 },
    { label: '400%', value: 4.0 },
  ]

  const handleZoomIn = () => {
    const newZoom = Math.min(8.0, canvasState.zoom * 1.2)
    setZoom(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, canvasState.zoom / 1.2)
    setZoom(newZoom)
  }

  const handleZoomFit = () => {
    // Reset zoom to fit view
    setZoom(1.0)
    setPan(0, 0)
  }

  const handleZoomPreset = (value: number | string) => {
    if (value === 'fit') {
      handleZoomFit()
    } else {
      setZoom(value as number)
    }
  }

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      {/* Zoom buttons */}
      <div className="panel p-2 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Zoom In (Ctrl + +)"
        >
          <ZoomIn size={18} />
        </button>

        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Zoom Out (Ctrl + -)"
        >
          <ZoomOut size={18} />
        </button>

        <button
          onClick={handleZoomFit}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Fit to View (Ctrl + 0)"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Zoom percentage dropdown */}
      <div className="panel p-2">
        <select
          value={canvasState.zoom}
          onChange={(e) => handleZoomPreset(e.target.value === 'fit' ? 'fit' : parseFloat(e.target.value))}
          className="w-24 px-2 py-1 text-sm bg-transparent border-none focus:outline-none cursor-pointer"
        >
          {zoomPresets.map((preset) => (
            <option key={preset.label} value={preset.value}>
              {preset.label}
            </option>
          ))}
          <option value={canvasState.zoom}>
            {Math.round(canvasState.zoom * 100)}%
          </option>
        </select>
      </div>
    </div>
  )
}
