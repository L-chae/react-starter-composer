const { buildComposerResult, sanitizeProjectName } = require('./composer');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkTsFullOptionsCase() {
  const response = buildComposerResult({
    projectName: 'My App!',
    language: 'ts',
    styling: 'tailwind',
    useVitest: true,
    useZustand: true,
    useLucide: true,
    usePrettier: true,
  });

  assert(response.ok, 'TS full options case should succeed.');
  assert(response.result.projectName === 'my-app', 'projectName sanitize failed for TS case.');
  assert(response.result.baseTemplate.id === 'ts', 'TS case should select ts base.');
  assert(
    response.result.selectedOptions.join(',') === 'tailwind,vitest,zustand,lucide,prettier',
    'TS case selected options mismatch.',
  );
  assert(
    response.result.files.includes('templates/options/vitest/ts/vitest.config.ts'),
    'TS case must include vitest ts file.',
  );
  assert(
    !response.result.files.includes('templates/options/vitest/js/vitest.config.js'),
    'TS case must not include vitest js file.',
  );
}

function checkJsBaseOnlyCase() {
  const response = buildComposerResult({
    projectName: '../bad',
    language: 'js',
    styling: 'css',
    useVitest: false,
    useZustand: false,
    useLucide: false,
    usePrettier: false,
  });

  assert(response.ok, 'JS base-only case should succeed.');
  assert(response.result.projectName === 'bad', 'projectName sanitize failed for JS case.');
  assert(response.result.baseTemplate.id === 'js', 'JS case should select js base.');
  assert(response.result.selectedOptions.length === 0, 'JS base-only should have no selected options.');
  assert(
    response.result.files.includes('templates/base/js/src/main.jsx'),
    'JS case must include base js files.',
  );
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
