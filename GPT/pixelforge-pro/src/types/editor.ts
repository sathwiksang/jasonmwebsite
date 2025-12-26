// ============================================================================
// PIXELFORGE PRO - CORE TYPE DEFINITIONS
// ============================================================================

// ============================================================================
// LAYER TYPES
// ============================================================================

export type LayerType = 'raster' | 'text' | 'shape' | 'adjustment' | 'group'

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'

export interface Layer {
  id: string
  name: string
  type: LayerType
  visible: boolean
  locked: boolean
  opacity: number // 0-100
  blendMode: BlendMode
  x: number
  y: number
  width: number
  height: number

  // Layer-specific data
  data: RasterLayerData | TextLayerData | ShapeLayerData | AdjustmentLayerData | GroupLayerData

  // Fabric.js reference (for canvas rendering)
  fabricObject?: any

  // Offscreen canvas for non-destructive editing
  offscreenCanvas?: HTMLCanvasElement

  // Thumbnail for layer panel
  thumbnail?: string // base64 data URL

  // Layer effects
  effects?: LayerEffect[]

  // Masking
  mask?: LayerMask

  // Parent group (if nested)
  parentId?: string

  // Z-index (stacking order)
  zIndex: number

  // Metadata
  createdAt: number
  updatedAt: number
}

export interface RasterLayerData {
  imageData?: ImageData
  imageUrl?: string
}

export interface TextLayerData {
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: 'normal' | 'bold' | 'lighter' | number
  fontStyle: 'normal' | 'italic' | 'oblique'
  textAlign: 'left' | 'center' | 'right' | 'justify'
  textDecoration: 'none' | 'underline' | 'line-through' | 'overline'
  lineHeight: number
  letterSpacing: number
  fill: string | Gradient
  stroke?: string
  strokeWidth?: number
}

export interface ShapeLayerData {
  shapeType: 'rectangle' | 'ellipse' | 'polygon' | 'line' | 'custom'
  fill: string | Gradient | Pattern
  stroke: string
  strokeWidth: number
  strokeDashArray?: number[]
  cornerRadius?: number // for rectangles
  sides?: number // for polygons
  points?: { x: number; y: number }[] // for custom shapes
}

export interface AdjustmentLayerData {
  adjustmentType: 'brightness-contrast' | 'hue-saturation' | 'levels' | 'curves' | 'color-balance'
  parameters: Record<string, number | string | boolean>
}

export interface GroupLayerData {
  childrenIds: string[]
  expanded: boolean
}

export interface LayerEffect {
  id: string
  type: 'drop-shadow' | 'inner-shadow' | 'glow' | 'stroke' | 'bevel'
  enabled: boolean
  parameters: Record<string, number | string | boolean>
}

export interface LayerMask {
  imageData: ImageData
  enabled: boolean
  inverted: boolean
}

// ============================================================================
// TOOL TYPES
// ============================================================================

export type ToolType =
  // Selection Tools
  | 'move'
  | 'rectangular-marquee'
  | 'elliptical-marquee'
  | 'lasso'
  | 'polygonal-lasso'
  | 'magic-wand'
  // Drawing Tools
  | 'brush'
  | 'pencil'
  | 'eraser'
  | 'fill'
  | 'gradient'
  // Retouching Tools
  | 'clone-stamp'
  | 'healing-brush'
  | 'spot-healing'
  | 'red-eye'
  // Shape Tools
  | 'rectangle'
  | 'ellipse'
  | 'line'
  | 'polygon'
  | 'custom-shape'
  // Text Tool
  | 'text'
  // Transform Tools
  | 'crop'
  | 'free-transform'
  | 'warp'
  | 'perspective'
  // View Tools
  | 'hand'
  | 'zoom'

export interface BaseTool {
  type: ToolType
  cursor: string
  icon: string
}

export interface BrushToolOptions {
  size: number // 1-500px
  hardness: number // 0-100%
  opacity: number // 0-100%
  flow: number // 0-100%
  spacing: number // 1-100%
  pressureSensitivity: boolean
}

