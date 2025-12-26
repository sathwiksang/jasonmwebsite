# Advanced Web-Based Photo Editor - Complete Implementation Plan

## Project Overview
**Project Name:** PixelForge Pro  
**Goal:** Build a Photoshop-competitive, privacy-first, browser-based photo editor  
**Tech Stack:** React 18 + TypeScript + Vite + Fabric.js + WebGL + TailwindCSS  

---

## Phase 1: Project Foundation & Setup
**Duration:** 1-2 days  
**Objective:** Establish project structure, tooling, and development environment

### Step 1.1: Initialize Project
```bash
# Claude Code Commands
npm create vite@latest pixelforge-pro -- --template react-ts
cd pixelforge-pro
npm install
```

**Checklist:**
- [ ] Vite project created with React + TypeScript template
- [ ] Project runs with `npm run dev`
- [ ] No TypeScript errors in console
- [ ] Browser opens to default Vite page

### Step 1.2: Install Core Dependencies
```bash
# Core libraries
npm install fabric @types/fabric
npm install zustand immer
npm install tailwindcss postcss autoprefixer
npm install lucide-react
npm install uuid @types/uuid
npm install file-saver @types/file-saver
npm install jszip

# Development tools
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint-config-prettier
```

**Checklist:**
- [ ] All packages installed without errors
- [ ] `package.json` shows correct dependencies
- [ ] No peer dependency warnings (or resolved)

### Step 1.3: Configure TailwindCSS
```bash
npx tailwindcss init -p
```

**Files to create/modify:**
- `tailwind.config.js` - Configure content paths
- `src/index.css` - Add Tailwind directives

**Checklist:**
- [ ] Tailwind classes work in components
- [ ] Dark mode configuration ready
- [ ] Custom color palette defined

### Step 1.4: Project Structure Setup
```
pixelforge-pro/
├── public/
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── Canvas/
│   │   ├── Toolbar/
│   │   ├── Panels/
│   │   ├── Dialogs/
│   │   └── UI/
│   ├── hooks/
│   ├── stores/
│   ├── utils/
│   ├── types/
│   ├── filters/
│   ├── tools/
│   └── constants/
├── tests/
└── docs/
```

**Checklist:**
- [ ] All directories created
- [ ] Index files for each module
- [ ] Path aliases configured in `vite.config.ts`
- [ ] TypeScript paths configured in `tsconfig.json`

### Step 1.5: Verification Gate
**Test:** Run the application
```bash
npm run dev
npm run build
npm run preview
```

**Must Pass:**
- [ ] Dev server starts without errors
- [ ] Production build succeeds
- [ ] Preview shows the application
- [ ] No console errors

---

## Phase 2: Core State Management & Types
**Duration:** 1-2 days  
**Objective:** Define TypeScript types and implement Zustand stores

### Step 2.1: Define Core Types
**File:** `src/types/editor.ts`

```typescript
// Layer types, Tool types, Filter types, Project types
// History state, Canvas state, UI state
```

**Types to define:**
- `Layer`, `LayerType`, `BlendMode`
- `Tool`, `ToolType`, `ToolOptions`
- `Filter`, `FilterType`, `FilterParams`
- `Project`, `ProjectMetadata`
- `HistoryEntry`, `HistoryAction`
- `Selection`, `SelectionType`
- `Color`, `Gradient`

**Checklist:**
- [ ] All types exported from `types/index.ts`
- [ ] No `any` types used
- [ ] Discriminated unions for tool/filter types
- [ ] Proper optional vs required properties

### Step 2.2: Implement Editor Store
**File:** `src/stores/editorStore.ts`

**State slices:**
```typescript
interface EditorState {
  // Canvas
  canvas: fabric.Canvas | null;
  canvasSize: { width: number; height: number };
  zoom: number;
  pan: { x: number; y: number };
  
  // Layers
  layers: Layer[];
  activeLayerId: string | null;
  
  // Tools
  activeTool: ToolType;
  toolOptions: Record<ToolType, ToolOptions>;
  
  // Colors
  foregroundColor: string;
  backgroundColor: string;
  
  // Selection
  selection: Selection | null;
  
  // History
  history: HistoryEntry[];
  historyIndex: number;
  
  // UI
  panels: PanelState;
}
```

