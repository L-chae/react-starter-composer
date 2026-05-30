import type { PackageJsonData, Language } from '../types/composer';
import { DEPENDENCY_VERSIONS } from '../rules/dependencyVersions';

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
      react: DEPENDENCY_VERSIONS.react,
      'react-dom': DEPENDENCY_VERSIONS['react-dom'],
    },
    devDependencies: {
      vite: DEPENDENCY_VERSIONS.vite,
      '@vitejs/plugin-react': DEPENDENCY_VERSIONS['@vitejs/plugin-react'],
    },
  };
}