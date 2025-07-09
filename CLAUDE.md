# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server:** `npm run dev`
- **Build for production:** `npm run build`
- **Lint code:** `npm run lint`
- **Preview production build:** `npm run preview`

## Architecture Overview

This is a **Canvas Academy** - an interactive HTML5 Canvas learning platform built with React, TypeScript, and Vite. The application provides a split-pane IDE experience for learning canvas programming.

### Core Structure

**Main Application Flow:**
- `App.tsx` orchestrates the entire UI layout and state management
- `useProject.ts` manages project state and file operations (virtual file system)
- Examples are loaded from `examples.ts` and executed in real-time

**Key Components:**
- `CodeEditor` - Monaco editor with Canvas API autocompletion and shortcuts
- `CanvasPreview` - Safe code execution environment with animation controls
- `FileExplorer` - Virtual file system for project organization
- `Sidebar` - Example gallery with categorized tutorials

### Code Execution Architecture

The application uses a **sandboxed execution environment** in `CanvasPreview.tsx`:

1. **Safe Globals:** Code runs in a controlled environment with limited global access
2. **Canvas Context:** Pre-injected `canvas` and `ctx` variables for immediate use
3. **Animation Management:** `requestAnimationFrame` is wrapped to track animation state
4. **Error Handling:** Comprehensive error catching with helpful debugging tips

### Example System

Examples are structured in `examples.ts` with:
- **Categories:** basics, animation, interaction, effects, games
- **Difficulty levels:** beginner, intermediate, advanced
- **Live code:** Ready-to-run Canvas API demonstrations

### State Management

- **Project State:** `useProject` hook manages virtual file system operations
- **File Operations:** Create, rename, delete, and organize files/folders
- **Active File:** Single active file with content synchronization
- **Example Loading:** Handles unsaved changes with user confirmation

## Development Notes

- Canvas and context (`canvas`, `ctx`) are pre-available in all executed code
- Examples assume these variables exist and should not redeclare them
- The Monaco editor has Canvas API type definitions for autocompletion
- Animation frame management is handled automatically by the preview component
- All code execution happens client-side in a sandboxed environment