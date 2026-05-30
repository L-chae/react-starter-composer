import type { GeneratedFile, PackageJsonData, Styling } from '../types/composer';

interface ApplyStylingParams {
  draftFiles: GeneratedFile[];
  draftPackageJson: PackageJsonData;
  styling: Styling;
}

/**
 * [파이프라인 2] 스타일링 도구 적용
 * 원본 데이터를 직접 수정(Mutation)하여 파일과 의존성을 추가합니다.
 */
export function applyStyling({ draftFiles, draftPackageJson, styling }: ApplyStylingParams): void {
  
  if (styling === 'tailwind') {
    // 1. Tailwind 관련 패키지 주입
    if (!draftPackageJson.devDependencies) draftPackageJson.devDependencies = {};
    draftPackageJson.devDependencies['tailwindcss'] = '^3.4.10';
    draftPackageJson.devDependencies['postcss'] = '^8.4.41';
    draftPackageJson.devDependencies['autoprefixer'] = '^10.4.20';

    // 2. tailwind.config.js 파일 생성
    draftFiles.push({
      path: 'tailwind.config.js',
      reason: 'Tailwind CSS 설정 파일',
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
    });

    // 3. postcss.config.js 파일 생성
    draftFiles.push({
      path: 'postcss.config.js',
      reason: 'PostCSS 설정 파일 (Tailwind 빌드용)',
      content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,
    });

    // 4. 최상위 CSS 파일에 Tailwind 지시어 추가
    draftFiles.push({
      path: 'src/index.css',
      reason: '글로벌 스타일시트 (Tailwind 지시어 포함)',
      content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`,
    });

  } else if (styling === 'css') {
    // 순수 CSS를 선택한 경우 기본 CSS 파일만 생성
    draftFiles.push({
      path: 'src/index.css',
      reason: '글로벌 스타일시트 (기본)',
      content: `body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
`,
    });
  }
}