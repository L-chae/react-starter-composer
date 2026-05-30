import type { ComposerSelection } from '../types/composer';

export function createComposerConfig(selection: ComposerSelection) {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    selection: selection,
  };
}