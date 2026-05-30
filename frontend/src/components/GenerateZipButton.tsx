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
    <div className="flex flex-col gap-4 pt-6 border-t border-gray-100">
      
      {/* 상태 메시지 알림창 */}
      <div className="flex flex-col gap-2 empty:hidden">
        {statusMessage && <div className="px-4 py-3 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100">{statusMessage}</div>}
        {errorMessage && <div className="px-4 py-3 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-100">{errorMessage}</div>}
        {successMessage && <div className="px-4 py-3 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-100">{successMessage}</div>}
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-3">
        <button 
          type="button" 
          onClick={handleReset}
          className="px-5 py-3 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          초기화
        </button>
        <button 
          type="button" 
          onClick={handleGenerateZip} 
          disabled={isGenerating || !resultData.isGeneratable}
          className={`flex-1 py-3 rounded-lg font-bold text-white transition-all shadow-sm flex justify-center items-center gap-2 ${
            isGenerating || !resultData.isGeneratable
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-900 hover:bg-black hover:shadow-md'
          }`}
        >
          {isGenerating ? '압축 중...' : '즉시 Generate ZIP 🚀'}
        </button>
      </div>
    </div>
  );
}
