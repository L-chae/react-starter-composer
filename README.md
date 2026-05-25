# React Starter Composer

GUI에서 옵션을 선택해 **React + Vite 스타터 프로젝트를 생성하고 ZIP으로 다운로드할 수 있는 개발 도구**입니다.

현재 문서는 **v1 배포 완료 상태**를 기준으로 작성되었습니다.

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://react-starter-composer.vercel.app)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://react-starter-composer-backend.onrender.com/health)

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)

---

## Overview

React Starter Composer는 반복적인 React 프로젝트 초기 설정을 줄이기 위해 만든 스타터 생성기입니다.

사용자는 화면에서 언어, 스타일링, 테스트 도구, 상태 관리 도구 등을 선택하고, 선택 결과에 따라 생성될 파일 구조와 설치 명령어를 미리 확인할 수 있습니다. 이후 백엔드는 선택값을 기반으로 템플릿을 조합해 실제 프로젝트 폴더와 ZIP 파일을 생성합니다.

이 프로젝트는 단순한 정적 UI가 아니라, **프론트엔드 옵션 선택 → 백엔드 템플릿 조합 → 프로젝트 파일 생성 → ZIP 다운로드**까지 이어지는 전체 흐름을 구현하는 데 초점을 두었습니다.

---

## Key Features

- GUI 기반 React 스타터 옵션 선택
- JavaScript / TypeScript 선택 지원
- Basic CSS / Tailwind CSS 선택 지원
- Vitest, Zustand, Lucide React, Prettier 옵션 지원
- 선택값 기반 파일 구조, 설치 명령어, `package.json scripts` 미리보기
- 프론트엔드-백엔드 API 연동
- `manifest.json` 기반 템플릿 조합
- 실제 프로젝트 폴더 및 README 생성
- ZIP 파일 생성 및 브라우저 다운로드
- 로딩 / 성공 / 에러 상태 UI 처리
- 입력값 검증 및 일관된 에러 응답 처리
- Vercel / Render 배포 환경 대응

---

## Technical Highlights

### Manifest 기반 템플릿 조합

옵션별 파일과 의존성을 하드코딩하지 않고 `templates/manifest.json`을 기준으로 관리했습니다. 이를 통해 새로운 옵션을 추가할 때 생성 로직 전체를 수정하지 않고, manifest와 템플릿 파일을 확장하는 방식으로 대응할 수 있도록 구성했습니다.

### Preview UI와 생성 결과 동기화

사용자가 선택한 옵션에 따라 예상 파일 구조, 설치 명령어, `package.json scripts`가 즉시 변경되도록 구현했습니다. 실제 ZIP 생성 전에 결과를 미리 확인할 수 있어 사용자가 생성 결과를 예측할 수 있습니다.

### 프로젝트 파일 생성 및 ZIP 압축 처리

백엔드는 선택된 옵션을 바탕으로 base template과 option template을 조합하고, 실제 프로젝트 폴더를 생성한 뒤 `archiver`를 사용해 ZIP 파일로 압축합니다. 생성된 ZIP은 다운로드 API를 통해 브라우저에서 받을 수 있습니다.

### 입력값 검증과 경로 보안 처리

프로젝트 이름을 sanitize하고, 다운로드 파일명을 검증해 잘못된 파일명이나 path traversal 시도를 차단했습니다. API 에러는 일관된 JSON 형태로 반환되도록 정리했습니다.

### 배포 환경 분리

프론트엔드와 백엔드를 각각 Vercel, Render에 배포하고, 로컬과 배포 환경의 API 주소 및 CORS 설정을 환경변수로 분리했습니다.

---

## How It Works

```txt
사용자 옵션 선택
        ↓
Preview UI 갱신
파일 구조 / 설치 명령어 / scripts 미리보기
        ↓
Generate ZIP 클릭
        ↓
프론트엔드에서 POST /api/generate 요청
        ↓
백엔드에서 manifest 기반 템플릿 조합
        ↓
프로젝트 폴더 생성
        ↓
ZIP 파일 생성
        ↓
프론트엔드에서 다운로드 API 호출
        ↓
브라우저에서 ZIP 다운로드
```

---

## Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![archiver](https://img.shields.io/badge/archiver-ZIP%20generation-6B7280?style=flat-square)
![fs/path](https://img.shields.io/badge/fs%20%2F%20path-File%20system-6B7280?style=flat-square)

### Deployment

![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)

---

## Project Structure

```txt
react-starter-composer/
├─ frontend/               # React + Vite + TypeScript 프론트엔드
├─ backend/                # Express API, composer, generator, ZIP 처리
├─ templates/              # base template, option template, manifest
├─ .gitignore
├─ AGENTS.md
└─ README.md
```

---

## Getting Started

### 1. Backend 실행

```bash
cd backend
npm install
npm run dev
```

기본 실행 주소는 다음과 같습니다.

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

### 2. Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

기본 실행 주소는 다음과 같습니다.

```txt
http://localhost:5173
```

브라우저에서 프론트엔드에 접속한 뒤 옵션을 선택하고 `Generate ZIP` 버튼을 클릭하면 ZIP 파일이 다운로드됩니다.

---

## Environment Variables

### Frontend

`frontend/.env.example`

```env
VITE_API_BASE_URL=http://localhost:4000
```

배포 환경에서는 Vercel에 다음 값을 등록합니다.

```env
VITE_API_BASE_URL=https://react-starter-composer-backend.onrender.com
```

### Backend

`backend/.env.example`

```env
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

배포 환경에서는 Render에 다음 값을 등록합니다.

```env
CORS_ORIGIN=https://react-starter-composer.vercel.app
```

Render는 `PORT`를 자동으로 제공하므로 배포 환경에서는 직접 설정하지 않아도 됩니다.

---

## API Reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | 백엔드 서버 상태 확인 |
| `POST` | `/api/generate` | 선택 옵션 기반 프로젝트 파일 및 ZIP 생성 |
| `GET` | `/api/download/:zipFileName` | 생성된 ZIP 파일 다운로드 |

### POST `/api/generate`

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

### GET `/api/download/:zipFileName`

예시:

```txt
GET /api/download/my-react-app.zip
```

동작 방식:

- 정상 파일이면 ZIP 다운로드 반환
- 잘못된 파일명은 `400` 응답 반환
- 존재하지 않는 ZIP 파일은 `404` 응답 반환

---

## Output Directory

백엔드에서 생성되는 파일은 아래 경로에 저장됩니다.

```txt
backend/output/temp/{projectName}
backend/output/zips/{projectName}.zip
```

해당 경로는 `.gitignore`에 포함되어 Git에 올라가지 않습니다.

---

## Validation

백엔드 검증 명령어:

```bash
cd backend
npm run check
```

검증 항목:

- TypeScript 풀옵션 프로젝트 생성
- JavaScript 기본 프로젝트 생성
- ZIP 파일 생성
- 잘못된 입력값 처리
- 잘못된 다운로드 파일명 차단

---

## Deployment

### Backend: Render

```txt
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

환경변수:

```env
CORS_ORIGIN=https://react-starter-composer.vercel.app
```

배포 후 상태 확인:

```bash
curl https://react-starter-composer-backend.onrender.com/health
```

### Frontend: Vercel

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

## Deployment Checklist

- [ ] Render 백엔드 `/health` 응답 확인
- [ ] Vercel 프론트엔드 접속 확인
- [ ] 옵션 선택 후 `Generate ZIP` 실행 확인
- [ ] ZIP 파일 다운로드 확인
- [ ] 압축 해제 후 `package.json`, `README.md`, `src/` 확인
- [ ] 브라우저 콘솔에서 CORS 오류 여부 확인

---

## Scope

v1에서는 아래 기능을 의도적으로 제외했습니다.

- Next.js 지원
- Jest 지원
- Redux Toolkit 지원
- 서버에서 `npm install` 실행
- 자동 dependency version update
- 모든 React 라이브러리 조합 지원

이 프로젝트는 모든 도구를 지원하는 범용 생성기가 아니라, **React + Vite 기준의 핵심 개발 환경을 안정적으로 조립하는 도구**를 목표로 합니다.

---

## Roadmap

- [x] 프로젝트 기본 구조 생성
- [x] 프론트엔드 Preview UI 구현
- [x] 백엔드 Express API 구현
- [x] 템플릿 manifest 구조 설계
- [x] manifest 기반 composer result 생성
- [x] composer result 기반 프로젝트 파일 생성
- [x] ZIP 생성 로직 구현
- [x] 프론트엔드-백엔드 다운로드 연동
- [x] env / CORS / PORT 배포 설정
- [x] 백엔드 입력 검증 강화
- [x] 프론트엔드 에러 / 로딩 UX 개선
- [x] Vercel / Render 배포 검증
- [ ] 도메인 기반 스타터 추가
- [ ] 테마 선택 기능 추가
- [ ] 템플릿 엔진 방식 도입
- [ ] 생성 프로젝트용 `LEARN.md` 자동 생성

---

## Future Improvements

### 도메인 기반 스타터

쇼핑몰, 대시보드, 블로그, 포트폴리오 등 목적에 맞는 폴더 구조와 예제 컴포넌트를 생성할 수 있도록 확장할 수 있습니다.

### 테마 선택

기본형, 미니멀, 대시보드형, 카드형 UI 등 테마에 따라 예제 컴포넌트와 스타일 구성을 다르게 생성할 수 있습니다.

### 템플릿 엔진화

현재는 파일 복사 중심이지만, 이후에는 템플릿 파일 안에 변수를 넣고 치환하는 방식으로 확장할 수 있습니다.

```txt
{{PROJECT_NAME}}
{{ICON_LIBRARY}}
{{THEME_NAME}}
```

### LEARN.md 자동 생성

생성된 프로젝트 안에 선택한 기술 스택에 대한 설명과 학습 순서를 담은 `LEARN.md`를 함께 생성할 수 있습니다.