**Checklist:**
- [ ] Store created with Zustand + Immer
- [ ] All actions typed correctly
- [ ] Undo/redo actions work
- [ ] State persistence hooks ready

### Step 2.3: Implement History System
**File:** `src/stores/historyStore.ts`

**Features:**
- Command pattern implementation
- State snapshots for complex operations
- Memory-efficient diff storage
- Configurable history limit (50 steps default)

**Checklist:**
- [ ] `pushHistory()` captures state
- [ ] `undo()` restores previous state
- [ ] `redo()` restores next state
- [ ] History limit enforced
- [ ] Memory cleanup on limit exceeded

### Step 2.4: Verification Gate
**Test:** Create test component that uses store
```typescript
// Test all store actions
// Verify state updates correctly
// Test undo/redo cycle
```

**Must Pass:**
- [ ] Store updates trigger re-renders
- [ ] Undo/redo works for all action types
- [ ] No memory leaks in history
- [ ] DevTools show correct state

---

## Phase 3: Canvas Engine Implementation
**Duration:** 3-4 days  
**Objective:** Build the core canvas rendering and manipulation engine

### Step 3.1: Canvas Container Component
**File:** `src/components/Canvas/CanvasContainer.tsx`

**Features:**
- Responsive canvas sizing
- Zoom controls (fit, 100%, custom)
- Pan with spacebar + drag
- Grid overlay (optional)
- Rulers (optional)

**Checklist:**
- [ ] Canvas resizes with container
- [ ] Zoom in/out works (scroll + buttons)
- [ ] Pan works with spacebar + drag
- [ ] Canvas centered in viewport
- [ ] Proper cursor changes

### Step 3.2: Fabric.js Integration
**File:** `src/components/Canvas/FabricCanvas.tsx`

**Implementation:**
```typescript
// Initialize Fabric canvas
// Sync with Zustand store
// Handle object events
// Layer z-index management
```

**Checklist:**
- [ ] Fabric canvas initializes correctly
- [ ] Objects selectable and movable
- [ ] Multi-select with Shift
- [ ] Transform controls styled
- [ ] Object events sync to store

### Step 3.3: Layer System Implementation
**File:** `src/utils/layerManager.ts`

**Features:**
- Create layer (raster, text, shape, adjustment)
- Delete layer
- Duplicate layer
- Merge layers
- Group/ungroup layers
- Layer visibility toggle
- Layer lock toggle
- Layer opacity
- Blend modes (16+ modes)
- Layer ordering (move up/down/top/bottom)

**Checklist:**
- [ ] All layer operations work
- [ ] Blend modes render correctly
- [ ] Layer groups work
- [ ] Z-index updates correctly
- [ ] Performance with 20+ layers

### Step 3.4: Offscreen Canvas Management
**File:** `src/utils/offscreenCanvas.ts`

**Purpose:** Each layer has its own offscreen canvas for:
- Non-destructive editing
- Efficient compositing
- Filter preview
- Export at original resolution

**Checklist:**
- [ ] Offscreen canvases created per layer
- [ ] Compositing produces correct output
- [ ] Memory managed (cleanup on delete)
- [ ] High-resolution export works

### Step 3.5: Verification Gate
**Test Scenarios:**
1. Create 10 layers, reorder them
2. Apply different blend modes
3. Zoom to 400%, pan around
4. Undo/redo layer operations

**Must Pass:**
- [ ] All test scenarios work
- [ ] No visual glitches
- [ ] Performance acceptable (60fps)
- [ ] Memory usage reasonable

---

## Phase 4: Essential Tools Implementation
**Duration:** 4-5 days  
**Objective:** Implement all core editing tools

### Step 4.1: Tool System Architecture
**File:** `src/tools/BaseTool.ts`

```typescript
abstract class BaseTool {
  abstract name: ToolType;
  abstract cursor: string;
  abstract onMouseDown(e: fabric.IEvent): void;
  abstract onMouseMove(e: fabric.IEvent): void;
  abstract onMouseUp(e: fabric.IEvent): void;
  abstract onKeyDown(e: KeyboardEvent): void;
  abstract getOptionsPanel(): React.FC;
}
```

