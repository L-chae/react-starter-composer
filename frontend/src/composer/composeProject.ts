// types/composer.ts 파일에서 타입만 가져옴
// import type을 사용하면 컴파일 후 JS 코드에는 포함되지 않음
import type {
  ComposerSelection,
  ComposerResult,
  GeneratedFile,
} from "../types/composer";

import { applyStyling } from "./applyStyling";
import { applyLibraryRule } from "./applyLibraryRule";
import {
  getIndexHtmlTemplate,
  getViteConfigTemplate,
  getMainEntryTemplate,
  getAppTemplate,
  getTsConfigNodeTemplate,
  getTsConfigTemplate,
} from "../templates/base";

import { createPackageJsonData } from "./createPackageJsonData";
import { DEPENDENCY_VERSIONS } from "../rules/dependencyVersions";
import { createComposerConfig } from './createComposerConfig';
import { createSetupDiff } from './createSetupDiff';
import { getReadmeTemplate, getSetupReportTemplate } from '../templates/docs';
/**
 * 프로젝트 생성기 핵심 함수
 * 사용자가 선택한 옵션을 받아서
 * package.json 데이터와 생성할 파일 목록을 조립한다.
 */
export function composeProject(selection: ComposerSelection): ComposerResult {
  // =====================================================
  // 1. package.json 기본 데이터 생성
  // =====================================================
  // 최종적으로 package.json이 될 객체
  const packageJsonData = createPackageJsonData(
    selection.projectName,
    selection.language,
  );

  // =====================================================
  // 2. 생성될 파일 목록
  // =====================================================
  // 최종적으로 생성할 파일들을 저장
  const files: GeneratedFile[] = [];

  // =====================================================
  // 3. 경고 및 오류 저장
  // =====================================================
  const issues: {
    type: "error" | "warning";
    message: string;
  }[] = [];
  // =====================================================
  // 4. 언어(JS / TS) 설정 및 React 기본 뼈대 적용
  // =====================================================
  const isTs = selection.language === "ts";
  const ext = isTs ? "tsx" : "jsx";
  const scriptExt = isTs ? "ts" : "js";

  // 사용자가 TypeScript 선택한 경우 의존성 추가
  if (isTs) {
    if (!packageJsonData.devDependencies) packageJsonData.devDependencies = {};
    // 룰 객체에서 버전 참조
    packageJsonData.devDependencies["typescript"] =
      DEPENDENCY_VERSIONS.typescript;
    packageJsonData.devDependencies["@types/react"] =
      DEPENDENCY_VERSIONS["@types/react"];
    packageJsonData.devDependencies["@types/react-dom"] =
      DEPENDENCY_VERSIONS["@types/react-dom"];
    // TS 설정 파일 주입
    files.push({
      path: "tsconfig.json",
      reason: "TypeScript 메인 컴파일러 설정",
      content: getTsConfigTemplate(),
    });
    files.push({
      path: "tsconfig.node.json",
      reason: "Vite 설정 파일을 위한 TypeScript 설정",
      content: getTsConfigNodeTemplate(),
    });
  }

  // 템플릿 폴더에서 순수 문자열을 가져와 파일 바구니에 주입 (이 부분이 누락되었었음!)
  files.push({
    path: "index.html",
    reason: "React 앱 진입점 HTML",
    content: getIndexHtmlTemplate(ext),
  });
  files.push({
    path: `vite.config.${scriptExt}`,
    reason: "Vite 번들러 기본 설정",
    content: getViteConfigTemplate(),
  });
  files.push({
    path: `src/main.${ext}`,
    reason: "React 렌더링 엔트리 파일",
    content: getMainEntryTemplate(isTs, ext),
  });
  files.push({
    path: `src/App.${ext}`,
    reason: "루트 컴포넌트",
    content: getAppTemplate(),
  });

  // =====================================================
  // 5. 스타일링 적용
  // =====================================================
  // 예:
  // Tailwind 선택 시
  // package.json 의존성 추가
  // tailwind.config.js 생성

  applyStyling({
    draftFiles: files,
    draftPackageJson: packageJsonData,
    styling: selection.styling,
  });

  // =====================================================
  // 6. 선택 라이브러리 적용
  // =====================================================
  // 예:
  // React Router
  // Zustand
  // TanStack Query
  //
  // 각각 설치 정보 추가
  selection.selectedLibraries.forEach((libId) => {
    applyLibraryRule({
      draftFiles: files,
      draftPackageJson: packageJsonData,
      libraryId: libId,
    });
  });

  // =====================================================
  // 7. package.json 파일 생성
  // =====================================================
  files.push({
    // 생성될 파일 경로
    path: "package.json",

    // 객체 → JSON 문자열 변환
    content: JSON.stringify(packageJsonData, null, 2) + "\n",

    // 파일 생성 이유
    reason: "프로젝트 핵심 설정 및 의존성 파일",
  });

// =====================================================
  // 8. 문서 및 메타데이터 주입 (최종 직렬화)
  // =====================================================
  const composerConfigData = createComposerConfig(selection);
  const setupDiff = createSetupDiff(selection.projectName, selection.language, files, packageJsonData);

  // 객체로 관리하던 JSON 데이터들을 문자열로 변환하여 파일 트리에 추가 (v2 기획안 준수)
  files.push({
    path: 'package.json',
    reason: '프로젝트 의존성 및 스크립트 명세',
    content: JSON.stringify(packageJsonData, null, 2) + '\n'
  });

  files.push({
    path: 'composer.config.json',
    reason: '환경 복원을 위한 메타데이터',
    content: JSON.stringify(composerConfigData, null, 2) + '\n'
  });

  files.push({
    path: 'README.md',
    reason: '프로젝트 시작 가이드',
    content: getReadmeTemplate(selection.projectName)
  });

  files.push({
    path: 'SETUP_REPORT.md',
    reason: '프로젝트 세팅 상세 리포트',
    content: getSetupReportTemplate(selection, setupDiff)
  });

  // =====================================================
  // 9. 최종 결과 반환
  // =====================================================
  return {
    projectName: selection.projectName,
    language: selection.language,
    styling: selection.styling,
    selectedLibraries: selection.selectedLibraries,
    
    files, 
    packageJsonData,
    composerConfigData,
    setupDiff,
    
    issues,
    isGeneratable: issues.every((issue) => issue.type !== "error"),
  };
}