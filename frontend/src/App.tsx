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
    /* 브라우저 기본 스크롤 허용 (min-h-screen) */
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 sm:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        <section className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 좌측 폼: 스크롤을 내릴 때 화면 상단에 고정됨 (sticky top-8) */}
          <form className="w-full lg:w-[360px] shrink-0 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col sticky top-8">
            <div className="p-6 flex flex-col gap-6">
              <h2 className="text-lg font-bold pb-3 border-b border-gray-100">1. 환경 선택</h2>
              <ProjectSettings />
              <LibraryCart />
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <GenerateZipButton resultData={preview.resultData} />
            </div>
          </form>

          {/* 우측 뷰어: 내용이 길어지면 브라우저 스크롤을 따라 자연스럽게 늘어남 */}
          <section className="flex-1 w-full bg-white border border-gray-200 rounded-xl shadow-sm min-w-0 flex flex-col overflow-hidden">
            <div className="flex bg-gray-50 border-b border-gray-200">
              <button type="button" className={`flex-1 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'files' ? 'bg-white text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-900'}`} onClick={() => setActiveTab('files')}>
                가상 파일 트리 및 코드
              </button>
              <button type="button" className={`flex-1 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'summary' ? 'bg-white text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-900'}`} onClick={() => setActiveTab('summary')}>
                의존성 세팅 요약 (Diff)
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'files' && <GeneratedFileTree preview={preview} />}
              {activeTab === 'summary' && <SetupDiffPanel diff={preview.resultData.setupDiff} />}
            </div>
          </section>

        </section>
      </div>
    </main>
  )
}

export default App