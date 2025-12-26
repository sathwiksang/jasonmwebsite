import { useState } from 'react'
import { useEditorStore } from './stores'
import Phase2Test from './components/Phase2Test'
import Phase3Test from './components/Phase3Test'
import Phase4Test from './components/Phase4Test'

function App() {
  const [showPhase2Test, setShowPhase2Test] = useState(false)
  const [showPhase3Test, setShowPhase3Test] = useState(false)
  const [showPhase4Test, setShowPhase4Test] = useState(true) // Start with Phase 4 test
  const theme = useEditorStore((state: any) => state.ui.theme)
  const setTheme = useEditorStore((state: any) => state.setTheme)

  if (showPhase2Test) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Phase2Test />
      </div>
    )
  }

  if (showPhase3Test) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Phase3Test />
      </div>
    )
  }

  if (showPhase4Test) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Phase4Test />
      </div>
    )
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-editor-bg-light dark:bg-editor-bg-dark transition-colors">
        {/* Header */}
        <header className="panel mx-4 my-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-editor-accent-primary">
                PixelForge Pro
              </div>
              <span className="text-sm text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
                v0.4.0 - Phase 4 Complete
              </span>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn-secondary"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4">
          <div className="panel p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-editor-text-primary-light dark:text-editor-text-primary-dark">
              Welcome to PixelForge Pro
            </h1>

            <div className="space-y-4 text-editor-text-primary-light dark:text-editor-text-primary-dark">
              <p className="text-lg">
                An advanced web-based photo editing application with Photoshop-like features.
              </p>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Phase 1 Setup Complete ✅</h2>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>✅ Vite + React 18 + TypeScript initialized</li>
                  <li>✅ Core dependencies installed (Fabric.js, Zustand, Immer, TailwindCSS)</li>
                  <li>✅ TailwindCSS configured with dark mode support</li>
                  <li>✅ Project folder structure created</li>
                  <li>✅ Path aliases configured (@components, @stores, etc.)</li>
                  <li>✅ Dev server running successfully</li>
                </ul>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Phase 2 State Management Complete ✅</h2>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>✅ Comprehensive TypeScript type system (800+ lines)</li>
                  <li>✅ Zustand editor store with 40+ actions (1000+ lines)</li>
                  <li>✅ History store with undo/redo system (300+ lines)</li>
                  <li>✅ Immer integration for immutable updates</li>
                  <li>✅ Helper hooks for common operations</li>
                  <li>✅ Test component for verification</li>
                </ul>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Phase 3 Canvas Engine Complete ✅</h2>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>✅ Fabric.js canvas integration (120+ lines)</li>
                  <li>✅ Canvas container with zoom and pan (200+ lines)</li>
                  <li>✅ Layer rendering system (230+ lines)</li>
                  <li>✅ Zoom controls with presets (90+ lines)</li>
                  <li>✅ Canvas toolbar with 11 tools (100+ lines)</li>
                  <li>✅ Grid and ruler overlays</li>
                  <li>✅ Mouse wheel zoom (Ctrl + scroll)</li>
                  <li>✅ Pan controls (Shift + drag, hand tool)</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold mb-2">Phase 3 is Complete!</h3>
                <p className="text-sm mb-3">
                  Canvas engine with Fabric.js integration, layer rendering, and zoom/pan controls are now ready. Click below to test the canvas.
                </p>
                <button
                  onClick={() => setShowPhase3Test(true)}
                  className="btn-primary"
                >
                  🎨 Run Phase 3 Canvas Test
                </button>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Phase 4 Essential Tools Complete ✅</h2>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>✅ Brush tool with freehand drawing</li>
                  <li>✅ Pencil tool for precise lines</li>
                  <li>✅ Eraser tool with brush-like behavior</li>
                  <li>✅ Rectangular and elliptical marquee selection tools</li>
                  <li>✅ Rectangle and ellipse shape tools</li>
                  <li>✅ Text tool with editable text</li>
                  <li>✅ Move/transform tool</li>
                  <li>✅ Tool options panel</li>
                  <li>✅ Keyboard shortcuts for all tools</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold mb-2">Phase 4 is Complete!</h3>
                <p className="text-sm mb-3">
                  All essential tools are now implemented with keyboard shortcuts and tool options. Click below to test the tools.
                </p>
                <button
                  onClick={() => setShowPhase4Test(true)}
                  className="btn-primary"
                >
                  🎨 Run Phase 4 Tools Test
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold mb-2">Next Steps (Phase 5):</h3>
                <ul className="space-y-1 ml-4 list-disc text-sm">
                  <li>Implement filters and adjustments</li>
                  <li>Add layer effects</li>
                  <li>Create professional UI panels</li>
                  <li>Implement file I/O operations</li>
                </ul>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowPhase2Test(true)}
                  className="btn-secondary"
                >
                  Verify Phase 2
                </button>
                <button
                  onClick={() => setShowPhase3Test(true)}
                  className="btn-secondary"
                >
                  Test Phase 3 Canvas
                </button>
                <button
                  onClick={() => setShowPhase4Test(true)}
                  className="btn-primary"
                >
                  Test Phase 4 Tools →
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-editor-text-secondary-light dark:text-editor-text-secondary-dark">
          <p>PixelForge Pro - Industry-level photo editing in your browser</p>
        </footer>
      </div>
    </div>
  )
}

export default App
