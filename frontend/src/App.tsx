import { useMemo } from 'react'
import './App.css'

import { composeProject } from './composer/composeProject'
import { useComposerStore } from './store/useComposerStore'

import { ProjectSettings } from './components/ProjectSettings'
import { LibraryCart } from './components/LibraryCart'
import { GeneratedFileTree } from './components/GeneratedFileTree'
import { GenerateZipButton } from './components/GenerateZipButton'
import { SetupDiffPanel } from './components/SetupDiffPanel'
import { buildFileTree } from './utils/buildFileTree'

function App() {
  const { 
    projectName, language, styling, selectedLibraries, getSelection 
  } = useComposerStore();

  // 1. 코어 엔진 구동 (스토어 상태가 바뀔 때마다 동기화)
  const preview = useMemo(() => {
    const selection = getSelection();
    const result = composeProject(selection);

    const stacks = [
      'React', 'Vite',
      selection.language === 'ts' ? 'TypeScript' : 'JavaScript',
      selection.styling === 'tailwind' ? 'Tailwind CSS' : 'Basic CSS',
      ...selection.selectedLibraries
    ];

    const fileTree = buildFileTree(result.projectName, result.files);

    return {
      stacks,
      fileTree,
      packageJsonData: result.packageJsonData,
      resultData: result 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName, language, styling, selectedLibraries]);

  // 2. 화면 렌더링 (모든 UI가 컴포넌트로 완벽히 분리됨)
  return (
    <main className="app">
      <section className="header">
        <h1>React Starter Composer (V2)</h1>
        <p>백엔드 없이 브라우저 메모리만으로 완벽한 초기 세팅을 즉시 구워냅니다.</p>
      </section>

      <section className="layout">
        <form className="panel">
          <h2>1. 환경 선택</h2>
          
          <ProjectSettings />
          <LibraryCart />
          
          <GenerateZipButton resultData={preview.resultData} />
        </form>

        <section className="panel">
          <GeneratedFileTree preview={preview} />
          <SetupDiffPanel diff={preview.resultData.setupDiff} />
        </section>
      </section>
    </main>
  )
}

export default App