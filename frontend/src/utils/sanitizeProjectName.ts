/**
 * 프로젝트 이름을 npm 명명 규칙에 맞게 정제합니다.
 */
export function sanitizeProjectName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'my-react-app';
  
  return trimmed
    .toLowerCase()
    .replace(/\s+/g, '-')          // 공백을 하이픈으로 변경
    .replace(/[^a-z0-9_.-]/g, ''); // 허용되지 않는 문자 제거
}