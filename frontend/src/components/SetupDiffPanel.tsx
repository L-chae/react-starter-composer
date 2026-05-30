import type { ComposerResult } from '../types/composer';

interface SetupDiffPanelProps {
  diff: ComposerResult['setupDiff'];
}

const GETTING_STARTED: { step: string; title: string; desc: string }[] = [
  { step: '1', title: '압축 풀기', desc: '다운로드한 ZIP 파일의 압축을 해제합니다.' },
  { step: '2', title: 'npm install', desc: '프로젝트 폴더에서 의존성을 설치합니다.' },
  { step: '3', title: 'npm run dev', desc: '개발 서버를 실행하고 브라우저에서 확인합니다.' },
];

export function SetupDiffPanel({ diff }: SetupDiffPanelProps) {
  const hasChanges = diff.dependencies.length > 0 || diff.devDependencies.length > 0 || diff.scripts.length > 0;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">

      {/* 추가된 의존성 및 스크립트 */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-1">추가된 의존성 및 스크립트</h3>
        <p className="text-xs text-gray-500 mb-4">선택한 라이브러리에 따라 package.json에 더해지는 항목입니다.</p>

        {hasChanges ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Dependencies */}
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-blue-900 mb-3">Dependencies</h4>
              <ul className="flex flex-col gap-1.5">
                {diff.dependencies.length === 0 && <li className="text-xs text-gray-400 italic">없음</li>}
                {diff.dependencies.map(d => (
                  <li key={d} className="text-sm text-blue-700 font-mono bg-white border border-blue-100 px-2 py-1 rounded-md shadow-sm">
                    + {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dev Dependencies */}
            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-emerald-900 mb-3">Dev Dependencies</h4>
              <ul className="flex flex-col gap-1.5">
                {diff.devDependencies.length === 0 && <li className="text-xs text-gray-400 italic">없음</li>}
                {diff.devDependencies.map(d => (
                  <li key={d} className="text-sm text-emerald-700 font-mono bg-white border border-emerald-100 px-2 py-1 rounded-md shadow-sm">
                    + {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Scripts */}
            <div className="bg-pink-50/50 border border-pink-100 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-pink-900 mb-3">Scripts</h4>
              <ul className="flex flex-col gap-1.5">
                {diff.scripts.length === 0 && <li className="text-xs text-gray-400 italic">없음</li>}
                {diff.scripts.map(s => (
                  <li key={s} className="text-sm text-pink-700 font-mono bg-white border border-pink-100 px-2 py-1 rounded-md shadow-sm">
                    + {s}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ) : (
          <div className="px-4 py-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500 text-sm">선택된 추가 옵션이 없어 기본 설정으로 구성됩니다.</p>
          </div>
        )}
      </div>

      {/* 다음 단계 가이드 */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 className="text-sm font-bold text-blue-900 mb-4">🚀 다음 단계 (Getting Started)</h3>
        <ol className="flex flex-col gap-3">
          {GETTING_STARTED.map((item) => (
            <li key={item.step} className="flex items-start gap-3">
              <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
                {item.step}
              </span>
              <div className="flex flex-col gap-0.5">
                <code className="text-sm font-bold font-mono text-blue-900">{item.title}</code>
                <span className="text-xs text-blue-700/80 leading-relaxed">{item.desc}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

    </div>
  );
}
