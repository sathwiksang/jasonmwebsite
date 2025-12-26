// ============================================================================
// PIXELFORGE PRO - TOOL MANAGER
// ============================================================================

import type { Canvas } from 'fabric'
import type { Tool } from './types'

// Import all tools
import { createBrushTool } from './drawing/BrushTool'
import { createPencilTool } from './drawing/PencilTool'
import { createEraserTool } from './drawing/EraserTool'
import { createRectangularMarqueeTool } from './selection/RectangularMarqueeTool'
import { createEllipticalMarqueeTool } from './selection/EllipticalMarqueeTool'
import { createRectangleTool } from './shapes/RectangleTool'
import { createEllipseTool } from './shapes/EllipseTool'
import { createMoveTool } from './transform/MoveTool'
import { createTextTool } from './transform/TextTool'

/**
 * Tool manager for handling tool activation and deactivation
 */
export class ToolManager {
  private canvas: Canvas | null = null
  private activeTool: Tool | null = null
  private tools: Map<string, Tool> = new Map()

  constructor() {
    this.initializeTools()
  }

  /**
   * Initialize all available tools
   */
  private initializeTools(): void {
    this.tools.set('move', createMoveTool())
    this.tools.set('brush', createBrushTool())
    this.tools.set('pencil', createPencilTool())
    this.tools.set('eraser', createEraserTool())
    this.tools.set('rectangular-marquee', createRectangularMarqueeTool())
    this.tools.set('elliptical-marquee', createEllipticalMarqueeTool())
    this.tools.set('rectangle', createRectangleTool())
    this.tools.set('ellipse', createEllipseTool())
    this.tools.set('text', createTextTool())
  }

  /**
   * Set the canvas instance
   */
  setCanvas(canvas: Canvas): void {
    this.canvas = canvas
  }

  /**
   * Activate a tool by name
   */
  activateTool(toolName: string): boolean {
    if (!this.canvas) {
      console.error('Canvas not set in ToolManager')
      return false
    }

    const tool = this.tools.get(toolName)
    if (!tool) {
      console.error(`Tool not found: ${toolName}`)
      return false
    }

    // Deactivate current tool
    if (this.activeTool && this.canvas) {
      this.activeTool.deactivate(this.canvas)
    }

    // Activate new tool
    this.activeTool = tool
    tool.activate(this.canvas)

    console.log(`Tool activated: ${toolName}`)
    return true
  }

  /**
   * Get the currently active tool
   */
  getActiveTool(): Tool | null {
    return this.activeTool
  }

  /**
   * Get a tool by name
   */
  getTool(toolName: string): Tool | undefined {
    return this.tools.get(toolName)
  }

  /**
   * Get all available tools
   */
  getAllTools(): Map<string, Tool> {
    return this.tools
  }

  /**
   * Deactivate the current tool
   */
  deactivateCurrentTool(): void {
    if (this.activeTool && this.canvas) {
      this.activeTool.deactivate(this.canvas)
      this.activeTool = null
    }
  }
}

/**
 * Create a tool manager instance
 */
export function createToolManager(): ToolManager {
  return new ToolManager()
}