export interface EraserToolOptions {
  size: number
  hardness: number
  opacity: number
  eraseMode: 'brush' | 'block'
}

export interface FillToolOptions {
  tolerance: number // 0-255
  contiguous: boolean
  sampleAllLayers: boolean
  antiAlias: boolean
}

export interface GradientToolOptions {
  gradientType: 'linear' | 'radial' | 'angle' | 'reflected' | 'diamond'
  gradient: Gradient
  reverse: boolean
  dither: boolean
}

export interface SelectionToolOptions {
  feather: number // 0-250px
  antiAlias: boolean
  mode: 'new' | 'add' | 'subtract' | 'intersect'
}

export interface MagicWandToolOptions extends SelectionToolOptions {
  tolerance: number // 0-255
  contiguous: boolean
  sampleAllLayers: boolean
}

export interface CloneStampToolOptions {
  size: number
  hardness: number
  opacity: number
  aligned: boolean
  sampleAllLayers: boolean
}

export interface CropToolOptions {
  aspectRatio: 'free' | '1:1' | '4:3' | '16:9' | 'custom'
  customRatio?: { width: number; height: number }
  showOverlay: boolean
  overlayType: 'none' | 'rule-of-thirds' | 'grid' | 'center'
}

export type ToolOptions =
  | BrushToolOptions
  | EraserToolOptions
  | FillToolOptions
  | GradientToolOptions
  | SelectionToolOptions
  | MagicWandToolOptions
  | CloneStampToolOptions
  | CropToolOptions

// ============================================================================
// FILTER TYPES
// ============================================================================

export type FilterCategory = 'adjustment' | 'blur' | 'sharpen' | 'distort' | 'stylize' | 'preset'

export type FilterType =
  // Adjustments
  | 'brightness-contrast'
  | 'hue-saturation'
  | 'levels'
  | 'curves'
  | 'color-balance'
  | 'exposure'
  | 'vibrance'
  | 'black-white'
  | 'invert'
  | 'posterize'
  | 'threshold'
  // Blur
  | 'gaussian-blur'
  | 'motion-blur'
  | 'radial-blur'
  | 'lens-blur'
  | 'tilt-shift'
  // Sharpen
  | 'sharpen'
  | 'unsharp-mask'
  | 'smart-sharpen'
  // Distort
  | 'liquify'
  | 'spherize'
  | 'pinch'
  | 'twirl'
  | 'wave'
  | 'ripple'
  // Stylize
  | 'emboss'
  | 'find-edges'
  | 'oil-paint'
  | 'solarize'
  | 'pixelate'
  | 'vignette'
  | 'noise'
  // Presets
  | 'vintage'
  | 'sepia'
  | 'cross-process'
  | 'hdr'

export interface Filter {
  type: FilterType
  category: FilterCategory
  name: string
  description: string
  parameters: FilterParameters
  previewEnabled: boolean
}

export type FilterParameters = Record<string, FilterParameter>

export interface FilterParameter {
  name: string
  type: 'number' | 'boolean' | 'color' | 'select' | 'curve'
  value: number | boolean | string | CurvePoint[]
  min?: number
  max?: number
  step?: number
  options?: string[]
  unit?: string
}

export interface CurvePoint {
  x: number // 0-255
  y: number // 0-255
}

// ============================================================================
// SELECTION TYPES
// ============================================================================

export type SelectionType = 'rectangular' | 'elliptical' | 'lasso' | 'polygonal' | 'magic-wand'

export interface Selection {
  type: SelectionType
  path: any
  feather: number
  antiAlias: boolean
  active: boolean
}

// ============================================================================
// COLOR TYPES
// ============================================================================

export interface RGB {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
}

export interface RGBA extends RGB {
  a: number // 0-1
}

export interface HSL {
  h: number // 0-360
  s: number // 0-100
  l: number // 0-100
}

export interface HSLA extends HSL {
  a: number // 0-1
}

export interface ColorStop {
  color: string
  offset: number // 0-1
}

export interface Gradient {
  type: 'linear' | 'radial'
  stops: ColorStop[]
  angle?: number // for linear gradients
  centerX?: number // for radial gradients (0-1)
  centerY?: number // for radial gradients (0-1)
  radius?: number // for radial gradients (0-1)
}

