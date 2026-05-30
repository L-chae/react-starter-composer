import { useComposerStore } from '../store/useComposerStore';

type LibKey = 'vitest' | 'zustand' | 'lucide' | 'prettier';
const LIBRARIES: { id: LibKey; name: string; }[] = [
  { id: 'vitest', name: 'Vitest' },
  { id: 'zustand', name: 'Zustand' },
  { id: 'lucide', name: 'Lucide React' },
  { id: 'prettier', name: 'Prettier' },
];

export function LibraryCart() {
  const { selectedLibraries, toggleLibrary } = useComposerStore();

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      <label className="text-sm font-bold text-gray-700">라이브러리 선택</label>
      <div className="flex flex-col gap-1">
        {LIBRARIES.map((lib) => {
          const isChecked = selectedLibraries[lib.id];
          return (
            <label key={lib.id} className="cursor-pointer group">
              <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={() => toggleLibrary(lib.id)} />
              <div className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50 transition-colors">
                <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'}`}>
                  {isChecked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-sm font-semibold ${isChecked ? 'text-blue-900' : 'text-gray-700'}`}>{lib.name}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}