// ============================================================================
// PIXELFORGE PRO - TOOL TYPES AND INTERFACES
// ============================================================================

import type { Canvas, Object as FabricObject } from 'fabric'

/**
 * Base tool interface that all tools must implement
 */
export interface Tool {
  /** Tool name/identifier */
  name: string

  /** Activate the tool */
  activate(canvas: Canvas, options?: any): void

  /** Deactivate the tool and clean up */
  deactivate(canvas: Canvas): void

  /** Handle cursor changes */
  getCursor?(): string
}

/**
 * Drawing tool options
 */
export interface DrawingToolOptions {
  /** Brush size in pixels */
  size: number

  /** Brush color */
  color: string

  /** Brush opacity (0-1) */
  opacity: number

  /** Brush hardness (0-1) */
  hardness: number

  /** Spacing between brush stamps (0-1) */
  spacing: number

  /** Blend mode */
  blendMode: string

  /** Enable pressure sensitivity */
  pressureSensitivity: boolean
}

/**
 * Selection tool options
 */
export interface SelectionToolOptions {
  /** Selection mode: new, add, subtract, intersect */
  mode: 'new' | 'add' | 'subtract' | 'intersect'

  /** Feather amount in pixels */
  feather: number

  /** Anti-aliasing */
  antiAlias: boolean
}

/**
 * Transform tool options
 */
export interface TransformToolOptions {
  /** Maintain aspect ratio */
  proportional: boolean

  /** Transform from center */
  fromCenter: boolean

  /** Snap to angle */
  snapAngle: number
}

/**
 * Text tool options
 */
export interface TextToolOptions {
  /** Font family */
  fontFamily: string

  /** Font size */
  fontSize: number

  /** Font weight */
  fontWeight: string

  /** Font style */
  fontStyle: string

  /** Text color */
  color: string

  /** Text alignment */
  align: 'left' | 'center' | 'right' | 'justify'

  /** Line height */
  lineHeight: number
}

/**
 * Tool event types
 */
export interface ToolEvents {
  onMouseDown?: (event: any, canvas: Canvas) => void
  onMouseMove?: (event: any, canvas: Canvas) => void
  onMouseUp?: (event: any, canvas: Canvas) => void
  onMouseWheel?: (event: any, canvas: Canvas) => void
  onKeyDown?: (event: KeyboardEvent, canvas: Canvas) => void
  onKeyUp?: (event: KeyboardEvent, canvas: Canvas) => void
}

/**
 * Tool state for tracking active operations
 */
export interface ToolState {
  isDrawing: boolean
  startPoint: { x: number; y: number } | null
  currentPath: FabricObject | null
  tempObjects: FabricObject[]
}
