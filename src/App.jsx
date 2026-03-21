import { useState } from 'react'
import './App.css'
import BoardOverlay from './components/BoardOverlay'
import Sidebar from './components/sidebar/Sidebar'
import ResultPanel from './components/ResultPanel'
import ActionButtons from './components/sidebar/ActionButtons'
import { usePrediction } from './hooks/usePrediction'

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
        <Sidebar
          activeTool={activeTool}     onToolChange={setActiveTool}
          angle={angle}               onAngleChange={setAngle}
          isNomatch={isNomatch}       onNomatchChange={setIsNomatch}
          result={result}             loading={loading}             error={error}
          canPredict={canPredict}
          onPredict={() => predict(selectedHolds, angle, isNomatch)}
          onClear={() => setSelectedHolds([])}
        />
        <BoardOverlay
          selectedHolds={selectedHolds}
          activeTool={activeTool}
          onHoldClick={handleHoldClick}
        />
        <div className="mobile-bottom">
          <ResultPanel result={result} loading={loading} error={error} />
          <ActionButtons
            canPredict={canPredict}
            onPredict={() => predict(selectedHolds, angle, isNomatch)}
            onClear={() => setSelectedHolds([])}
          />
        </div>
      </div>
    </div>
  )
}
