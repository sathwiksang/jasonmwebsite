// ============================================================================
// PIXELFORGE PRO - ELLIPTICAL MARQUEE TOOL
// ============================================================================

import { Canvas, Ellipse } from 'fabric'
import type { Tool, SelectionToolOptions } from '../types'

/**
 * Elliptical marquee tool for creating elliptical/circular selections
 */
export class EllipticalMarqueeTool implements Tool {
  name = 'elliptical-marquee'
  private isDrawing = false
  private startPoint: { x: number; y: number } | null = null
  private selectionEllipse: Ellipse | null = null
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

    console.log('Elliptical marquee tool activated')
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
    if (this.selectionEllipse) {
      canvas.remove(this.selectionEllipse)
      this.selectionEllipse = null
    }

    console.log('Elliptical marquee tool deactivated')
  }

  private handleMouseDown(canvas: Canvas, event: any): void {
    const pointer = canvas.getPointer(event.e)
    this.isDrawing = true
    this.startPoint = { x: pointer.x, y: pointer.y }

    // Create selection ellipse
    this.selectionEllipse = new Ellipse({
      left: pointer.x,
      top: pointer.y,
      rx: 0,
      ry: 0,
      fill: 'rgba(0, 123, 255, 0.1)',
      stroke: '#007bff',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center',
    })

    canvas.add(this.selectionEllipse)
    canvas.renderAll()
  }

  private handleMouseMove(canvas: Canvas, event: any): void {
    if (!this.isDrawing || !this.startPoint || !this.selectionEllipse) return

    const pointer = canvas.getPointer(event.e)
    const dx = pointer.x - this.startPoint.x
    const dy = pointer.y - this.startPoint.y

    // Calculate center point and radii
    const centerX = this.startPoint.x + dx / 2
    const centerY = this.startPoint.y + dy / 2
    const rx = Math.abs(dx / 2)
    const ry = Math.abs(dy / 2)

    // Update ellipse
    this.selectionEllipse.set({
      left: centerX,
      top: centerY,
      rx: rx,
      ry: ry,
    })

    canvas.renderAll()
  }

  private handleMouseUp(canvas: Canvas, event: any): void {
    if (!this.isDrawing || !this.selectionEllipse) return

    this.isDrawing = false

    // Get final selection bounds
    const bounds = {
      left: (this.selectionEllipse.left || 0) - (this.selectionEllipse.rx || 0),
      top: (this.selectionEllipse.top || 0) - (this.selectionEllipse.ry || 0),
      rx: this.selectionEllipse.rx || 0,
      ry: this.selectionEllipse.ry || 0,
    }

    console.log('Elliptical selection created:', bounds)

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
    if (this.selectionEllipse) {
      canvas.remove(this.selectionEllipse)
      this.selectionEllipse = null
      canvas.renderAll()
    }
  }
}

/**
 * Create an elliptical marquee tool instance
 */
export function createEllipticalMarqueeTool(
  options?: Partial<SelectionToolOptions>
): EllipticalMarqueeTool {
  return new EllipticalMarqueeTool(options)
}
