// ============================================================================
// PIXELFORGE PRO - PENCIL TOOL
// ============================================================================

import { Canvas, PencilBrush } from 'fabric'
import type { Tool, DrawingToolOptions } from '../types'

/**
 * Pencil tool for precise drawing with hard edges
 */
export class PencilTool implements Tool {
  name = 'pencil'
  private brush: PencilBrush | null = null
  private options: DrawingToolOptions

  constructor(options?: Partial<DrawingToolOptions>) {
    this.options = {
      size: options?.size ?? 2, // Smaller default size for precision
      color: options?.color ?? '#000000',
      opacity: 1, // Always full opacity for pencil
      hardness: 1, // Always full hardness for pencil
      spacing: 0.05, // Tighter spacing for smoother lines
      blendMode: options?.blendMode ?? 'source-over',
      pressureSensitivity: options?.pressureSensitivity ?? false,
    }
  }

  activate(canvas: Canvas): void {
    // Enable drawing mode
    canvas.isDrawingMode = true

    // Create and configure brush for pencil-like behavior
    this.brush = new PencilBrush(canvas)
    this.brush.width = this.options.size
    this.brush.color = this.options.color

    // Pencil has sharp, precise strokes
    this.brush.strokeLineCap = 'round'
    this.brush.strokeLineJoin = 'round'

    // Set the brush on the canvas
    canvas.freeDrawingBrush = this.brush

    // Change cursor to crosshair for precision
    canvas.defaultCursor = 'crosshair'
    canvas.hoverCursor = 'crosshair'

    console.log('Pencil tool activated:', this.options)
  }

  deactivate(canvas: Canvas): void {
    // Disable drawing mode
    canvas.isDrawingMode = false
    canvas.freeDrawingBrush = null as any
    this.brush = null

    // Reset cursor
    canvas.defaultCursor = 'default'
    canvas.hoverCursor = 'move'

    console.log('Pencil tool deactivated')
  }

  /**
   * Update pencil options (size and color mainly)
   */
  updateOptions(options: Partial<DrawingToolOptions>): void {
    // Pencil always maintains full opacity and hardness
    this.options = {
      ...this.options,
      ...options,
      opacity: 1,
      hardness: 1,
    }

    if (this.brush) {
      this.brush.width = this.options.size
      this.brush.color = this.options.color
    }
  }

  /**
   * Get current options
   */
  getOptions(): DrawingToolOptions {
    return { ...this.options }
  }

  getCursor(): string {
    return 'crosshair'
  }
}

/**
 * Create a pencil tool instance
 */
export function createPencilTool(options?: Partial<DrawingToolOptions>): PencilTool {
  return new PencilTool(options)
}
