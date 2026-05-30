import type { PackageJsonData } from "../types/composer";

interface GeneratedFileTreeProps {
  preview: {
    stacks: string[];
    fileTree: string;
    packageJsonData: PackageJsonData;
  };
}

const KEY_FILES: { name: string; role: string; detail: string }[] = [
  {
    name: 'vite.config.ts',
    role: '빌드 엔진 — 개발 서버와 번들링 동작을 설정합니다.',
    detail: 'Vite의 플러그인(React, Tailwind 등)과 dev 서버 포트, 별칭(alias), 빌드 출력 경로를 정의합니다. 이 파일을 수정하면 개발 환경과 최종 빌드 결과물의 동작이 바뀝니다.',
  },
  {
    name: 'tailwind.config.js',
    role: '디자인 테마 — 색상, 폰트 등 스타일 토큰을 정의합니다.',
    detail: 'theme.extend 안에서 색상, 폰트, 간격 같은 디자인 토큰을 확장합니다. content 경로에 등록된 파일에서 사용된 클래스만 최종 CSS에 포함되어 번들 크기가 최적화됩니다.',
  },
  {
    name: 'src/main.tsx',
    role: '앱 진입점 — React 앱을 DOM에 마운트하는 시작 지점입니다.',
    detail: 'createRoot로 index.html의 #root 엘리먼트를 찾아 <App />을 렌더링합니다. 전역 CSS import와 StrictMode 같은 최상위 래퍼도 보통 이곳에서 적용됩니다.',
  },
  {
    name: 'src/App.tsx',
    role: '루트 컴포넌트 — 화면을 구성하는 최상위 UI입니다.',
    detail: '라우팅, 레이아웃, 전역 Provider 등 화면의 뼈대를 구성합니다. 실제 기능 컴포넌트들은 이 App 아래에 트리 형태로 조합되어 렌더링됩니다.',
  },
  {
    name: 'package.json',
    role: '프로젝트 명세 — 의존성과 실행 스크립트를 관리합니다.',
    detail: 'dependencies/devDependencies로 설치할 패키지를, scripts로 dev·build·test 명령을 정의합니다. npm install이 이 파일을 기준으로 node_modules를 구성합니다.',
  },
];

export function GeneratedFileTree({ preview }: GeneratedFileTreeProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">

      {/* 1. 선택된 스택 (배지 형태) */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">선택된 스택</h3>
        <div className="flex flex-wrap gap-2">
          {preview.stacks.map((stack) => (
            <span key={stack} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
              {stack}
            </span>
          ))}
        </div>
      </div>

      {/* 2. 가상 파일 트리 (다크모드 터미널 스타일) */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">가상 파일 트리</h3>
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <pre className="p-4 text-sm text-gray-300 font-mono overflow-x-auto leading-relaxed">
            {preview.fileTree}
          </pre>
        </div>
      </div>

      {/* 3. package.json 결과물 (다크모드 터미널 스타일) */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">실시간 package.json</h3>
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <pre className="p-4 text-sm text-[#a5b4fc] font-mono overflow-x-auto leading-relaxed">
            {JSON.stringify(preview.packageJsonData, null, 2)}
          </pre>
        </div>
      </div>

      {/* 4. 학습 패널: 핵심 파일 이해하기 */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">📁 핵심 파일 이해하기</h3>
        <div className="flex flex-col divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
          {KEY_FILES.map((file) => (
            <details key={file.name} className="group">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
                <code className="shrink-0 text-xs font-bold font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                  {file.name}
                </code>
                <span className="flex-1 text-sm text-gray-600 leading-relaxed">{file.role}</span>
                <svg
                  className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="grid grid-rows-[1fr] px-4 pb-4 pl-4">
                <p className="border-l-2 border-blue-100 pl-3 text-sm leading-relaxed text-gray-500">
                  {file.detail}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>

    </div>
  );
}
