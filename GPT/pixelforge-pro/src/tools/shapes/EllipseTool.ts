// ============================================================================
// PIXELFORGE PRO - ELLIPSE SHAPE TOOL
// ============================================================================

import { Canvas, Ellipse } from 'fabric'
import type { Tool } from '../types'

/**
 * Ellipse tool for drawing ellipse/circle shapes
 */
export class EllipseTool implements Tool {
  name = 'ellipse'
  private isDrawing = false
  private startPoint: { x: number; y: number } | null = null
  private currentEllipse: Ellipse | null = null
  private fillColor = '#3b82f6'
  private strokeColor = '#1e40af'
  private strokeWidth = 2

  activate(canvas: Canvas): void {
    canvas.selection = false
    canvas.defaultCursor = 'crosshair'
    canvas.hoverCursor = 'crosshair'

    canvas.on('mouse:down', this.handleMouseDown.bind(this, canvas))
    canvas.on('mouse:move', this.handleMouseMove.bind(this, canvas))
    canvas.on('mouse:up', this.handleMouseUp.bind(this, canvas))

    console.log('Ellipse tool activated')
  }

  deactivate(canvas: Canvas): void {
    canvas.selection = true
    canvas.defaultCursor = 'default'
    canvas.hoverCursor = 'move'

    canvas.off('mouse:down')
    canvas.off('mouse:move')
    canvas.off('mouse:up')

    console.log('Ellipse tool deactivated')
  }

  private handleMouseDown(canvas: Canvas, event: any): void {
    const pointer = canvas.getPointer(event.e)
    this.isDrawing = true
    this.startPoint = { x: pointer.x, y: pointer.y }

    this.currentEllipse = new Ellipse({
      left: pointer.x,
      top: pointer.y,
      rx: 0,
      ry: 0,
      fill: this.fillColor,
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
      originX: 'center',
      originY: 'center',
    })

    canvas.add(this.currentEllipse)
  }

  private handleMouseMove(canvas: Canvas, event: any): void {
    if (!this.isDrawing || !this.startPoint || !this.currentEllipse) return

    const pointer = canvas.getPointer(event.e)
    const dx = pointer.x - this.startPoint.x
    const dy = pointer.y - this.startPoint.y

    const centerX = this.startPoint.x + dx / 2
    const centerY = this.startPoint.y + dy / 2
    const rx = Math.abs(dx / 2)
    const ry = Math.abs(dy / 2)

    this.currentEllipse.set({
      left: centerX,
      top: centerY,
      rx: rx,
      ry: ry,
    })

    canvas.renderAll()
  }

  private handleMouseUp(canvas: Canvas, event: any): void {
    this.isDrawing = false
    this.startPoint = null
    this.currentEllipse = null
  }

  setColors(fill: string, stroke: string): void {
    this.fillColor = fill
    this.strokeColor = stroke
  }

  setStrokeWidth(width: number): void {
    this.strokeWidth = width
  }

  getCursor(): string {
    return 'crosshair'
  }
}

export function createEllipseTool(): EllipseTool {
  return new EllipseTool()
}
