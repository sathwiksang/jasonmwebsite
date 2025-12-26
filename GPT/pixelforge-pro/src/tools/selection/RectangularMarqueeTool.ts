// ============================================================================
// PIXELFORGE PRO - RECTANGULAR MARQUEE TOOL
// ============================================================================

import { Canvas, Rect } from 'fabric'
import type { Tool, SelectionToolOptions } from '../types'

/**
 * Rectangular marquee tool for creating rectangular selections
 */
export class RectangularMarqueeTool implements Tool {
  name = 'rectangular-marquee'
  private isDrawing = false
  private startPoint: { x: number; y: number } | null = null
  private selectionRect: Rect | null = null
  private options: SelectionToolOptions

  constructor(options?: Partial<SelectionToolOptions>) {
    this.options = {
      mode: options?.mode ?? 'new',
      feather: options?.feather ?? 0,
      antiAlias: options?.antiAlias ?? true,
    }
  }

  activate(canvas: Canvas): void {
    // Disable default selection
    canvas.selection = false
    canvas.defaultCursor = 'crosshair'
    canvas.hoverCursor = 'crosshair'

    // Add event listeners
    canvas.on('mouse:down', this.handleMouseDown.bind(this, canvas))
    canvas.on('mouse:move', this.handleMouseMove.bind(this, canvas))
    canvas.on('mouse:up', this.handleMouseUp.bind(this, canvas))

    console.log('Rectangular marquee tool activated')
  }

  deactivate(canvas: Canvas): void {
    // Re-enable default selection
    canvas.selection = true
    canvas.defaultCursor = 'default'
    canvas.hoverCursor = 'move'

    // Remove event listeners
    canvas.off('mouse:down')
    canvas.off('mouse:move')
    canvas.off('mouse:up')

    // Clean up any temporary selection
    if (this.selectionRect) {
      canvas.remove(this.selectionRect)
      this.selectionRect = null
    }

    console.log('Rectangular marquee tool deactivated')
  }

  private handleMouseDown(canvas: Canvas, event: any): void {
    const pointer = canvas.getPointer(event.e)
    this.isDrawing = true
    this.startPoint = { x: pointer.x, y: pointer.y }

    // Create selection rectangle
    this.selectionRect = new Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      fill: 'rgba(0, 123, 255, 0.1)',
      stroke: '#007bff',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    })

    canvas.add(this.selectionRect)
    canvas.renderAll()
  }

  private handleMouseMove(canvas: Canvas, event: any): void {
    if (!this.isDrawing || !this.startPoint || !this.selectionRect) return

    const pointer = canvas.getPointer(event.e)
    const width = pointer.x - this.startPoint.x
    const height = pointer.y - this.startPoint.y

    // Update rectangle dimensions
    if (width < 0) {
      this.selectionRect.set({ left: pointer.x })
    }
    if (height < 0) {
      this.selectionRect.set({ top: pointer.y })
    }

    this.selectionRect.set({
      width: Math.abs(width),
      height: Math.abs(height),
    })

    canvas.renderAll()
  }

  private handleMouseUp(canvas: Canvas, event: any): void {
    if (!this.isDrawing || !this.selectionRect) return

    this.isDrawing = false

    // Get final selection bounds
    const bounds = {
      left: this.selectionRect.left || 0,
      top: this.selectionRect.top || 0,
      width: this.selectionRect.width || 0,
      height: this.selectionRect.height || 0,
    }

    console.log('Selection created:', bounds)

    // TODO: Store selection in editor store
    // For now, we'll keep the marching ants visible

    // Reset for next selection
    this.startPoint = null
  }

  updateOptions(options: Partial<SelectionToolOptions>): void {
    this.options = { ...this.options, ...options }
  }

  getOptions(): SelectionToolOptions {
    return { ...this.options }
  }

  getCursor(): string {
    return 'crosshair'
  }

  /**
   * Clear the current selection
   */
  clearSelection(canvas: Canvas): void {
    if (this.selectionRect) {
      canvas.remove(this.selectionRect)
      this.selectionRect = null
      canvas.renderAll()
    }
  }
}

/**
 * Create a rectangular marquee tool instance
 */
export function createRectangularMarqueeTool(
  options?: Partial<SelectionToolOptions>
): RectangularMarqueeTool {
  return new RectangularMarqueeTool(options)
}
