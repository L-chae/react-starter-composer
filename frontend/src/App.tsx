import { useMemo, useState } from 'react'
import './App.css'

import { composeProject } from './composer/composeProject'
import { useComposerStore } from './store/useComposerStore'

import { ProjectSettings } from './components/ProjectSettings'
import { LibraryCart } from './components/LibraryCart'
import { GeneratedFileTree } from './components/GeneratedFileTree'
import { GenerateZipButton } from './components/GenerateZipButton'
import { SetupDiffPanel } from './components/SetupDiffPanel'
import { buildFileTree } from './utils/buildFileTree'

type TabType = 'files' | 'summary';

function App() {
  const { projectName, language, styling, selectedLibraries, getSelection } = useComposerStore();
  const [activeTab, setActiveTab] = useState<TabType>('files');

  const preview = useMemo(() => {
    const selection = getSelection();
    const result = composeProject(selection);
    const fileTree = buildFileTree(result.projectName, result.files);

    return {
      stacks: ['React', 'Vite', selection.language === 'ts' ? 'TypeScript' : 'JavaScript', selection.styling === 'tailwind' ? 'Tailwind CSS' : 'Basic CSS', ...selection.selectedLibraries],
      fileTree,
      packageJsonData: result.packageJsonData,
      resultData: result 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName, language, styling, selectedLibraries]);

  return (
    /* 브라우저 기본 스크롤만 사용 (min-h-screen) - 내부 이중 스크롤 금지 */
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* 헤더: 앱의 학습형 정체성을 설명 */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-900 text-white text-sm font-bold">R</span>
            <h1 className="text-2xl font-bold tracking-tight text-balance">React Starter Composer</h1>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-pretty">
            선택한 기술이 왜 필요한지, 어떤 파일이 생성되는지 학습하며 나만의 보일러플레이트를 만들어보세요.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* 좌측 패널: 학습형 Form Controls */}
          <form className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-8">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-6">
              <ProjectSettings />
              <LibraryCart />
              <GenerateZipButton resultData={preview.resultData} />
            </div>
          </form>

          {/* 우측 패널: 교육형 Viewer */}
          <section className="flex-1 min-w-0 w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                className={`flex-1 py-4 px-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'files' ? 'border-blue-600 text-blue-600' : 'text-gray-500 border-transparent hover:text-gray-900'}`}
                onClick={() => setActiveTab('files')}
              >
                가상 파일 트리 및 구조 이해
              </button>
              <button
                type="button"
                className={`flex-1 py-4 px-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'summary' ? 'border-blue-600 text-blue-600' : 'text-gray-500 border-transparent hover:text-gray-900'}`}
                onClick={() => setActiveTab('summary')}
              >
                의존성 요약 및 시작 가이드
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'files' && <GeneratedFileTree preview={preview} />}
              {activeTab === 'summary' && <SetupDiffPanel diff={preview.resultData.setupDiff} />}
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}

export default App
