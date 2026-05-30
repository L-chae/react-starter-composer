import type { GeneratedFile, PackageJsonData, LibraryId } from '../types/composer';
import { DEPENDENCY_VERSIONS } from './dependencyVersions';
import { getVitestConfigTemplate, getVitestSetupTemplate } from '../templates/vitest';
import { getZustandStoreTemplate } from '../templates/zustand';
import { getPrettierrcTemplate } from '../templates/prettier';

export interface LibraryRule {
  id: LibraryId;
  apply: (draftFiles: GeneratedFile[], draftPackageJson: PackageJsonData) => void;
}

// OCP 적용: 새로운 라이브러리가 추가되어도 이 객체에 데이터만 추가하면 됩니다. 엔진 수정 불필요.
export const libraryRules: Record<LibraryId, LibraryRule> = {
  vitest: {
    id: 'vitest',
    apply: (files, pkg) => {
      pkg.devDependencies!['vitest'] = DEPENDENCY_VERSIONS.vitest;
      pkg.devDependencies!['jsdom'] = DEPENDENCY_VERSIONS.jsdom;
      pkg.devDependencies!['@testing-library/react'] = DEPENDENCY_VERSIONS['@testing-library/react'];
      pkg.devDependencies!['@testing-library/jest-dom'] = DEPENDENCY_VERSIONS['@testing-library/jest-dom'];
      
      pkg.scripts!['test'] = 'vitest';
      pkg.scripts!['test:coverage'] = 'vitest --coverage';
      
      files.push({ path: 'vitest.config.ts', reason: 'Vitest 설정', content: getVitestConfigTemplate() });
      files.push({ path: 'src/setupTests.ts', reason: '테스트 환경 초기화', content: getVitestSetupTemplate() });
    }
  },
  zustand: {
    id: 'zustand',
    apply: (files, pkg) => {
      pkg.dependencies!['zustand'] = DEPENDENCY_VERSIONS.zustand;
      files.push({ path: 'src/stores/useCounterStore.ts', reason: 'Zustand 전역 스토어', content: getZustandStoreTemplate() });
    }
  },
  lucide: {
    id: 'lucide',
    apply: (_, pkg) => {
      pkg.dependencies!['lucide-react'] = DEPENDENCY_VERSIONS['lucide-react'];
    }
  },
  prettier: {
    id: 'prettier',
    apply: (files, pkg) => {
      pkg.devDependencies!['prettier'] = DEPENDENCY_VERSIONS.prettier;
      pkg.scripts!['format'] = 'prettier --write .';
      files.push({ path: '.prettierrc', reason: 'Prettier 설정', content: getPrettierrcTemplate() });
    }
  }
};