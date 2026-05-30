import type { PackageJsonData } from "../types/composer";

interface GeneratedFileTreeProps {
  preview: {
    stacks: string[];
    fileTree: string;
    packageJsonData: PackageJsonData;
  };
}

const KEY_FILES: { name: string; role: string }[] = [
  { name: 'vite.config.ts', role: '빌드 엔진 — 개발 서버와 번들링 동작을 설정합니다.' },
  { name: 'tailwind.config.js', role: '디자인 테마 — 색상, 폰트 등 스타일 토큰을 정의합니다.' },
  { name: 'src/main.tsx', role: '앱 진입점 — React 앱을 DOM에 마운트하는 시작 지점입니다.' },
  { name: 'src/App.tsx', role: '루트 컴포넌트 — 화면을 구성하는 최상위 UI입니다.' },
  { name: 'package.json', role: '프로젝트 명세 — 의존성과 실행 스크립트를 관리합니다.' },
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
        <ul className="flex flex-col divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
          {KEY_FILES.map((file) => (
            <li key={file.name} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 hover:bg-gray-50 transition-colors">
              <code className="shrink-0 text-xs font-bold font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded-md sm:w-44">
                {file.name}
              </code>
              <span className="text-sm text-gray-600 leading-relaxed">{file.role}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
