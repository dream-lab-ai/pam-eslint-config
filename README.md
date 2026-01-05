<div align="center">
<h1>@dream-lab-ai/pam-eslint-config</h1>

<p>Shareable ESLint configuration for Pam AI projects - ESLint 9 Flat Config</p>
</div>

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Available Presets](#available-presets)
- [Configuration Examples](#configuration-examples)
- [Migration Guide](#migration-guide)
- [Publishing](#publishing)

## Overview

This package provides Pam AI's ESLint configuration using the modern ESLint 9 flat config system. It includes:

- **Base config**: Core JavaScript/TypeScript linting rules
- **React config**: React-specific rules with hooks support
- **Vitest config**: Testing rules for Vitest
- **Testing Library config**: React Testing Library best practices
- **Prettier integration**: Consistent code formatting

## Prerequisites

**Node.js**: >=18 (tested on v22.14.0)

**Required peer dependencies**:
- `eslint` >= 9.0.0

## Installation

Install this package as a `devDependency`:

```bash
npm install --save-dev @dream-lab-ai/pam-eslint-config eslint
```

## Usage

### Automatic Configuration (Recommended)

The main export automatically detects your project setup and includes the appropriate presets:

**Create `eslint.config.mjs` in your project root:**

```javascript
import pamConfig from '@dream-lab-ai/pam-eslint-config';

export default [
  ...pamConfig,
  {
    // Your custom rules here
    rules: {
      // Override or extend rules
    },
  },
];
```

The config will automatically include:
- ✅ Base config (always included)
- ✅ Vitest config (if `vitest` is installed)
- ✅ React config (if `react` is installed)
- ✅ Testing Library config (if `@testing-library/react` is installed)

### Manual Preset Selection

You can also import specific presets for more control:

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
      // Your custom rules
    },
  },
];
```

## Available Presets

### Base

Core JavaScript and TypeScript linting rules.

```javascript
import baseConfig from '@dream-lab-ai/pam-eslint-config/base';
```

**Includes:**
- TypeScript support with `@typescript-eslint`
- Prettier integration
- Import ordering
- Code quality rules
- Best practices enforcement

### React

React and JSX specific rules.

```javascript
import reactConfig from '@dream-lab-ai/pam-eslint-config/react';
```

**Includes:**
- React 19+ support (no React import needed)
- React Hooks rules
- JSX accessibility (a11y) warnings
- Component best practices

### Vitest

Testing rules for Vitest test files.

```javascript
import vitestConfig from '@dream-lab-ai/pam-eslint-config/vitest';
```

**Applies to:**
- `**/__tests__/**/*.[jt]s?(x)`
- `**/?(*.)+(spec|test).[jt]s?(x)`

### Testing Library

React Testing Library best practices.

```javascript
import testingLibraryConfig from '@dream-lab-ai/pam-eslint-config/testingLibrary';
```

Use with React + Testing Library projects.

## Configuration Examples

### Next.js Project

```javascript
import pamConfig from '@dream-lab-ai/pam-eslint-config';

export default [
  ...pamConfig,
  {
    ignores: ['.next/**', 'out/**', 'public/**'],
  },
  {
    rules: {
      'react/jsx-props-no-spreading': 'off', // Common in Next.js
    },
  },
];
```

### TypeScript Library

```javascript
import baseConfig from '@dream-lab-ai/pam-eslint-config/base';

export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
];
```

### React + Vitest Project

```javascript
import pamConfig from '@dream-lab-ai/pam-eslint-config';

export default [
  ...pamConfig,
  {
    ignores: ['dist/**', 'build/**', 'coverage/**'],
  },
];
```

## Migration Guide

### Migrating from ESLint 8 to ESLint 9

If you're upgrading from an older version of this config:

1. **Update ESLint:**
   ```bash
   npm install --save-dev eslint@^9.0.0
   ```

2. **Delete old config files:**
   - Remove `.eslintrc.js`, `.eslintrc.json`, or `.eslintrc.yml`

3. **Create `eslint.config.mjs`:**
   ```javascript
   import pamConfig from '@dream-lab-ai/pam-eslint-config';
   
   export default pamConfig;
   ```

4. **Update package.json scripts:**
   ```json
   {
     "scripts": {
       "lint": "eslint .",
       "lint:fix": "eslint --fix ."
     }
   }
   ```

5. **Remove legacy ignore file:**
   - ESLint 9 doesn't use `.eslintignore`
   - Add ignores in your config instead:
   ```javascript
   export default [
     ...pamConfig,
     {
       ignores: ['node_modules/**', 'dist/**'],
     },
   ];
   ```

### Migrating from Jest to Vitest

This config now only supports Vitest. If you're still using Jest:

1. **Migrate tests to Vitest** (recommended)
2. **Or use v1.x of this package** (deprecated, ESLint 8 only)

## Sharing Prettier Configuration

This package also exports a Prettier configuration.

**In your `package.json`:**

```json
{
  "name": "my-project",
  "prettier": "@dream-lab-ai/pam-eslint-config/prettierConfig"
}
```

**Or create `.prettierrc.js`:**

```javascript
module.exports = {
  ...require('@dream-lab-ai/pam-eslint-config/prettierConfig'),
  // Your overrides
};
```

## Publishing This Package

To publish a new version:

1. **Update version in `package.json`**
2. **Login to npm (first time only):**
   ```bash
   npm login
   ```
3. **Publish to npm:**
   ```bash
   npm publish
   ```

The package is configured to publish to the public npm registry.

---

## Package Information

- **Version**: 2.0.0
- **Node Version**: >=18 (tested on v22.14.0)
- **ESLint**: ^9.0.0
- **License**: See repository

## Support

For issues or questions, please open an issue in the [GitHub repository](https://github.com/dream-lab-ai/pam-eslint-config).