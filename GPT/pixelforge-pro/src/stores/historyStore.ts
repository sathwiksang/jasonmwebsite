// ============================================================================
// PIXELFORGE PRO - HISTORY STORE (UNDO/REDO SYSTEM)
// ============================================================================

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuidv4 } from 'uuid'
import type { HistoryEntry, HistoryActionType, EditorStateSnapshot } from '../types/editor'
import { useEditorStore } from './editorStore'

// ============================================================================
// HISTORY STATE
// ============================================================================

interface HistoryState {
  entries: HistoryEntry[]
  currentIndex: number
  maxSize: number
  enabled: boolean
}

interface HistoryActions {
  // Core Actions
  pushHistory: (type: HistoryActionType, description: string, snapshot: EditorStateSnapshot) => void
  undo: () => void
  redo: () => void
  clear: () => void

  // Query Actions
  canUndo: () => boolean
  canRedo: () => boolean
  getHistoryLength: () => number
  getUndoDescription: () => string | null
  getRedoDescription: () => string | null

  // Configuration
  setMaxSize: (size: number) => void
  setEnabled: (enabled: boolean) => void

  // Utilities
  compress: () => void
  exportHistory: () => HistoryEntry[]
  importHistory: (entries: HistoryEntry[]) => void
}

const initialState: HistoryState = {
  entries: [],
  currentIndex: -1,
  maxSize: 50,
  enabled: true,
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useHistoryStore = create<HistoryState & HistoryActions>()(
  immer((set, get) => ({
    ...initialState,

    // ========================================================================
    // CORE ACTIONS
    // ========================================================================

    pushHistory: (type, description, snapshot) => {
      const state = get()

      if (!state.enabled) return

      const entry: HistoryEntry = {
        id: uuidv4(),
        type,
        description,
        timestamp: Date.now(),
        state: snapshot,
        compressed: false,
      }

      set((draft: any) => {
        // Remove all entries after current index (for new branches)
        draft.entries = draft.entries.slice(0, draft.currentIndex + 1)

        // Add new entry
        draft.entries.push(entry)

        // Enforce max size
        if (draft.entries.length > draft.maxSize) {
          draft.entries.shift()
        } else {
          draft.currentIndex++
        }
      })

      // Auto-compress old entries to save memory
      setTimeout(() => {
        get().compress()
      }, 1000)
    },

    undo: () => {
      const state = get()

      if (!state.canUndo()) {
        console.warn('Cannot undo: no previous state')
        return
      }

      const targetIndex = state.currentIndex - 1
      const targetEntry = state.entries[targetIndex]

      if (targetEntry) {
        // Restore state
        restoreEditorState(targetEntry.state)

        set((draft) => {
          draft.currentIndex = targetIndex
        })
      }
    },

    redo: () => {
      const state = get()

      if (!state.canRedo()) {
        console.warn('Cannot redo: no next state')
        return
      }

      const targetIndex = state.currentIndex + 1
      const targetEntry = state.entries[targetIndex]

      if (targetEntry) {
        // Restore state
        restoreEditorState(targetEntry.state)

        set((draft) => {
          draft.currentIndex = targetIndex
        })
      }
    },

    clear: () => {
      set((draft) => {
        draft.entries = []
        draft.currentIndex = -1
      })
    },

    // ========================================================================
    // QUERY ACTIONS
    // ========================================================================

    canUndo: () => {
      const state = get()
      return state.currentIndex > 0
    },

    canRedo: () => {
      const state = get()
      return state.currentIndex < state.entries.length - 1
    },

    getHistoryLength: () => {
      return get().entries.length
    },

    getUndoDescription: () => {
      const state = get()
      if (!state.canUndo()) return null
      return state.entries[state.currentIndex - 1]?.description || null
    },

    getRedoDescription: () => {
      const state = get()
      if (!state.canRedo()) return null
      return state.entries[state.currentIndex + 1]?.description || null
    },

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    setMaxSize: (size) => {
      set((draft) => {
        draft.maxSize = Math.max(1, Math.min(100, size))

        // Trim entries if needed
        if (draft.entries.length > draft.maxSize) {
          const removeCount = draft.entries.length - draft.maxSize
          draft.entries.splice(0, removeCount)
          draft.currentIndex = Math.max(0, draft.currentIndex - removeCount)
        }
      })
    },

    setEnabled: (enabled) => {
      set((draft) => {
        draft.enabled = enabled
      })
    },

    // ========================================================================
    // UTILITIES
    // ========================================================================

    compress: () => {
      set((draft) => {
        // Compress entries older than 10 positions from current
        const compressThreshold = Math.max(0, draft.currentIndex - 10)

        draft.entries.forEach((entry, index) => {
          if (index < compressThreshold && !entry.compressed) {
            // Simple compression: remove some redundant data
            // In a real implementation, you might use actual compression algorithms
            entry.compressed = true

            // Remove fabric object references to save memory
            entry.state.layers.forEach((layer) => {
              if (layer.fabricObject) {
                delete layer.fabricObject
              }
              if (layer.offscreenCanvas) {
                delete layer.offscreenCanvas
              }
            })
          }
        })
      })
    },

    exportHistory: () => {
      return get().entries
    },

    importHistory: (entries) => {
      set((draft: any) => {
        draft.entries = entries
        draft.currentIndex = entries.length - 1
      })
    },
  }))
)

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Restore editor state from a history snapshot
 */
function restoreEditorState(snapshot: EditorStateSnapshot) {
  const editorStore = useEditorStore.getState()

  // Restore layers
  useEditorStore.setState({
    layers: snapshot.layers.map(layer => ({
      ...layer,
      // Deep clone to prevent reference issues
      updatedAt: Date.now(),
    })),
    activeLayerId: snapshot.activeLayerId,
    selection: snapshot.selection,
  })

  // Restore canvas size if changed
  if (
    snapshot.canvasSize.width !== editorStore.canvasState.width ||
    snapshot.canvasSize.height !== editorStore.canvasState.height
  ) {
    editorStore.setCanvasSize(snapshot.canvasSize.width, snapshot.canvasSize.height)
  }
}

/**
 * Create a snapshot of current editor state
 */
export function createEditorSnapshot(): EditorStateSnapshot {
  const state = useEditorStore.getState()

  return {
    layers: state.layers.map(layer => ({
      ...layer,
      // Deep clone layer data
      data: JSON.parse(JSON.stringify(layer.data)),
    })),
    activeLayerId: state.activeLayerId,
    selection: state.selection ? { ...state.selection } : null,
    canvasSize: {
      width: state.canvasState.width,
      height: state.canvasState.height,
    },
  }
}

/**
 * Record a history entry for an action
 */
export function recordHistory(type: HistoryActionType, description: string) {
  const snapshot = createEditorSnapshot()
  useHistoryStore.getState().pushHistory(type, description, snapshot)
}


// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Hook to get undo/redo capabilities
 */
export const useHistoryCapabilities = () => {
  const canUndo = useHistoryStore((state) => state.canUndo())
  const canRedo = useHistoryStore((state) => state.canRedo())
  const undoDescription = useHistoryStore((state) => state.getUndoDescription())
  const redoDescription = useHistoryStore((state) => state.getRedoDescription())

  return {
    canUndo,
    canRedo,
    undoDescription,
    redoDescription,
  }
}

/**
 * Hook to get history length
 */
export const useHistoryLength = () => {
  return useHistoryStore((state) => state.getHistoryLength())
}

/**
 * Hook to get undo/redo actions
 */
export const useHistoryActions = () => {
  const undo = useHistoryStore((state) => state.undo)
  const redo = useHistoryStore((state) => state.redo)
  const clear = useHistoryStore((state) => state.clear)

  return { undo, redo, clear }
}
