# React Starter Composer

React 프로젝트 스타터를 GUI로 조합하고 미리보기하는 도구를 목표로 하는 프로젝트입니다.  
현재는 프론트엔드 Preview UI까지 구현되어 있으며, 백엔드/템플릿/ZIP 생성 기능은 아직 구현 전 단계입니다.

## 1. 프로젝트 소개

`React Starter Composer`는 React 프로젝트 생성에 필요한 옵션(언어, 스타일링, 부가 라이브러리)을 선택하면,
예상 파일 구조와 설치 명령을 미리 보여주는 GUI 기반 도구입니다.

최종 목표는 선택한 옵션에 맞는 프로젝트 파일을 조립해 ZIP으로 다운로드하는 것입니다.

## 2. 현재 구현 상태

- GitHub 저장소 연결 완료
- `frontend` 생성 완료 (React + Vite + TypeScript)
- 프론트엔드 Preview UI 구현 완료
- `backend`는 폴더만 생성됨 (서버 미구현)
- `templates`는 폴더만 생성됨 (템플릿 구조 미구현)
- ZIP 다운로드 기능 미구현

## 3. 주요 기능

현재 사용 가능한 기능:
- 프로젝트 이름 입력
- 언어 선택 (TypeScript / JavaScript)
- 스타일링 선택 (Basic CSS / Tailwind CSS)
- 추가 옵션 선택 (Vitest, Zustand, Lucide React, Prettier)
- 선택 결과 기반 Preview 표시
  - 선택 스택
  - 예상 파일 트리
  - 설치 명령어
  - `package.json` scripts 예시

아직 미구현:
- 실제 파일 생성
- 백엔드 API 연동
- ZIP 다운로드

## 4. 프로젝트 구조

```txt
react-starter-composer/
├─ frontend/      # React + Vite + TypeScript, Preview UI 구현
├─ backend/       # 현재 폴더만 존재 (.gitkeep)
├─ templates/     # 현재 폴더만 존재 (.gitkeep)
├─ .gitignore
└─ README.md
```

## 5. 기술 스택

현재 적용된 스택:
- Frontend: React 19, TypeScript, Vite
- Styling: CSS

계획된 스택(미구현):
- Backend: Node.js + Express
- Template/File Assembly: fs 계열 유틸리티
- ZIP: archiver 또는 동급 라이브러리

## 6. 실행 방법

현재 실행 가능한 대상은 프론트엔드입니다.

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 Vite 개발 서버 주소로 접속하면 Preview UI를 확인할 수 있습니다.

## 7. 개발 로드맵

- [x] Phase 0. 기획 정리(초기 범위 정의)
- [x] Phase 1. 저장소/폴더 구조 생성
- [x] Phase 2. 프론트엔드 Preview UI 구현
- [ ] Phase 3. 백엔드 Express 서버 뼈대 구현
- [ ] Phase 4. 템플릿 manifest 구조 설계
- [ ] Phase 5. 파일 조립 로직 구현
- [ ] Phase 6. ZIP 다운로드 구현
- [ ] Phase 7. README/포트폴리오 정리(최종)

## 8. 제외 범위

현재 범위에 포함하지 않는 항목:
- 계정/인증 시스템
- 템플릿 마켓플레이스 기능
- 클라우드 저장/배포 자동화
- 모노레포/멀티프레임워크(Next.js, Vue 등) 동시 지원
