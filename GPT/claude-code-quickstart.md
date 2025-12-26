# Claude Code Quick-Start Guide for PixelForge Pro

## Initial Setup Command

Copy and run this in your terminal with Claude Code:

```bash
claude "I'm building an advanced web-based photo editor called PixelForge Pro. 

Create the initial project with:
1. Vite + React 18 + TypeScript
2. Install: fabric, zustand, immer, tailwindcss, lucide-react, uuid, file-saver, jszip
3. Configure Tailwind with dark mode
4. Set up path aliases (@components, @stores, @utils, @types, @hooks, @tools, @filters)
5. Create the folder structure:
   - src/components/{Canvas,Toolbar,Panels,Dialogs,UI,Layout,Menu}
   - src/stores
   - src/utils
   - src/types
   - src/hooks
   - src/tools/{selection,drawing,retouch,shapes,transform}
   - src/filters/{adjustments,blur,sharpen,distort,stylize,presets}
   - src/features
   - src/constants

Start the project and verify it runs."
```

---

## Phase-by-Phase Commands

### Phase 1: Foundation (Already done above)
Verify with:
```bash
claude "Verify the project setup: run dev server, check all imports work, and confirm Tailwind is configured correctly"
```

### Phase 2: Types & State
```bash
claude "Create the core TypeScript types in src/types/editor.ts:
- Layer (id, name, type, visible, locked, opacity, blendMode, data)
- LayerType enum (raster, text, shape, adjustment, group)
- BlendMode enum (16 modes: normal, multiply, screen, overlay, etc.)
- Tool, ToolType, ToolOptions
- Filter, FilterType, FilterParams  
- Project, ProjectMetadata
- HistoryEntry with action type and state snapshot
- Selection with type and path data
- EditorState interface combining all state

Then create the Zustand store in src/stores/editorStore.ts with:
- Canvas state (canvas ref, size, zoom, pan)
- Layer management (layers array, activeLayerId, CRUD actions)
- Tool state (activeTool, toolOptions)
- Color state (foreground, background)
- Selection state
- History with undo/redo (limit 50)
- UI state (panel visibility, theme)

Use Immer for immutable updates."
```

### Phase 3: Canvas Engine
```bash
claude "Implement the canvas system:

1. src/components/Canvas/CanvasContainer.tsx
   - Responsive container that fills available space
   - Centers the canvas with overflow scroll
   - Handles zoom (Ctrl+scroll, 10%-800%)
   - Handles pan (spacebar + drag)
   - Shows zoom level in corner

2. src/components/Canvas/FabricCanvas.tsx  
   - Initialize Fabric.js canvas
   - Sync with Zustand store
   - Handle selection events
   - Support for zoom/pan transforms

3. src/utils/layerManager.ts
   - createLayer(type, options)
   - deleteLayer(id)
   - duplicateLayer(id)
   - moveLayer(id, direction)
   - setLayerVisibility(id, visible)
   - setLayerOpacity(id, opacity)
   - setLayerBlendMode(id, mode)
   - mergeVisibleLayers()
   - flattenImage()

4. Each layer should have its own offscreen canvas for non-destructive editing.

Verify: Can create 5 layers, reorder them, toggle visibility, and see changes on canvas."
```

### Phase 4: Essential Tools (Part 1 - Selection)
```bash
claude "Implement selection tools in src/tools/selection/:

1. BaseTool.ts - Abstract base class with:
   - name, cursor, icon properties
   - onMouseDown, onMouseMove, onMouseUp handlers
   - onKeyDown handler
   - getOptionsComponent() method
   - activate() and deactivate() methods

2. MoveTool.ts - Move and transform objects
   - Click to select
   - Drag to move
   - Transform handles for resize/rotate

3. RectangularMarqueeTool.ts
   - Draw rectangle selection
   - Shift for square
   - Alt for center-origin
   - Marching ants animation
   - Add/subtract modes (Shift/Alt on click)

4. EllipticalMarqueeTool.ts - Same as rectangle but ellipse

5. LassoTool.ts - Freeform selection by drawing

6. MagicWandTool.ts
   - Click to select similar colors
   - Tolerance option (0-255)
   - Contiguous option
   - Sample all layers option

Create tool registry in src/tools/toolRegistry.ts that maps ToolType to tool classes.
Create useCurrentTool hook that returns active tool instance.

Verify: Switch between tools, create selections, see marching ants."
```

