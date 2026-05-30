import JSZip from 'jszip';
import type { GeneratedFile } from '../types/composer';

/**
 * 조립된 파일 목록을 브라우저 메모리에서 ZIP으로 압축하여 다운로드합니다.
 */
export async function createProjectZip(projectName: string, files: GeneratedFile[]): Promise<void> {
  const zip = new JSZip();
  
  files.forEach(file => {
    zip.file(`${projectName}/${file.path}`, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${projectName}.zip`;
  
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
}