import type { GeneratedFile, PackageJsonData, LibraryId } from '../types/composer';
import { libraryRules } from '../rules/libraryRules';

interface ApplyLibraryParams {
  draftFiles: GeneratedFile[];
  draftPackageJson: PackageJsonData;
  libraryId: LibraryId;
}

/**
 * [파이프라인 3] 선택된 라이브러리의 Rule을 읽어와 프로젝트에 주입합니다.
 */
export function applyLibraryRule({ draftFiles, draftPackageJson, libraryId }: ApplyLibraryParams): void {
  // 방어 코드: 객체가 없으면 초기화
  if (!draftPackageJson.scripts) draftPackageJson.scripts = {};
  if (!draftPackageJson.dependencies) draftPackageJson.dependencies = {};
  if (!draftPackageJson.devDependencies) draftPackageJson.devDependencies = {};

  // OCP 준수: 규칙 사전에 정의된 라이브러리라면, apply 함수를 실행하여 위임함
  const rule = libraryRules[libraryId];
  if (rule) {
    rule.apply(draftFiles, draftPackageJson);
  }
}