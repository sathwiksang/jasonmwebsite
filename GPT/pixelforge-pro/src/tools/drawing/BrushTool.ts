// ============================================================================
// PIXELFORGE PRO - BRUSH TOOL
// ============================================================================

import { Canvas, PencilBrush } from 'fabric'
import type { Tool, DrawingToolOptions } from '../types'

/**
 * Brush tool for freehand drawing
 */
export class BrushTool implements Tool {
  name = 'brush'
  private brush: PencilBrush | null = null
  private options: DrawingToolOptions

  constructor(options?: Partial<DrawingToolOptions>) {
    this.options = {
      size: options?.size ?? 10,
      color: options?.color ?? '#000000',
      opacity: options?.opacity ?? 1,
      hardness: options?.hardness ?? 1,
      spacing: options?.spacing ?? 0.1,
      blendMode: options?.blendMode ?? 'source-over',
      pressureSensitivity: options?.pressureSensitivity ?? false,
    }
  }

  activate(canvas: Canvas): void {
    // Enable drawing mode
    canvas.isDrawingMode = true

    // Create and configure brush
    this.brush = new PencilBrush(canvas)
    this.brush.width = this.options.size
    this.brush.color = this.hexToRgba(this.options.color, this.options.opacity)

    // Set the brush on the canvas
    canvas.freeDrawingBrush = this.brush

    // Change cursor
    canvas.defaultCursor = 'crosshair'
    canvas.hoverCursor = 'crosshair'

    console.log('Brush tool activated:', this.options)
  }

  deactivate(canvas: Canvas): void {
    // Disable drawing mode
    canvas.isDrawingMode = false
    canvas.freeDrawingBrush = null as any
    this.brush = null

    // Reset cursor
    canvas.defaultCursor = 'default'
    canvas.hoverCursor = 'move'

    console.log('Brush tool deactivated')
  }

  /**
   * Update brush options
   */
  updateOptions(options: Partial<DrawingToolOptions>): void {
    this.options = { ...this.options, ...options }

    if (this.brush) {
      this.brush.width = this.options.size
      this.brush.color = this.hexToRgba(this.options.color, this.options.opacity)
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

  /**
   * Convert hex color to rgba
   */
  private hexToRgba(hex: string, opacity: number): string {
    // Remove # if present
    hex = hex.replace('#', '')

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
}

/**
 * Create a brush tool instance
 */
export function createBrushTool(options?: Partial<DrawingToolOptions>): BrushTool {
  return new BrushTool(options)
}
