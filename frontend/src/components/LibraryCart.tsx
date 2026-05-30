import { useComposerStore } from '../store/useComposerStore';

export function LibraryCart() {
  const { selectedLibraries, toggleLibrary } = useComposerStore();

  return (
    <div className="field">
      <span className="field-title">추가 옵션</span>
      <div className="option-list">
        <label className="option">
          <input 
            type="checkbox" 
            checked={selectedLibraries.vitest} 
            onChange={() => toggleLibrary('vitest')} 
          />
          <span>Vitest</span>
        </label>
        <label className="option">
          <input 
            type="checkbox" 
            checked={selectedLibraries.zustand} 
            onChange={() => toggleLibrary('zustand')} 
          />
          <span>Zustand</span>
        </label>
        <label className="option">
          <input 
            type="checkbox" 
            checked={selectedLibraries.lucide} 
            onChange={() => toggleLibrary('lucide')} 
          />
          <span>Lucide React</span>
        </label>
        <label className="option">
          <input 
            type="checkbox" 
            checked={selectedLibraries.prettier} 
            onChange={() => toggleLibrary('prettier')} 
          />
          <span>Prettier</span>
        </label>
      </div>
    </div>
  );
}