import { useMemo, useState } from 'react'
import JSZip from 'jszip'
import './App.css'

import { composeProject } from './composer/composeProject'
import type { ComposerSelection, Language, Styling, LibraryId } from './types/composer'

const GENERATING_MESSAGE = '브라우저에서 프로젝트를 조립하고 ZIP을 생성 중입니다...'

function App() {
  const [projectName, setProjectName] = useState('my-react-app')
  const [language, setLanguage] = useState<Language>('ts')
  const [styling, setStyling] = useState<Styling>('css')
  const [useVitest, setUseVitest] = useState(false)
  const [useZustand, setUseZustand] = useState(false)
  const [useLucide, setUseLucide] = useState(false)
  const [usePrettier, setUsePrettier] = useState(false)
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const currentSelection = useMemo<ComposerSelection>(() => {
    const selectedLibraries: LibraryId[] = [];
    if (useVitest) selectedLibraries.push('vitest');
    if (useZustand) selectedLibraries.push('zustand');
    if (useLucide) selectedLibraries.push('lucide');
    if (usePrettier) selectedLibraries.push('prettier');

    return {
      projectName: projectName.trim() || 'my-react-app',
      language,
      styling,
      selectedLibraries,
    };
  }, [projectName, language, styling, useVitest, useZustand, useLucide, usePrettier]);

 const preview = useMemo(() => {
    const result = composeProject(currentSelection);

    const stacks = [
      'React', 'Vite',
      // 외부 상태(language) 대신 currentSelection 내부의 값을 참조하도록 변경
      currentSelection.language === 'ts' ? 'TypeScript' : 'JavaScript',
      currentSelection.styling === 'tailwind' ? 'Tailwind CSS' : 'Basic CSS',
      ...currentSelection.selectedLibraries
    ];

    const fileTree = `${result.projectName}/\n` + result.files.map(f => `├─ ${f.path}`).join('\n');

    return {
      stacks,
      fileTree,
      packageJsonData: result.packageJsonData,
      resultData: result 
    }
  }, [currentSelection]);

  const resetOptions = () => {
    setProjectName('my-react-app')
    setLanguage('ts')
    setStyling('css')
    setUseVitest(false)
    setUseZustand(false)
    setUseLucide(false)
    setUsePrettier(false)
    setStatusMessage('')
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleGenerateZip = async () => {
    try {
      setIsGenerating(true)
      setStatusMessage(GENERATING_MESSAGE)
      setErrorMessage('')
      setSuccessMessage('')

      const result = preview.resultData;

      if (!result.isGeneratable) {
        throw new Error(result.issues[0]?.message || '생성할 수 없는 설정입니다.');
      }

      const zip = new JSZip();
      result.files.forEach(file => {
        zip.file(`${result.projectName}/${file.path}`, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${result.projectName}.zip`;
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);

      setStatusMessage('')
      setSuccessMessage(`${result.projectName}.zip 다운로드가 즉시 완료되었습니다. 🚀`)
    } catch (error) {
      setStatusMessage('')
      setErrorMessage(error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="app">
      <section className="header">
        <h1>React Starter Composer (V2)</h1>
        <p>백엔드 없이 브라우저 메모리만으로 완벽한 초기 세팅을 즉시 구워냅니다.</p>
      </section>

      <section className="layout">
        <form className="panel">
          <h2>1. 환경 선택</h2>

          <div className="field">
            <label className="field-title" htmlFor="projectName">프로젝트 이름</label>
            <input id="projectName" type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
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

          <div className="field">
            <span className="field-title">추가 옵션</span>
            <div className="option-list">
              <label className="option">
                <input type="checkbox" checked={useVitest} onChange={(e) => setUseVitest(e.target.checked)} />
                <span>Vitest</span>
              </label>
              <label className="option">
                <input type="checkbox" checked={useZustand} onChange={(e) => setUseZustand(e.target.checked)} />
                <span>Zustand</span>
              </label>
              <label className="option">
                <input type="checkbox" checked={useLucide} onChange={(e) => setUseLucide(e.target.checked)} />
                <span>Lucide React</span>
              </label>
              <label className="option">
                <input type="checkbox" checked={usePrettier} onChange={(e) => setUsePrettier(e.target.checked)} />
                <span>Prettier</span>
              </label>
            </div>
          </div>

          <div className="button-row" style={{ marginTop: '20px' }}>
            <button type="button" className="secondary" onClick={resetOptions}>초기화</button>
            <button type="button" className="primary" onClick={handleGenerateZip} disabled={isGenerating}>
              {isGenerating ? '압축 중...' : '즉시 Generate ZIP 🚀'}
            </button>
          </div>

          <div className="status-panel">
            {statusMessage && <p className="status-message status-info">{statusMessage}</p>}
            {errorMessage && <p className="status-message status-error">{errorMessage}</p>}
            {successMessage && <p className="status-message status-success">{successMessage}</p>}
          </div>
        </form>

        <section className="panel">
          <h2>2. 생성 결과 실시간 미리보기</h2>

          <div className="preview-grid">
            <div className="preview-card light">
              <h3>선택된 스택</h3>
              <div className="badge-list">
                {preview.stacks.map((stack) => (
                  <span className="badge" key={stack}>{stack}</span>
                ))}
              </div>
            </div>

            <div className="preview-card">
              <h3>가상 파일 트리</h3>
              <pre>{preview.fileTree}</pre>
            </div>

            <div className="preview-card" style={{ gridColumn: '1 / -1' }}>
              <h3>🔥 실시간 package.json 결과물</h3>
              <pre style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {JSON.stringify(preview.packageJsonData, null, 2)}
              </pre>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

export default App