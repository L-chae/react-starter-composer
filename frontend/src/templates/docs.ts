import type { ComposerSelection } from '../types/composer';

export function getReadmeTemplate(projectName: string): string {
  return `# ${projectName}

이 프로젝트는 React Starter Composer v2로 생성되었습니다.

## 시작하기
\`\`\`bash
npm install
npm run dev
\`\`\`

초기 세팅 시 어떤 파일과 라이브러리들이 추가되었는지 확인하려면 \`SETUP_REPORT.md\`를 참조하십시오.
`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSetupReportTemplate(selection: ComposerSelection, diff: any): string {
  return `# Setup Report

## 1. Selected Stack
- **Language:** ${selection.language === 'ts' ? 'TypeScript' : 'JavaScript'}
- **Styling:** ${selection.styling === 'tailwind' ? 'Tailwind CSS' : 'Basic CSS'}

## 2. Added Libraries
${selection.selectedLibraries.length > 0 ? selection.selectedLibraries.map(lib => `- ${lib}`).join('\n') : '없음'}

## 3. Setup Diff (Changes)

### Dependencies
${diff.dependencies.length > 0 ? diff.dependencies.map((d: string) => `- \`${d}\``).join('\n') : '추가됨 없음'}

### Dev Dependencies
${diff.devDependencies.length > 0 ? diff.devDependencies.map((d: string) => `- \`${d}\``).join('\n') : '추가됨 없음'}

### Scripts
${diff.scripts.length > 0 ? diff.scripts.map((s: string) => `- \`${s}\``).join('\n') : '추가됨 없음'}
`;
}