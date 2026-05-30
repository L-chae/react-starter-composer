import { describe, it, expect } from 'vitest';
import { sanitizeProjectName } from '../src/utils/sanitizeProjectName';

describe('sanitizeProjectName', () => {
  it('대문자를 소문자로 변환하고 공백을 하이픈으로 바꾼다', () => {
    expect(sanitizeProjectName('My React App')).toBe('my-react-app');
  });

  it('허용되지 않는 특수문자를 모두 제거한다', () => {
    expect(sanitizeProjectName('Hello @World! 2026')).toBe('hello-world-2026');
  });

  it('앞뒤 공백을 제거한다', () => {
    expect(sanitizeProjectName('  my-app  ')).toBe('my-app');
  });

  it('입력값이 비어있거나 공백만 있으면 기본값(my-react-app)을 반환한다', () => {
    expect(sanitizeProjectName('')).toBe('my-react-app');
    expect(sanitizeProjectName('   ')).toBe('my-react-app');
  });
  it('연속 공백을 하나의 하이픈으로 변환한다', () => {
  expect(sanitizeProjectName('my   react   app')).toBe('my-react-app');
});

it('이미 하이픈이 포함된 이름을 유지한다', () => {
  expect(sanitizeProjectName('my-react-app')).toBe('my-react-app');
});
});