import { useComposerStore } from '../store/useComposerStore';

export function ProjectSettings() {
  const { projectName, language, styling, setProjectName, setLanguage, setStyling } = useComposerStore();

  return (
    <>
      <div className="field">
        <label className="field-title" htmlFor="projectName">프로젝트 이름</label>
        <input 
          id="projectName" 
          type="text" 
          value={projectName} 
          onChange={(e) => setProjectName(e.target.value)} 
        />
      </div>

      <div className="field">
        <span className="field-title">언어</span>
        <div className="option-list">
          <label className="option">
            <input type="radio" name="language" checked={language === 'ts'} onChange={() => setLanguage('ts')} />
            <span>TypeScript</span>
          </label>
          <label className="option">
            <input type="radio" name="language" checked={language === 'js'} onChange={() => setLanguage('js')} />
            <span>JavaScript</span>
          </label>
        </div>
      </div>

      <div className="field">
        <span className="field-title">스타일링</span>
        <div className="option-list">
          <label className="option">
            <input type="radio" name="styling" checked={styling === 'css'} onChange={() => setStyling('css')} />
            <span>Basic CSS</span>
          </label>
          <label className="option">
            <input type="radio" name="styling" checked={styling === 'tailwind'} onChange={() => setStyling('tailwind')} />
            <span>Tailwind CSS</span>
          </label>
        </div>
      </div>
    </>
  );
}