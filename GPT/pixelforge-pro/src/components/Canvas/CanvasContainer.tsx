// ============================================================================
// PIXELFORGE PRO - CANVAS CONTAINER
// ============================================================================

import { useRef, useEffect, useState, useCallback } from 'react'
import { useEditorStore } from '../../stores'
import FabricCanvas from './FabricCanvas'
import ZoomControls from './ZoomControls'

export default function CanvasContainer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  // Store state
  const canvasState = useEditorStore((state: any) => state.canvasState)
  const activeTool = useEditorStore((state: any) => state.activeTool)
  const { setZoom, setPan } = useEditorStore()

  // Handle zoom with mouse wheel
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = -e.deltaY
        const zoomFactor = delta > 0 ? 1.1 : 0.9
        const newZoom = Math.max(0.1, Math.min(8.0, canvasState.zoom * zoomFactor))
        setZoom(newZoom)
      }
    },
    [canvasState.zoom, setZoom]
  )

  // Handle pan with spacebar + drag or hand tool
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const shouldPan = (e.button === 0 && e.shiftKey) || activeTool === 'hand'

      if (shouldPan) {
        setIsPanning(true)
        setPanStart({ x: e.clientX, y: e.clientY })
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grabbing'
        }
      }
    },
    [activeTool]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - panStart.x
        const deltaY = e.clientY - panStart.y
        setPan(canvasState.pan.x + deltaX, canvasState.pan.y + deltaY)
        setPanStart({ x: e.clientX, y: e.clientY })
      }
    },
    [isPanning, panStart, canvasState.pan, setPan]
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
    if (containerRef.current) {
      containerRef.current.style.cursor = activeTool === 'hand' ? 'grab' : 'default'
    }
  }, [activeTool])

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      container.removeEventListener('wheel', handleWheel)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp])

  // Update cursor based on active tool
  useEffect(() => {
    if (containerRef.current) {
      let cursor = 'default'
      switch (activeTool) {
        case 'hand':
          cursor = isPanning ? 'grabbing' : 'grab'
          break
        case 'zoom':
          cursor = 'zoom-in'
          break
        case 'brush':
        case 'pencil':
        case 'eraser':
          cursor = 'crosshair'
          break
        case 'move':
          cursor = 'move'
          break
        default:
          cursor = 'default'
      }
      containerRef.current.style.cursor = cursor
    }
  }, [activeTool, isPanning])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-900"
      style={{
        backgroundImage: canvasState.showGrid
          ? `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `
          : 'none',
        backgroundSize: canvasState.showGrid ? `${canvasState.gridSize}px ${canvasState.gridSize}px` : 'auto',
        backgroundPosition: `${canvasState.pan.x}px ${canvasState.pan.y}px`,
      }}
    >
      {/* Rulers */}
      {canvasState.showRulers && (
        <>
          {/* Horizontal Ruler */}
          <div className="absolute top-0 left-8 right-0 h-8 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex items-center overflow-hidden">
            {Array.from({ length: Math.ceil(canvasState.width / 50) }).map((_, i) => (
              <div
                key={i}
                className="absolute text-xs text-gray-600 dark:text-gray-400"
                style={{ left: `${i * 50 * canvasState.zoom + canvasState.pan.x}px` }}
              >
                {i * 50}
              </div>
            ))}
          </div>

          {/* Vertical Ruler */}
          <div className="absolute top-8 left-0 bottom-0 w-8 bg-gray-200 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 overflow-hidden">
            {Array.from({ length: Math.ceil(canvasState.height / 50) }).map((_, i) => (
              <div
                key={i}
                className="absolute text-xs text-gray-600 dark:text-gray-400"
                style={{
                  top: `${i * 50 * canvasState.zoom + canvasState.pan.y}px`,
                  left: '2px',
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'left top',
                }}
              >
                {i * 50}
              </div>
            ))}
          </div>

          {/* Corner square */}
          <div className="absolute top-0 left-0 w-8 h-8 bg-gray-300 dark:bg-gray-700" />
        </>
      )}

      {/* Canvas */}
      <div
        className="absolute"
        style={{
          left: canvasState.showRulers ? '32px' : '0',
          top: canvasState.showRulers ? '32px' : '0',
          right: '0',
          bottom: '0',
        }}
      >
        <FabricCanvas />
      </div>

      {/* Zoom Controls */}
      <ZoomControls />

      {/* Canvas Info Overlay */}
      <div className="absolute bottom-4 left-4 panel px-3 py-2 text-xs">
        <div className="flex gap-4 text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
          <span>
            Size: {canvasState.width} × {canvasState.height}px
          </span>
          <span>Zoom: {Math.round(canvasState.zoom * 100)}%</span>
          <span>
            Pan: {Math.round(canvasState.pan.x)}, {Math.round(canvasState.pan.y)}
          </span>
        </div>
      </div>
    </div>
  )
}
