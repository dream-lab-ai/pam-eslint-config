# PAM ESLint Config - AI Agent Instructions

## Project Identity

**Type**: Shareable ESLint and Prettier configuration package for Pam AI projects

**Stack**: Node.js 22.x (CommonJS modules), ESLint 9 (Flat Config), Prettier 3.x

**Architecture**: Preset-based configuration system with automatic detection and composition

**Purpose**: Provide standardized, opinionated linting and formatting configurations that automatically detect project types (React, Vitest, TypeScript) and apply appropriate rules

---

## Critical Context

### Node.js Version & Module System

- **Node.js**: 22.14.0 (see `.nvmrc` - strict requirement, must use `nvm use`)
- **Module System**: CommonJS (no `"type": "module"` in package.json)
- **Import Style**: Use `require()` and `module.exports` - this is a CommonJS package
- **Package Manager**: npm only - No yarn, pnpm, or other package managers

### Distribution Method

- **Published via**: GitHub (not npm registry)
- **Installation**: `"@dream-lab-ai/pam-eslint-config": "github:dream-lab-ai/pam-eslint-config"`
- **Versioning**: Git tags (e.g., `v2.0.0`) - consumers can reference specific tags
- **Public Repository**: Changes are immediately available to all consuming projects

---

## Development Environment

### Initial Setup

```bash
# Use correct Node version
nvm use  # reads from .nvmrc (v22.14.0)

# Install dependencies
npm install

# Initialize Husky hooks
npm run prepare
```

### Development Commands

```bash
npm run lint       # Run ESLint with auto-fix
npm run format     # Format all files with Prettier
npm run build      # No-op (exits immediately, kept for CI compatibility)
npm run npm-audit  # Run security audit
```

### No Test Suite

- This package does not have automated tests
- Testing happens by consuming it in actual projects (pam-tekion-integration, etc.)
- Changes should be tested in at least one consuming project before release

---

## Testing Strategy

### Manual Testing Approach

