import { useMemo, useState } from 'react'
import './App.css'
import { getApiUrl } from './config/api'

type Language = 'ts' | 'js'
type Styling = 'css' | 'tailwind'
type ErrorResponse = {
  ok: false
  errors?: string[]
}

type GenerateSuccessResponse = {
  ok: true
  zipFileName: string
}

type GenerateResponse = {
  ok: boolean
  zipFileName?: unknown
  errors?: unknown
}

const GENERATING_MESSAGE = '프로젝트를 조립하고 ZIP을 생성하는 중입니다...'
const BACKEND_CONNECTION_ERROR =
  '백엔드 서버에 연결할 수 없습니다. backend 서버가 실행 중인지 확인하세요.'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  return isRecord(value) && value.ok === false
}

function isGenerateSuccessResponse(value: unknown): value is GenerateSuccessResponse {
  return (
    isRecord(value) &&
    value.ok === true &&
    typeof value.zipFileName === 'string' &&
    value.zipFileName.trim() !== ''
  )
}

function getErrorsFromResponse(value: unknown): string[] {
  if (!isErrorResponse(value) || !Array.isArray(value.errors)) {
    return []
  }

  return value.errors.filter((error): error is string => typeof error === 'string' && error.trim() !== '')
}

async function parseJsonSafely(response: Response): Promise<unknown | null> {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}

function toNetworkError(error: unknown): Error {
  if (error instanceof TypeError) {
    return new Error(BACKEND_CONNECTION_ERROR)
  }

  if (error instanceof Error) {
    return error
  }

  return new Error('요청을 처리하지 못했습니다. 잠시 후 다시 시도하세요.')
}

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

      const payload = {
        projectName,
        language,
        styling,
        useVitest,
        useZustand,
        useLucide,
        usePrettier,
      }

      let generateResponse: Response
      try {
        generateResponse = await fetch(getApiUrl('/api/generate'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      } catch (error) {
        throw toNetworkError(error)
      }

      const generateData = (await parseJsonSafely(generateResponse)) as GenerateResponse | null

      if (!generateResponse.ok) {
        const errors = getErrorsFromResponse(generateData)
        if (errors.length > 0) {
          throw new Error(errors.join('\n'))
        }
        throw new Error('프로젝트 생성 요청이 실패했습니다.')
      }

      if (!isGenerateSuccessResponse(generateData)) {
        throw new Error('백엔드 응답 형식이 올바르지 않습니다.')
      }

      let downloadResponse: Response
      try {
        downloadResponse = await fetch(
          getApiUrl(`/api/download/${encodeURIComponent(generateData.zipFileName)}`),
        )
      } catch (error) {
        throw toNetworkError(error)
      }

      if (!downloadResponse.ok) {
        const downloadData = await parseJsonSafely(downloadResponse)
        const errors = getErrorsFromResponse(downloadData)
        if (errors.length > 0) {
          throw new Error(errors.join('\n'))
        }
        throw new Error('ZIP 다운로드 요청이 실패했습니다.')
      }

      let blob: Blob
      try {
        blob = await downloadResponse.blob()
      } catch {
        throw new Error('ZIP 파일을 다운로드 형식으로 처리하지 못했습니다.')
      }

      if (blob.size <= 0) {
        throw new Error('다운로드할 ZIP 파일이 비어 있습니다.')
      }

      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = downloadUrl
      link.download = generateData.zipFileName
      document.body.appendChild(link)
      try {
        link.click()
      } catch {
        throw new Error('브라우저 다운로드를 시작하지 못했습니다.')
      }
      link.remove()
      URL.revokeObjectURL(downloadUrl)

      setStatusMessage('')
      setSuccessMessage(`${generateData.zipFileName} 다운로드가 시작되었습니다.`)
    } catch (error) {
      setStatusMessage('')
      const message = toNetworkError(error).message
      setErrorMessage(message)
    } finally {
      setIsGenerating(false)
    }
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
            <button
              type="button"
              className="primary"
              onClick={handleGenerateZip}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate ZIP'}
            </button>
          </div>

          <div className="status-panel" aria-live="polite">
            {statusMessage ? (
              <p className="status-message status-info" role="status">
                {statusMessage}
              </p>
            ) : null}

            {errorMessage ? (
              <p className="status-message status-error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            {successMessage ? (
              <p className="status-message status-success" role="status">
                {successMessage}
              </p>
            ) : null}
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