### Phase 4: Essential Tools (Part 2 - Drawing)
```bash
claude "Implement drawing tools in src/tools/drawing/:

1. BrushTool.ts
   - Smooth stroke interpolation (catmull-rom or similar)
   - Size (1-500px), hardness (0-100%), opacity (0-100%), flow (0-100%)
   - Paint on active layer's offscreen canvas
   - Blend with foreground color
   - Single history entry per stroke

2. PencilTool.ts
   - Hard-edged, 1px precision
   - Anti-aliasing option

3. EraserTool.ts  
   - Same options as brush
   - Erases to transparency
   - Block eraser option

4. FillTool.ts (Paint Bucket)
   - Flood fill algorithm
   - Tolerance setting
   - Contiguous option
   - Fill with foreground color or pattern

5. GradientTool.ts
   - Types: linear, radial, angle, reflected, diamond
   - Drag to define gradient line
   - Foreground to background colors
   - Gradient editor modal for custom stops

Verify: Paint strokes are smooth, eraser works, fill respects tolerance."
```

### Phase 4: Essential Tools (Part 3 - Retouch, Shape, Text)
```bash
claude "Implement remaining tools:

src/tools/retouch/:
1. CloneStampTool.ts - Alt+click source, paint to clone
2. HealingBrushTool.ts - Clone with automatic blending
3. SpotHealingTool.ts - One-click blemish removal

src/tools/shapes/:
1. RectangleTool.ts - Rectangles with optional corner radius
2. EllipseTool.ts - Circles and ellipses
3. LineTool.ts - Straight lines with arrow options
4. PolygonTool.ts - Custom sided polygons

All shapes need:
- Fill color/gradient
- Stroke color and width
- Create as shape layer
- Shift to constrain proportions

src/tools/TextTool.ts:
- Click for point text
- Drag for area text
- Font family picker
- Size, weight, style options
- Color picker
- Alignment options
- Create text as editable layer

src/tools/transform/:
1. CropTool.ts - Crop with aspect ratio presets and rule-of-thirds overlay
2. FreeTransformTool.ts - Scale, rotate, skew handles

Verify: Each tool works, shapes are editable, text can be modified."
```

### Phase 5: Filters
```bash
claude "Implement filter system:

1. src/filters/FilterEngine.ts
   - WebGL context management
   - Shader compilation and caching
   - Apply filter to canvas/layer
   - Preview mode (updates live)
   - Queue multiple filters

2. src/filters/adjustments/:
   - BrightnessContrast.ts (WebGL)
   - HueSaturationLightness.ts (WebGL)
   - Levels.ts - Histogram-based with input/output levels
   - Curves.ts - Bezier curve editor for tone mapping
   - ColorBalance.ts - Shadows/midtones/highlights
   - Invert.ts, Posterize.ts, Threshold.ts

3. src/filters/blur/:
   - GaussianBlur.ts - WebGL 2-pass separable blur
   - MotionBlur.ts - Directional blur
   - RadialBlur.ts - Spin/zoom effects

4. src/filters/sharpen/:
   - UnsharpMask.ts - Amount, radius, threshold

5. src/filters/stylize/:
   - Emboss.ts, Vignette.ts, Noise.ts, Pixelate.ts

6. src/filters/presets/:
   - 15 one-click presets (vintage, B&W, cross-process, etc.)
   - Each is a combination of adjustments

Create FilterDialog component that shows preview and parameters.

Verify: Filters apply in real-time, WebGL is being used, presets work."
```

### Phase 6: UI
```bash
claude "Build the complete UI:

1. src/components/Layout/EditorLayout.tsx
   - Flexbox layout with resizable panels
   - Menu bar at top
   - Toolbar on left
   - Canvas area in center
   - Panels on right (collapsible)
   - Status bar at bottom

2. src/components/Menu/MenuBar.tsx
   - File, Edit, Image, Layer, Filter, Select, View, Help menus
   - Dropdown menus with keyboard shortcuts shown
   - Disabled state for unavailable actions

3. src/components/Toolbar/Toolbar.tsx
   - All tools with icons (use lucide-react)
   - Tool groups with flyouts
   - Tooltips with shortcuts

4. src/components/Panels/:
   - LayersPanel.tsx - Thumbnail list, visibility, blend mode, opacity
   - PropertiesPanel.tsx - Context-sensitive tool options
   - HistoryPanel.tsx - Action list, click to revert
   - ColorPanel.tsx - Foreground/background picker, swatches

5. src/components/Dialogs/:
   - NewDocumentDialog.tsx - Size presets, custom dimensions
   - ImageSizeDialog.tsx - Resize with aspect lock
   - ExportDialog.tsx - Format, quality, metadata options

6. Theme support with dark mode default, toggle in View menu.

Verify: Full UI works, panels collapse, dialogs open/close, theme switches."
```

