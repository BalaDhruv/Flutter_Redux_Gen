# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flutter Redux Gen (FRG) is a VS Code extension that automatically generates Redux boilerplate code for Flutter applications. It creates State, Reducer, Middleware, and Action files with proper structure and imports.

## Key Concepts

### Sets and Parent Sets
- **Set**: A folder containing four files (State, Reducer, Middleware, Action) for a specific Redux feature
- **Parent Set**: The root Redux store that orchestrates all individual Sets. Contains:
  - A parent state that aggregates all child states
  - A parent reducer that delegates to child reducers
  - A parent middleware that combines all middlewares
- **Auto Import**: When creating a Set, the extension automatically imports and wires it into the Parent Set

### Freezed Support
The extension supports both standard Dart classes and [freezed](https://pub.dev/packages/freezed) immutable classes. When creating states with freezed:
- Generates `@freezed` annotations
- Creates part directives for `.freezed.dart` and `.g.dart` files
- Uses factory constructors with named parameters
- After adding variables to freezed states, users must run: `dart run build_runner build`

## Getting Started After Cloning

```bash
# 1. Install dependencies
npm install

# 2. Compile TypeScript to JavaScript
npm run compile

# 3. Open in VS Code and press F5 to launch Extension Development Host
# This opens a new VS Code window with the extension loaded for testing
```

**Testing the Extension:**
1. Open the project in VS Code
2. Press `F5` (or Run > Start Debugging)
3. This compiles the extension and launches the Extension Development Host (a new VS Code window)
4. In the new window, open a Flutter project with a `pubspec.yaml` file
5. Right-click on a folder in the Explorer to see the "Flutter Redux Gen" commands

## Build & Development Commands

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-recompile on changes)
npm run watch

# Lint
npm run lint

# Run tests
npm test

# Build for publishing
npm run vscode:prepublish
```

## Architecture

### Entry Point
[src/extension.ts](src/extension.ts) - Registers all VS Code commands and initializes the extension

### Code Generation Modules
- [src/resources/gen/state.ts](src/resources/gen/state.ts) - State file generation and variable addition logic
- [src/resources/gen/reducer.ts](src/resources/gen/reducer.ts) - Reducer file generation
- [src/resources/gen/middleware.ts](src/resources/gen/middleware.ts) - Middleware file generation
- [src/resources/gen/action.ts](src/resources/gen/action.ts) - Action file generation
- [src/resources/gen/parent_set.ts](src/resources/gen/parent_set.ts) - Parent Set generation and auto-import logic

### Utility Modules
- [src/resources/utils/file-utils.ts](src/resources/utils/file-utils.ts) - File system operations (create files/folders)
- [src/resources/utils/storage.ts](src/resources/utils/storage.ts) - VS Code workspace state management for Parent Set persistence
- [src/resources/utils/utils.ts](src/resources/utils/utils.ts) - String formatting utilities (camelCase, PascalCase conversions)
- [src/resources/utils/constants.ts](src/resources/utils/constants.ts) - File extensions, regex patterns, error messages

## Critical Implementation Details

### Parent Set State Management
The extension stores the Parent Set location in VS Code's workspace state ([storage.ts:3-6](src/resources/utils/storage.ts#L3-L6)). This allows:
- Persistence across VS Code sessions
- Auto-import when creating new Sets
- Detection of whether a Parent Set is configured

### Auto-Import Mechanism
When creating a Set, [parent_set.ts:73-76](src/resources/gen/parent_set.ts#L73-L76) automatically:
1. Adds state variable to Parent State with proper imports
2. Wires reducer into Parent Reducer
3. Both operations manipulate existing files by parsing and inserting code at specific locations

### Variable Addition to States
The "Add Variable to State" feature ([state.ts:53-141](src/resources/gen/state.ts#L53-L141)) performs complex AST-like manipulation:
- Detects whether the state uses freezed or standard classes
- For standard classes: Updates class field, constructor, factory method, copyWith, operator==, hashCode, and toString
- For freezed classes: Adds parameter to factory constructor ([state.ts:144-180](src/resources/gen/state.ts#L144-L180))

### Path Handling
Windows path handling note: The codebase strips leading slashes/backslashes when reading files ([state.ts:59](src/resources/gen/state.ts#L59), [state.ts:147](src/resources/gen/state.ts#L147)) to handle VS Code's URI format on Windows.

## Command Palette Integration

Most commands are hidden from the command palette (`when: false`) and only accessible via:
- Right-click context menus in the Explorer
- Right-click context menus in the editor (for `*.state.dart` files)
- Exception: "Select Parent Set" is always available in the command palette

## Testing

Test files are in [src/test/](src/test/). The extension uses:
- Mocha test framework
- VS Code's test runner (`vscode-test`)
- Run with: `npm test` (which runs `npm run pretest` first to compile and lint)

## Important File Patterns

- State files: `*.state.dart`
- Reducer files: `*.reducer.dart`
- Middleware files: `*.middleware.dart`
- Action files: `*.action.dart`
- Freezed generated files: `*.freezed.dart`, `*.g.dart`

## Dependencies

- **lodash**: Used for utility functions like `findLastIndex` in state manipulation
- All other dependencies are dev dependencies for TypeScript/VS Code extension development
