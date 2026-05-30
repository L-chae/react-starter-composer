import { useState } from 'react';
import type { ComposerResult } from '../types/composer';
import { useComposerStore } from '../store/useComposerStore';
import { createProjectZip } from '../composer/createProjectZip';

const GENERATING_MESSAGE = '브라우저에서 프로젝트를 조립하고 ZIP을 생성 중입니다...';

interface GenerateZipButtonProps {
  resultData: ComposerResult;
}

export function GenerateZipButton({ resultData }: GenerateZipButtonProps) {
  const resetStore = useComposerStore((state) => state.reset);

  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleReset = () => {
    resetStore();
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

      // 분리된 순수 함수 호출
      await createProjectZip(resultData.projectName, resultData.files);

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