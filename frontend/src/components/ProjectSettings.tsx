import { useComposerStore } from '../store/useComposerStore';
import type { Language, Styling } from '../types/composer';

const LANGUAGE_OPTIONS: { id: Language; name: string; hint: string }[] = [
  { id: 'ts', name: 'TypeScript', hint: '타입 안정성 확보' },
  { id: 'js', name: 'JavaScript', hint: '가장 기초적인 방식' },
];

const STYLING_OPTIONS: { id: Styling; name: string; hint: string }[] = [
  { id: 'css', name: 'Basic CSS', hint: '순수 CSS 파일로 작성' },
  { id: 'tailwind', name: 'Tailwind CSS', hint: '유틸리티 클래스 기반' },
];

export function ProjectSettings() {
  const { projectName, language, styling, setProjectName, setLanguage, setStyling } = useComposerStore();

  return (
    <div className="flex flex-col gap-6">

      {/* 프로젝트 이름 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="project-name" className="text-sm font-bold text-gray-900">프로젝트 이름</label>
        <p className="text-xs text-gray-500">package.json의 name과 폴더 이름으로 사용됩니다.</p>
        <input
          id="project-name"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="mt-1 w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          placeholder="my-react-app"
        />
      </div>

      {/* 언어 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-900">언어</label>
        <p className="text-xs text-gray-500">코드의 안전성과 생산성을 결정합니다.</p>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {LANGUAGE_OPTIONS.map((opt) => {
            const isActive = language === opt.id;
            return (
              <label key={opt.id} className="cursor-pointer">
                <input type="radio" className="peer sr-only" value={opt.id} checked={isActive} onChange={() => setLanguage(opt.id)} />
                <div className={`flex flex-col gap-0.5 px-3 py-2.5 border rounded-lg transition-colors ${isActive ? 'bg-blue-50 border-blue-600' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                  <span className={`text-sm font-bold ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>{opt.name}</span>
                  <span className={`text-xs ${isActive ? 'text-blue-600/80' : 'text-gray-500'}`}>{opt.hint}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 스타일링 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-900">스타일링</label>
        <p className="text-xs text-gray-500">화면을 그리는 방식을 선택합니다.</p>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {STYLING_OPTIONS.map((opt) => {
            const isActive = styling === opt.id;
            return (
              <label key={opt.id} className="cursor-pointer">
                <input type="radio" className="peer sr-only" value={opt.id} checked={isActive} onChange={() => setStyling(opt.id)} />
                <div className={`flex flex-col gap-0.5 px-3 py-2.5 border rounded-lg transition-colors ${isActive ? 'bg-blue-50 border-blue-600' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                  <span className={`flex items-center gap-1.5 text-sm font-bold ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                    {opt.name}
                    {opt.id === 'tailwind' && <TailwindPreviewTooltip />}
                  </span>
                  <span className={`text-xs ${isActive ? 'text-blue-600/80' : 'text-gray-500'}`}>{opt.hint}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

    </div>
  );
}

/** 순수 CSS 호버 팝오버 — Tailwind 기본 색상 팔레트 미리보기 */
function TailwindPreviewTooltip() {
  const swatches = [
    { name: 'red', className: 'bg-red-500' },
    { name: 'orange', className: 'bg-orange-500' },
    { name: 'green', className: 'bg-green-500' },
    { name: 'blue', className: 'bg-blue-500' },
    { name: 'indigo', className: 'bg-indigo-500' },
    { name: 'pink', className: 'bg-pink-500' },
  ];
  return (
    <span className="group/tip relative inline-flex" onClick={(e) => e.preventDefault()}>
      <InfoIcon />
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden w-56 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3 text-left shadow-lg group-hover/tip:block">
        <span className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-500">기본 색상 팔레트</span>
        <span className="grid grid-cols-6 gap-1.5">
          {swatches.map((s) => (
            <span key={s.name} className={`h-6 w-6 rounded-md ${s.className} ring-1 ring-black/5`} title={s.name} />
          ))}
        </span>
        <span className="mt-2 block font-mono text-[11px] text-gray-400">className="bg-blue-500"</span>
      </span>
    </span>
  );
}

function InfoIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
