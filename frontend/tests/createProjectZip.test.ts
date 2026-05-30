// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import JSZip from 'jszip';
import { createProjectZip } from '../src/composer/createProjectZip';
import type { GeneratedFile } from '../src/types/composer';

const fileMock = vi.fn();
const generateAsyncMock = vi.fn();

vi.mock('jszip', () => {
  return {
    default: class {
      file = fileMock;
      generateAsync = generateAsyncMock;
    }
  };
});

describe('createProjectZip', () => {
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let createElementSpy: ReturnType<typeof vi.spyOn>;
  let appendChildSpy: ReturnType<typeof vi.spyOn>;

  const clickMock = vi.fn();
  const removeMock = vi.fn(); // removeChild 대신 remove 메서드 모킹

  beforeEach(() => {
    vi.clearAllMocks();

    generateAsyncMock.mockResolvedValue(new Blob(['zip-content']));

    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    const anchor = {
      href: '',
      download: '',
      click: clickMock,
      remove: removeMock, // 실제 구현인 link.remove() 대응
    } as unknown as HTMLAnchorElement;

    createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(anchor);
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => anchor);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('모든 파일을 zip의 최상위 폴더(프로젝트명) 아래에 추가해야 한다', async () => {
    const files: GeneratedFile[] = [
      { path: 'src/main.tsx', content: 'console.log("hello")', reason: 'entry' },
      { path: 'package.json', content: '{"name":"test"}', reason: 'package' },
    ];

    await createProjectZip('test-project', files);

    // 실제 구현 코드에 맞춰 프로젝트명이 접두어로 붙는지 검증
    expect(fileMock).toHaveBeenCalledWith('test-project/src/main.tsx', 'console.log("hello")');
    expect(fileMock).toHaveBeenCalledWith('test-project/package.json', '{"name":"test"}');
    
    expect(generateAsyncMock).toHaveBeenCalled();
  });

  it('zip 생성 후 올바른 이름으로 다운로드 링크를 생성하고 실행해야 한다', async () => {
    const files: GeneratedFile[] = [{ path: 'test.txt', content: 'hello', reason: 'test' }];

    await createProjectZip('my-app', files);

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test-url');

    // 제안하신 다운로드 파일명 검증 추가
    const anchor = createElementSpy.mock.results[0].value as HTMLAnchorElement;
    expect(anchor.download).toBe('my-app.zip');
  });

  it('빈 파일 배열이어도 예외 없이 동작해야 한다', async () => {
    await expect(createProjectZip('empty-project', [])).resolves.not.toThrow();
  });

  it('zip 생성 실패 시 에러를 전파해야 한다', async () => {
    generateAsyncMock.mockRejectedValueOnce(new Error('zip generation failed'));

    await expect(createProjectZip('broken-project', [])).rejects.toThrow('zip generation failed');
  });
});