**Checklist:**
- [ ] Base tool class defined
- [ ] Tool registry created
- [ ] Tool switching works
- [ ] Cursor updates per tool
- [ ] Options panel switches

### Step 4.2: Selection Tools
**Files:** `src/tools/selection/`

**Tools:**
1. **Move Tool** - Move/transform objects
2. **Rectangular Marquee** - Rectangle selection
3. **Elliptical Marquee** - Ellipse selection
4. **Lasso Tool** - Freeform selection
5. **Polygonal Lasso** - Point-to-point selection
6. **Magic Wand** - Color-based selection

**Magic Wand Algorithm:**
```typescript
// Flood fill algorithm
// Tolerance parameter (0-255)
// Contiguous vs non-contiguous
// Anti-aliasing option
```

**Checklist per tool:**
- [ ] Tool activates correctly
- [ ] Visual feedback during use
- [ ] Selection marching ants animation
- [ ] Add/subtract/intersect modes (Shift/Alt)
- [ ] Feather option works
- [ ] Selection can be inverted

### Step 4.3: Drawing Tools
**Files:** `src/tools/drawing/`

**Tools:**
1. **Brush Tool**
   - Size, hardness, opacity, flow
   - Pressure sensitivity (if available)
   - Brush presets
   
2. **Pencil Tool**
   - Hard-edged drawing
   - Pixel-perfect mode
   
3. **Eraser Tool**
   - Brush/block modes
   - Erase to transparency
   
4. **Fill Tool (Paint Bucket)**
   - Tolerance setting
   - Contiguous fill
   - All layers option

5. **Gradient Tool**
   - Linear, radial, angle, reflected, diamond
   - Gradient editor
   - Multiple color stops

**Checklist per tool:**
- [ ] Smooth drawing (interpolation)
- [ ] Correct blend with existing pixels
- [ ] Undo creates single history entry per stroke
- [ ] Performance with large brush sizes

### Step 4.4: Retouching Tools
**Files:** `src/tools/retouch/`

**Tools:**
1. **Clone Stamp**
   - Alt+click to set source
   - Aligned/non-aligned modes
   - Sample all layers option

2. **Healing Brush**
   - Content-aware blending
   - Source sampling

3. **Spot Healing**
   - One-click healing
   - Content-aware fill

4. **Red Eye Tool**
   - Automatic detection
   - Pupil size adjustment

**Checklist:**
- [ ] Clone stamp samples correctly
- [ ] Healing blends naturally
- [ ] Spot healing removes blemishes
- [ ] Red eye detection works

### Step 4.5: Shape Tools
**Files:** `src/tools/shapes/`

**Tools:**
1. Rectangle (rounded corners option)
2. Ellipse
3. Line
4. Polygon (custom sides)
5. Custom Shape (preset library)

**Options:**
- Fill color/gradient/pattern
- Stroke color, width, style
- Create as shape layer vs rasterize

**Checklist:**
- [ ] All shapes draw correctly
- [ ] Shift constrains proportions
- [ ] Alt draws from center
- [ ] Stroke/fill options work
- [ ] Shapes are editable after creation

### Step 4.6: Text Tool
**File:** `src/tools/TextTool.ts`

**Features:**
- Point text (single line)
- Paragraph text (bounded box)
- Font family selection
- Font size, weight, style
- Letter spacing, line height
- Text alignment
- Text color/gradient
- Text effects (shadow, outline)
- Warp text (optional)

**Checklist:**
- [ ] Text input works
- [ ] Font selection works
- [ ] All text properties adjustable
- [ ] Text remains editable
- [ ] Text can be rasterized

### Step 4.7: Transform Tools
**Files:** `src/tools/transform/`

**Tools:**
1. **Free Transform**
   - Scale, rotate, skew
   - Maintain aspect ratio (Shift)
   
2. **Warp** (advanced)
   - Grid-based distortion
   
3. **Perspective**
   - Four-corner distortion

**Checklist:**
- [ ] Transform handles visible
- [ ] Transforms apply correctly
- [ ] Can confirm/cancel transform
- [ ] Non-destructive preview

