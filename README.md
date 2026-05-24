# React Starter Composer

React Starter Composer는 **React + Vite 프로젝트를 GUI에서 조립하고 ZIP으로 다운로드할 수 있는 스타터 생성기**입니다.

사용자는 화면에서 원하는 개발 환경을 선택할 수 있습니다.

- JavaScript / TypeScript
- Basic CSS / Tailwind CSS
- Vitest
- Zustand
- Lucide React
- Prettier

선택한 옵션에 따라 예상 파일 구조, 설치 명령어, `package.json scripts`를 미리 확인할 수 있습니다.  
백엔드는 선택값을 바탕으로 템플릿을 조합하고, 실제 프로젝트 폴더와 ZIP 파일을 생성합니다.

현재 문서는 **v1 배포 완료 상태**를 기준으로 작성되었습니다.

---

## 배포 링크

- **프론트엔드 (UI)**: [![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?style=flat-square&logo=vercel)](https://react-starter-composer.vercel.app)
- **백엔드 (API 상태)**: [![Render](https://img.shields.io/badge/Render-Health_Check-46E3B7?style=flat-square&logo=render&logoColor=white)](https://react-starter-composer-backend.onrender.com/health)

---

## 핵심 기능

- GUI 기반 React 스타터 옵션 선택
- 선택값에 따른 파일 구조 미리보기
- 선택값에 따른 설치 명령어 미리보기
- 선택값에 따른 `package.json scripts` 미리보기
- manifest 기반 템플릿 조합
- 실제 프로젝트 폴더 생성
- ZIP 파일 생성 및 다운로드
- 프론트엔드-백엔드 연동
- 배포 환경 대응을 위한 환경변수 분리
- 입력값 검증 및 에러 응답 처리

---

## 현재 구현 완료 기능

### 프론트엔드

- React + Vite + TypeScript 기반 Preview UI
- 프로젝트 이름, 언어, 스타일링, 옵션 선택
- 선택값에 따른 파일 구조 / 설치 명령어 / `package.json scripts` 미리보기
- `Generate ZIP` 버튼을 통한 백엔드 API 호출 및 ZIP 다운로드
- 로딩 / 성공 / 에러 상태 메시지 표시

### 백엔드

- Express 기반 API 서버
- `GET /health`, `POST /api/generate`, `GET /api/download/:zipFileName`
- 요청 body 검증, 프로젝트 이름 sanitize, 다운로드 파일명 검증
- path traversal 방지 및 일관된 JSON 에러 응답 처리

### 템플릿 / 생성 로직

- `templates/manifest.json` 기반 옵션 관리
- base template과 option template 조합
- 선택 옵션 기반 실제 프로젝트 파일 생성
- `package.json` dependencies / devDependencies / scripts 병합
- 생성된 프로젝트 README 작성 및 ZIP 압축

---

## 동작 흐름

```txt
사용자가 옵션 선택
→ 파일 구조 / 설치 명령어 / scripts 미리보기
→ Generate ZIP 클릭
→ 프론트엔드가 백엔드 API 호출
→ 백엔드가 manifest 기반으로 템플릿 조합
→ 실제 프로젝트 폴더 생성
→ ZIP 파일 생성
→ 프론트엔드가 ZIP 다운로드 요청
→ 브라우저에서 ZIP 다운로드
```

---

## 프로젝트 구조

```txt
react-starter-composer/
├─ frontend/               # React + Vite + TypeScript 프론트엔드
├─ backend/                # Express API, composer, project generator, ZIP 생성
├─ templates/              # base 템플릿, option 템플릿, manifest
├─ .gitignore
├─ AGENTS.md
└─ README.md
```

---

## 기술 스택

### 프론트엔드

* React
* TypeScript
* Vite
* CSS

### 백엔드

* Node.js
* Express
* archiver
* fs / path 기반 파일 처리

### 배포

* Frontend: Vercel
* Backend: Render

---

## 로컬 실행 방법

### 1. 백엔드 실행

```bash
cd backend
npm install
npm run dev
```

기본 실행 주소:

```txt
http://localhost:4000
```

상태 확인:

```bash
curl http://localhost:4000/health
```

예상 응답:

```json
{ "ok": true }
```

---

### 2. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

기본 실행 주소:

```txt
http://localhost:5173
```

브라우저에서 프론트엔드에 접속한 뒤 옵션을 선택하고 `Generate ZIP` 버튼을 클릭하면 ZIP 파일이 다운로드됩니다.

---

### 3. 백엔드 검증

```bash
cd backend
npm run check
```

이 명령어는 다음 내용을 검증합니다.

* TypeScript 풀옵션 프로젝트 생성
* JavaScript 기본 프로젝트 생성
* ZIP 파일 생성
* 잘못된 입력값 처리
* 잘못된 다운로드 파일명 차단

---

## 환경변수 설정

### 프론트엔드 환경변수

파일 예시:

```txt
frontend/.env.example
```

내용:

```env
VITE_API_BASE_URL=http://localhost:4000
```

배포 환경에서는 Vercel에 아래 값을 등록합니다.

```env
VITE_API_BASE_URL=https://react-starter-composer-backend.onrender.com
```

---

### 백엔드 환경변수

파일 예시:

```txt
backend/.env.example
```

내용:

```env
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

배포 환경에서는 Render에 아래 값을 등록합니다.

```env
CORS_ORIGIN=https://react-starter-composer.vercel.app
```

`PORT`는 Render가 자동으로 제공하므로 직접 설정하지 않아도 됩니다.

---

## API 설명

### GET /health

백엔드 서버가 정상 실행 중인지 확인하는 API입니다.

```bash
curl http://localhost:4000/health
```

응답 예시:

```json
{
  "ok": true
}
```

---

### POST /api/generate

사용자가 선택한 옵션을 기반으로 프로젝트 파일과 ZIP 파일을 생성하는 API입니다.

요청 예시:

```bash
curl -X POST http://localhost:4000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "my-react-app",
    "language": "ts",
    "styling": "tailwind",
    "useVitest": true,
    "useZustand": true,
    "useLucide": true,
    "usePrettier": true
  }'
```

응답 예시:

```json
{
  "ok": true,
  "message": "Project files generated and zipped",
  "result": { "...": "composer result" },
  "outputPath": "backend/output/temp/my-react-app",
  "generatedFiles": ["package.json", "src/main.tsx", "..."],
  "zipPath": "backend/output/zips/my-react-app.zip",
  "zipFileName": "my-react-app.zip",
  "zipSizeBytes": 1234
}
```

---

### GET /api/download/:zipFileName

생성된 ZIP 파일을 다운로드하는 API입니다.

예시:

```txt
GET /api/download/my-react-app.zip
```

동작 방식:

* 정상 파일이면 ZIP 다운로드 반환
* 잘못된 파일명은 `400`
* 존재하지 않는 ZIP 파일은 `404`

---

## 생성 결과 위치

백엔드에서 생성되는 파일은 아래 경로에 저장됩니다.

```txt
backend/output/temp/{projectName}
backend/output/zips/{projectName}.zip
```

이 경로들은 `.gitignore`에 포함되어 있어 Git에 올라가지 않습니다.

---

## 배포 설정

### 백엔드 배포: Render

Render 설정:

```txt
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

환경변수:

```env
CORS_ORIGIN=https://react-starter-composer.vercel.app
```

배포 후 확인:

```bash
curl https://react-starter-composer-backend.onrender.com/health
```

---

### 프론트엔드 배포: Vercel

Vercel 설정:

```txt
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

환경변수:

```env
VITE_API_BASE_URL=https://react-starter-composer-backend.onrender.com
```

---

## 배포 후 테스트 체크리스트

* [ ] Render 백엔드 `/health` 응답 확인
* [ ] Vercel 프론트 화면 접속 확인
* [ ] 옵션 선택 후 `Generate ZIP` 클릭
* [ ] ZIP 파일 다운로드 확인
* [ ] 압축 해제 후 `package.json`, `README.md`, `src/` 확인
* [ ] 브라우저 콘솔에서 CORS 오류 없는지 확인

---

## 개발 로드맵

* [x] Phase 1: 프로젝트 기본 구조 생성
* [x] Phase 2: 프론트엔드 Preview UI 구현
* [x] Phase 3: 백엔드 Express 서버 뼈대 구현
* [x] Phase 4: 템플릿 manifest 구조 설계
* [x] Phase 5: manifest 기반 composer result 생성
* [x] Phase 6: composer result 기반 프로젝트 파일 생성
* [x] Phase 7: ZIP 생성 로직 구현
* [x] Phase 8: 프론트엔드-백엔드 다운로드 연동
* [x] Phase 9-1: env / CORS / PORT 배포 설정
* [x] Phase 9-2: 백엔드 입력 검증 강화
* [x] Phase 9-3: 프론트엔드 에러 / 로딩 UX 개선
* [x] Phase 9-4: 배포 검증 및 포트폴리오 README 정리
* [ ] Next Phase: 2차 확장 (도메인/테마/템플릿 엔진)

---

## 포트폴리오 요약

이 프로젝트는 React 프로젝트 초기 설정을 GUI에서 선택하고, 선택 결과를 실제 파일과 ZIP으로 생성하는 개발 도구입니다.

단순한 화면 구현보다 다음 흐름을 중점적으로 다뤘습니다.

- 옵션 선택에 따른 미리보기 UI 구성
- 프론트엔드와 백엔드 API 연동
- manifest 기반 템플릿 조합
- 프로젝트 파일 생성 및 ZIP 다운로드 처리
- 입력값 검증과 에러 응답 처리
- Vercel / Render 기반 배포 환경 구성

---

## 제외한 범위

v1에서는 아래 기능을 의도적으로 제외했습니다.

* Next.js 지원
* Jest 지원
* Redux Toolkit 지원
* 서버에서 `npm install` 실행
* 자동 dependency version update
* 모든 React 라이브러리 조합 지원

이 프로젝트는 모든 도구를 지원하는 범용 생성기가 아니라, **React + Vite 기준의 핵심 개발 환경을 안정적으로 조립하는 도구**를 목표로 합니다.

---

## 앞으로의 확장 계획

v1 이후에는 다음 기능을 추가할 수 있습니다.

### 1. 도메인 기반 스타터

예시:

* 쇼핑몰
* 대시보드
* 블로그
* 포트폴리오

도메인을 선택하면 해당 목적에 맞는 폴더 구조와 예제 컴포넌트를 생성할 수 있습니다.

### 2. 테마 선택

예시:

* 기본형
* 미니멀
* 대시보드형
* 카드형 UI

선택한 테마에 따라 예제 컴포넌트와 스타일 구성을 다르게 생성할 수 있습니다.

### 3. 템플릿 엔진화

현재는 파일 복사 중심이지만, 이후에는 템플릿 파일 안에 변수를 넣고 치환하는 방식으로 확장할 수 있습니다.

예시:

```txt
{{PROJECT_NAME}}
{{ICON_LIBRARY}}
{{THEME_NAME}}
```

### 4. LEARN.md 자동 생성

생성된 프로젝트 안에 학습 가이드를 함께 넣을 수 있습니다.

예시:

```txt
LEARN.md
```

이 파일에는 선택한 기술 스택에 대한 설명과 공부 순서를 적을 수 있습니다.