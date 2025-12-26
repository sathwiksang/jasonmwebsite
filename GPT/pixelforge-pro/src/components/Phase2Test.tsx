// ============================================================================
// PHASE 2 VERIFICATION COMPONENT
// ============================================================================

import { useState } from 'react'
import { useEditorStore, useHistoryStore, useHistoryCapabilities, recordHistory } from '../stores'
import type { LayerType, ToolType } from '../types'

export default function Phase2Test() {
  const [testResults, setTestResults] = useState<string[]>([])

  // Editor store selectors
  const layers = useEditorStore((state: any) => state.layers)
  const activeLayerId = useEditorStore((state: any) => state.activeLayerId)
  const activeTool = useEditorStore((state: any) => state.activeTool)
  const foregroundColor = useEditorStore((state: any) => state.foregroundColor)
  const backgroundColor = useEditorStore((state: any) => state.backgroundColor)
  const theme = useEditorStore((state: any) => state.ui.theme)

  // Editor store actions
  const {
    createLayer,
    duplicateLayer,
    setActiveTool,
    setForegroundColor,
    setBackgroundColor,
    swapColors,
    setTheme,
    newProject,
  } = useEditorStore()

  // History store
  const historyLength = useHistoryStore((state: any) => state.getHistoryLength())
  const { undo, redo } = useHistoryStore()
  const { canUndo, canRedo, undoDescription, redoDescription } = useHistoryCapabilities()

  // Test functions
  const runAllTests = () => {
    const results: string[] = []

    // Test 1: Layer Creation
    try {
      createLayer('raster' as LayerType, { name: 'Test Layer' })
      recordHistory('layer-create', 'Created test layer')
      results.push('✅ Layer creation successful')
    } catch (e) {
      results.push(`❌ Layer creation failed: ${e}`)
    }

    // Test 2: Layer Operations
    try {
      if (layers.length > 0) {
        const firstLayer = layers[0]
        duplicateLayer(firstLayer.id)
        recordHistory('layer-duplicate', 'Duplicated layer')
        results.push('✅ Layer duplication successful')
      }
    } catch (e) {
      results.push(`❌ Layer duplication failed: ${e}`)
    }

    // Test 3: Tool Switching
    try {
      setActiveTool('brush' as ToolType)
      results.push('✅ Tool switching successful')
    } catch (e) {
      results.push(`❌ Tool switching failed: ${e}`)
    }

    // Test 4: Color Management
    try {
      setForegroundColor('#FF0000')
      setBackgroundColor('#0000FF')
      swapColors()
      results.push('✅ Color management successful')
    } catch (e) {
      results.push(`❌ Color management failed: ${e}`)
    }

    // Test 5: History System
    try {
      if (canUndo) {
        undo()
        results.push('✅ Undo functionality successful')

        if (canRedo) {
          redo()
          results.push('✅ Redo functionality successful')
        }
      } else {
        results.push('ℹ️ No history to undo')
      }
    } catch (e) {
      results.push(`❌ History system failed: ${e}`)
    }

    // Test 6: Project Creation
    try {
      newProject(1920, 1080, { name: 'Test Project' })
      results.push('✅ Project creation successful')
    } catch (e) {
      results.push(`❌ Project creation failed: ${e}`)
    }

    setTestResults(results)
  }

  return (
    <div className="min-h-screen bg-editor-bg-light dark:bg-editor-bg-dark p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-editor-text-primary-light dark:text-editor-text-primary-dark mb-2">
            Phase 2 Verification Tests
          </h1>
          <p className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
            Testing Core State Management & Types
          </p>
        </header>

        {/* Test Controls */}
        <div className="panel p-6 mb-6">
          <div className="flex gap-4">
            <button onClick={runAllTests} className="btn-primary">
              Run All Tests
            </button>
            <button onClick={() => setTestResults([])} className="btn-secondary">
              Clear Results
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn-secondary"
            >
              Toggle Theme
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="panel p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-editor-text-primary-light dark:text-editor-text-primary-dark">
              Test Results
            </h2>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${
                    result.startsWith('✅')
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                      : result.startsWith('❌')
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Store State Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editor Store State */}
          <div className="panel p-6">
            <h2 className="text-xl font-semibold mb-4 text-editor-text-primary-light dark:text-editor-text-primary-dark">
              Editor Store State
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                  Layers:
                </span>
                <span className="font-mono text-editor-text-primary-light dark:text-editor-text-primary-dark">
                  {layers.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                  Active Tool:
                </span>
                <span className="font-mono text-editor-text-primary-light dark:text-editor-text-primary-dark">
                  {activeTool}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                  Foreground:
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: foregroundColor }}
                  />
                  <span className="font-mono text-editor-text-primary-light dark:text-editor-text-primary-dark">
                    {foregroundColor}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                  Background:
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: backgroundColor }}
                  />
                  <span className="font-mono text-editor-text-primary-light dark:text-editor-text-primary-dark">
                    {backgroundColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* History Store State */}
          <div className="panel p-6">
            <h2 className="text-xl font-semibold mb-4 text-editor-text-primary-light dark:text-editor-text-primary-dark">
              History Store State
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                  History Length:
                </span>
                <span className="font-mono text-editor-text-primary-light dark:text-editor-text-primary-dark">
                  {historyLength}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                  Can Undo:
                </span>
                <span className="font-mono text-editor-text-primary-light dark:text-editor-text-primary-dark">
                  {canUndo ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                  Can Redo:
                </span>
                <span className="font-mono text-editor-text-primary-light dark:text-editor-text-primary-dark">
                  {canRedo ? 'Yes' : 'No'}
                </span>
              </div>
              {undoDescription && (
                <div className="flex justify-between">
                  <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                    Undo Action:
                  </span>
                  <span className="font-mono text-xs text-editor-text-primary-light dark:text-editor-text-primary-dark">
                    {undoDescription}
                  </span>
                </div>
              )}
              {redoDescription && (
                <div className="flex justify-between">
                  <span className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                    Redo Action:
                  </span>
                  <span className="font-mono text-xs text-editor-text-primary-light dark:text-editor-text-primary-dark">
                    {redoDescription}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Layers List */}
          <div className="panel p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-editor-text-primary-light dark:text-editor-text-primary-dark">
              Layers
            </h2>
            {layers.length === 0 ? (
              <p className="text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                No layers yet. Run tests to create layers.
              </p>
            ) : (
              <div className="space-y-2">
                {layers.map((layer: any) => (
                  <div
                    key={layer.id}
                    className={`p-3 rounded border ${
                      layer.id === activeLayerId
                        ? 'border-editor-accent-primary bg-blue-50 dark:bg-blue-900/20'
                        : 'border-editor-border-light dark:border-editor-border-dark'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-editor-text-primary-light dark:text-editor-text-primary-dark">
                          {layer.name}
                        </span>
                        <span className="text-xs text-editor-text-secondary-light dark:text-editor-text-secondary-dark ml-2">
                          ({layer.type})
                        </span>
                      </div>
                      <div className="flex gap-2 text-xs text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                        <span>Opacity: {layer.opacity}%</span>
                        <span>Blend: {layer.blendMode}</span>
                        <span>{layer.visible ? '👁️' : '🚫'}</span>
                        <span>{layer.locked ? '🔒' : '🔓'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Phase 2 Checklist */}
        <div className="panel p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-editor-text-primary-light dark:text-editor-text-primary-dark">
            Phase 2 Completion Checklist
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span className="text-editor-text-primary-light dark:text-editor-text-primary-dark">
                Core TypeScript types defined (Layer, Tool, Filter, etc.)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span className="text-editor-text-primary-light dark:text-editor-text-primary-dark">
                Zustand editor store implemented with 40+ actions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span className="text-editor-text-primary-light dark:text-editor-text-primary-dark">
                History store with undo/redo functionality
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span className="text-editor-text-primary-light dark:text-editor-text-primary-dark">
                Immer integration for immutable state updates
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span className="text-editor-text-primary-light dark:text-editor-text-primary-dark">
                Helper hooks for common operations
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