### Step 4.8: Crop & Slice Tools
**File:** `src/tools/CropTool.ts`

**Features:**
- Freeform crop
- Aspect ratio presets (1:1, 4:3, 16:9, custom)
- Rule of thirds overlay
- Rotate while cropping
- Perspective crop

**Checklist:**
- [ ] Crop selection works
- [ ] Aspect ratio lock works
- [ ] Overlay guides show
- [ ] Crop applies correctly
- [ ] Canvas resizes after crop

### Step 4.9: Verification Gate
**Test each tool:**
1. Basic functionality
2. Options work correctly
3. Undo/redo works
4. Tool switching maintains state
5. Keyboard shortcuts work

**Must Pass:**
- [ ] All 20+ tools functional
- [ ] No crashes during use
- [ ] Consistent behavior
- [ ] Performance acceptable

---

## Phase 5: Filters & Adjustments
**Duration:** 4-5 days  
**Objective:** Implement comprehensive filter and adjustment system

### Step 5.1: Filter Engine Architecture
**File:** `src/filters/FilterEngine.ts`

**Design:**
- WebGL-accelerated filters
- Fallback to Canvas 2D
- Real-time preview
- Filter stacking
- Non-destructive adjustment layers

**Checklist:**
- [ ] WebGL context initializes
- [ ] Canvas 2D fallback works
- [ ] Filter preview updates live
- [ ] Multiple filters can stack

### Step 5.2: Color Adjustments
**Files:** `src/filters/adjustments/`

**Adjustments:**
1. **Brightness/Contrast**
2. **Levels** (histogram-based)
3. **Curves** (RGB + individual channels)
4. **Exposure**
5. **Hue/Saturation/Lightness**
6. **Color Balance**
7. **Vibrance**
8. **Black & White** (channel mixer)
9. **Photo Filter** (warming/cooling)
10. **Channel Mixer**
11. **Invert**
12. **Posterize**
13. **Threshold**
14. **Gradient Map**
15. **Selective Color**

**Each adjustment needs:**
- [ ] Parameter UI (sliders, curves)
- [ ] Real-time preview
- [ ] Reset to default button
- [ ] Can apply as adjustment layer

### Step 5.3: Blur Filters
**Files:** `src/filters/blur/`

**Filters:**
1. **Gaussian Blur** (WebGL)
2. **Box Blur**
3. **Motion Blur** (angle + distance)
4. **Radial Blur** (spin/zoom)
5. **Surface Blur** (edge-preserving)
6. **Lens Blur** (bokeh simulation)
7. **Tilt-Shift** (selective focus)

**WebGL Implementation:**
```glsl
// Gaussian blur shader
// Separable implementation (2-pass)
// Configurable kernel size
```

**Checklist:**
- [ ] Blur renders correctly
- [ ] Parameter adjustments work
- [ ] Performance acceptable (< 100ms)
- [ ] Edge handling correct

### Step 5.4: Sharpen Filters
**Files:** `src/filters/sharpen/`

**Filters:**
1. **Sharpen**
2. **Unsharp Mask** (amount, radius, threshold)
3. **Smart Sharpen**
4. **High Pass** (for overlay sharpening)

**Checklist:**
- [ ] Sharpening visible
- [ ] No excessive halos
- [ ] Threshold prevents noise sharpening

### Step 5.5: Distort Filters
**Files:** `src/filters/distort/`

**Filters:**
1. **Liquify** (interactive push/pull)
2. **Spherize**
3. **Pinch**
4. **Twirl**
5. **Wave**
6. **Ripple**
7. **Polar Coordinates**

**Liquify Tool:**
- Forward Warp
- Reconstruct
- Pucker/Bloat
- Push Left
- Freeze/Thaw mask

**Checklist:**
- [ ] Each distortion renders
- [ ] Parameters affect output
- [ ] Liquify is interactive
- [ ] Preview updates smoothly

### Step 5.6: Stylize Filters
**Files:** `src/filters/stylize/`

**Filters:**
1. **Emboss**
2. **Find Edges**
3. **Oil Paint**
4. **Solarize**
5. **Pixelate** (mosaic, crystallize)
6. **Halftone**
7. **Vignette**
8. **Film Grain/Noise**

