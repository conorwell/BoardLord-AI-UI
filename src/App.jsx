import { useState } from 'react'
import './App.css'
import BoardOverlay from './components/BoardOverlay'
import ResultPanel from './components/ResultPanel'
import { usePrediction } from './hooks/usePrediction'

const ANGLES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65]

const TOOLS = [
  { role: 5,       label: 'Start',  key: 'S' },
  { role: 6,       label: 'Hand',   key: 'H' },
  { role: 7,       label: 'Finish', key: 'F' },
  { role: 8,       label: 'Foot',   key: 'T' },
  { role: 'erase', label: 'Erase',  key: 'E' },
]

function roleCount(holds, role) {
  return holds.filter(h => h.role === role).length
}

function roleDotStyle(role) {
  if (role === 'erase') return { background: 'var(--border)' }
  if (role === 5) return { background: 'var(--role-start)' }
  if (role === 6) return { background: 'var(--role-hand)' }
  if (role === 7) return { background: 'var(--role-finish)' }
  return { background: 'var(--role-foot)' }
}

export default function App() {
  const [selectedHolds, setSelectedHolds] = useState([])
  const [activeTool, setActiveTool]       = useState(6)
  const [angle, setAngle]                 = useState(40)
  const [isNomatch, setIsNomatch]         = useState(false)
  const { predict, result, loading, error } = usePrediction()

  function handleHoldClick(positionId) {
    if (activeTool === 'erase') {
      setSelectedHolds(prev => prev.filter(h => h.position_id !== positionId))
      return
    }
    setSelectedHolds(prev => {
      const existing = prev.find(h => h.position_id === positionId)
      if (existing) {
        if (existing.role === activeTool) {
          return prev.filter(h => h.position_id !== positionId)
        }
        return prev.map(h => h.position_id === positionId ? { ...h, role: activeTool } : h)
      }
      return [...prev, { position_id: positionId, role: activeTool }]
    })
  }

  const canPredict = selectedHolds.length > 0 && !loading

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>BoardLord.AI</h1>
          <p className="subtitle">Tension Board 2 Mirror — Grade Predictor</p>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">

          <div className="sidebar-section">
            <h2>Tool</h2>
            <div className="tool-palette">
              {TOOLS.map(t => (
                <button
                  key={t.role}
                  className={`tool-btn${activeTool === t.role ? ' active' : ''}`}
                  data-role={t.role}
                  onClick={() => setActiveTool(t.role)}
                >
                  <span className="dot" style={roleDotStyle(t.role)} />
                  {t.label}
                  <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.4 }}>{t.key}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h2>Angle — {angle}°</h2>
            <div className="angle-grid">
              {ANGLES.map(a => (
                <button
                  key={a}
                  className={`angle-btn${angle === a ? ' active' : ''}`}
                  onClick={() => setAngle(a)}
                >
                  {a}°
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h2>Matching</h2>
            <div className="toggle-row">
              <div className="toggle-label">
                <span>No Match</span>
                <span>Finish must be one-handed</span>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={isNomatch}
                  onChange={e => setIsNomatch(e.target.checked)}
                />
                <span className="toggle-track" />
              </label>
            </div>
          </div>

          <div className="sidebar-section">
            <h2>Holds</h2>
            <div className="hold-counts">
              {[
                { role: 5, label: 'Start',  cls: 'dot-start'  },
                { role: 6, label: 'Hand',   cls: 'dot-hand'   },
                { role: 7, label: 'Finish', cls: 'dot-finish' },
                { role: 8, label: 'Foot',   cls: 'dot-foot'   },
              ].map(({ role, label, cls }) => (
                <div key={role} className="count-row">
                  <span className="label">
                    <span className={`dot ${cls}`} />
                    {label}
                  </span>
                  <span className="num">{roleCount(selectedHolds, role)}</span>
                </div>
              ))}
              <div className="count-row" style={{ marginTop: 4, borderTop: '1px solid var(--border)', paddingTop: 6 }}>
                <span className="label" style={{ color: 'var(--text-muted)' }}>Total</span>
                <span className="num">{selectedHolds.length}</span>
              </div>
            </div>
          </div>

          <ResultPanel result={result} loading={loading} error={error} />

          <div className="sidebar-section">
            <button
              className="btn-primary"
              onClick={() => predict(selectedHolds, angle, isNomatch)}
              disabled={!canPredict}
            >
              Predict Grade
            </button>
            <button
              className="btn-secondary"
              onClick={() => setSelectedHolds([])}
            >
              Clear All
            </button>
          </div>

        </aside>

        <BoardOverlay
          selectedHolds={selectedHolds}
          activeTool={activeTool}
          onHoldClick={handleHoldClick}
        />
      </div>
    </div>
  )
}
