import { describe, it, expect } from 'vitest';
import { createPackageJsonData } from '../composer/createPackageJsonData';

describe('createPackageJsonData', () => {
  it('TypeScript 선택 시 build 스크립트에 tsc -b가 포함되어야 한다', () => {
    const result = createPackageJsonData('test-app', 'ts');
    expect(result.scripts?.build).toContain('tsc -b');
  });

  it('JavaScript 선택 시 build 스크립트에 tsc -b가 포함되지 않아야 한다', () => {
    const result = createPackageJsonData('test-app', 'js');
    expect(result.scripts?.build).not.toContain('tsc -b');
  });
});