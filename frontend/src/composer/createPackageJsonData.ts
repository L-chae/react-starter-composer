import type { PackageJsonData, Language } from '../types/composer';

/**
 * 프로젝트 기본 package.json 객체를 생성합니다.
 */
export function createPackageJsonData(projectName: string, language: Language): PackageJsonData {
  const isTs = language === 'ts';

  return {
    name: projectName,
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: isTs ? 'tsc -b && vite build' : 'vite build',
      preview: 'vite preview',
    },
    dependencies: {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
    },
    devDependencies: {
      vite: '^5.4.1',
      '@vitejs/plugin-react': '^4.3.1',
    },
  };
}