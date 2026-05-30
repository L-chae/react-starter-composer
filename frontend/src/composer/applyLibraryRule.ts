import type { GeneratedFile, PackageJsonData, LibraryId } from '../types/composer';
import { getVitestConfigTemplate, getVitestSetupTemplate } from '../templates/vitest';
import { getZustandStoreTemplate } from '../templates/zustand';
import { getPrettierrcTemplate } from '../templates/prettier';

interface ApplyLibraryParams {
  draftFiles: GeneratedFile[];
  draftPackageJson: PackageJsonData;
  libraryId: LibraryId;
}

export function applyLibraryRule({ draftFiles, draftPackageJson, libraryId }: ApplyLibraryParams): void {
  if (!draftPackageJson.scripts) draftPackageJson.scripts = {};
  if (!draftPackageJson.dependencies) draftPackageJson.dependencies = {};
  if (!draftPackageJson.devDependencies) draftPackageJson.devDependencies = {};

  const scripts = draftPackageJson.scripts;
  const dependencies = draftPackageJson.dependencies;
  const devDependencies = draftPackageJson.devDependencies;

  if (libraryId === 'vitest') {
    devDependencies['vitest'] = '^2.0.5';
    devDependencies['jsdom'] = '^24.1.1';
    devDependencies['@testing-library/react'] = '^16.0.0';
    devDependencies['@testing-library/jest-dom'] = '^6.4.8';

    scripts['test'] = 'vitest';
    scripts['test:coverage'] = 'vitest --coverage';

    draftFiles.push({ path: 'vitest.config.ts', reason: 'Vitest 실행 설정', content: getVitestConfigTemplate() });
    draftFiles.push({ path: 'src/setupTests.ts', reason: '테스트 환경 초기화', content: getVitestSetupTemplate() });
  }

  if (libraryId === 'zustand') {
    dependencies['zustand'] = '^4.5.4';
    draftFiles.push({ path: 'src/stores/useCounterStore.ts', reason: 'Zustand 전역 스토어 예시', content: getZustandStoreTemplate() });
  }

  if (libraryId === 'lucide') {
    dependencies['lucide-react'] = '^0.427.0';
  }

  if (libraryId === 'prettier') {
    devDependencies['prettier'] = '^3.3.3';
    scripts['format'] = 'prettier --write .';
    draftFiles.push({ path: '.prettierrc', reason: 'Prettier 규칙 설정', content: getPrettierrcTemplate() });
  }
}