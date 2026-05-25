# Templates Guide

This folder contains composition-ready template pieces for React Starter Composer.

## base template role

- `base/js` and `base/ts` are the starting skeletons.
- Composer picks one base first (by language) and then applies options.

## option template role

- `options/*` contains additive file fragments (styling, testing, state, icons, formatting).
- Some options include both `js` and `ts` variants so the composer can choose by language.

## manifest.json role

- `manifest.json` is the source of truth for option metadata.
- It lists:
  - option id/label/category
  - files to copy
  - dependencies/devDependencies
  - scripts to merge
  - install command hints

## planned composer flow

1. Read selected language and options from request.
2. Copy matching base template.
3. Apply selected option files.
4. Merge package scripts/dependency metadata from manifest.
5. Pass assembled result to the next phase (zip generation, not implemented here).
