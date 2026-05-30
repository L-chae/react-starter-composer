import { useComposerStore } from '../store/useComposerStore';

type LibKey = 'vitest' | 'zustand' | 'lucide' | 'prettier';
const LIBRARIES: { id: LibKey; name: string; desc: string }[] = [
  { id: 'vitest', name: 'Vitest', desc: '초고속 단위 테스트' },
  { id: 'zustand', name: 'Zustand', desc: '가벼운 상태 관리' },
  { id: 'lucide', name: 'Lucide React', desc: '깔끔한 오픈소스 아이콘' },
  { id: 'prettier', name: 'Prettier', desc: '일관된 코드 포맷팅' },
];

export function LibraryCart() {
  const { selectedLibraries, toggleLibrary } = useComposerStore();

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-gray-900">라이브러리 선택</label>
      <p className="text-xs text-gray-500">필요한 도구를 골라 보일러플레이트에 추가하세요.</p>
      <div className="mt-1 flex flex-col gap-2">
        {LIBRARIES.map((lib) => {
          const isChecked = selectedLibraries[lib.id];
          return (
            <label key={lib.id} className="cursor-pointer group">
              <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleLibrary(lib.id)} />
              <div className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg transition-colors ${isChecked ? 'bg-blue-50 border-blue-600' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                <div className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center border ${isChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                  {isChecked && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className={`text-sm font-bold ${isChecked ? 'text-blue-700' : 'text-gray-700'}`}>{lib.name}</span>
                  <span className={`text-xs ${isChecked ? 'text-blue-600/80' : 'text-gray-500'}`}>{lib.desc}</span>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
