import type { GeneratedFile, PackageJsonData, Language } from '../types/composer';
import { createPackageJsonData } from './createPackageJsonData';

export function createSetupDiff(
  projectName: string,
  language: Language,
  files: GeneratedFile[],
  currentPackageJson: PackageJsonData
) {
  // 기준점(Base)이 되는 기본 패키지 정보 생성
  const basePackageJson = createPackageJsonData(projectName, language);

  const getDiff = (current: Record<string, string> = {}, base: Record<string, string> = {}) => {
    return Object.keys(current).filter((key) => !base[key]);
  };

  const getScriptDiff = (current: Record<string, string> = {}, base: Record<string, string> = {}) => {
    return Object.entries(current)
      .filter(([key]) => !base[key])
      .map(([key, value]) => `${key}: ${value}`);
  };

  return {
    files: files.map(f => f.path),
    dependencies: getDiff(currentPackageJson.dependencies, basePackageJson.dependencies),
    devDependencies: getDiff(currentPackageJson.devDependencies, basePackageJson.devDependencies),
    scripts: getScriptDiff(currentPackageJson.scripts, basePackageJson.scripts),
  };
}