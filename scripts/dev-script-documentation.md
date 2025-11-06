# Documentation for `scripts/dev.mjs`

**1. Test Server (`test/server.mjs`)**
- Spawns a Node.js process with the `--watch` flag for automatic restarts
- Serves the project on port 3000 for local development and testing
- Provides live reload capabilities for the demo pages

**2. TypeScript Checker (`tsc --noEmit --watch`)**
- Runs TypeScript compiler in watch mode without emitting files
- Performs continuous type checking on source files in `src/`
- Provides real-time feedback on type errors and warnings

**3. Rollup Build Watcher (`rollup -c --watch`)**
- Monitors source files using Rollup's built-in file watcher
- Automatically triggers rebuilds when files change
- Produces multiple output formats (CommonJS, ES modules, SystemJS)

### File System Operations & Change Detection

**File Modification Tracking:**
- Uses `fs.statSync()` to monitor `dist/module.js` modification times
- Implements timestamp comparison to detect actual file changes
- Prevents false triggers from build system notifications

**Automated File Operations:**
```javascript
// Primary file copy operation
copyFileSync('dist/module.js', 'docs/demos/dist/module.js')

// UMD build output copy
copyFileSync('dist/umd/simple-datatables.js', 'docs/demos/dist/ksp-table.js')
```

### Build Pipeline Architecture

**Trigger Chain:**
1. Source file change detected by Rollup watcher
2. Rollup rebuilds `dist/module.js` and related outputs
3. File system change detection compares modification timestamps
4. If change confirmed, triggers UMD build via `pnpm run build_js_umd`
5. UMD build completion triggers final file copy operations

**ANSI Color Code Handling:**
The script strips ANSI escape sequences from Rollup output using regex pattern `/\u001b\[[0-9;]*m/g` to ensure reliable text matching for build completion detection.

### Process Communication & Output Management

**stdout/stderr Stream Handling:**
- Each spawned process has its output streams piped separately
- Console output is prefixed with emoji identifiers for process identification:
  - 🌐 `[SERVER]` - Test server output
  - 🔍 `[TSC]` - TypeScript checker output  
  - 🔨 `[BUILD]` - Rollup build output
  - 🔧 `[UMD]` - UMD build process output

**Graceful Shutdown:**
Implements signal handling for `SIGINT` and `SIGTERM` to ensure clean process termination. All child processes receive interrupt signals before the main process exits.

### Error Handling & Resilience

- File system operations wrapped in try-catch blocks
- Non-zero exit codes from child processes trigger cleanup procedures
- Missing files or directories are handled gracefully
- Build failures are logged but don't crash the entire development environment

This architecture provides a robust, multi-process development environment that handles TypeScript compilation, bundling, file watching, and development server management in a coordinated fashion.

## Process Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Test Server   │    │ TypeScript Checker│   │ Rollup Watcher  │
│                 │    │                 │    │                 │
│ test/server.mjs │    │ tsc --watch     │    │ rollup --watch  │
│ Port: 3000      │    │ Type checking   │    │ Build files     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                         ┌───────▼───────┐
                         │  File Change  │
                         │   Detection   │
                         └───────┬───────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Copy module.js to     │
                    │  docs/demos/dist/      │
                    └────────────┬────────────┘
                                 │
                         ┌───────▼───────┐
                         │  Trigger UMD  │
                         │     Build     │
                         └───────┬───────┘
                                 │
                    ┌────────────▼────────────┐
                    │ Copy UMD output to     │
                    │ docs/demos/dist/       │
                    └─────────────────────────┘
```

## Key Features

### 🚀 **Multi-Process Architecture**
Runs multiple development tools simultaneously without blocking

### 🔄 **Automatic Rebuilding**
Detects source file changes and rebuilds project automatically

### 📁 **Smart File Management**
Copies built files to appropriate locations for demos and testing

### 🛡️ **Error Resilience**
Handles build failures gracefully without crashing the development environment

### 🎯 **Real-time Feedback**
Provides immediate feedback on TypeScript errors and build status

### 🧹 **Clean Shutdown**
Properly terminates all child processes when stopped

## Usage

```bash
# Start the development environment
pnpm dev

# This will start:
# - Test server on http://localhost:3000
# - TypeScript type checker
# - Rollup build watcher
# - Automatic file copying and UMD building

# Stop with Ctrl+C
```