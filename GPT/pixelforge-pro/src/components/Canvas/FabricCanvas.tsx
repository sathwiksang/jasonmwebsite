// ============================================================================
// PIXELFORGE PRO - FABRIC.JS CANVAS INTEGRATION
// ============================================================================

import { useEffect, useRef } from 'react'
import { Canvas } from 'fabric'
import { useEditorStore } from '../../stores'
import { renderLayers } from '../../utils/layerRenderer'

export default function FabricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<any>(null)

  // Store state
  const canvasState = useEditorStore((state: any) => state.canvasState)
  const layers = useEditorStore((state: any) => state.layers)
  const setCanvas = useEditorStore((state: any) => state.setCanvas)

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: canvasState.width,
      height: canvasState.height,
      backgroundColor: canvasState.background,
      selection: true,
      preserveObjectStacking: true,
    })

    fabricRef.current = fabricCanvas
    setCanvas(fabricCanvas)

    // Set up event listeners
    fabricCanvas.on('selection:created', (e: any) => {
      console.log('Selection created:', e.selected)
    })

    fabricCanvas.on('selection:updated', (e: any) => {
      console.log('Selection updated:', e.selected)
    })

    fabricCanvas.on('selection:cleared', () => {
      console.log('Selection cleared')
    })

    fabricCanvas.on('object:modified', (e: any) => {
      console.log('Object modified:', e.target)
    })

    fabricCanvas.on('object:moving', (e: any) => {
      // Snap to grid if enabled
      if (canvasState.snapToGrid) {
        const obj = e.target
        const gridSize = canvasState.gridSize
        obj.set({
          left: Math.round((obj.left || 0) / gridSize) * gridSize,
          top: Math.round((obj.top || 0) / gridSize) * gridSize,
        })
      }
    })

    return () => {
      fabricCanvas.dispose()
      fabricRef.current = null
      setCanvas(null)
    }
  }, []) // Only run once on mount

  // Update canvas size
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setWidth(canvasState.width)
      fabricRef.current.setHeight(canvasState.height)
      fabricRef.current.renderAll()
    }
  }, [canvasState.width, canvasState.height])

  // Update background color
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setBackgroundColor(canvasState.background, () => {
        fabricRef.current.renderAll()
      })
    }
  }, [canvasState.background])

  // Update zoom
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setZoom(canvasState.zoom)
      fabricRef.current.renderAll()
    }
  }, [canvasState.zoom])

  // Update viewport transform for panning
  useEffect(() => {
    if (fabricRef.current) {
      const vpt = fabricRef.current.viewportTransform
      if (vpt) {
        vpt[4] = canvasState.pan.x
        vpt[5] = canvasState.pan.y
        fabricRef.current.setViewportTransform(vpt)
        fabricRef.current.renderAll()
      }
    }
  }, [canvasState.pan.x, canvasState.pan.y])

  // Render layers
  useEffect(() => {
    if (fabricRef.current && layers.length > 0) {
      renderLayers(fabricRef.current, layers)
    }
  }, [layers])

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative">
        <canvas ref={canvasRef} className="shadow-2xl" />
      </div>
    </div>
  )
}
