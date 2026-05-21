const fs = require('fs');
const path = require('path');
const { buildComposerResult, sanitizeProjectName } = require('./composer');
const { generateProjectFromComposerResult } = require('./project-generator');
const { zipGeneratedProject } = require('./zipper');

const BACKEND_ROOT = path.resolve(__dirname, '..');
const TEMP_OUTPUT_ROOT = path.resolve(BACKEND_ROOT, 'output/temp');
const ZIP_OUTPUT_ROOT = path.resolve(BACKEND_ROOT, 'output/zips');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function checkTsFullOptionsCase(runId) {
  const inputProjectName = `My App ${runId}!`;
  const expectedProjectName = sanitizeProjectName(inputProjectName);
  const composed = buildComposerResult({
    projectName: inputProjectName,
    language: 'ts',
    styling: 'tailwind',
    useVitest: true,
    useZustand: true,
    useLucide: true,
    usePrettier: true,
  });

  assert(composed.ok, 'TS full options case should succeed.');
  assert(composed.result.projectName === expectedProjectName, 'projectName sanitize failed for TS case.');
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
  const projectDir = path.resolve(TEMP_OUTPUT_ROOT, expectedProjectName);
  assert(generated.outputPath === projectDir, 'TS case output path mismatch.');
  assert(fs.existsSync(projectDir), 'TS case project directory should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'package.json')), 'TS case package.json should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'README.md')), 'TS case README.md should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'tailwind.config.js')), 'TS case tailwind config should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'vitest.config.ts')), 'TS case vitest config should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'src/App.test.tsx')), 'TS case App.test.tsx should exist.');

  const zipped = await zipGeneratedProject(projectDir, composed.result.projectName);
  const expectedZipFileName = expectedProjectName + '.zip';
  const expectedZip = path.resolve(ZIP_OUTPUT_ROOT, expectedZipFileName);
  assert(zipped.zipPath === expectedZip, 'TS case zip path mismatch.');
  assert(zipped.zipFileName === expectedZipFileName, 'TS case zip filename mismatch.');
  assert(zipped.sizeBytes > 0, 'TS case zip size should be greater than 0.');
  assert(fs.existsSync(expectedZip), 'TS case zip file should exist.');
}

async function checkJsBaseOnlyCase(runId) {
  const inputProjectName = `../bad-${runId}`;
  const expectedProjectName = sanitizeProjectName(inputProjectName);
  const composed = buildComposerResult({
    projectName: inputProjectName,
    language: 'js',
    styling: 'css',
    useVitest: false,
    useZustand: false,
    useLucide: false,
    usePrettier: false,
  });

  assert(composed.ok, 'JS base-only case should succeed.');
  assert(composed.result.projectName === expectedProjectName, 'projectName sanitize failed for JS case.');
  assert(composed.result.baseTemplate.id === 'js', 'JS case should select js base.');
  assert(composed.result.selectedOptions.length === 0, 'JS base-only should have no selected options.');
  assert(
    composed.result.files.includes('templates/base/js/src/main.jsx'),
    'JS case must include base js files.',
  );

  const generated = generateProjectFromComposerResult(composed.result);
  const projectDir = path.resolve(TEMP_OUTPUT_ROOT, expectedProjectName);
  assert(generated.outputPath === projectDir, 'JS case output path mismatch.');
  assert(fs.existsSync(projectDir), 'JS case project directory should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'package.json')), 'JS case package.json should exist.');
  assert(fs.existsSync(path.resolve(projectDir, 'README.md')), 'JS case README.md should exist.');
  assert(!fs.existsSync(path.resolve(projectDir, 'tailwind.config.js')), 'JS case should not have tailwind config.');
  assert(!fs.existsSync(path.resolve(projectDir, 'vitest.config.js')), 'JS case should not have vitest config.');
  assert(!fs.existsSync(path.resolve(projectDir, 'src/App.test.jsx')), 'JS case should not have App.test.jsx.');

  const zipped = await zipGeneratedProject(projectDir, composed.result.projectName);
  const expectedZipFileName = expectedProjectName + '.zip';
  const expectedZip = path.resolve(ZIP_OUTPUT_ROOT, expectedZipFileName);
  assert(zipped.zipPath === expectedZip, 'JS case zip path mismatch.');
  assert(zipped.zipFileName === expectedZipFileName, 'JS case zip filename mismatch.');
  assert(zipped.sizeBytes > 0, 'JS case zip size should be greater than 0.');
  assert(fs.existsSync(expectedZip), 'JS case zip file should exist.');
}

function checkSanitizeDefaults() {
  assert(sanitizeProjectName('') === 'my-react-app', 'Empty projectName should default.');
}

async function main() {
  const runId = String(Date.now());
  await checkTsFullOptionsCase(runId);
  await checkJsBaseOnlyCase(runId);
  checkSanitizeDefaults();
  console.log('composer check passed');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
