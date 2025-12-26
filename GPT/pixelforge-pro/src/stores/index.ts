// ============================================================================
// PIXELFORGE PRO - STORE EXPORTS
// ============================================================================

export * from './editorStore'
export * from './historyStore'

// Re-export commonly used hooks
export {
  useEditorStore,
  useActiveLayer,
  useVisibleLayers,
  useLayerCount,
} from './editorStore'

export {
  useHistoryStore,
  useHistoryCapabilities,
  useHistoryLength,
  useHistoryActions,
  recordHistory,
  createEditorSnapshot,
} from './historyStore'
