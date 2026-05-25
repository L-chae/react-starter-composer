# AGENTS.md

## 1. Project Overview

- React Starter Composer는 GUI 기반 React + Vite 스타터 생성기다.
- 사용자가 옵션을 선택하면 파일 구조, 설치 명령어, `package.json scripts`를 preview 한다.
- 이후 backend composer가 templates를 조립하고 ZIP으로 제공한다.

## 2. Current Phase

- Completed:
  - project setup
  - frontend preview UI
  - backend Express skeleton
  - templates manifest structure
  - manifest-driven composer result generation
  - project file generation to `backend/output/temp/{projectName}`
  - Phase 7 ZIP generation
  - Phase 8 frontend-backend download integration
  - Phase 9-B frontend error/loading UX polish
- Next:
  - Phase 9-D deploy readiness
- Not yet:
  - deployment verification (Vercel + Render)
  - portfolio polish

## 3. Directory Rules

- `frontend/`: UI와 preview 상태 관리
- `backend/`: API, composer, ZIP 생성 로직
- `templates/`: base template, option template, manifest
- `output/`, `temp/` 생성물은 Git에 포함하지 않는다.

## 4. Development Rules

- 한 번에 하나의 Phase만 진행한다.
- 작업 전 `git status`를 확인한다.
- 작업 후 검증 명령어를 실행한다.
- 기능 커밋 후 다음 Phase로 진행한다.
- `frontend/backend/templates`를 동시에 크게 수정하지 않는다.
- `AGENTS.md`는 Phase 변화나 실행 규칙 변화가 있을 때만 업데이트한다.
- Phase 9에서는 기능 확장보다 안정화를 우선한다.
- 대규모 구조 변경을 금지한다.
- 기존 동작을 깨지 않는 개선만 진행한다.
- 배포 전에는 기능 확장을 금지하고 안정화/검증을 우선한다.

## 5. Frontend Rules

- React + TypeScript + Vite를 유지한다.
- 외부 UI 라이브러리 추가를 금지한다.
- plain CSS를 유지한다.
- 다운로드 상태 UX 개선은 가능하다.
- 에러 메시지 개선은 가능하다.

## 6. Backend Rules

- Node.js + Express를 유지한다.
- 서버에서 `npm install` 실행을 금지한다.
- 생성 프로젝트 의존성은 README/installCommands로 안내한다.
- composer 로직을 ZIP 로직보다 먼저 구현한다.
- `fs-extra`는 composer phase에서 필요 시 추가 가능하다.
- ZIP 생성 로직은 구현 완료 상태로 유지한다.
- ZIP 생성 경로는 `backend/output/zips`로 유지한다.
- ZIP 내부 루트에는 `package.json`, `src/`, `README.md`가 바로 보이게 유지한다.
- download endpoint를 유지한다.
- path traversal 방지 검증을 유지한다.

## 6-1. Output Rules

- 프로젝트 생성물: `backend/output/temp`
- ZIP 생성물: `backend/output/zips`
- 위 경로는 Git 추적 대상에서 제외한다.

## 7. Template Rules

- `manifest.json` 기반으로 옵션을 관리한다.
- 모든 조합을 한 번에 지원하려고 하지 않는다.
- 현재 지원 범위:
  - `js` / `ts`
  - `css` / `tailwind`
  - `vitest`
  - `zustand`
  - `lucide`
  - `prettier`

## 8. Scope Exclusions

- Next.js
- Jest
- Redux Toolkit
- GitHub repo 자동 생성
- 자동 dependency version update
- 서버 측 `npm install`
- 모든 React 라이브러리 조합 지원

## 9. Validation Commands

- frontend build

```bash
cd frontend
npm run build
```

- backend

```bash
cd backend
npm run check
```

- backend run

```bash
cd backend
npm run dev
```

- generate API 확인
- `POST /api/generate` 응답에서 `zipPath`, `zipFileName`, `zipSizeBytes` 확인
- 브라우저에서 `Generate ZIP` 다운로드 수동 확인
- git

```bash
git status --short
```
