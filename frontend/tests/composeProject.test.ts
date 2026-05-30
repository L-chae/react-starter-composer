import { describe, it, expect } from 'vitest';
import { composeProject } from '../src/composer/composeProject';
import type { ComposerSelection } from '../src/types/composer';

describe('composeProject 엔진 테스트', () => {
  it('기본 설정으로 조립 시 필수 파일(package.json, index.html, main)이 생성되어야 한다', () => {
    const mockSelection: ComposerSelection = {
      projectName: 'test-app',
      language: 'ts',
      styling: 'css',
      selectedLibraries: []
    };

    const result = composeProject(mockSelection);

    expect(result.projectName).toBe('test-app');
    
    // 파일 생성 여부 검증
    const filePaths = result.files.map(f => f.path);
    expect(filePaths).toContain('package.json');
    expect(filePaths).toContain('index.html');
    expect(filePaths).toContain('src/main.tsx');
  });

  it('라이브러리(Zustand) 선택 시 해당 룰이 정상 적용되어 파일이 추가되어야 한다', () => {
    const mockSelection: ComposerSelection = {
      projectName: 'test-app',
      language: 'ts',
      styling: 'css',
      selectedLibraries: ['zustand']
    };

    const result = composeProject(mockSelection);
    
    // Zustand 스토어 파일이 주입되었는지 확인
    const filePaths = result.files.map(f => f.path);
    expect(filePaths).toContain('src/stores/useCounterStore.ts');
    expect(result.packageJsonData.dependencies?.['zustand']).toBeDefined();
  });
});