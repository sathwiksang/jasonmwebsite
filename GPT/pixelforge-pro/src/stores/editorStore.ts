// ============================================================================
// PIXELFORGE PRO - MAIN EDITOR STORE
// ============================================================================

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuidv4 } from 'uuid'
import type {
  EditorState,
  Layer,
  LayerType,
  BlendMode,
  ToolType,
  ToolOptions,
  Selection,
  Project,
  CanvasState,
  UIState,
} from '../types/editor'

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialCanvasState: CanvasState = {
  width: 1920,
  height: 1080,
  zoom: 1.0,
  pan: { x: 0, y: 0 },
  background: '#ffffff',
  showGrid: false,
  showRulers: false,
  snapToGrid: false,
  gridSize: 10,
}

const initialUIState: UIState = {
  panels: {
    layers: true,
    properties: true,
    history: true,
    color: true,
    navigator: false,
  },
  dialogs: {
    newDocument: false,
    imageSize: false,
    canvasSize: false,
    export: false,
    preferences: false,
    keyboardShortcuts: false,
    about: false,
  },
  theme: 'dark',
  loading: false,
  error: null,
}

const initialState: EditorState = {
  canvas: null,
  canvasState: initialCanvasState,
  layers: [],
  activeLayerId: null,
  activeTool: 'move' as ToolType,
  toolOptions: {},
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  recentColors: ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'],
  selection: null,
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,
  ui: initialUIState,
  project: null,
  clipboard: {
    type: null,
    data: null,
  },
  performanceMode: 'balanced',
  memoryUsage: 0,
}

// ============================================================================
// STORE ACTIONS INTERFACE
// ============================================================================

interface EditorActions {
  // Canvas Actions
  setCanvas: (canvas: any | null) => void
  setCanvasSize: (width: number, height: number) => void
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  setBackground: (color: string) => void
  toggleGrid: () => void
  toggleRulers: () => void
  toggleSnapToGrid: () => void

  // Layer Actions
  createLayer: (type: LayerType, options?: Partial<Layer>) => Layer
  deleteLayer: (layerId: string) => void
  duplicateLayer: (layerId: string) => Layer | null
  setActiveLayer: (layerId: string) => void
  moveLayer: (layerId: string, direction: 'up' | 'down' | 'top' | 'bottom') => void
  renameLayer: (layerId: string, name: string) => void
  setLayerVisibility: (layerId: string, visible: boolean) => void
  setLayerOpacity: (layerId: string, opacity: number) => void
  setLayerBlendMode: (layerId: string, blendMode: BlendMode) => void
  setLayerLocked: (layerId: string, locked: boolean) => void
  mergeVisibleLayers: () => void
  flattenImage: () => void
  getLayer: (layerId: string) => Layer | undefined

  // Tool Actions
  setActiveTool: (tool: ToolType) => void
  setToolOptions: (tool: ToolType, options: Partial<ToolOptions>) => void
  getToolOptions: (tool: ToolType) => ToolOptions | undefined

  // Color Actions
  setForegroundColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  swapColors: () => void
  addRecentColor: (color: string) => void

  // Selection Actions
  setSelection: (selection: Selection | null) => void
  clearSelection: () => void
  invertSelection: () => void

  // UI Actions
  togglePanel: (panel: keyof UIState['panels']) => void
  openDialog: (dialog: keyof UIState['dialogs']) => void
  closeDialog: (dialog: keyof UIState['dialogs']) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Project Actions
  newProject: (width: number, height: number, options?: Partial<Project>) => void
  loadProject: (project: Project) => void
  saveProject: () => Project | null
  clearProject: () => void

  // Clipboard Actions
  copy: () => void
  cut: () => void
  paste: () => void