### Phase 7: File I/O
```bash
claude "Implement file handling:

1. src/utils/fileImport.ts
   - loadFromFile(file: File) - Load JPEG, PNG, GIF, WebP, BMP
   - loadFromURL(url: string) - Fetch and load
   - loadFromClipboard() - Paste image
   - Drag-and-drop handler for App component
   - Show progress for large files

2. src/utils/projectFile.ts
   - saveProject() - Save as .pfp file (JSON + images in ZIP)
   - loadProject(file) - Restore complete state
   - Include: layers, history, canvas size, tool settings

3. src/utils/fileExport.ts
   - exportAs(format, options)
   - Formats: JPEG (quality 0-100), PNG (8/24/32 bit), WebP
   - Options: resize, DPI, strip metadata
   - Flatten all layers before export
   - Trigger download

4. src/components/Dialogs/ExportDialog.tsx
   - Format selector
   - Quality slider (for JPEG/WebP)
   - Preview of file size
   - Download button

Verify: Import various formats, save/load project, export all formats."
```

### Phase 8: Advanced Features
```bash
claude "Implement advanced features:

1. src/features/backgroundRemoval.ts
   - Simple implementation: Color-based removal with tolerance
   - Advanced (optional): TensorFlow.js with pre-trained model
   - Returns selection or directly removes

2. src/features/contentAwareFill.ts
   - Requires selection
   - Use patch-matching algorithm
   - Or integrate OpenCV.js inpainting

3. src/features/autoEnhance.ts
   - Analyze histogram
   - Auto levels: stretch to full range
   - Auto contrast: S-curve adjustment
   - Auto color: gray world assumption

Add these to Image menu and as one-click buttons.

Verify: Background removal works on simple images, auto-enhance improves most photos."
```

### Phase 9: Performance
```bash
claude "Optimize performance:

1. Canvas rendering:
   - Only re-render changed areas (dirty rectangles)
   - Use requestAnimationFrame for smooth updates
   - Throttle filter preview updates

2. WebGL:
   - Cache compiled shaders
   - Reuse textures when possible
   - Proper cleanup on dispose

3. Memory:
   - Limit history to 50 entries, compress old states
   - Dispose layer canvases when deleted
   - Show memory usage in status bar
   - Warning when approaching limit

4. Web Workers (src/workers/):
   - filterWorker.ts - Offload heavy filter calculations
   - exportWorker.ts - Background export processing

Verify: 4K image with 20 layers and 10 filters runs smoothly."
```

### Phase 10: Polish
```bash
claude "Final polish:

1. src/utils/keyboardShortcuts.ts
   - Register all shortcuts (V, M, L, B, E, G, T, C, etc.)
   - Ctrl+Z undo, Ctrl+Shift+Z redo
   - Ctrl+S save, Ctrl+E export
   - [ and ] for brush size
   - Shortcuts dialog (Ctrl+/)

2. Accessibility:
   - ARIA labels on all interactive elements
   - Keyboard focus indicators
   - Tab navigation through UI
   - Screen reader announcements for actions

3. Error handling:
   - Try-catch around file operations
   - User-friendly error messages
   - Auto-save every 5 minutes to IndexedDB
   - Recovery prompt on reload

4. Loading states:
   - Splash screen on initial load
   - Progress bar for file operations
   - Skeleton loaders for panels

Verify: Complete keyboard navigation, errors handled gracefully."
```

### Phase 11: PWA & Deploy
```bash
claude "Prepare for deployment:

1. PWA setup:
   - public/manifest.json with icons and theme
   - Service worker for offline caching
   - Install prompt handling

2. Build optimization:
   - Code splitting by route/feature
   - Lazy load heavy components (filters, dialogs)
   - Compress assets
   - Generate source maps for debugging

3. Deploy to Vercel/Netlify:
   - Configure build command
   - Set up environment variables if needed
   - Enable HTTPS
   - Configure caching headers

Run: npm run build && npm run preview

Verify: PWA installable, works offline, production build < 2MB initial."
```

---

## Verification Commands

After each phase, run:
```bash
claude "Run all verification checks for Phase X:
1. [List specific checks from the plan]
2. Report any issues found
3. Fix critical issues before proceeding"
```

---

## Troubleshooting Commands

```bash
# If something breaks
claude "Debug the issue: [describe problem]. Check the error, find the cause, and fix it."

# If performance is slow
claude "Profile and optimize [component/feature]. Find bottlenecks and improve performance."

# If tests fail
claude "The test for [feature] is failing because [error]. Fix the implementation."
```

---

## Full Build Command (End-to-End)

For a complete build session:
```bash
claude "Build PixelForge Pro photo editor following docs/IMPLEMENTATION_PLAN.md. 
Complete Phase [X] fully, verify all checklist items, then report status.
If any check fails, fix it before marking complete."
```
