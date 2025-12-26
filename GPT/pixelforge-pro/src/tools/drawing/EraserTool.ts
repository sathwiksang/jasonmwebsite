// ============================================================================
// PIXELFORGE PRO - ERASER TOOL
// ============================================================================

import { Canvas, PencilBrush } from 'fabric'
import type { Tool, DrawingToolOptions } from '../types'

/**
 * Eraser tool for removing content from the canvas
 */
export class EraserTool implements Tool {
  name = 'eraser'
  private brush: PencilBrush | null = null
  private options: DrawingToolOptions

  constructor(options?: Partial<DrawingToolOptions>) {
    this.options = {
      size: options?.size ?? 20, // Larger default size for eraser
      color: '#ffffff', // Not used for eraser, but required
      opacity: 1, // Always full opacity for erasing
      hardness: options?.hardness ?? 1,
      spacing: 0.1,
      blendMode: 'destination-out', // This makes it erase
      pressureSensitivity: options?.pressureSensitivity ?? false,
    }
  }

  activate(canvas: Canvas): void {
    // Enable drawing mode
    canvas.isDrawingMode = true

    // Create and configure brush for erasing
    this.brush = new PencilBrush(canvas)
    this.brush.width = this.options.size

    // Use white color with destination-out for erasing effect
    // The destination-out composite mode removes pixels
    this.brush.color = 'rgba(255, 255, 255, 1)'

    // Set eraser-specific properties
    // @ts-ignore - Fabric.js typing may not include all properties
    if (this.brush.globalCompositeOperation !== undefined) {
      // @ts-ignore
      this.brush.globalCompositeOperation = 'destination-out'
    }

    // Set the brush on the canvas
    canvas.freeDrawingBrush = this.brush

    // Change cursor to indicate eraser
    canvas.defaultCursor = 'crosshair'
    canvas.hoverCursor = 'crosshair'

    console.log('Eraser tool activated:', this.options)
  }

  deactivate(canvas: Canvas): void {
    // Disable drawing mode
    canvas.isDrawingMode = false
    canvas.freeDrawingBrush = null as any
    this.brush = null

    // Reset cursor
    canvas.defaultCursor = 'default'
    canvas.hoverCursor = 'move'

    console.log('Eraser tool deactivated')
  }

  /**
   * Update eraser options (mainly size)
   */
  updateOptions(options: Partial<DrawingToolOptions>): void {
    this.options = {
      ...this.options,
      ...options,
      opacity: 1, // Always full opacity for eraser
    }

    if (this.brush) {
      this.brush.width = this.options.size
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
 * Create an eraser tool instance
 */
export function createEraserTool(options?: Partial<DrawingToolOptions>): EraserTool {
  return new EraserTool(options)
}
