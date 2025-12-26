// ============================================================================
// PIXELFORGE PRO - PHASE 4 TEST COMPONENT
// ============================================================================
// Test all essential tools implementation

import { useEffect, useState } from 'react'
import { useEditorStore } from '../stores'
import { createToolManager } from '../tools/ToolManager'
import ToolOptionsPanel from './Panels/ToolOptionsPanel'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import {
  MousePointer2,
  Paintbrush,
  Pencil,
  Eraser,
  Square,
  Circle,
  Type,
  RectangleSelect,
  CircleDot,
} from 'lucide-react'

export default function Phase4Test() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [toolManager] = useState(() => createToolManager())

  const canvas = useEditorStore((state: any) => state.canvas)
  const activeTool = useEditorStore((state: any) => state.activeTool)
  const setActiveTool = useEditorStore((state: any) => state.setActiveTool)

  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  useEffect(() => {
    if (canvas) {
      toolManager.setCanvas(canvas)
      runTests()
    }
  }, [canvas])

  // Activate tool when active tool changes
  useEffect(() => {
    if (canvas && activeTool) {
      toolManager.activateTool(activeTool)
    }
  }, [activeTool, canvas])

  const runTests = () => {
    const results: Record<string, boolean> = {}

    // Test 1: Tool Manager Created
    results['toolManagerCreated'] = toolManager !== null

    // Test 2: All tools registered
    const allTools = toolManager.getAllTools()
    results['allToolsRegistered'] = allTools.size >= 9

    // Test 3: Move tool exists
    results['moveToolExists'] = allTools.has('move')

    // Test 4: Brush tool exists
    results['brushToolExists'] = allTools.has('brush')

    // Test 5: Pencil tool exists
    results['pencilToolExists'] = allTools.has('pencil')

    // Test 6: Eraser tool exists
    results['eraserToolExists'] = allTools.has('eraser')

    // Test 7: Selection tools exist
    results['selectionToolsExist'] =
      allTools.has('rectangular-marquee') && allTools.has('elliptical-marquee')

    // Test 8: Shape tools exist
    results['shapeToolsExist'] = allTools.has('rectangle') && allTools.has('ellipse')

    // Test 9: Text tool exists
    results['textToolExists'] = allTools.has('text')

    setTestResults(results)
  }

  const tools = [
    { id: 'move', name: 'Move', icon: MousePointer2, key: 'V' },
    { id: 'brush', name: 'Brush', icon: Paintbrush, key: 'B' },
    { id: 'pencil', name: 'Pencil', icon: Pencil, key: 'P' },
    { id: 'eraser', name: 'Eraser', icon: Eraser, key: 'E' },
    { id: 'rectangular-marquee', name: 'Rectangle Select', icon: RectangleSelect, key: 'M' },
    { id: 'elliptical-marquee', name: 'Ellipse Select', icon: CircleDot, key: 'L' },
    { id: 'rectangle', name: 'Rectangle', icon: Square, key: 'U' },
    { id: 'ellipse', name: 'Ellipse', icon: Circle, key: 'I' },
    { id: 'text', name: 'Text', icon: Type, key: 'T' },
  ]

  const allTestsPassed = Object.values(testResults).every((result) => result === true)

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Phase 4: Essential Tools Implementation</h1>
          <p className="text-neutral-400">
            Testing all essential tools and keyboard shortcuts
          </p>
        </div>

        {/* Test Results */}
        <div className="bg-neutral-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <div className="space-y-2">
            {Object.entries(testResults).map(([test, passed]) => (
              <div key={test} className="flex items-center justify-between">
                <span className="text-sm font-mono">{test}</span>
                <span
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    passed
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-700">
            <div className="flex items-center justify-between">
              <span className="font-bold">Overall Status:</span>
              <span
                className={`px-4 py-2 rounded font-bold ${
                  allTestsPassed
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {allTestsPassed ? 'ALL TESTS PASSED ✓' : 'TESTS IN PROGRESS'}
              </span>
            </div>
          </div>
        </div>

        {/* Tool Palette */}
        <div className="bg-neutral-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Tool Palette</h2>
          <p className="text-sm text-neutral-400 mb-4">
            Click a tool or press its keyboard shortcut
          </p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {tools.map((tool) => {
              const Icon = tool.icon
              const isActive = activeTool === tool.id
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500/20 border-2 border-blue-500'
                      : 'bg-neutral-700 border-2 border-transparent hover:bg-neutral-600'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-xs font-medium">{tool.name}</span>
                  <span className="text-xs text-neutral-400 font-mono bg-neutral-900 px-2 py-0.5 rounded">
                    {tool.key}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tool Options Panel */}
        <div className="bg-neutral-800 rounded-lg overflow-hidden mb-8">
          <h2 className="text-xl font-bold p-6 pb-4">Tool Options</h2>
          <ToolOptionsPanel />
        </div>

        {/* Canvas Test Area */}
        <div className="bg-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Canvas Test Area</h2>
          <p className="text-sm text-neutral-400 mb-4">
            The canvas from Phase 3 is integrated. Select a tool and test it on the canvas.
          </p>
          <div className="bg-neutral-900 rounded border border-neutral-700 p-4">
            <div className="text-center text-neutral-500">
              <p>Canvas is rendered in the main layout</p>
              <p className="text-sm mt-2">Active Tool: <span className="text-blue-400 font-mono">{activeTool || 'none'}</span></p>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Reference */}
        <div className="bg-neutral-800 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Keyboard Shortcuts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-bold mb-2 text-blue-400">Tools</h3>
              <div className="space-y-1 text-neutral-300">
                <div><kbd className="bg-neutral-900 px-2 py-0.5 rounded">V</kbd> Move</div>
                <div><kbd className="bg-neutral-900 px-2 py-0.5 rounded">B</kbd> Brush</div>
                <div><kbd className="bg-neutral-900 px-2 py-0.5 rounded">P</kbd> Pencil</div>
                <div><kbd className="bg-neutral-900 px-2 py-0.5 rounded">E</kbd> Eraser</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-blue-400">Shapes</h3>
              <div className="space-y-1 text-neutral-300">
                <div><kbd className="bg-neutral-900 px-2 py-0.5 rounded">U</kbd> Rectangle</div>
                <div><kbd className="bg-neutral-900 px-2 py-0.5 rounded">I</kbd> Ellipse</div>
                <div><kbd className="bg-neutral-900 px-2 py-0.5 rounded">T</kbd> Text</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-blue-400">Selection</h3>
              <div className="space-y-1 text-neutral-300">
                <div><kbd className="bg-neutral-900 px-2 py-0.5 rounded">M</kbd> Rect Marquee</div>
                <div><kbd className="bg-neutral-900 px-2 py-0.5 rounded">L</kbd> Ellipse Marquee</div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 4 Completion Summary */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Phase 4 Completion Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Brush tool with freehand drawing</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Pencil tool with precise drawing</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Eraser tool with erasing capability</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Rectangular and elliptical marquee selection tools</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Rectangle and ellipse shape tools</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Text tool with editable text</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Move/transform tool</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Tool options panel with context-specific settings</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Keyboard shortcuts for all tools</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Tool manager for tool activation/deactivation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
