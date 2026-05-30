import type { ComposerResult } from '../types/composer';

interface SetupDiffPanelProps {
  diff: ComposerResult['setupDiff'];
}

export function SetupDiffPanel({ diff }: SetupDiffPanelProps) {
  const hasChanges = diff.dependencies.length > 0 || diff.devDependencies.length > 0 || diff.scripts.length > 0;

  if (!hasChanges) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl">
        <h3 className="text-lg font-bold text-gray-700 mb-2">✨ Setup Summary</h3>
        <p className="text-gray-500 text-sm">선택된 추가 옵션이 없어 기본 설정으로 구성됩니다.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <h3 className="text-sm font-bold text-gray-700 mb-4">✨ 추가된 의존성 및 스크립트</h3>
      
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
    </div>
  );
}