# PixelForge Pro

> Advanced Web-Based Photo Editing Application
>
> Industry-level photo editing capabilities with Photoshop-like features, entirely in your browser.

## 🎯 Project Status

**Phase 1: Project Foundation & Setup** - ✅ **COMPLETED**

## 🚀 Quick Start

```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

## 📦 Tech Stack

- **Framework:** React 18.x with TypeScript
- **Build Tool:** Vite 7.x
- **Canvas Library:** Fabric.js 6.9.1
- **State Management:** Zustand 5.0.9 with Immer
- **Styling:** TailwindCSS 3.4.17 (with dark mode)
- **Icons:** Lucide React
- **Utilities:** UUID, File-Saver, JSZip

## 📁 Project Structure

```
pixelforge-pro/
├── src/
│   ├── components/          # React components
│   │   ├── Canvas/         # Canvas-related components
│   │   ├── Toolbar/        # Tool palette
│   │   ├── Panels/         # Side panels (Layers, History, etc.)
│   │   ├── Dialogs/        # Modal dialogs
│   │   ├── UI/             # Reusable UI components
│   │   ├── Layout/         # Layout components
│   │   └── Menu/           # Menu bar
│   ├── stores/             # Zustand state stores
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   ├── tools/              # Editing tools
│   │   ├── selection/      # Selection tools
│   │   ├── drawing/        # Brush, pencil, eraser
│   │   ├── retouch/        # Clone, heal, etc.
│   │   ├── shapes/         # Shape tools
│   │   └── transform/      # Transform tools
│   ├── filters/            # Image filters
│   │   ├── adjustments/    # Color adjustments
│   │   ├── blur/           # Blur effects
│   │   ├── sharpen/        # Sharpen effects
│   │   ├── distort/        # Distortion effects
│   │   ├── stylize/        # Artistic effects
│   │   └── presets/        # Filter presets
│   ├── features/           # Advanced features
│   └── constants/          # Constants and configs
├── public/                 # Static assets
├── docs/                   # Documentation
└── tests/                  # Tests
```

## 🎨 Features Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Vite + React + TypeScript
- [x] TailwindCSS with dark mode
- [x] Folder structure and path aliases
- [x] Core dependencies installed

### Phase 2: State Management (Next)
- [ ] TypeScript type system
- [ ] Zustand stores
- [ ] History system with undo/redo

### Phase 3: Canvas Engine
- [ ] Fabric.js integration
- [ ] Layer system
- [ ] Zoom and pan controls

### Phase 4: Essential Tools
- [ ] Selection tools (marquee, lasso, magic wand)
- [ ] Drawing tools (brush, pencil, eraser)
- [ ] Shape tools
- [ ] Text tool
- [ ] Transform tools

### Phase 5: Filters & Adjustments
- [ ] Color adjustments
- [ ] Blur/sharpen filters
- [ ] Stylize effects
- [ ] Filter presets

### Phase 6: UI
- [ ] Menu bar
- [ ] Toolbar
- [ ] Panels system
- [ ] Dialogs

### Phase 7: File I/O
- [ ] Import images (JPEG, PNG, GIF, WebP, BMP)
- [ ] Project save/load
- [ ] Export options

### Phase 8-12: Advanced Features, Optimization, Deployment

## 🛠 Development

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
import { Layer } from '@types/editor'
import { EditorStore } from '@stores/editorStore'
import { BrushTool } from '@tools/drawing/BrushTool'
import { GaussianBlur } from '@filters/blur/GaussianBlur'
```

### Available Aliases
- `@/` → `src/`
- `@components/` → `src/components/`
- `@stores/` → `src/stores/`
- `@utils/` → `src/utils/`
- `@types/` → `src/types/`
- `@hooks/` → `src/hooks/`
- `@tools/` → `src/tools/`
- `@filters/` → `src/filters/`
- `@features/` → `src/features/`
- `@constants/` → `src/constants/`

## 🎨 Styling

TailwindCSS v3 with custom theme colors for the editor:

- `editor-bg-{dark|light}` - Background colors
- `editor-panel-{dark|light}` - Panel backgrounds
- `editor-border-{dark|light}` - Border colors
- `editor-text-primary-{dark|light}` - Text colors
- `editor-text-secondary-{dark|light}` - Secondary text
- `editor-accent-primary` - Primary accent color
- `editor-accent-hover` - Hover state

### Dark Mode

Toggle dark mode using the `dark` class on the root element.

## 📝 Notes

- **Privacy-First:** All processing happens client-side
- **No Server Uploads:** Images never leave your browser
- **Offline Capable:** Will be PWA-enabled in Phase 11
- **Industry-Level:** Targeting Photoshop-competitive features

## 📚 Documentation

- [Implementation Plan](../photo-editor-plan.md) - Complete phase-by-phase plan
- [Quick Start Commands](../claude-code-quickstart.md) - Command reference
- [Session Progress](../SESSION_PROGRESS.md) - Current progress tracker

## 🤝 Contributing

This project is built incrementally following the implementation plan. Each phase builds on the previous one.

## 📄 License

[License TBD]

---

**Built with Claude Code** | **Powered by React + TypeScript + Vite**
