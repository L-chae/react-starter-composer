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

import { createPackageJsonData } from './createPackageJsonData';

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
  const packageJsonData = createPackageJsonData(selection.projectName, selection.language);

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
    // TypeScript 설치
    packageJsonData.devDependencies["typescript"] = "^5.5.3";
    // React 타입 설치
    packageJsonData.devDependencies["@types/react"] = "^18.3.3";
    // ReactDOM 타입 설치
    packageJsonData.devDependencies["@types/react-dom"] = "^18.3.0";

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
  // 8. 최종 결과 반환
  // =====================================================
  return {
    // 프로젝트 이름
    projectName: selection.projectName,

    // JS 또는 TS
    language: selection.language,

    // CSS 또는 Tailwind
    styling: selection.styling,

    // 선택한 라이브러리 목록
    selectedLibraries: selection.selectedLibraries,

    files, // 생성된 파일 목록

    // package.json 객체 상태
    // Preview 화면에서 사용 가능
    packageJsonData,

    // 추후 composer 설정 저장용
    composerConfigData: {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(), // 생성된 현재 시간 기록
      selection: selection, // 사용자의 원천 선택 데이터
    },

    // 어떤 변경이 발생했는지 추적
    setupDiff: {
      files: [],
      dependencies: [],
      devDependencies: [],
      scripts: [],
    },
    issues, // 오류/경고 목록
    // 에러가 하나도 없으면 true
    isGeneratable: issues.every((issue) => issue.type !== "error"),
  };
}
