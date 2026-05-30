import type { GeneratedFile, PackageJsonData, Styling } from '../types/composer';
import { 
  getTailwindConfigTemplate, 
  getPostcssConfigTemplate, 
  getTailwindCssTemplate, 
  getBasicCssTemplate 
} from '../templates/styling';

interface ApplyStylingParams {
  draftFiles: GeneratedFile[];
  draftPackageJson: PackageJsonData;
  styling: Styling;
}

/**
 * 스타일링 도구 적용
 */
export function applyStyling({ draftFiles, draftPackageJson, styling }: ApplyStylingParams): void {
  
  if (styling === 'tailwind') {
    if (!draftPackageJson.devDependencies) draftPackageJson.devDependencies = {};
    draftPackageJson.devDependencies['tailwindcss'] = '^3.4.10';
    draftPackageJson.devDependencies['postcss'] = '^8.4.41';
    draftPackageJson.devDependencies['autoprefixer'] = '^10.4.20';

    draftFiles.push({
      path: 'tailwind.config.js',
      reason: 'Tailwind CSS 설정 파일',
      content: getTailwindConfigTemplate(),
    });

    draftFiles.push({
      path: 'postcss.config.js',
      reason: 'PostCSS 설정 파일 (Tailwind 빌드용)',
      content: getPostcssConfigTemplate(),
    });

    draftFiles.push({
      path: 'src/index.css',
      reason: '글로벌 스타일시트 (Tailwind 지시어 포함)',
      content: getTailwindCssTemplate(),
    });

  } else if (styling === 'css') {
    draftFiles.push({
      path: 'src/index.css',
      reason: '글로벌 스타일시트 (기본)',
      content: getBasicCssTemplate(),
    });
  }
}