// ============================================================================
// PIXELFORGE PRO - MOVE/TRANSFORM TOOL
// ============================================================================

import { Canvas } from 'fabric'
import type { Tool, TransformToolOptions } from '../types'

/**
 * Move tool for selecting and transforming objects
 */
export class MoveTool implements Tool {
  name = 'move'
  private options: TransformToolOptions

  constructor(options?: Partial<TransformToolOptions>) {
    this.options = {
      proportional: options?.proportional ?? false,
      fromCenter: options?.fromCenter ?? false,
      snapAngle: options?.snapAngle ?? 15,
    }
  }

  activate(canvas: Canvas): void {
    // Enable selection and transformation
    canvas.selection = true
    canvas.defaultCursor = 'default'
    canvas.hoverCursor = 'move'

    // Enable all transform controls
    canvas.forEachObject((obj) => {
      obj.set({
        selectable: true,
        hasControls: true,
        hasBorders: true,
      })
    })

    // Set up transform controls
    this.configureTransformControls(canvas)

    console.log('Move tool activated')
  }

  deactivate(canvas: Canvas): void {
    // Deselect all objects
    canvas.discardActiveObject()
    canvas.renderAll()

    console.log('Move tool deactivated')
  }

  private configureTransformControls(canvas: Canvas): void {
    // Configure object controls based on options
    canvas.on('object:scaling', (e: any) => {
      if (this.options.proportional && e.target) {
        // Lock aspect ratio
        e.target.set({
          lockScalingFlip: true,
          lockUniScaling: true,
        })
      }
    })

    canvas.on('object:rotating', (e: any) => {
      if (this.options.snapAngle && e.target) {
        const angle = e.target.angle || 0
        const snapAngle = this.options.snapAngle
        const snappedAngle = Math.round(angle / snapAngle) * snapAngle
        e.target.set({ angle: snappedAngle })
      }
    })
  }

  /**
   * Update transform options
   */
  updateOptions(options: Partial<TransformToolOptions>): void {
    this.options = { ...this.options, ...options }
  }

  /**
   * Get current options
   */
  getOptions(): TransformToolOptions {
    return { ...this.options }
  }

  getCursor(): string {
    return 'default'
  }

  /**
   * Delete selected objects
   */
  deleteSelected(canvas: Canvas): void {
    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => canvas.remove(obj))
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  /**
   * Duplicate selected objects
   */
  async duplicateSelected(canvas: Canvas): Promise<void> {
    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length > 0) {
      for (const obj of activeObjects) {
        const cloned = await obj.clone()
        cloned.set({
          left: (cloned.left || 0) + 10,
          top: (cloned.top || 0) + 10,
        })
        canvas.add(cloned)
      }
      canvas.renderAll()
    }
  }
}

/**
 * Create a move tool instance
 */
export function createMoveTool(options?: Partial<TransformToolOptions>): MoveTool {
  return new MoveTool(options)
}
