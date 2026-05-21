const fs = require('fs');
const path = require('path');
const { buildComposerResult, sanitizeProjectName } = require('./composer');
const { generateProjectFromComposerResult } = require('./project-generator');

const BACKEND_ROOT = path.resolve(__dirname, '..');
const TEMP_OUTPUT_ROOT = path.resolve(BACKEND_ROOT, 'output/temp');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkTsFullOptionsCase() {
  const composed = buildComposerResult({
    projectName: 'My App!',
    language: 'ts',
    styling: 'tailwind',
    useVitest: true,
    useZustand: true,
    useLucide: true,
    usePrettier: true,
  });

  assert(composed.ok, 'TS full options case should succeed.');
  assert(composed.result.projectName === 'my-app', 'projectName sanitize failed for TS case.');
  assert(composed.result.baseTemplate.id === 'ts', 'TS case should select ts base.');
  assert(
    composed.result.selectedOptions.join(',') === 'tailwind,vitest,zustand,lucide,prettier',
    'TS case selected options mismatch.',
  );
  assert(
    composed.result.files.includes('templates/options/vitest/ts/vitest.config.ts'),
    'TS case must include vitest ts file.',
  );
  assert(
    !composed.result.files.includes('templates/options/vitest/js/vitest.config.js'),
    'TS case must not include vitest js file.',
  );

  const generated = generateProjectFromComposerResult(composed.result);
  const projectDir = path.resolve(TEMP_OUTPUT_ROOT, 'my-app');
  assert(generated.outputPath === projectDir, 'TS case output path mismatch.');
  assert(fs.existsSync(projectDir), 'TS case project directory should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'package.json')), 'TS case package.json should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'README.md')), 'TS case README.md should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'tailwind.config.js')), 'TS case tailwind config should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'vitest.config.ts')), 'TS case vitest config should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'src/App.test.tsx')), 'TS case App.test.tsx should exist.');
}

function checkJsBaseOnlyCase() {
  const composed = buildComposerResult({
    projectName: '../bad',
    language: 'js',
    styling: 'css',
    useVitest: false,
    useZustand: false,
    useLucide: false,
    usePrettier: false,
  });

  assert(composed.ok, 'JS base-only case should succeed.');
  assert(composed.result.projectName === 'bad', 'projectName sanitize failed for JS case.');
  assert(composed.result.baseTemplate.id === 'js', 'JS case should select js base.');
  assert(composed.result.selectedOptions.length === 0, 'JS base-only should have no selected options.');
  assert(
    composed.result.files.includes('templates/base/js/src/main.jsx'),
    'JS case must include base js files.',
  );

  const generated = generateProjectFromComposerResult(composed.result);
  const projectDir = path.resolve(TEMP_OUTPUT_ROOT, 'bad');
  assert(generated.outputPath === projectDir, 'JS case output path mismatch.');
  assert(fs.existsSync(projectDir), 'JS case project directory should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'package.json')), 'JS case package.json should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'README.md')), 'JS case README.md should exist.');
  assert(!fs.existsSync(path.resolve(projectDir, 'tailwind.config.js')), 'JS case should not have tailwind config.');
  assert(!fs.existsSync(path.resolve(projectDir, 'vitest.config.js')), 'JS case should not have vitest config.');
  assert(!fs.existsSync(path.resolve(projectDir, 'src/App.test.jsx')), 'JS case should not have App.test.jsx.');
}

function checkSanitizeDefaults() {
  assert(sanitizeProjectName('') === 'my-react-app', 'Empty projectName should default.');
}

function main() {
  checkTsFullOptionsCase();
  checkJsBaseOnlyCase();
  checkSanitizeDefaults();
  console.log('composer check passed');
}

main();
