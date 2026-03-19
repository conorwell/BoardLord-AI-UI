const TOOLS = [
  { role: 5, label: 'Start' },
  { role: 6, label: 'Hand' },
  { role: 7, label: 'Finish' },
  { role: 8, label: 'Foot' },
]

function roleDotStyle(role) {
  if (role === 'erase') return { background: 'var(--border)' }
  if (role === 5) return { background: 'var(--role-start)' }
  if (role === 6) return { background: 'var(--role-hand)' }
  if (role === 7) return { background: 'var(--role-finish)' }
  return { background: 'var(--role-foot)' }
}

export default function ToolPalette({ activeTool, onToolChange }) {
  return (
    <div className="sidebar-section">
      <h2>Tool</h2>
      <div className="tool-palette">
        {TOOLS.map(t => (
          <button
            key={t.role}
            className={`tool-btn${activeTool === t.role ? ' active' : ''}`}
            data-role={t.role}
            onClick={() => onToolChange(t.role)}
          >
            <span className="dot" style={roleDotStyle(t.role)} />
            {t.label}
            <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.4 }}>{t.key}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
