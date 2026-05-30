import { useComposerStore } from '../store/useComposerStore';

export function ProjectSettings() {
  const { projectName, language, styling, setProjectName, setLanguage, setStyling } = useComposerStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-700">프로젝트 이름</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="my-react-app"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-700">언어</label>
        <div className="grid grid-cols-2 gap-1.5">
          {['ts', 'js'].map((lang) => (
            <label key={lang} className="cursor-pointer">
              <input type="radio" className="peer sr-only" value={lang} checked={language === lang} onChange={() => setLanguage(lang as 'ts' | 'js')} />
              <div className="px-3 py-1.5 border border-gray-200 rounded peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 text-gray-600 font-semibold text-xs text-center hover:bg-gray-50">
                {lang === 'ts' ? 'TypeScript' : 'JavaScript'}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-700">스타일링</label>
        <div className="grid grid-cols-2 gap-1.5">
          {['css', 'tailwind'].map((style) => (
            <label key={style} className="cursor-pointer">
              <input type="radio" className="peer sr-only" value={style} checked={styling === style} onChange={() => setStyling(style as 'css' | 'tailwind')} />
              <div className="px-3 py-1.5 border border-gray-200 rounded peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 text-gray-600 font-semibold text-xs text-center hover:bg-gray-50">
                {style === 'css' ? 'Basic CSS' : 'Tailwind'}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}