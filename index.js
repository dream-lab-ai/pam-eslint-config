const fs = require('fs');
const path = require('path');
const baseConfig = require('./presets/base');
const vitestConfig = require('./presets/vitest');
const reactConfig = require('./presets/react');
const testingLibraryConfig = require('./presets/testingLibrary');

// Helper function to check if a package exists
function hasPackage(packageName) {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      return false;
    }
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return !!(
      (packageJson.dependencies && packageJson.dependencies[packageName]) ||
      (packageJson.devDependencies && packageJson.devDependencies[packageName])
    );
  } catch {
    return false;
  }
}

// Build the config array based on what's installed
const configs = [...baseConfig];

// Add Vitest config if vitest is installed
if (hasPackage('vitest')) {
  configs.push(...vitestConfig);
}

// Add React configs if react is installed
if (hasPackage('react')) {
  configs.push(...reactConfig);

  // Add testing-library config if both react and testing-library are present
  if (hasPackage('@testing-library/react')) {
    configs.push(...testingLibraryConfig);
  }
}

module.exports = configs;
