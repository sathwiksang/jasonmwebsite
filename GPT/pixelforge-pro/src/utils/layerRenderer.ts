// ============================================================================
// PIXELFORGE PRO - LAYER RENDERER
// ============================================================================

import type { Layer } from '../types'

/**
 * Render layers to Fabric.js canvas
 */
export function renderLayers(canvas: any, layers: Layer[]) {
  if (!canvas) return

  // Clear existing objects
  canvas.clear()

  // Sort layers by z-index
  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex)

  // Render each visible layer
  sortedLayers.forEach((layer) => {
    if (!layer.visible) return

    try {
      renderLayer(canvas, layer)
    } catch (error) {
      console.error(`Error rendering layer ${layer.name}:`, error)
    }
  })

  canvas.renderAll()
}

/**
 * Render a single layer
 */
function renderLayer(canvas: any, layer: Layer) {
  switch (layer.type) {
    case 'raster':
      renderRasterLayer(canvas, layer)
      break
    case 'text':
      renderTextLayer(canvas, layer)
      break
    case 'shape':
      renderShapeLayer(canvas, layer)
      break
    case 'adjustment':
      // Adjustment layers don't render directly
      break
    case 'group':
      // Group layers render their children
      break
    default:
      console.warn(`Unknown layer type: ${layer.type}`)
  }
}

/**
 * Render raster layer
 */
function renderRasterLayer(canvas: any, layer: Layer) {
  // For now, create a placeholder rectangle
  const rect = new (canvas.constructor as any).Rect({
    left: layer.x,
    top: layer.y,
    width: layer.width,
    height: layer.height,
    fill: 'rgba(200, 200, 200, 0.3)',
    stroke: 'rgba(150, 150, 150, 0.5)',
    strokeWidth: 1,
    opacity: layer.opacity / 100,
    selectable: !layer.locked,
    evented: !layer.locked,
  })

  canvas.add(rect)
  layer.fabricObject = rect
}

/**
 * Render text layer
 */
function renderTextLayer(canvas: any, layer: Layer) {
  const textData = layer.data as any

  const text = new (canvas.constructor as any).Text(textData.text || 'Text Layer', {
    left: layer.x,
    top: layer.y,
    fontFamily: textData.fontFamily || 'Arial',
    fontSize: textData.fontSize || 32,
    fontWeight: textData.fontWeight || 'normal',
    fontStyle: textData.fontStyle || 'normal',
    fill: textData.fill || '#000000',
    opacity: layer.opacity / 100,
    selectable: !layer.locked,
    evented: !layer.locked,
  })

  canvas.add(text)
  layer.fabricObject = text
}

/**
 * Render shape layer
 */
function renderShapeLayer(canvas: any, layer: Layer) {
  const shapeData = layer.data as any

  let shape: any

  switch (shapeData.shapeType) {
    case 'rectangle':
      shape = new (canvas.constructor as any).Rect({
        left: layer.x,
        top: layer.y,
        width: layer.width,
        height: layer.height,
        fill: shapeData.fill || '#000000',
        stroke: shapeData.stroke || '#000000',
        strokeWidth: shapeData.strokeWidth || 1,
        rx: shapeData.cornerRadius || 0,
        ry: shapeData.cornerRadius || 0,
        opacity: layer.opacity / 100,
        selectable: !layer.locked,
        evented: !layer.locked,
      })
      break

    case 'ellipse':
      shape = new (canvas.constructor as any).Ellipse({
        left: layer.x,
        top: layer.y,
        rx: layer.width / 2,
        ry: layer.height / 2,
        fill: shapeData.fill || '#000000',
        stroke: shapeData.stroke || '#000000',
        strokeWidth: shapeData.strokeWidth || 1,
        opacity: layer.opacity / 100,
        selectable: !layer.locked,
        evented: !layer.locked,
      })
      break

    case 'line':
      shape = new (canvas.constructor as any).Line(
        [layer.x, layer.y, layer.x + layer.width, layer.y + layer.height],
        {
          stroke: shapeData.stroke || '#000000',
          strokeWidth: shapeData.strokeWidth || 1,
          opacity: layer.opacity / 100,
          selectable: !layer.locked,
          evented: !layer.locked,
        }
      )
      break

    default:
      // Default to rectangle
      shape = new (canvas.constructor as any).Rect({
        left: layer.x,
        top: layer.y,
        width: layer.width,
        height: layer.height,
        fill: shapeData.fill || '#000000',
        stroke: shapeData.stroke || '#000000',
        strokeWidth: shapeData.strokeWidth || 1,
        opacity: layer.opacity / 100,
        selectable: !layer.locked,
        evented: !layer.locked,
      })
  }

  if (shape) {
    canvas.add(shape)
    layer.fabricObject = shape
  }
}

/**
 * Apply blend mode to layer
 */
export function applyBlendMode(fabricObject: any, blendMode: string) {
  // Fabric.js uses globalCompositeOperation for blend modes
  const blendModeMap: Record<string, string> = {
    normal: 'source-over',
    multiply: 'multiply',
    screen: 'screen',
    overlay: 'overlay',
    darken: 'darken',
    lighten: 'lighten',
    'color-dodge': 'color-dodge',
    'color-burn': 'color-burn',
    'hard-light': 'hard-light',
    'soft-light': 'soft-light',
    difference: 'difference',
    exclusion: 'exclusion',
    hue: 'hue',
    saturation: 'saturation',
    color: 'color',
    luminosity: 'luminosity',
  }

  if (fabricObject && blendModeMap[blendMode]) {
    fabricObject.globalCompositeOperation = blendModeMap[blendMode]
  }
}

/**
 * Update layer on canvas
 */
export function updateLayerOnCanvas(canvas: any, layer: Layer) {
  if (!canvas || !layer.fabricObject) return

  const obj = layer.fabricObject

  // Update common properties
  obj.set({
    left: layer.x,
    top: layer.y,
    opacity: layer.opacity / 100,
    selectable: !layer.locked,
    evented: !layer.locked,
    visible: layer.visible,
  })

  // Apply blend mode
  applyBlendMode(obj, layer.blendMode)

  canvas.renderAll()
}

/**
 * Remove layer from canvas
 */
export function removeLayerFromCanvas(canvas: any, layer: Layer) {
  if (!canvas || !layer.fabricObject) return

  canvas.remove(layer.fabricObject)
  layer.fabricObject = undefined
  canvas.renderAll()
}
