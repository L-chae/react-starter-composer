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
                  <span className={`flex items-center gap-1.5 text-sm font-bold ${isChecked ? 'text-blue-700' : 'text-gray-700'}`}>
                    {lib.name}
                    {lib.id === 'lucide' && <LucidePreviewTooltip />}
                  </span>
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

/** 순수 CSS 호버 팝오버 — 대표 Lucide 아이콘 미리보기 (인라인 SVG) */
function LucidePreviewTooltip() {
  return (
    <span className="group/tip relative inline-flex" onClick={(e) => e.preventDefault()}>
      <InfoIcon />
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden w-56 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3 text-left shadow-lg group-hover/tip:block">
        <span className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-500">대표 아이콘 미리보기</span>
        <span className="flex items-center justify-between gap-1 text-gray-700">
          <HomeIcon />
          <SettingsIcon />
          <UserIcon />
          <SearchIcon />
          <BellIcon />
        </span>
        <span className="mt-2 block font-mono text-[11px] text-gray-400">{'import { Home } from "lucide-react"'}</span>
      </span>
    </span>
  );
}

const iconProps = {
  className: 'h-6 w-6',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function InfoIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg {...iconProps}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