**Checklist:**
- [ ] Each effect visible
- [ ] Artistic quality acceptable
- [ ] Performance reasonable

### Step 5.7: Preset Filters (Instagram-style)
**File:** `src/filters/presets/`

**Presets:**
- Vintage, Retro, Sepia
- Black & White variations
- Cross-process
- Lomo, Toaster, Nashville
- HDR effect
- Cinematic looks

**Implementation:** Combination of adjustments saved as presets

**Checklist:**
- [ ] 20+ presets available
- [ ] One-click apply
- [ ] Intensity slider
- [ ] Preview thumbnails

### Step 5.8: Verification Gate
**Test each filter:**
1. Apply to test image
2. Adjust parameters
3. Compare to reference
4. Check performance

**Must Pass:**
- [ ] All 40+ filters work
- [ ] WebGL acceleration active
- [ ] Preview is real-time
- [ ] No visual artifacts

---

## Phase 6: User Interface Implementation
**Duration:** 3-4 days  
**Objective:** Build professional, intuitive UI

### Step 6.1: Layout Structure
**File:** `src/components/Layout/EditorLayout.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  Menu Bar                                               │
├────────┬────────────────────────────────┬───────────────┤
│        │                                │               │
│  Tool  │                                │   Panels      │
│  Bar   │        Canvas Area             │   (Layers,    │
│        │                                │   Properties, │
│        │                                │   History)    │
│        │                                │               │
├────────┴────────────────────────────────┴───────────────┤
│  Status Bar (zoom, dimensions, memory)                  │
└─────────────────────────────────────────────────────────┘
```

**Checklist:**
- [ ] Layout renders correctly
- [ ] Panels are collapsible
- [ ] Responsive to window resize
- [ ] Keyboard focus management

### Step 6.2: Menu Bar
**File:** `src/components/Menu/MenuBar.tsx`

**Menus:**
- **File:** New, Open, Save, Export, Print
- **Edit:** Undo, Redo, Cut, Copy, Paste, Clear
- **Image:** Adjustments, Image Size, Canvas Size, Rotate
- **Layer:** New, Duplicate, Merge, Flatten, Layer Styles
- **Filter:** All filter categories
- **Select:** All, Deselect, Inverse, Modify
- **View:** Zoom, Rulers, Guides, Grid
- **Help:** Shortcuts, About

**Checklist:**
- [ ] All menus open/close correctly
- [ ] Keyboard shortcuts shown
- [ ] Disabled items styled correctly
- [ ] Submenus work

### Step 6.3: Toolbar
**File:** `src/components/Toolbar/Toolbar.tsx`

**Features:**
- Tool icons with tooltips
- Tool groups (flyout menus)
- Active tool highlight
- Quick access to tool options

**Checklist:**
- [ ] All tools accessible
- [ ] Flyout menus work
- [ ] Keyboard shortcuts activate tools
- [ ] Active state visible

### Step 6.4: Panels System
**Files:** `src/components/Panels/`

**Panels:**
1. **Layers Panel**
   - Layer thumbnails
   - Visibility/lock toggles
   - Opacity slider
   - Blend mode dropdown
   - Layer effects indicator
   - Context menu

2. **Properties Panel**
   - Dynamic based on selection
   - Tool options
   - Adjustment controls

3. **History Panel**
   - Action list
   - Click to revert
   - Clear history option

4. **Color Panel**
   - Color picker
   - Swatches
   - Foreground/background

5. **Navigator Panel**
   - Thumbnail preview
   - Zoom control
   - Pan viewport

**Checklist per panel:**
- [ ] Panel renders correctly
- [ ] Data syncs with store
- [ ] Interactions work
- [ ] Collapse/expand works
- [ ] Can be closed/reopened

### Step 6.5: Dialog System
**Files:** `src/components/Dialogs/`

**Dialogs:**
- New Document
- Image Size
- Canvas Size
- Export Options
- Filter Dialogs (with preview)
- Preferences
- Keyboard Shortcuts
- About

**Checklist:**
- [ ] Dialogs open centered
- [ ] Close on Escape
- [ ] Form validation works
- [ ] Preview updates live

