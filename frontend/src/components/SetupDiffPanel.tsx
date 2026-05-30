import type { ComposerResult } from '../types/composer';

interface SetupDiffPanelProps {
  diff: ComposerResult['setupDiff'];
}

export function SetupDiffPanel({ diff }: SetupDiffPanelProps) {
  const hasChanges = diff.dependencies.length > 0 || diff.devDependencies.length > 0 || diff.scripts.length > 0;

  if (!hasChanges) {
    return (
      <div className="preview-card light" style={{ gridColumn: '1 / -1' }}>
        <h3>✨ Setup Summary</h3>
        <p style={{ color: '#666' }}>추가된 라이브러리 및 스크립트가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="preview-card" style={{ gridColumn: '1 / -1' }}>
      <h3>✨ Setup Summary (추가된 환경)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '10px' }}>
        
        <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>Dependencies</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#0056b3' }}>
            {diff.dependencies.map(d => <li key={d}>+ {d}</li>)}
          </ul>
        </div>

        <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>Dev Dependencies</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#198754' }}>
            {diff.devDependencies.map(d => <li key={d}>+ {d}</li>)}
          </ul>
        </div>

        <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>Scripts</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#d63384' }}>
            {diff.scripts.map(s => <li key={s}>+ {s}</li>)}
          </ul>
        </div>

      </div>
    </div>
  );
}