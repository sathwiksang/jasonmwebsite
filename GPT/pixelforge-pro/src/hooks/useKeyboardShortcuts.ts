// ============================================================================
// PIXELFORGE PRO - KEYBOARD SHORTCUTS HOOK
// ============================================================================

import { useEffect } from 'react'
import { useEditorStore } from '../stores'

/**
 * Keyboard shortcuts configuration
 */
const SHORTCUTS = {
  // Tools
  V: 'move', // Move/Select tool
  B: 'brush', // Brush tool
  P: 'pencil', // Pencil tool
  E: 'eraser', // Eraser tool
  M: 'rectangular-marquee', // Rectangular marquee
  L: 'elliptical-marquee', // Elliptical/Lasso marquee
  U: 'rectangle', // Rectangle shape
  I: 'ellipse', // Ellipse shape
  T: 'text', // Text tool
  H: 'hand', // Hand/Pan tool
  Z: 'zoom', // Zoom tool

  // Canvas operations
  CTRL_Z: 'undo',
  CTRL_SHIFT_Z: 'redo',
  CTRL_Y: 'redo',

  // Layer operations
  CTRL_J: 'duplicate-layer',
  DELETE: 'delete-layer',
  BACKSPACE: 'delete-layer',

  // View operations
  CTRL_PLUS: 'zoom-in',
  CTRL_MINUS: 'zoom-out',
  CTRL_0: 'zoom-fit',
  CTRL_1: 'zoom-100',

  // File operations
  CTRL_S: 'save',
  CTRL_SHIFT_S: 'save-as',
  CTRL_O: 'open',
  CTRL_N: 'new',

  // Edit operations
  CTRL_C: 'copy',
  CTRL_V: 'paste',
  CTRL_X: 'cut',
  CTRL_A: 'select-all',
  CTRL_D: 'deselect',
}

/**
 * Hook for handling keyboard shortcuts
 */
export function useKeyboardShortcuts() {
  const setActiveTool = useEditorStore((state: any) => state.setActiveTool)
  const undo = useEditorStore((state: any) => state.undo)
  const redo = useEditorStore((state: any) => state.redo)
  const zoomIn = useEditorStore((state: any) => state.zoomIn)
  const zoomOut = useEditorStore((state: any) => state.zoomOut)
  const setZoom = useEditorStore((state: any) => state.setZoom)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      const key = event.key.toUpperCase()
      const ctrl = event.ctrlKey || event.metaKey
      const shift = event.shiftKey

      // Tool shortcuts (single keys)
      if (!ctrl && !shift) {
        switch (key) {
          case 'V':
            setActiveTool('move')
            event.preventDefault()
            break
          case 'B':
            setActiveTool('brush')
            event.preventDefault()
            break
          case 'P':
            setActiveTool('pencil')
            event.preventDefault()
            break
          case 'E':
            setActiveTool('eraser')
            event.preventDefault()
            break
          case 'M':
            setActiveTool('rectangular-marquee')
            event.preventDefault()
            break
          case 'L':
            setActiveTool('elliptical-marquee')
            event.preventDefault()
            break
          case 'U':
            setActiveTool('rectangle')
            event.preventDefault()
            break
          case 'I':
            setActiveTool('ellipse')
            event.preventDefault()
            break
          case 'T':
            setActiveTool('text')
            event.preventDefault()
            break
          case 'H':
            setActiveTool('hand')
            event.preventDefault()
            break
          case 'Z':
            setActiveTool('zoom')
            event.preventDefault()
            break
        }
      }

      // Ctrl shortcuts
      if (ctrl && !shift) {
        switch (key) {
          case 'Z':
            undo()
            event.preventDefault()
            break
          case 'Y':
            redo()
            event.preventDefault()
            break
          case '=':
          case '+':
            zoomIn()
            event.preventDefault()
            break
          case '-':
            zoomOut()
            event.preventDefault()
            break
          case '0':
            setZoom(1) // 100%
            event.preventDefault()
            break
        }
      }

      // Ctrl + Shift shortcuts
      if (ctrl && shift) {
        switch (key) {
          case 'Z':
            redo()
            event.preventDefault()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setActiveTool, undo, redo, zoomIn, zoomOut, setZoom])
}

/**
 * Get keyboard shortcut for a tool
 */
export function getToolShortcut(tool: string): string | undefined {
  const shortcuts: Record<string, string> = {
    move: 'V',
    brush: 'B',
    pencil: 'P',
    eraser: 'E',
    'rectangular-marquee': 'M',
    'elliptical-marquee': 'L',
    rectangle: 'U',
    ellipse: 'I',
    text: 'T',
    hand: 'H',
    zoom: 'Z',
  }
  return shortcuts[tool]
}