### Step 6.6: Context Menus
**File:** `src/components/UI/ContextMenu.tsx`

**Context menus for:**
- Canvas (right-click)
- Layer panel items
- Tool options

**Checklist:**
- [ ] Opens at cursor position
- [ ] Closes on outside click
- [ ] Actions work correctly

### Step 6.7: Theme System
**File:** `src/styles/themes.ts`

**Features:**
- Dark theme (default)
- Light theme
- Custom theme support
- System preference detection

**Checklist:**
- [ ] Both themes work
- [ ] Toggle switch works
- [ ] Preference persisted
- [ ] All components themed

### Step 6.8: Verification Gate
**Test UI:**
1. Navigate all menus
2. Use all panels
3. Open all dialogs
4. Test keyboard shortcuts
5. Test both themes

**Must Pass:**
- [ ] All UI elements functional
- [ ] No visual glitches
- [ ] Keyboard navigation works
- [ ] Responsive to window size

---

## Phase 7: File I/O & Export
**Duration:** 2-3 days  
**Objective:** Implement file handling and export options

### Step 7.1: File Import
**File:** `src/utils/fileImport.ts`

**Supported formats:**
- JPEG, PNG, GIF, WebP, BMP
- SVG (as shape layer)
- PSD (basic support via psd.js)
- RAW (optional, via dcraw.js)

**Implementation:**
```typescript
// Drag-and-drop support
// File picker dialog
// URL import
// Clipboard paste (Ctrl+V)
```

**Checklist:**
- [ ] All formats load correctly
- [ ] Drag-and-drop works
- [ ] Large files handled (progress bar)
- [ ] Invalid files show error

### Step 7.2: Project Save/Load
**File:** `src/utils/projectFile.ts`

**Format:** `.pfp` (PixelForge Project)
- JSON structure with layer data
- Embedded images as base64 or separate files
- History state (optional)
- Compressed with JSZip

**Checklist:**
- [ ] Save captures all state
- [ ] Load restores correctly
- [ ] File size reasonable
- [ ] Version compatibility

### Step 7.3: Export Options
**File:** `src/utils/fileExport.ts`

**Export formats:**
- JPEG (quality slider)
- PNG (8-bit, 24-bit, 32-bit)
- WebP (quality slider)
- GIF (optional animation)
- PDF (optional)
- SVG (vector layers only)
- PSD (optional)

**Export options:**
- Resolution (72, 150, 300 DPI)
- Resize for export
- Color profile (sRGB)
- Metadata strip option

**Checklist:**
- [ ] All formats export correctly
- [ ] Quality settings work
- [ ] File downloads properly
- [ ] Metadata handling correct

### Step 7.4: Verification Gate
**Test scenarios:**
1. Import each supported format
2. Save and reload project
3. Export to each format
4. Verify output quality

**Must Pass:**
- [ ] All imports work
- [ ] Project round-trip works
- [ ] Exports match preview
- [ ] No data loss

---

## Phase 8: Advanced Features
**Duration:** 3-4 days  
**Objective:** Implement advanced/AI features

### Step 8.1: Content-Aware Fill
**File:** `src/features/contentAwareFill.ts`

**Implementation:**
- Selection required
- Patch-based synthesis
- OpenCV.js inpainting

**Checklist:**
- [ ] Removes selected content
- [ ] Fill looks natural
- [ ] Performance acceptable

### Step 8.2: Background Removal (AI)
**File:** `src/features/backgroundRemoval.ts`

**Options:**
1. **Client-side:** TensorFlow.js + U²-Net model
2. **Simple:** Color-based removal with tolerance

**Checklist:**
- [ ] One-click removal works
- [ ] Edge quality acceptable
- [ ] Processing time < 5s

### Step 8.3: Auto-Enhance
**File:** `src/features/autoEnhance.ts`

**Features:**
- Auto levels (histogram stretch)
- Auto contrast
- Auto color correction
- Auto sharpen

**Checklist:**
- [ ] Improves most photos
- [ ] Doesn't over-process
- [ ] One-click operation

### Step 8.4: Smart Selection
**File:** `src/features/smartSelection.ts`

**Implementation:**
- Edge detection
- Color clustering
- Optional: ML-based segmentation

