import type { GeneratedFile } from '../types/composer';

/**
 * 생성된 가상 파일 목록을 트리 형태의 문자열로 변환합니다.
 */
export function buildFileTree(projectName: string, files: GeneratedFile[]): string {
  return `${projectName}/\n` + files.map(f => `├─ ${f.path}`).join('\n');
}