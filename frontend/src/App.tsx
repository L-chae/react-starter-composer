import { useMemo, useState } from 'react'
import './App.css'

type Language = 'ts' | 'js'
type Styling = 'css' | 'tailwind'

function App() {
  const [projectName, setProjectName] = useState('my-react-app')
  const [language, setLanguage] = useState<Language>('ts')
  const [styling, setStyling] = useState<Styling>('css')
  const [useVitest, setUseVitest] = useState(false)
  const [useZustand, setUseZustand] = useState(false)
  const [useLucide, setUseLucide] = useState(false)
  const [usePrettier, setUsePrettier] = useState(false)

  const preview = useMemo(() => {
    const safeProjectName = projectName.trim() || 'my-react-app'
    const ext = language === 'ts' ? 'tsx' : 'jsx'
    const configExt = language === 'ts' ? 'ts' : 'js'
    const scriptExt = language === 'ts' ? 'ts' : 'js'

    const stacks = [
      'React',
      'Vite',
      language === 'ts' ? 'TypeScript' : 'JavaScript',
      styling === 'tailwind' ? 'Tailwind CSS' : 'Basic CSS',
    ]

    if (useVitest) stacks.push('Vitest')
    if (useZustand) stacks.push('Zustand')
    if (useLucide) stacks.push('Lucide React')
    if (usePrettier) stacks.push('Prettier')

    const files = [
      `${safeProjectName}/`,
      `├─ src/`,
      `│  ├─ App.${ext}`,
      `│  ├─ main.${ext}`,
      `│  ├─ index.css`,
    ]

    if (styling === 'css') {
      files.push(`│  └─ App.css`)
    }

    if (styling === 'tailwind') {
      files.push(`├─ tailwind.config.${configExt}`)
      files.push(`├─ postcss.config.js`)
    }

    if (useVitest) {
      files.push(`├─ vitest.config.${configExt}`)
      files.push(`├─ src/setupTests.${scriptExt}`)
      files.push(`├─ src/App.test.${ext}`)
    }

    if (useZustand) {
      files.push(`├─ src/stores/useCounterStore.${scriptExt}`)
      files.push(`├─ src/components/Counter.${ext}`)
    }

    if (useLucide) {
      files.push(`├─ src/components/IconExample.${ext}`)
    }

    if (usePrettier) {
      files.push(`├─ .prettierrc`)
      files.push(`├─ .prettierignore`)
    }

    files.push(`├─ package.json`)
    files.push(`└─ README.md`)

    const dependencies: string[] = []
    const devDependencies: string[] = []

    if (styling === 'tailwind') {
      devDependencies.push('tailwindcss', 'postcss', 'autoprefixer')
    }

    if (useVitest) {
      devDependencies.push(
        'vitest',
        'jsdom',
        '@testing-library/react',
        '@testing-library/jest-dom',
        '@testing-library/user-event',
      )
    }

    if (useZustand) dependencies.push('zustand')
    if (useLucide) dependencies.push('lucide-react')
    if (usePrettier) devDependencies.push('prettier')

    const commands = [`cd ${safeProjectName}`, 'npm install']

    if (dependencies.length > 0) {
      commands.push(`npm install ${dependencies.join(' ')}`)
    }

    if (devDependencies.length > 0) {
      commands.push(`npm install -D ${devDependencies.join(' ')}`)
    }

    commands.push('npm run dev')

    const scripts: Record<string, string> = {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
    }

    if (useVitest) {
      scripts.test = 'vitest'
      scripts['test:coverage'] = 'vitest --coverage'
    }

    if (usePrettier) {
      scripts.format = 'prettier --write .'
    }

    return {
      stacks,
      files: files.join('\n'),
      commands: commands.join('\n'),
      scripts: JSON.stringify({ scripts }, null, 2),
    }
  }, [
    projectName,
    language,
    styling,
    useVitest,
    useZustand,
    useLucide,
    usePrettier,
  ])

  const resetOptions = () => {
    setProjectName('my-react-app')
    setLanguage('ts')
    setStyling('css')
    setUseVitest(false)
    setUseZustand(false)
    setUseLucide(false)
    setUsePrettier(false)
  }

  return (
    <main className="app">
      <section className="header">
        <h1>React Starter Composer</h1>
        <p>
          원하는 React 개발 환경을 선택하면, 필요한 파일 구조와 설치
          명령어를 미리 보여주고 ZIP으로 받을 수 있는 GUI 스타터
          생성기입니다.
        </p>
      </section>

      <section className="layout">
        <form className="panel">
          <h2>1. 환경 선택</h2>

          <div className="field">
            <label className="field-title" htmlFor="projectName">
              프로젝트 이름
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
            />
          </div>

          <div className="field">
            <span className="field-title">언어</span>
            <div className="option-list">
              <label className="option">
                <input
                  type="radio"
                  name="language"
                  checked={language === 'ts'}
                  onChange={() => setLanguage('ts')}
                />
                <span>
                  TypeScript
                  <small>실무 기본값으로 추천</small>
                </span>
              </label>

              <label className="option">
                <input
                  type="radio"
                  name="language"
                  checked={language === 'js'}
                  onChange={() => setLanguage('js')}
                />
                <span>
                  JavaScript
                  <small>초보자에게 더 단순한 문법</small>
                </span>
              </label>
            </div>
          </div>

          <div className="field">
            <span className="field-title">스타일링</span>
            <div className="option-list">
              <label className="option">
                <input
                  type="radio"
                  name="styling"
                  checked={styling === 'css'}
                  onChange={() => setStyling('css')}
                />
                <span>
                  Basic CSS
                  <small>가장 단순한 기본 CSS 구조</small>
                </span>
              </label>

              <label className="option">
                <input
                  type="radio"
                  name="styling"
                  checked={styling === 'tailwind'}
                  onChange={() => setStyling('tailwind')}
                />
                <span>
                  Tailwind CSS
                  <small>유틸리티 클래스 기반 스타일링</small>
                </span>
              </label>
            </div>
          </div>

          <div className="field">
            <span className="field-title">추가 옵션</span>
            <div className="option-list">
              <label className="option">
                <input
                  type="checkbox"
                  checked={useVitest}
                  onChange={(event) => setUseVitest(event.target.checked)}
                />
                <span>
                  Vitest
                  <small>React 컴포넌트 테스트 환경</small>
                </span>
              </label>

              <label className="option">
                <input
                  type="checkbox"
                  checked={useZustand}
                  onChange={(event) => setUseZustand(event.target.checked)}
                />
                <span>
                  Zustand
                  <small>간단한 전역 상태관리</small>
                </span>
              </label>

              <label className="option">
                <input
                  type="checkbox"
                  checked={useLucide}
                  onChange={(event) => setUseLucide(event.target.checked)}
                />
                <span>
                  Lucide React
                  <small>가벼운 SVG 아이콘 라이브러리</small>
                </span>
              </label>

              <label className="option">
                <input
                  type="checkbox"
                  checked={usePrettier}
                  onChange={(event) => setUsePrettier(event.target.checked)}
                />
                <span>
                  Prettier
                  <small>코드 포맷팅 설정</small>
                </span>
              </label>
            </div>
          </div>

          <div className="button-row">
            <button type="button" className="secondary" onClick={resetOptions}>
              초기화
            </button>
            <button type="button" className="primary">
              Generate ZIP
            </button>
          </div>
        </form>

        <section className="panel">
          <h2>2. 생성 결과 미리보기</h2>

          <div className="preview-grid">
            <div className="preview-card light">
              <h3>선택된 스택</h3>
              <div className="badge-list">
                {preview.stacks.map((stack) => (
                  <span className="badge" key={stack}>
                    {stack}
                  </span>
                ))}
              </div>
            </div>

            <div className="preview-card">
              <h3>Preview Files</h3>
              <pre>{preview.files}</pre>
            </div>

            <div className="preview-card">
              <h3>Install Commands</h3>
              <pre>{preview.commands}</pre>
            </div>

            <div className="preview-card">
              <h3>package.json scripts</h3>
              <pre>{preview.scripts}</pre>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

export default App