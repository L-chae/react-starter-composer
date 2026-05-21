# AGENTS.md

## 1. Project Overview
- React Starter Composer는 GUI 기반 React + Vite 스타터 생성기다.
- 사용자가 언어, 스타일링, 테스트, 상태관리, 아이콘, 포맷팅 옵션을 선택하면 파일 구조와 설치 명령어를 미리 보여준다.
- 이후 백엔드에서 선택값에 따라 ZIP 프로젝트를 생성한다.

## 2. Directory Structure
- `frontend/`
- `backend/`
- `templates/`

## 3. Current Phase
- Phase 1: project setup 완료
- Phase 2: frontend preview UI 완료
- Next: backend Express skeleton

## 4. Frontend Rules
- 프론트 작업은 `frontend/` 안에서만 진행한다.
- React + TypeScript + Vite를 유지한다.
- 외부 UI 라이브러리를 추가하지 않는다.
- 스타일은 plain CSS를 유지한다.
- `Generate ZIP` 버튼은 백엔드 구현 전까지 placeholder로 유지한다.

## 5. Backend Rules
- 백엔드 작업은 `backend/` 안에서만 진행한다.
- Node.js + Express를 사용한다.
- `GET /health` 엔드포인트를 제공한다.
- `POST /api/generate` 엔드포인트를 제공한다.
- 서버 프로세스에서 `npm install`을 실행하지 않는다.

## 6. Template Rules
- 템플릿 작업은 `templates/` 안에서만 진행한다.
- `base/` + `options/` 구조를 사용한다.
- 옵션은 `manifest` 기반으로 관리한다.
- 초기 단계에서 모든 조합을 한 번에 지원하려고 하지 않는다.

## 7. Scope Exclusions
- Next.js
- Jest
- Redux Toolkit
- GitHub repo 자동 생성
- 자동 의존성 버전 업데이트
- 서버 측 `npm install` 실행

## 8. Validation
- Frontend: `npm run build` (in `frontend/`)
- Backend: `npm run dev` 또는 `npm start` (in `backend/`)
- 작업 후 `git status` 확인
