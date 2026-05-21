const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../..');
const MANIFEST_PATH = path.resolve(REPO_ROOT, 'templates/manifest.json');

function toPosixPath(value) {
  return value.replace(/\\/g, '/');
}

function sanitizeProjectName(projectName) {
  if (typeof projectName !== 'string') {
    return 'my-react-app';
  }

  const normalized = projectName.trim().toLowerCase().replace(/\\/g, '/');
  const pathParts = normalized.split('/').filter(Boolean);
  const lastPart = pathParts.length > 0 ? pathParts[pathParts.length - 1] : normalized;

  const slug = lastPart
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return slug || 'my-react-app';
}

function validateAndNormalizeInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      ok: false,
      errors: ['Request body must be a JSON object.'],
    };
  }

  const errors = [];

  if (!['js', 'ts'].includes(input.language)) {
    errors.push("language must be either 'js' or 'ts'.");
  }

  if (!['css', 'tailwind'].includes(input.styling)) {
    errors.push("styling must be either 'css' or 'tailwind'.");
  }

  if (input.projectName !== undefined && typeof input.projectName !== 'string') {
    errors.push('projectName must be a string when provided.');
  }

  const optionFlags = ['useVitest', 'useZustand', 'useLucide', 'usePrettier'];

  for (const key of optionFlags) {
    if (input[key] !== undefined && typeof input[key] !== 'boolean') {
      errors.push(key + ' must be a boolean.');
    }
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    options: {
      projectName: sanitizeProjectName(input.projectName || ''),
      language: input.language,
      styling: input.styling,
      useVitest: input.useVitest === true,
      useZustand: input.useZustand === true,
      useLucide: input.useLucide === true,
      usePrettier: input.usePrettier === true,
    },
  };
}

function loadManifest() {
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(raw);

  if (!manifest.baseTemplates || !manifest.options) {
    throw new Error('Invalid manifest: missing baseTemplates or options.');
  }

  return manifest;
}

function selectOptionIds(options) {
  const selected = [];

  if (options.styling === 'tailwind') {
    selected.push('tailwind');
  }
  if (options.useVitest) {
    selected.push('vitest');
  }
  if (options.useZustand) {
    selected.push('zustand');
  }
  if (options.useLucide) {
    selected.push('lucide');
  }
  if (options.usePrettier) {
    selected.push('prettier');
  }

  return selected;
}

function filterFilesByLanguage(files, language) {
  return files.filter((file) => {
    const normalized = toPosixPath(file);

    if (normalized.includes('/js/')) {
      return language === 'js';
    }

    if (normalized.includes('/ts/')) {
      return language === 'ts';
    }

    return true;
  });
}

function mergeUnique(list, values) {
  for (const value of values) {
    if (!list.includes(value)) {
      list.push(value);
    }
  }
}

function buildComposerResult(input) {
  const parsed = validateAndNormalizeInput(input);

  if (!parsed.ok) {
    return parsed;
  }

  const manifest = loadManifest();
  const { options } = parsed;
  const base = manifest.baseTemplates[options.language];

  if (!base) {
    return {
      ok: false,
      errors: ['No base template found for language: ' + options.language],
    };
  }

  const baseFiles = (base.files || []).map((file) => toPosixPath(path.posix.join(base.path, file)));

  const basePackagePath = path.resolve(REPO_ROOT, base.path, 'package.json');
  const basePackage = JSON.parse(fs.readFileSync(basePackagePath, 'utf8'));

  const selectedOptionIds = selectOptionIds(options);
  const optionMap = new Map((manifest.options || []).map((option) => [option.id, option]));

  const files = [...baseFiles];
  const dependencies = Object.keys(basePackage.dependencies || {});
  const devDependencies = Object.keys(basePackage.devDependencies || {});
  const scripts = { ...(basePackage.scripts || {}) };
  const installCommands = ['npm install'];
  const missingOptionIds = [];

  for (const optionId of selectedOptionIds) {
    const option = optionMap.get(optionId);

    if (!option) {
      missingOptionIds.push(optionId);
      continue;
    }

    mergeUnique(files, filterFilesByLanguage(option.files || [], options.language));
    mergeUnique(dependencies, option.dependencies || []);
    mergeUnique(devDependencies, option.devDependencies || []);
    Object.assign(scripts, option.scripts || {});
    mergeUnique(installCommands, option.installCommands || []);
  }

  if (missingOptionIds.length > 0) {
    return {
      ok: false,
      errors: ['Missing options in manifest: ' + missingOptionIds.join(', ')],
    };
  }

  return {
    ok: true,
    result: {
      projectName: options.projectName,
      language: options.language,
      baseTemplate: {
        id: options.language,
        path: base.path,
      },
      selectedOptions: selectedOptionIds,
      files,
      dependencies,
      devDependencies,
      scripts,
      installCommands,
    },
  };
}

module.exports = {
  buildComposerResult,
  sanitizeProjectName,
};
