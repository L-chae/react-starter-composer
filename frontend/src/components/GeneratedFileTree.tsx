import type { PackageJsonData } from "../types/composer";

interface GeneratedFileTreeProps {
  preview: {
    stacks: string[];
    fileTree: string;
    packageJsonData: PackageJsonData;
  };
}

export function GeneratedFileTree({ preview }: GeneratedFileTreeProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* 1. 선택된 스택 (배지 형태) */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">선택된 스택</h3>
        <div className="flex flex-wrap gap-2">
          {preview.stacks.map((stack) => (
            <span key={stack} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
              {stack}
            </span>
          ))}
        </div>
      </div>

      {/* 2. 가상 파일 트리 (다크모드 터미널 스타일) */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">가상 파일 트리</h3>
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <pre className="p-4 text-sm text-gray-300 font-mono overflow-x-auto leading-relaxed">
            {preview.fileTree}
          </pre>
        </div>
      </div>

      {/* 3. package.json 결과물 (다크모드 터미널 스타일) */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">🔥 실시간 package.json</h3>
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <pre className="p-4 text-sm text-[#a5b4fc] font-mono overflow-y-auto max-h-[400px] leading-relaxed custom-scrollbar">
            {JSON.stringify(preview.packageJsonData, null, 2)}
          </pre>
        </div>
      </div>

    </div>
  );
}