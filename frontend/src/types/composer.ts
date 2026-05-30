export type Language = 'js' | 'ts';
export type Styling = 'css' | 'tailwind';

export type LibraryId =
  | 'zustand'
  | 'lucide'
  | 'vitest'
  | 'prettier';

export type IssueType = 'error' | 'warning';

// 상태 관리(Zustand)에 저장될 유일한 원천 데이터
export type ComposerSelection = {
  projectName: string;
  language: Language;
  styling: Styling;
  selectedLibraries: LibraryId[];
};

export type GeneratedFile = {
  path: string;
  content: string;
  reason: string; // SETUP_REPORT.md 생성에 사용될 이유
};

// 동적 객체 조작을 위한 타입
export type PackageJsonData = {
  name: string;
  version: string;
  private?: boolean;
  type?: 'module' | 'commonjs';
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  // 명시되지 않은 기타 속성 확장을 허용하되, any 대신 unknown 사용
  [key: string]: unknown; 
};

export type ComposerConfigData = {
  schemaVersion: number;
  generatedAt: string;
  selection: ComposerSelection;
};
export type ComposeIssue = {
  type: IssueType;
  message: string;
};

// composeProject 함수가 반환하는 최종 파생 결과물
export type ComposerResult = {
  projectName: string;
  language: Language;
  styling: Styling;
  selectedLibraries: LibraryId[];
  files: GeneratedFile[];
  packageJsonData: PackageJsonData;
  composerConfigData: ComposerConfigData;
  setupDiff: {
    files: string[];
    dependencies: string[];
    devDependencies: string[];
    scripts: string[];
  };
  issues: ComposeIssue[];
  isGeneratable: boolean;
};