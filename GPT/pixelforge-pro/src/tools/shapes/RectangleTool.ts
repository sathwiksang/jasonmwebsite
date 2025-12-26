// ============================================================================
// PIXELFORGE PRO - RECTANGLE SHAPE TOOL
// ============================================================================

import { Canvas, Rect } from 'fabric'
import type { Tool } from '../types'

/**
 * Rectangle tool for drawing rectangle shapes
 */
export class RectangleTool implements Tool {
  name = 'rectangle'
  private isDrawing = false
  private startPoint: { x: number; y: number } | null = null
  private currentRect: Rect | null = null
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

    console.log('Rectangle tool activated')
  }

  deactivate(canvas: Canvas): void {
    canvas.selection = true
    canvas.defaultCursor = 'default'
    canvas.hoverCursor = 'move'

    canvas.off('mouse:down')
    canvas.off('mouse:move')
    canvas.off('mouse:up')

    console.log('Rectangle tool deactivated')
  }

  private handleMouseDown(canvas: Canvas, event: any): void {
    const pointer = canvas.getPointer(event.e)
    this.isDrawing = true
    this.startPoint = { x: pointer.x, y: pointer.y }

    this.currentRect = new Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      fill: this.fillColor,
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
    })

    canvas.add(this.currentRect)
  }

  private handleMouseMove(canvas: Canvas, event: any): void {
    if (!this.isDrawing || !this.startPoint || !this.currentRect) return

    const pointer = canvas.getPointer(event.e)
    const width = pointer.x - this.startPoint.x
    const height = pointer.y - this.startPoint.y

    if (width < 0) {
      this.currentRect.set({ left: pointer.x })
    }
    if (height < 0) {
      this.currentRect.set({ top: pointer.y })
    }

    this.currentRect.set({
      width: Math.abs(width),
      height: Math.abs(height),
    })

    canvas.renderAll()
  }

  private handleMouseUp(canvas: Canvas, event: any): void {
    this.isDrawing = false
    this.startPoint = null
    this.currentRect = null
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

export function createRectangleTool(): RectangleTool {
  return new RectangleTool()
}
