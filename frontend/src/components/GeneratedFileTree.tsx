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
    <>
      <h2>2. 생성 결과 실시간 미리보기</h2>
      <div className="preview-grid">
        <div className="preview-card light">
          <h3>선택된 스택</h3>
          <div className="badge-list">
            {preview.stacks.map((stack) => (
              <span className="badge" key={stack}>
                {stack}
              </span>
            ))}
          </div>
        </div>

        <div className="preview-card">
          <h3>가상 파일 트리</h3>
          <pre>{preview.fileTree}</pre>
        </div>

        <div className="preview-card" style={{ gridColumn: "1 / -1" }}>
          <h3>🔥 실시간 package.json 결과물</h3>
          <pre style={{ maxHeight: "400px", overflowY: "auto" }}>
            {JSON.stringify(preview.packageJsonData, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}