export interface Pattern {
  type: 'pattern'
  imageUrl: string  // Use URL instead of DOM element
  repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
  offsetX?: number
  offsetY?: number
  scaleX?: number
  scaleY?: number
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface Project {
  id: string
  name: string
  width: number
  height: number
  resolution: number // DPI
  colorMode: 'rgb' | 'grayscale' | 'cmyk'
  backgroundColor: string
  layers: Layer[]
  metadata: ProjectMetadata
  version: string
  createdAt: number
  updatedAt: number
}

export interface ProjectMetadata {
  author?: string
  description?: string
  tags?: string[]
  customData?: Record<string, unknown>
}

export interface ExportOptions {
  format: 'png' | 'jpeg' | 'webp' | 'gif' | 'pdf' | 'svg'
  quality?: number // 0-100 (for jpeg/webp)
  colorDepth?: 8 | 24 | 32 // (for png)
  dpi?: number
  resize?: {
    width: number
    height: number
    maintainAspectRatio: boolean
  }
  flatten: boolean
  stripMetadata: boolean
  backgroundColor?: string
}

// ============================================================================
// HISTORY TYPES
// ============================================================================

export type HistoryActionType =
  // Layer Actions
  | 'layer-create'
  | 'layer-delete'
  | 'layer-duplicate'
  | 'layer-merge'
  | 'layer-move'
  | 'layer-rename'
  | 'layer-property-change'
  // Drawing Actions
  | 'draw-stroke'
  | 'erase-stroke'
  | 'fill-area'
  // Transform Actions
  | 'transform'
  | 'crop'
  | 'resize'
  // Filter Actions
  | 'apply-filter'
  // Selection Actions
  | 'create-selection'
  | 'modify-selection'
  | 'delete-selection'
  // Other
  | 'paste'
  | 'clear'

export interface HistoryEntry {
  id: string
  type: HistoryActionType
  description: string
  timestamp: number

  // State snapshot (could be full state or diff)
  state: EditorStateSnapshot

  // For memory optimization
  compressed?: boolean
}

export interface EditorStateSnapshot {
  layers: Layer[]
  activeLayerId: string | null
  selection: Selection | null
  canvasSize: { width: number; height: number }
}

// ============================================================================
// CANVAS TYPES
// ============================================================================

export interface CanvasState {
  width: number
  height: number
  zoom: number
  pan: {
    x: number
    y: number
  }
  background: string
  showGrid: boolean
  showRulers: boolean
  snapToGrid: boolean
  gridSize: number
}

export interface Viewport {
  x: number
  y: number
  width: number
  height: number
  zoom: number
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface PanelState {
  layers: boolean
  properties: boolean
  history: boolean
  color: boolean
  navigator: boolean
}

export interface DialogState {
  newDocument: boolean
  imageSize: boolean
  canvasSize: boolean
  export: boolean
  preferences: boolean
  keyboardShortcuts: boolean
  about: boolean
}

export interface UIState {
  panels: PanelState
  dialogs: DialogState
  theme: 'light' | 'dark'
  loading: boolean
  error: string | null
}

// ============================================================================
// MAIN EDITOR STATE
// ============================================================================

export interface EditorState {
  // Canvas
  canvas: any | null
  canvasState: CanvasState

  // Layers
  layers: Layer[]
  activeLayerId: string | null

  // Tools
  activeTool: ToolType
  toolOptions: Partial<Record<ToolType, ToolOptions>>

  // Colors
  foregroundColor: string
  backgroundColor: string
  recentColors: string[]

  // Selection
  selection: Selection | null

  // History
  history: HistoryEntry[]
  historyIndex: number
  maxHistorySize: number

  // UI
  ui: UIState

  // Project
  project: Project | null

  // Clipboard
  clipboard: {
    type: 'layer' | 'selection' | null
    data: Layer | ImageData | null
  }

  // Performance
  performanceMode: 'quality' | 'balanced' | 'performance'
  memoryUsage: number // in MB
}
