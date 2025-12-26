// ============================================================================
// PHASE 3 VERIFICATION COMPONENT
// ============================================================================

import { useState } from 'react'
import { useEditorStore, useActiveLayer, useLayerCount } from '../stores'
import { CanvasContainer } from './Canvas'
import CanvasToolbar from './Canvas/CanvasToolbar'

export default function Phase3Test() {
  const [testResults, setTestResults] = useState<string[]>([])

  // Store state
  const canvas = useEditorStore((state: any) => state.canvas)
  const canvasState = useEditorStore((state: any) => state.canvasState)
  const layers = useEditorStore((state: any) => state.layers)
  const activeTool = useEditorStore((state: any) => state.activeTool)
  const layerCount = useLayerCount()
  const activeLayer = useActiveLayer()
  const theme = useEditorStore((state: any) => state.ui.theme)

  // Store actions
  const {
    createLayer,
    setZoom,
    setPan,
    setActiveTool,
    toggleGrid,
    toggleRulers,
    setTheme,
  } = useEditorStore()

  // Test functions
  const runAllTests = () => {
    const results: string[] = []

    // Test 1: Canvas Initialization
    try {
      if (canvas) {
        results.push('✅ Canvas initialized successfully')
      } else {
        results.push('❌ Canvas not initialized')
      }
    } catch (e) {
      results.push(`❌ Canvas initialization failed: ${e}`)
    }

    // Test 2: Zoom Controls
    try {
      const originalZoom = canvasState.zoom
      setZoom(1.5)
      if (useEditorStore.getState().canvasState.zoom === 1.5) {
        results.push('✅ Zoom controls working')
        setZoom(originalZoom)
      } else {
        results.push('❌ Zoom controls failed')
      }
    } catch (e) {
      results.push(`❌ Zoom test failed: ${e}`)
    }

    // Test 3: Pan Controls
    try {
      setPan(50, 50)
      const state = useEditorStore.getState().canvasState
      if (state.pan.x === 50 && state.pan.y === 50) {
        results.push('✅ Pan controls working')
        setPan(0, 0)
      } else {
        results.push('❌ Pan controls failed')
      }
    } catch (e) {
      results.push(`❌ Pan test failed: ${e}`)
    }

    // Test 4: Layer Creation & Rendering
    try {
      const initialCount = layers.length
      createLayer('shape', {
        name: 'Test Rectangle',
        width: 200,
        height: 100,
        data: {
          shapeType: 'rectangle',
          fill: '#3b82f6',
          stroke: '#1e40af',
          strokeWidth: 2,
        },
      })
      if (useEditorStore.getState().layers.length > initialCount) {
        results.push('✅ Layer creation and rendering working')
      } else {
        results.push('❌ Layer creation failed')
      }
    } catch (e) {
      results.push(`❌ Layer test failed: ${e}`)
    }

    // Test 5: Tool Switching
    try {
      setActiveTool('brush')
      if (useEditorStore.getState().activeTool === 'brush') {
        results.push('✅ Tool switching working')
      } else {
        results.push('❌ Tool switching failed')
      }
    } catch (e) {
      results.push(`❌ Tool switching test failed: ${e}`)
    }

    // Test 6: Grid Toggle
    try {
      const originalGrid = canvasState.showGrid
      toggleGrid()
      if (useEditorStore.getState().canvasState.showGrid !== originalGrid) {
        results.push('✅ Grid toggle working')
        toggleGrid()
      } else {
        results.push('❌ Grid toggle failed')
      }
    } catch (e) {
      results.push(`❌ Grid test failed: ${e}`)
    }

    // Test 7: Rulers Toggle
    try {
      const originalRulers = canvasState.showRulers
      toggleRulers()
      if (useEditorStore.getState().canvasState.showRulers !== originalRulers) {
        results.push('✅ Rulers toggle working')
        toggleRulers()
      } else {
        results.push('❌ Rulers toggle failed')
      }
    } catch (e) {
      results.push(`❌ Rulers test failed: ${e}`)
    }

    setTestResults(results)
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="flex flex-col h-screen bg-editor-bg-light dark:bg-editor-bg-dark">
        {/* Header */}
        <header className="panel px-4 py-3 flex items-center justify-between border-b border-editor-border-light dark:border-editor-border-dark">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-editor-accent-primary">PixelForge Pro</h1>
            <span className="text-sm text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
              Phase 3 Canvas Test
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={runAllTests} className="btn-primary text-sm">
              Run Tests
            </button>
            <button onClick={() => setTestResults([])} className="btn-secondary text-sm">
              Clear
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn-secondary text-sm"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="w-16 border-r border-editor-border-light dark:border-editor-border-dark">
            <CanvasToolbar />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 relative">
            <CanvasContainer />
          </div>

          {/* Side Panel */}
          <div className="w-80 border-l border-editor-border-light dark:border-editor-border-dark p-4 overflow-y-auto">
            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="panel p-4 mb-4">
                <h2 className="text-lg font-semibold mb-3 text-editor-text-primary-light dark:text-editor-text-primary-dark">
                  Test Results
                </h2>
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`text-sm p-2 rounded ${
                        result.startsWith('✅')
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Canvas State */}
            <div className="panel p-4 mb-4">
              <h2 className="text-lg font-semibold mb-3 text-editor-text-primary-light dark:text-editor-text-primary-dark">
                Canvas State
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                    Size:
                  </span>
                  <span className="font-mono text-editor-text-primary-light dark:text-editor-text-primary-dark">
                    {canvasState.width}×{canvasState.height}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                    Zoom:
                  </span>
                  <span className="font-mono text-editor-text-primary-light dark:text-editor-text-primary-dark">
                    {Math.round(canvasState.zoom * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                    Pan:
                  </span>
                  <span className="font-mono text-editor-text-primary-light dark:text-editor-text-primary-dark">
                    {canvasState.pan.x}, {canvasState.pan.y}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                    Grid:
                  </span>
                  <span className="font-mono text-editor-text-primary-light dark:text-editor-text-primary-dark">
                    {canvasState.showGrid ? 'On' : 'Off'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                    Rulers:
                  </span>
                  <span className="font-mono text-editor-text-primary-light dark:text-editor-text-primary-dark">
                    {canvasState.showRulers ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Tool */}
            <div className="panel p-4 mb-4">
              <h2 className="text-lg font-semibold mb-3 text-editor-text-primary-light dark:text-editor-text-primary-dark">
                Active Tool
              </h2>
              <div className="text-sm font-mono text-editor-accent-primary">{activeTool}</div>
            </div>

            {/* Layers */}
            <div className="panel p-4">
              <h2 className="text-lg font-semibold mb-3 text-editor-text-primary-light dark:text-editor-text-primary-dark">
                Layers ({layerCount})
              </h2>
              {layers.length === 0 ? (
                <p className="text-sm text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                  No layers. Run tests to create layers.
                </p>
              ) : (
                <div className="space-y-2">
                  {layers.map((layer: any) => (
                    <div
                      key={layer.id}
                      className={`p-2 rounded text-sm ${
                        activeLayer?.id === layer.id
                          ? 'bg-editor-accent-primary/20 border border-editor-accent-primary'
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <div className="font-medium text-editor-text-primary-light dark:text-editor-text-primary-dark">
                        {layer.name}
                      </div>
                      <div className="text-xs text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                        {layer.type} • {layer.opacity}% • {layer.blendMode}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => createLayer('raster', { name: 'New Layer' })}
                className="btn-primary w-full text-sm"
              >
                Add Raster Layer
              </button>
              <button
                onClick={() => createLayer('text', {
                  name: 'Text Layer',
                  data: {
                    text: 'New Text',
                    fontFamily: 'Arial',
                    fontSize: 32,
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    textAlign: 'left',
                    textDecoration: 'none',
                    lineHeight: 1.2,
                    letterSpacing: 0,
                    fill: '#000000',
                  },
                })}
                className="btn-secondary w-full text-sm"
              >
                Add Text Layer
              </button>
              <button
                onClick={() => createLayer('shape', {
                  name: 'Rectangle',
                  data: {
                    shapeType: 'rectangle',
                    fill: '#3b82f6',
                    stroke: '#1e40af',
                    strokeWidth: 2,
                  },
                })}
                className="btn-secondary w-full text-sm"
              >
                Add Rectangle
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="panel px-4 py-2 text-xs flex items-center justify-between border-t border-editor-border-light dark:border-editor-border-dark">
          <div className="flex gap-4 text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
            <span>Canvas: {canvasState.width}×{canvasState.height}px</span>
            <span>Zoom: {Math.round(canvasState.zoom * 100)}%</span>
            <span>Layers: {layerCount}</span>
            <span>Tool: {activeTool}</span>
          </div>
          <div className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
            Phase 3: Canvas Engine
          </div>
        </div>
      </div>
    </div>
  )
}