**Checklist:**
- [ ] Detects edges well
- [ ] Better than magic wand
- [ ] Reasonable performance

### Step 8.5: Verification Gate
**Test advanced features:**
1. Test on various images
2. Compare to manual results
3. Check performance

**Must Pass:**
- [ ] Features improve workflow
- [ ] Quality acceptable
- [ ] No crashes

---

## Phase 9: Performance Optimization
**Duration:** 2-3 days  
**Objective:** Optimize for large images and smooth operation

### Step 9.1: Canvas Optimization
- Use `willReadFrequently` hint
- Implement dirty rectangle rendering
- Use OffscreenCanvas where supported
- Implement progressive rendering for large images

**Checklist:**
- [ ] 4K images render smoothly
- [ ] Drawing is 60fps
- [ ] No memory leaks

### Step 9.2: WebGL Optimization
- Minimize shader switches
- Use texture atlases
- Implement shader caching
- Use WebGL2 features

**Checklist:**
- [ ] Filters apply < 100ms
- [ ] GPU memory managed
- [ ] Fallback works

### Step 9.3: Memory Management
- Implement layer thumbnail caching
- Dispose unused resources
- Limit history size dynamically
- Compress large states

**Checklist:**
- [ ] Memory usage < 2GB for large projects
- [ ] Cleanup on layer delete
- [ ] Warning at high memory

### Step 9.4: Web Worker Integration
- Offload filter calculations
- Background export processing
- Async history snapshots

**Checklist:**
- [ ] UI remains responsive
- [ ] Workers communicate correctly
- [ ] Proper termination

### Step 9.5: Verification Gate
**Performance tests:**
1. Load 4K image, apply 10 filters
2. Create 30 layers
3. 100 undo/redo cycles
4. Export high-res image

**Must Pass:**
- [ ] All operations smooth
- [ ] Memory under control
- [ ] No crashes under stress

---

## Phase 10: Polish & Accessibility
**Duration:** 2 days  
**Objective:** Final polish and accessibility compliance

### Step 10.1: Keyboard Shortcuts
**File:** `src/utils/keyboardShortcuts.ts`

**Essential shortcuts:**
- Tools: V (move), M (marquee), L (lasso), B (brush), etc.
- Actions: Ctrl+Z (undo), Ctrl+S (save), Ctrl+E (export)
- View: Ctrl+0 (fit), Ctrl+1 (100%), +/- (zoom)
- Layers: Ctrl+J (duplicate), Delete (delete layer)

**Checklist:**
- [ ] All shortcuts work
- [ ] No conflicts
- [ ] Shortcuts shown in tooltips
- [ ] Shortcuts reference dialog

### Step 10.2: Accessibility
- ARIA labels on all controls
- Keyboard navigation throughout
- High contrast support
- Screen reader announcements

**Checklist:**
- [ ] Tab navigation works
- [ ] All actions keyboard accessible
- [ ] ARIA labels present
- [ ] Color contrast passes WCAG

### Step 10.3: Error Handling
- Graceful error recovery
- User-friendly error messages
- Auto-save recovery
- Crash reporting (optional)

**Checklist:**
- [ ] Errors don't crash app
- [ ] User notified appropriately
- [ ] Recovery options provided

### Step 10.4: Loading States
- Splash screen
- Progress bars for long operations
- Skeleton loaders
- Operation status

**Checklist:**
- [ ] All async ops show loading
- [ ] Progress accurate
- [ ] Can cancel long operations

### Step 10.5: Verification Gate
**Final QA:**
1. Keyboard-only usage test
2. Screen reader test
3. Error scenario testing
4. Cross-browser testing

**Must Pass:**
- [ ] Keyboard navigable
- [ ] Accessible to screen readers
- [ ] Errors handled gracefully
- [ ] Works in Chrome, Firefox, Safari, Edge

---

## Phase 11: PWA & Deployment
**Duration:** 1-2 days  
**Objective:** Prepare for production deployment

### Step 11.1: PWA Configuration
**Files:**
- `public/manifest.json`
- `src/sw.ts` (Service Worker)
- `public/icons/` (various sizes)

**Features:**
- Offline capability
- Install prompt
- App-like experience

