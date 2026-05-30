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
                  <span className={`text-sm font-bold ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>{opt.name}</span>
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
