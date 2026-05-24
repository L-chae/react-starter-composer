# React Starter Composer

React Starter Composer는 GUI 기반 React + Vite 스타터 생성기입니다.  
사용자가 옵션을 선택하면 예상 파일 구조, 설치 명령어, `package.json scripts`를 미리 보여주고,
backend에서 템플릿 조합 결과를 실제 프로젝트 폴더로 생성한 뒤 ZIP을 내려받을 수 있게 하는 것을 목표로 합니다.

현재 문서는 **배포 완료 상태(v1)** 기준입니다.

## Live Demo

- Frontend (Vercel): `https://your-vercel-domain.vercel.app` (replace with your real URL)
- Backend Health (Render): `https://react-starter-composer-backend.onrender.com/health`

## 현재 구현 완료 기능

- Frontend Preview UI 구현 완료 (`frontend`)
- Backend `GET /health` 엔드포인트 구현 완료
- Backend `POST /api/generate` 엔드포인트 구현 완료
- Backend `GET /api/download/:zipFileName` 엔드포인트 구현 완료
- `templates/manifest.json` 기반 composer result 생성 완료
- composer result 기반 실제 파일 생성 완료
  - 생성 경로: `backend/output/temp/{projectName}`
  - 응답에 `outputPath`, `generatedFiles` 포함
- 생성된 프로젝트 기반 ZIP 생성 완료
  - 생성 경로: `backend/output/zips/{projectName}.zip`
  - 응답에 `zipPath`, `zipFileName`, `zipSizeBytes` 포함
- frontend-backend ZIP 다운로드 연동 완료
  - frontend `Generate ZIP` 버튼이 backend API를 호출
  - backend 생성 완료 후 download endpoint 호출
  - 브라우저에서 ZIP 파일 다운로드 트리거

## 핵심 기능 요약

- 옵션 선택 (language, styling, optional tools)
- 파일 구조 preview
- install commands preview
- `package.json scripts` preview
- 프로젝트 ZIP 생성 및 다운로드

## Architecture

- Frontend: React + Vite + TypeScript, deployed on Vercel
- Backend: Node.js + Express API, deployed on Render
- Templates: manifest 기반 base/options 조합으로 프로젝트 생성

## Current Status

- `v1 deployed`
- End-to-end flow works in deployed environment:
  - option selection -> generate -> zip download
- Future work:
  - domain/theme 확장
  - additional template options
  - UX polish

## 프로젝트 구조

```txt
react-starter-composer/
├─ frontend/               # React + Vite + TypeScript, Preview UI
├─ backend/                # Express API, composer, project generator
├─ templates/              # base/js, base/ts, options, manifest
├─ .gitignore
├─ AGENTS.md
└─ README.md
```

## Local Development 실행 순서

### 1) Backend 실행

```bash
cd backend
npm install
npm run dev
```

### 2) Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

### 3) Backend 검증

```bash
cd backend
npm run check
```

브라우저에서 frontend에 접속한 뒤 옵션을 선택하고 `Generate ZIP`을 클릭하면 ZIP이 다운로드됩니다.

## Deployment

### Backend deployment on Render

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  - `PORT`: Render가 자동 제공하므로 수동 설정 불필요
  - `CORS_ORIGIN=https://your-vercel-domain.vercel.app`

### Frontend deployment on Vercel

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_BASE_URL=https://your-render-backend.onrender.com`

## API 설명

### GET /health

```bash
curl http://localhost:4000/health
```

예상 응답:

```json
{ "ok": true }
```

### POST /api/generate

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

예상 응답(요약):

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

### GET /api/download/:zipFileName

- `POST /api/generate` 응답으로 받은 `zipFileName`으로 호출
- 정상 파일이면 ZIP 다운로드 반환
- 잘못된 파일명은 `400`, 파일이 없으면 `404`

## 생성 결과 위치

- 생성 프로젝트 폴더: `backend/output/temp/{projectName}`
- 생성 ZIP 파일: `backend/output/zips/{projectName}.zip`
- 위 경로들은 `.gitignore` 대상이며 Git 추적 대상이 아닙니다.

## 배포 후 테스트 체크리스트

- Render 배포 URL에서 `/health` 응답 확인
- Vercel 배포 화면에서 `Generate ZIP` 클릭
- ZIP 다운로드가 정상적으로 시작되는지 확인
- 브라우저 콘솔/네트워크에서 CORS 오류가 없는지 확인

## 개발 로드맵

- [x] Phase 1: project setup
- [x] Phase 2: frontend preview UI
- [x] Phase 3: backend Express skeleton
- [x] Phase 4: templates manifest structure
- [x] Phase 5: manifest-driven composer result 생성
- [x] Phase 6: composer result 기반 프로젝트 파일 생성
- [x] Phase 7: ZIP 생성 로직
- [x] Phase 8: frontend-backend download integration
- [x] Phase 9-B: frontend error/loading UX polish
- [ ] Next Phase: deployment verification / portfolio polish

## Portfolio Summary

이 프로젝트는 다음 역량을 보여줍니다.
- React + TypeScript 기반 상태 관리 및 사용자 흐름 설계
- Express API 설계/검증/예외 처리
- 템플릿 기반 파일 생성 및 ZIP 파이프라인 구현
- frontend-backend 연동과 배포 환경(Vercel/Render) 구성
- 실서비스 관점의 안정화(입력 검증, 에러 응답, CORS, env 분리)

## 제외 범위

- Next.js
- Jest
- Redux Toolkit
- 서버에서 `npm install` 실행
- 자동 dependency version update
