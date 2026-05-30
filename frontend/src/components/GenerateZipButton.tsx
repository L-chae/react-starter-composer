import { useState } from 'react';
import JSZip from 'jszip';
import type { ComposerResult } from '../types/composer';
import { useComposerStore } from '../store/useComposerStore';

const GENERATING_MESSAGE = '브라우저에서 프로젝트를 조립하고 ZIP을 생성 중입니다...';

interface GenerateZipButtonProps {
  // 코어 엔진이 조립한 최종 결과물을 Props로 받습니다.
  resultData: ComposerResult;
}

export function GenerateZipButton({ resultData }: GenerateZipButtonProps) {
  // 스토어에서 초기화 액션만 꺼내옵니다.
  const resetStore = useComposerStore((state) => state.reset);

  // 이 컴포넌트 안에서만 쓰이는 로컬 UI 상태들
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleReset = () => {
    resetStore(); // 전역 상태 초기화
    setStatusMessage('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleGenerateZip = async () => {
    try {
      setIsGenerating(true);
      setStatusMessage(GENERATING_MESSAGE);
      setErrorMessage('');
      setSuccessMessage('');

      if (!resultData.isGeneratable) {
        throw new Error(resultData.issues[0]?.message || '생성할 수 없는 설정입니다.');
      }

      // 브라우저 단독 압축 로직
      const zip = new JSZip();
      resultData.files.forEach(file => {
        zip.file(`${resultData.projectName}/${file.path}`, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${resultData.projectName}.zip`;
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);

      setStatusMessage('');
      setSuccessMessage(`${resultData.projectName}.zip 다운로드가 즉시 완료되었습니다. 🚀`);
    } catch (error) {
      setStatusMessage('');
      setErrorMessage(error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="button-row" style={{ marginTop: '20px' }}>
        <button type="button" className="secondary" onClick={handleReset}>초기화</button>
        <button type="button" className="primary" onClick={handleGenerateZip} disabled={isGenerating}>
          {isGenerating ? '압축 중...' : '즉시 Generate ZIP 🚀'}
        </button>
      </div>

      <div className="status-panel">
        {statusMessage && <p className="status-message status-info">{statusMessage}</p>}
        {errorMessage && <p className="status-message status-error">{errorMessage}</p>}
        {successMessage && <p className="status-message status-success">{successMessage}</p>}
      </div>
    </>
  );
}