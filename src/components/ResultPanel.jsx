const GRADE_ORDER = ['≤V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12+']

export default function ResultPanel({ result, loading, error }) {
  if (loading) {
    return (
      <div className="result-panel">
        <div className="loading-dots">
          <span /><span /><span />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="result-panel">
        <p className="error-msg">{error}</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="result-panel">
        <p className="result-placeholder">Click "Predict Grade" to see results</p>
      </div>
    )
  }

  const maxProb = Math.max(...Object.values(result.probabilities))

  return (
    <div className="result-panel">
      <div className="result-grade">
        <div className="grade-display">{result.grade}</div>
        <div className="grade-confidence">
          {(result.confidence * 100).toFixed(1)}% confidence
        </div>
      </div>
      <div className="prob-bars">
        {GRADE_ORDER.map(label => {
          const prob = result.probabilities[label] ?? 0
          return (
            <div key={label} className="prob-row">
              <span className="prob-label">{label}</span>
              <div className="prob-bar-track">
                <div
                  className={`prob-bar-fill ${label === result.grade ? 'predicted' : ''}`}
                  style={{ width: `${(prob / maxProb) * 100}%` }}
                />
              </div>
              <span className="prob-pct">{(prob * 100).toFixed(1)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