  // Utility Actions
  reset: () => void
  updateMemoryUsage: () => void
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useEditorStore = create<EditorState & EditorActions>()(
  immer((set, get) => ({
    ...initialState,

    // ========================================================================
    // CANVAS ACTIONS
    // ========================================================================

    setCanvas: (canvas) => {
      set((state) => {
        state.canvas = canvas
      })
    },

    setCanvasSize: (width, height) => {
      set((state) => {
        state.canvasState.width = width
        state.canvasState.height = height
      })
    },

    setZoom: (zoom) => {
      set((state) => {
        state.canvasState.zoom = Math.max(0.1, Math.min(8.0, zoom))
      })
    },

    setPan: (x, y) => {
      set((state) => {
        state.canvasState.pan = { x, y }
      })
    },

    setBackground: (color) => {
      set((state) => {
        state.canvasState.background = color
      })
    },

    toggleGrid: () => {
      set((state) => {
        state.canvasState.showGrid = !state.canvasState.showGrid
      })
    },

    toggleRulers: () => {
      set((state) => {
        state.canvasState.showRulers = !state.canvasState.showRulers
      })
    },

    toggleSnapToGrid: () => {
      set((state) => {
        state.canvasState.snapToGrid = !state.canvasState.snapToGrid
      })
    },

    // ========================================================================
    // LAYER ACTIONS
    // ========================================================================

    createLayer: (type, options = {}) => {
      const newLayer: Layer = {
        id: options.id || uuidv4(),
        name: options.name || `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
        type,
        visible: options.visible ?? true,
        locked: options.locked ?? false,
        opacity: options.opacity ?? 100,
        blendMode: options.blendMode || 'normal' as BlendMode,
        x: options.x ?? 0,
        y: options.y ?? 0,
        width: options.width ?? get().canvasState.width,
        height: options.height ?? get().canvasState.height,
        data: options.data || (type === 'raster' ? {} : type === 'text' ? {
          text: 'New Text',
          fontFamily: 'Arial',
          fontSize: 32,
          fontWeight: 'normal',
          fontStyle: 'normal',
          textAlign: 'left',
          textDecoration: 'none',
          lineHeight: 1.2,
          letterSpacing: 0,
          fill: get().foregroundColor,
        } : type === 'shape' ? {
          shapeType: 'rectangle',
          fill: get().foregroundColor,
          stroke: '#000000',
          strokeWidth: 1,
        } : type === 'adjustment' ? {
          adjustmentType: 'brightness-contrast',
          parameters: {},
        } : {
          childrenIds: [],
          expanded: true,
        }),
        zIndex: get().layers.length,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      set((draft: any) => {
        draft.layers.push(newLayer)
        draft.activeLayerId = newLayer.id
      })

      return newLayer
    },

    deleteLayer: (layerId) => {
      set((state) => {
        const index = state.layers.findIndex((l) => l.id === layerId)
        if (index !== -1) {
          state.layers.splice(index, 1)

          // Update z-indices
          state.layers.forEach((layer, idx) => {
            layer.zIndex = idx
          })

          // Update active layer
          if (state.activeLayerId === layerId) {
            state.activeLayerId = state.layers[Math.max(0, index - 1)]?.id || null
          }
        }
      })
    },

    duplicateLayer: (layerId) => {
      const state = get()
      const layer = state.layers.find((l) => l.id === layerId)
      if (!layer) return null

      const duplicatedLayer = {
        ...JSON.parse(JSON.stringify(layer)),
        id: uuidv4(),
        name: `${layer.name} copy`,
        zIndex: layer.zIndex + 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      set((draft: any) => {
        // Insert after the original layer
        const index = draft.layers.findIndex((l: any) => l.id === layerId)
        draft.layers.splice(index + 1, 0, duplicatedLayer)

        // Update z-indices
        draft.layers.forEach((l: any, idx: number) => {
          l.zIndex = idx
        })

        draft.activeLayerId = duplicatedLayer.id
      })

      return duplicatedLayer
    },

    setActiveLayer: (layerId) => {
      set((state) => {
        if (state.layers.find((l) => l.id === layerId)) {
          state.activeLayerId = layerId
        }
      })
    },

    moveLayer: (layerId, direction) => {
      set((state) => {
        const index = state.layers.findIndex((l) => l.id === layerId)
        if (index === -1) return

        let newIndex = index

        switch (direction) {
          case 'up':
            newIndex = Math.min(index + 1, state.layers.length - 1)
            break
          case 'down':
            newIndex = Math.max(index - 1, 0)
            break
          case 'top':
            newIndex = state.layers.length - 1
            break
          case 'bottom':
            newIndex = 0
            break
        }

        if (newIndex !== index) {
          const [layer] = state.layers.splice(index, 1)
          state.layers.splice(newIndex, 0, layer)

          // Update z-indices
          state.layers.forEach((l, idx) => {
            l.zIndex = idx
          })
        }
      })
    },

    renameLayer: (layerId, name) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === layerId)
        if (layer) {
          layer.name = name
          layer.updatedAt = Date.now()
        }
      })
    },

    setLayerVisibility: (layerId, visible) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === layerId)
        if (layer) {
          layer.visible = visible
          layer.updatedAt = Date.now()
        }
      })
    },

    setLayerOpacity: (layerId, opacity) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === layerId)
        if (layer) {
          layer.opacity = Math.max(0, Math.min(100, opacity))
          layer.updatedAt = Date.now()
        }
      })
    },

    setLayerBlendMode: (layerId, blendMode) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === layerId)
        if (layer) {
          layer.blendMode = blendMode
          layer.updatedAt = Date.now()
        }
      })
    },

    setLayerLocked: (layerId, locked) => {
      set((state) => {
        const layer = state.layers.find((l) => l.id === layerId)
        if (layer) {
          layer.locked = locked
          layer.updatedAt = Date.now()
        }
      })
    },

    mergeVisibleLayers: () => {
      // TODO: Implement layer merging logic
      console.log('Merge visible layers - to be implemented')
    },

    flattenImage: () => {
      // TODO: Implement flatten logic
      console.log('Flatten image - to be implemented')
    },

    getLayer: (layerId) => {
      return get().layers.find((l) => l.id === layerId)
    },

    // ========================================================================
    // TOOL ACTIONS
    // ========================================================================

    setActiveTool: (tool) => {
      set((state) => {
        state.activeTool = tool
      })
    },

    setToolOptions: (tool, options) => {
      set((state) => {
        state.toolOptions[tool] = {
          ...state.toolOptions[tool],
          ...options,
        } as ToolOptions
      })
    },

    getToolOptions: (tool) => {
      return get().toolOptions[tool]
    },

    // ========================================================================
    // COLOR ACTIONS
    // ========================================================================

    setForegroundColor: (color) => {
      set((state) => {
        state.foregroundColor = color
      })
      get().addRecentColor(color)
    },

    setBackgroundColor: (color) => {
      set((state) => {
        state.backgroundColor = color
      })
      get().addRecentColor(color)
    },

    swapColors: () => {
      set((state) => {
        const temp = state.foregroundColor
        state.foregroundColor = state.backgroundColor
        state.backgroundColor = temp
      })
    },

    addRecentColor: (color) => {
      set((state) => {
        if (!state.recentColors.includes(color)) {
          state.recentColors.unshift(color)
          if (state.recentColors.length > 10) {
            state.recentColors.pop()
          }
        }
      })
    },

    // ========================================================================
    // SELECTION ACTIONS
    // ========================================================================

    setSelection: (selection) => {
      set((state) => {
        state.selection = selection
      })
    },

    clearSelection: () => {
      set((state) => {
        state.selection = null
      })
    },

    invertSelection: () => {
      // TODO: Implement selection inversion
      console.log('Invert selection - to be implemented')
    },

    // ========================================================================
    // UI ACTIONS
    // ========================================================================

    togglePanel: (panel) => {
      set((state) => {
        state.ui.panels[panel] = !state.ui.panels[panel]
      })
    },

    openDialog: (dialog) => {
      set((state) => {
        state.ui.dialogs[dialog] = true
      })
    },

    closeDialog: (dialog) => {
      set((state) => {
        state.ui.dialogs[dialog] = false
      })
    },

    setTheme: (theme) => {
      set((state) => {
        state.ui.theme = theme
      })
    },

    setLoading: (loading) => {
      set((state) => {
        state.ui.loading = loading
      })
    },

    setError: (error) => {
      set((state) => {
        state.ui.error = error
      })
    },

    // ========================================================================
    // PROJECT ACTIONS
    // ========================================================================

    newProject: (width, height, options = {}) => {
      const project: Project = {
        id: options.id || uuidv4(),
        name: options.name || 'Untitled Project',
        width,
        height,
        resolution: options.resolution || 72,
        colorMode: options.colorMode || 'rgb',
        backgroundColor: options.backgroundColor || '#ffffff',
        layers: [],
        metadata: options.metadata || {},
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      set((draft: any) => {
        draft.project = project
        draft.canvasState.width = width
        draft.canvasState.height = height
        draft.canvasState.background = project.backgroundColor
        draft.layers = []
        draft.activeLayerId = null
      })

      // Create default background layer
      get().createLayer('raster' as LayerType, { name: 'Background', locked: true })
    },

    loadProject: (project) => {
      set((state: any) => {
        state.project = project
        state.layers = project.layers
        state.canvasState.width = project.width
        state.canvasState.height = project.height
        state.canvasState.background = project.backgroundColor
        state.activeLayerId = project.layers[0]?.id || null
      })
    },

    saveProject: () => {
      const state = get()
      if (!state.project) return null

      const updatedProject: Project = {
        ...state.project,
        layers: state.layers,
        updatedAt: Date.now(),
      }

      set((draft: any) => {
        draft.project = updatedProject
      })

      return updatedProject
    },

    clearProject: () => {
      set((state) => {
        state.project = null
        state.layers = []
        state.activeLayerId = null
        state.history = []
        state.historyIndex = -1
      })
    },

    // ========================================================================
    // CLIPBOARD ACTIONS
    // ========================================================================

    copy: () => {
      const state = get()
      if (state.activeLayerId) {
        const layer = state.getLayer(state.activeLayerId)
        if (layer) {
          set((draft: any) => {
            draft.clipboard = {
              type: 'layer',
              data: layer,
            }
          })
        }
      }
    },

    cut: () => {
      const state = get()
      if (state.activeLayerId) {
        const layer = state.getLayer(state.activeLayerId)
        if (layer) {
          set((draft: any) => {
            draft.clipboard = {
              type: 'layer',
              data: layer,
            }
          })
          state.deleteLayer(state.activeLayerId)
        }
      }
    },

    paste: () => {
      const state = get()
      if (state.clipboard.type === 'layer' && state.clipboard.data) {
        const layer = state.clipboard.data as Layer
        state.createLayer(layer.type, layer)
      }
    },

    // ========================================================================
    // UTILITY ACTIONS
    // ========================================================================

    reset: () => {
      set(initialState)
    },

    updateMemoryUsage: () => {
      // Approximate memory usage calculation
      const state = get()
      const layerCount = state.layers.length
      const historyCount = state.history.length
      const approximateMemory = (layerCount * 5) + (historyCount * 2) // Very rough estimate in MB

      set((draft) => {
        draft.memoryUsage = approximateMemory
      })
    },
  }))
)

// ============================================================================
// HELPER HOOKS
// ============================================================================

// Hook to get active layer
export const useActiveLayer = () => {
  const activeLayerId = useEditorStore((state) => state.activeLayerId)
  const getLayer = useEditorStore((state) => state.getLayer)
  return activeLayerId ? getLayer(activeLayerId) : null
}

// Hook to get visible layers
export const useVisibleLayers = () => {
  return useEditorStore((state) => state.layers.filter((l) => l.visible))
}

// Hook to get layer count
export const useLayerCount = () => {
  return useEditorStore((state) => state.layers.length)
}