**Checklist:**
- [ ] Manifest valid
- [ ] Service worker caches assets
- [ ] Install prompt works
- [ ] Offline mode functional

### Step 11.2: Build Optimization
```bash
# Production build
npm run build

# Analyze bundle
npm run build -- --analyze
```

**Optimizations:**
- Code splitting
- Tree shaking
- Asset compression
- Lazy loading

**Checklist:**
- [ ] Bundle size < 2MB initial
- [ ] Lazy loaded chunks work
- [ ] Assets compressed
- [ ] No dead code

### Step 11.3: Deployment
**Options:**
1. **Vercel:** `vercel deploy`
2. **Netlify:** Connect GitHub repo
3. **GitHub Pages:** `npm run deploy`
4. **Self-hosted:** Nginx/Apache

**Checklist:**
- [ ] Deployment succeeds
- [ ] HTTPS enabled
- [ ] Assets cached properly
- [ ] 404 handling for SPA

### Step 11.4: Final Verification
**Production checklist:**
- [ ] All features work in production
- [ ] Performance acceptable
- [ ] No console errors
- [ ] PWA installable
- [ ] Analytics working (if added)

---

## Phase 12: Documentation & Launch
**Duration:** 1 day  
**Objective:** Document and announce

### Step 12.1: User Documentation
- Getting started guide
- Tool reference
- Keyboard shortcuts reference
- FAQ

### Step 12.2: Developer Documentation
- Architecture overview
- Contributing guide
- API documentation
- Build instructions

### Step 12.3: Launch Checklist
- [ ] README complete
- [ ] License added
- [ ] Demo site live
- [ ] Screenshots/videos
- [ ] Social announcement ready

---

## Summary Checklist

### Core Features ✓
- [ ] Canvas engine with zoom/pan
- [ ] Layer system (20+ blend modes)
- [ ] 20+ editing tools
- [ ] 40+ filters and adjustments
- [ ] Selection tools with marching ants
- [ ] Text tool with formatting
- [ ] Shape tools
- [ ] Clone/healing tools
- [ ] Transform tools
- [ ] Crop tool

### Quality Features ✓
- [ ] Undo/redo (50+ steps)
- [ ] Real-time preview
- [ ] WebGL acceleration
- [ ] Keyboard shortcuts
- [ ] Dark/light themes
- [ ] Responsive layout
- [ ] Accessibility compliant

### File Handling ✓
- [ ] Import: JPEG, PNG, GIF, WebP, BMP, PSD
- [ ] Export: JPEG, PNG, WebP
- [ ] Project save/load
- [ ] Drag-and-drop

### Advanced Features ✓
- [ ] Background removal
- [ ] Content-aware fill
- [ ] Auto-enhance
- [ ] Filter presets

### Deployment ✓
- [ ] PWA ready
- [ ] Offline support
- [ ] Production build optimized
- [ ] Deployed and accessible

---

## Estimated Timeline

| Phase | Duration | Cumulative |
|-------|----------|------------|
| 1. Foundation | 1-2 days | 2 days |
| 2. State Management | 1-2 days | 4 days |
| 3. Canvas Engine | 3-4 days | 8 days |
| 4. Tools | 4-5 days | 13 days |
| 5. Filters | 4-5 days | 18 days |
| 6. UI | 3-4 days | 22 days |
| 7. File I/O | 2-3 days | 25 days |
| 8. Advanced | 3-4 days | 29 days |
| 9. Performance | 2-3 days | 32 days |
| 10. Polish | 2 days | 34 days |
| 11. Deployment | 1-2 days | 36 days |
| 12. Documentation | 1 day | 37 days |

**Total: ~5-6 weeks for MVP with all core features**

---

## Claude Code Commands Reference

```bash
# Initialize
claude "Create React + TypeScript project with Vite for photo editor"

# Per phase
claude "Implement [Phase X] following the plan in docs/IMPLEMENTATION_PLAN.md"

# Verification
claude "Run verification tests for [Phase X] and report issues"

# Fix issues
claude "Fix the issue: [description] in [file]"
```

**Best Practice:** Work through one phase at a time, verify all checkboxes, then proceed.