1. **Make changes** to presets or configuration
2. **Commit changes** (don't push yet)
3. **Test in consuming project**:
   ```bash
   cd ../pam-tekion-integration  # Or another project
   npm install  # Re-installs from GitHub, picks up your local changes if committed
   npm run lint  # Test linting
   npm run format  # Test formatting
   ```
4. **Iterate** if needed
5. **Push to GitHub** when confident

### What to Test Manually

- ✅ ESLint rules apply correctly in consuming projects
- ✅ Prettier formats code as expected
- ✅ Automatic preset detection works (React, Vitest, TypeScript)
- ✅ No conflicts between ESLint and Prettier
- ✅ All file types are covered (`.js`, `.ts`, `.jsx`, `.tsx`, `.mjs`, `.cjs`)

---

## Code Quality & Formatting

### Linting

```bash
npm run lint  # ESLint with auto-fix
```

- **Config**: `eslint.config.js` (self-hosted - this config lints itself)
- **Base**: Uses its own base preset
- **Pre-commit**: Husky + lint-staged runs lint + format automatically

### Formatting

```bash
npm run format  # Prettier with auto-fix
```

- **Config**: Uses its own `prettierConfig.js`
- **Style**: Opinionated - don't fight it, let Prettier decide
- **Pre-commit**: Runs on all staged files

### Pre-commit Hooks

- **Tool**: Husky v9
- **Config**: `lint-staged` in package.json
- **Triggers**: `npm run lint` and `npm run format` on staged files
- **Setup**: `npm run prepare` (runs after npm install)

---

## Architecture Patterns

### Preset System Architecture

```
index.js               → Main entry point, automatic preset detection
presets/
  ├── base.js          → Core JavaScript/TypeScript rules (always included)
  ├── react.js         → React-specific rules (auto-detected if react installed)
  ├── vitest.js        → Vitest test rules (auto-detected if vitest installed)
  └── testingLibrary.js → Testing Library rules (auto-detected if @testing-library/react installed)
prettierConfig.js      → Shared Prettier configuration
package.json           → Package metadata, exports configuration
```

### Main Entry Point Pattern (`index.js`)

```javascript
// Automatic preset composition based on consumer's dependencies
const hasPackage = (packageName) => {
  // Reads consumer's package.json
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  return !!(
    (packageJson.dependencies && packageJson.dependencies[packageName]) ||
    (packageJson.devDependencies && packageJson.devDependencies[packageName])
  );
};

// Build config array
const configs = [...baseConfig];

if (hasPackage('vitest')) {
  configs.push(...vitestConfig);
}

if (hasPackage('react')) {
  configs.push(...reactConfig);
  if (hasPackage('@testing-library/react')) {
    configs.push(...testingLibraryConfig);
  }
}

module.exports = configs;
```

### Preset Structure Pattern

Each preset exports an array of ESLint flat config objects:

```javascript
// presets/base.js structure
module.exports = [
  // Global ignores
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
  },
  // File-specific configuration
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      /* ... */
    },
    plugins: {
      /* ... */
    },
    rules: {
      /* ... */
    },
  },
  // TypeScript-specific configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: tsConfig, // Auto-detected tsconfig.json
      },
    },
    rules: {
      /* ... */
    },
  },
];
```

### Package Exports Pattern

```json
{
  "exports": {
    ".": "./index.js", // Main entry (auto-detect)
    "./base": "./presets/base.js", // Manual preset selection
    "./react": "./presets/react.js",
    "./vitest": "./presets/vitest.js",
    "./package.json": "./package.json", // Allow package.json inspection
    "./prettierConfig": "./prettierConfig.js" // Shared Prettier config
  }
}
```

---

## Configuration Presets

### Base Preset (`presets/base.js`)

**Purpose**: Core linting rules for JavaScript and TypeScript

**Key Features**:

- TypeScript support with `@typescript-eslint`
- Prettier integration with `eslint-plugin-prettier`
- Auto-detects `tsconfig.json` for TypeScript projects
- Import ordering rules
- Code quality rules (no-unused-vars, no-console, etc.)
- Best practices enforcement

**Rule Philosophy**:

- Errors for bugs and potential issues
- Warnings for code quality concerns
- Disabled rules that conflict with Prettier

**File Matching**: `**/*.{js,jsx,ts,tsx,mjs,cjs}`

### React Preset (`presets/react.js`)

**Purpose**: React-specific linting rules

**Key Features**:

- React 19+ support (no React import needed in JSX files)
- React Hooks rules (`eslint-plugin-react-hooks`)
- JSX accessibility warnings (`eslint-plugin-jsx-a11y`)
- Component best practices

**Important Rules**:

- `react/react-in-jsx-scope`: `'off'` (React 19+)
- `react/prop-types`: `'off'` (favor TypeScript types)
- `react-hooks/rules-of-hooks`: `'error'`
- `react-hooks/exhaustive-deps`: `'warn'`

**File Matching**: `**/*.{jsx,tsx}`

### Vitest Preset (`presets/vitest.js`)

**Purpose**: Testing rules for Vitest test files

**Key Features**:

- Vitest-specific rules (`eslint-plugin-vitest`)
- Relaxed rules for test files (allow `console.log`, `no-unused-expressions`)
- Environment-aware globals

**File Matching**:

- `**/__tests__/**/*.[jt]s?(x)`
- `**/?(*.)+(spec|test).[jt]s?(x)`

### Testing Library Preset (`presets/testingLibrary.js`)

**Purpose**: React Testing Library best practices

**Key Features**:

- Testing Library rules (`eslint-plugin-testing-library`)
- Best practices for accessible queries
- Async testing patterns

**File Matching**: Same as Vitest preset (test files only)

### Prettier Config (`prettierConfig.js`)

**Purpose**: Shared Prettier configuration

**Key Settings**:

```javascript
{
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
}
```

---

## Consumer Usage Patterns

### Automatic Configuration (Recommended)

**In consumer's `eslint.config.mjs`:**

```javascript
import pamConfig from '@dream-lab-ai/pam-eslint-config';

export default [
  ...pamConfig,
  {
    // Consumer-specific overrides
    ignores: ['.serverless/**', 'special_sheets/**'],
  },
];
```

**What happens**: Automatically includes base + detected presets (React, Vitest, etc.)

### Manual Preset Selection

**In consumer's `eslint.config.mjs`:**

```javascript
import baseConfig from '@dream-lab-ai/pam-eslint-config/base';
import reactConfig from '@dream-lab-ai/pam-eslint-config/react';
import vitestConfig from '@dream-lab-ai/pam-eslint-config/vitest';

export default [
  ...baseConfig,
  ...reactConfig,
  ...vitestConfig,
  {
    rules: {
      // Custom rules
    },
  },
];
```

**When to use**: Fine-grained control, unusual project structures

### Prettier Configuration

**Option 1: In consumer's `package.json`:**

```json
{
  "prettier": "@dream-lab-ai/pam-eslint-config/prettierConfig"
}
```

**Option 2: In consumer's `.prettierrc.cjs`:**

```javascript
module.exports = {
  ...require('@dream-lab-ai/pam-eslint-config/prettierConfig'),
  // Consumer overrides
};
```

---

## Code Style & Conventions

### File Naming

- **Presets**: camelCase.js (e.g., `base.js`, `testingLibrary.js`)
- **Config Files**: camelCase.js (e.g., `prettierConfig.js`)
- **Main Entry**: `index.js`

### Module Structure

- **CommonJS**: Use `require()` and `module.exports`
- **No ESM**: Don't use `import`/`export` syntax
- **File Extensions**: Always `.js` (no `.mjs` or `.cjs` unless needed)

### Preset Organization

```javascript
// Each preset follows this structure:
module.exports = [
  // 1. Global ignores (if applicable)
  {
    ignores: ['pattern/**'],
  },

  // 2. File matching and configuration
  {
    files: ['**/*.js'],
    languageOptions: {
      /* ... */
    },
    plugins: {
      /* ... */
    },
    rules: {
      /* ... */
    },
  },

  // 3. Additional specialized configs (if needed)
];
```

### Rule Configuration Philosophy

- **`'error'`**: For bugs, security issues, or incorrect code
- **`'warn'`**: For code quality, maintainability issues
- **`'off'`**: For rules that conflict with other tools or project philosophy

---

## Common Patterns & Recipes

### Adding a New Preset

1. Create file in `presets/` directory (e.g., `presets/newPreset.js`)
2. Export array of ESLint flat config objects
3. Add to `package.json` exports:
   ```json
   {
     "exports": {
       "./newPreset": "./presets/newPreset.js"
     }
   }
   ```
4. Optionally add auto-detection in `index.js`:
   ```javascript
   if (hasPackage('target-package')) {
     configs.push(...newPresetConfig);
   }
   ```
5. Update README.md with usage examples
6. Test in consuming project

### Modifying Existing Rules

1. Identify which preset contains the rule
2. Update the rule in the appropriate preset file
3. Document reason for change in commit message
4. Test in at least one consuming project
5. Create git tag for release

### Adding a New ESLint Plugin

1. Add to `dependencies` in `package.json`:
   ```json
   {
     "dependencies": {
       "eslint-plugin-name": "^1.0.0"
     }
   }
   ```
2. Import in preset file:
   ```javascript
   const pluginName = require('eslint-plugin-name');
   ```
3. Add to plugins config:
   ```javascript
   {
     plugins: {
       'plugin-name': pluginName,
     }
   }
   ```
4. Configure rules:
   ```javascript
   {
     rules: {
       'plugin-name/rule-name': 'error',
     }
   }
   ```

### Debugging Consumer Issues

```bash
# In consuming project
npx eslint --print-config src/file.js  # Show effective config for file
npx eslint --debug src/file.js         # Debug mode
npx eslint --inspect-config            # Interactive config inspector (ESLint 9+)
```

---

## Security & Dependencies

### Dependency Strategy

- **All plugins as dependencies**: Consumers don't need to install plugins separately
- **Peer dependency**: Only `eslint` >= 9.0.0 required by consumer
- **No peer dependency warnings**: All plugins bundled

### Security Audits

```bash
npm run npm-audit  # Run security audit
```

- **Scheduled**: Run on every PR via GitHub Actions
- **Fix vulnerabilities**: `npm audit fix` (test in consuming project after)
- **Breaking changes**: Document in commit message if audit fix updates major versions

---

## Deployment & Versioning

### Release Process

1. **Make changes** and test in consuming project
2. **Update version** in `package.json`:
   ```json
   {
     "version": "2.1.0"
   }
   ```
3. **Commit changes**:
   ```bash
   git add .
   git commit -m "v2.1.0: Add support for new ESLint rule"
   ```
4. **Create git tag**:
   ```bash
   git tag v2.1.0
   git push origin main --tags
   ```
5. **Update consuming projects**: They can now reference `v2.1.0`

### Versioning Strategy

- **Semantic Versioning**: `MAJOR.MINOR.PATCH`
- **Major**: Breaking changes (new ESLint version, removed presets, incompatible rule changes)
- **Minor**: New features (new presets, new rules, new plugins)
- **Patch**: Bug fixes (rule adjustments, dependency updates)

### Consumer Update Pattern

**In consumer's `package.json`:**

```json
{
  "devDependencies": {
    "@dream-lab-ai/pam-eslint-config": "github:dream-lab-ai/pam-eslint-config#v2.1.0"
  }
}
```

**Or use main branch (latest):**

```json
{
  "devDependencies": {
    "@dream-lab-ai/pam-eslint-config": "github:dream-lab-ai/pam-eslint-config"
  }
}
```

### Breaking Changes

When releasing breaking changes:

1. Document in commit message
2. Update README with migration guide
3. Notify teams using this config
4. Bump major version (e.g., `2.0.0` → `3.0.0`)

---

## Documentation

### README.md

- **Audience**: Developers consuming this package
- **Content**: Installation, usage examples, available presets
- **Keep Updated**: When adding presets or changing usage patterns

### AGENTS.md (This File)

- **Audience**: AI agents and developers maintaining this package
- **Content**: Architecture, patterns, development workflow
- **Keep Updated**: When changing internal patterns or adding features

### Inline Comments

- **Preset files**: Comment complex rule decisions
- **Example**:
  ```javascript
  rules: {
    'react/react-in-jsx-scope': 'off',  // React 19+ doesn't require React import
  }
  ```

---

## Agent Permissions & Boundaries

### Allowed Actions (No Approval Required)

- ✅ Read any file in the repository
- ✅ List directory contents
- ✅ Search codebase
- ✅ Run linter: `npm run lint`
- ✅ Run formatter: `npm run format`
- ✅ View package dependencies: `cat package.json`
- ✅ Read documentation files

### Actions Requiring Approval

- ⚠️ Install/remove npm packages (`npm install`, `npm uninstall`)
- ⚠️ Modify `package.json` (dependencies, version, exports)
- ⚠️ Create/delete preset files in `presets/` directory
- ⚠️ Modify rule configurations in presets
- ⚠️ Git operations: commit, push, tag
- ⚠️ Change versioning or release process
- ⚠️ Modify Prettier configuration

### Strictly Prohibited

- 🚫 Commit breaking changes without major version bump
- 🚫 Delete presets without migration guide
- 🚫 Force push to main
- 🚫 Modify git tags
- 🚫 Change distribution method (GitHub to npm)

---

## Troubleshooting

### Common Issues

#### "Cannot find module '@dream-lab-ai/pam-eslint-config'"

- **Cause**: Consumer hasn't installed package or npm install failed
- **Fix**: Run `npm install` in consumer project

#### "Parsing error: Cannot find module 'typescript'"

- **Cause**: Consumer has TypeScript files but no TypeScript installed
- **Fix**: Add `typescript` to consumer's `devDependencies`

#### Rules conflict between ESLint and Prettier

- **Cause**: ESLint formatting rules enabled that Prettier handles
- **Fix**: Ensure `eslint-config-prettier` is last in config array (already handled)

#### Auto-detection not working

- **Cause**: Consumer using unusual package.json location or structure
- **Fix**: Use manual preset selection instead of automatic

#### Changes not reflected in consumer project

- **Cause**: Consumer references old git tag or npm hasn't re-fetched
- **Fix**:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Where to Look for Help

1. **This file** (`AGENTS.md`) - Start here for development context
2. **README.md** - Consumer-facing documentation
3. **Preset files** (`presets/*.js`) - Rule configurations and comments
4. **ESLint documentation** - [https://eslint.org/docs/latest/](https://eslint.org/docs/latest/)
5. **Consuming projects** - See how this config is used in practice

---

## Project-Specific Terminology

- **Preset**: A configuration module that exports ESLint flat config objects
- **Flat Config**: ESLint 9's new configuration format (array of objects, not `.eslintrc`)
- **Consumer**: A project that depends on this package (e.g., pam-tekion-integration)
- **Auto-detection**: Automatic inclusion of presets based on consumer's dependencies
- **Composite Action**: Pattern of spreading multiple config arrays into one
- **Config Array**: ESLint flat config format - array of configuration objects
- **Plugin**: ESLint plugin that provides additional rules (e.g., `eslint-plugin-react`)
- **Rule**: Individual linting check (e.g., `no-console`, `react/jsx-key`)

---

## Quick Reference

### Most Common Commands

```bash
npm run lint        # Run ESLint with auto-fix
npm run format      # Format all files with Prettier
npm run npm-audit   # Security audit
```

### Most Important Files

- `index.js` - Main entry point with auto-detection logic
- `presets/base.js` - Core JavaScript/TypeScript rules
- `presets/react.js` - React-specific rules
- `presets/vitest.js` - Vitest testing rules
- `prettierConfig.js` - Shared Prettier configuration
- `package.json` - Package metadata, exports, dependencies

### Key Directories

- `presets/` - Individual preset modules
- `node_modules/` - Dependencies (gitignored)

### Consuming Projects

- pam-tekion-integration
- pam-vitest-config
- pam-github-actions
- Other Pam projects

---

**Last Updated**: 2026-01-06  
**Node Version**: 22.14.0  
**ESLint Version**: ^9.39.2  
**Prettier Version**: ^3.5.3  
**Current Package Version**: 2.0.0
