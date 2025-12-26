// ============================================================================
// PIXELFORGE PRO - TEXT TOOL
// ============================================================================

import { Canvas, IText } from 'fabric'
import type { Tool, TextToolOptions } from '../types'

/**
 * Text tool for adding and editing text on the canvas
 */
export class TextTool implements Tool {
  name = 'text'
  private options: TextToolOptions

  constructor(options?: Partial<TextToolOptions>) {
    this.options = {
      fontFamily: options?.fontFamily ?? 'Arial',
      fontSize: options?.fontSize ?? 32,
      fontWeight: options?.fontWeight ?? 'normal',
      fontStyle: options?.fontStyle ?? 'normal',
      color: options?.color ?? '#000000',
      align: options?.align ?? 'left',
      lineHeight: options?.lineHeight ?? 1.2,
    }
  }

  activate(canvas: Canvas): void {
    canvas.selection = false
    canvas.defaultCursor = 'text'
    canvas.hoverCursor = 'text'

    // Add click handler to create text
    canvas.on('mouse:down', this.handleMouseDown.bind(this, canvas))

    console.log('Text tool activated')
  }

  deactivate(canvas: Canvas): void {
    canvas.selection = true
    canvas.defaultCursor = 'default'
    canvas.hoverCursor = 'move'

    canvas.off('mouse:down')

    console.log('Text tool deactivated')
  }

  private handleMouseDown(canvas: Canvas, event: any): void {
    // Don't create new text if clicking on existing text
    if (event.target) return

    const pointer = canvas.getPointer(event.e)

    // Create new text object
    const text = new IText('Text', {
      left: pointer.x,
      top: pointer.y,
      fontFamily: this.options.fontFamily,
      fontSize: this.options.fontSize,
      fontWeight: this.options.fontWeight,
      fontStyle: this.options.fontStyle,
      fill: this.options.color,
      textAlign: this.options.align,
      lineHeight: this.options.lineHeight,
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    text.enterEditing()
    text.selectAll()
    canvas.renderAll()
  }

  /**
   * Update text options
   */
  updateOptions(options: Partial<TextToolOptions>): void {
    this.options = { ...this.options, ...options }
  }

  /**
   * Get current options
   */
  getOptions(): TextToolOptions {
    return { ...this.options }
  }

  getCursor(): string {
    return 'text'
  }

  /**
   * Apply formatting to selected text
   */
  applyFormatting(canvas: Canvas, options: Partial<TextToolOptions>): void {
    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set({
        fontFamily: options.fontFamily,
        fontSize: options.fontSize,
        fontWeight: options.fontWeight,
        fontStyle: options.fontStyle,
        fill: options.color,
        textAlign: options.align,
        lineHeight: options.lineHeight,
      })
      canvas.renderAll()
    }
  }
}

/**
 * Create a text tool instance
 */
export function createTextTool(options?: Partial<TextToolOptions>): TextTool {
  return new TextTool(options)
}
