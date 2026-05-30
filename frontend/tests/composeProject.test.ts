import { describe, it, expect } from 'vitest';
import { composeProject } from '../src/composer/composeProject';
import type { ComposerSelection } from '../src/types/composer';

function createSelection(
  overrides: Partial<ComposerSelection> = {}
): ComposerSelection {
  return {
    projectName: 'test-app',
    language: 'ts',
    styling: 'css',
    selectedLibraries: [],
    ...overrides,
  };
}

describe('composeProject', () => {
  it('기본 TypeScript 프로젝트를 생성한다', () => {
    const result = composeProject(createSelection());

    expect(result.isGeneratable).toBe(true);

    const packageFile = result.files.find(
      (file) => file.path === 'package.json'
    );

    expect(packageFile).toBeDefined();

    const packageJson = JSON.parse(packageFile!.content);

    expect(packageJson.name).toBe('test-app');
    expect(packageJson.dependencies.react).toBeDefined();
    expect(packageJson.dependencies['react-dom']).toBeDefined();

    const filePaths = result.files.map((file) => file.path);

    expect(filePaths).toContain('package.json');
    expect(filePaths).toContain('README.md');
    expect(filePaths).toContain('SETUP_REPORT.md');
    expect(filePaths).toContain('composer.config.json');
  });

  it('Tailwind 선택 시 관련 설정 파일과 의존성을 추가한다', () => {
    const result = composeProject(
      createSelection({
        styling: 'tailwind',
      })
    );

    expect(result.packageJsonData.devDependencies).toHaveProperty(
      'tailwindcss'
    );
    expect(result.packageJsonData.devDependencies).toHaveProperty(
      'postcss'
    );

    const filePaths = result.files.map((file) => file.path);

    expect(filePaths).toContain('tailwind.config.js');
    expect(filePaths).toContain('postcss.config.js');
  });

  it('Vitest와 Zustand 설정을 함께 병합한다', () => {
    const result = composeProject(
      createSelection({
        selectedLibraries: ['vitest', 'zustand'],
      })
    );

    expect(result.packageJsonData.scripts).toHaveProperty('test');
    expect(result.packageJsonData.dependencies).toHaveProperty(
      'zustand'
    );
    expect(result.packageJsonData.devDependencies).toHaveProperty(
      'vitest'
    );

    const filePaths = result.files.map((file) => file.path);

    expect(filePaths).toContain('vitest.config.ts');
    expect(filePaths).toContain('src/stores/useCounterStore.ts');
  });

  it('setupDiff에 추가된 항목을 반영한다', () => {
    const result = composeProject(
      createSelection({
        styling: 'tailwind',
        selectedLibraries: ['zustand', 'vitest'],
      })
    );

    expect(result.setupDiff.dependencies).toContain('zustand');
    expect(result.setupDiff.devDependencies).toContain('vitest');
    expect(result.setupDiff.scripts).toContain('test: vitest');
  });
});