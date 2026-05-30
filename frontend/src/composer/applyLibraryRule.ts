import type { GeneratedFile, PackageJsonData, LibraryId } from '../types/composer';

interface ApplyLibraryParams {
  draftFiles: GeneratedFile[];
  draftPackageJson: PackageJsonData;
  libraryId: LibraryId;
}

/**
 * [파이프라인 3] 개별 라이브러리 설정 주입
 * 각 라이브러리 식별자에 따라 의존성 배열과 가상 설정 파일을 추가합니다.
 */
export function applyLibraryRule({ draftFiles, draftPackageJson, libraryId }: ApplyLibraryParams): void {
  
  // PackageJsonData 타입에서 선택적 필드(Optional)로 선언된 객체들을 안전하게 초기화
  if (!draftPackageJson.scripts) draftPackageJson.scripts = {};
  if (!draftPackageJson.dependencies) draftPackageJson.dependencies = {};
  if (!draftPackageJson.devDependencies) draftPackageJson.devDependencies = {};

  const scripts = draftPackageJson.scripts;
  const dependencies = draftPackageJson.dependencies;
  const devDependencies = draftPackageJson.devDependencies;

  // 1. Vitest (단위 테스트 환경)
  if (libraryId === 'vitest') {
    devDependencies['vitest'] = '^2.0.5';
    devDependencies['jsdom'] = '^24.1.1';
    devDependencies['@testing-library/react'] = '^16.0.0';
    devDependencies['@testing-library/jest-dom'] = '^6.4.8';

    scripts['test'] = 'vitest';
    scripts['test:coverage'] = 'vitest --coverage';

    draftFiles.push({
      path: 'vitest.config.ts',
      reason: 'Vitest 실행 설정 파일',
      content: `import { defineConfig } from 'vitest/config'\n\nexport default defineConfig({\n  test: {\n    environment: 'jsdom',\n    setupFiles: ['./src/setupTests.ts'],\n  }\n})\n`
    });

    draftFiles.push({
      path: 'src/setupTests.ts',
      reason: '테스트 환경 초기화 설정',
      content: `import '@testing-library/jest-dom'\n`
    });
  }

  // 2. Zustand (전역 상태 관리)
  if (libraryId === 'zustand') {
    dependencies['zustand'] = '^4.5.4';

    draftFiles.push({
      path: 'src/stores/useCounterStore.ts',
      reason: 'Zustand 전역 스토어 구현 예시',
      content: `import { create } from 'zustand'\n\ninterface CounterState {\n  count: number\n  inc: () => void\n}\n\nexport const useCounterStore = create<CounterState>((set) => ({\n  count: 0,\n  inc: () => set((state) => ({ count: state.count + 1 })),\n}))\n`
    });
  }

  // 3. Lucide React (아이콘)
  if (libraryId === 'lucide') {
    dependencies['lucide-react'] = '^0.427.0';
  }

  // 4. Prettier (코드 품질 관리)
  if (libraryId === 'prettier') {
    devDependencies['prettier'] = '^3.3.3';
    scripts['format'] = 'prettier --write .';

    draftFiles.push({
      path: '.prettierrc',
      reason: 'Prettier 서식 규칙 파일',
      content: `{\n  "semi": false,\n  "singleQuote": true,\n  "trailingComma": "all"\n}\n`
    });
  }
}