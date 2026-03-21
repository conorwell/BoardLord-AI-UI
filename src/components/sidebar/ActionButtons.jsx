export default function ActionButtons({ canPredict, validationMsg, onPredict, onClear }) {
  return (
    <div className="sidebar-section">
      {validationMsg && <p className="validation-msg">{validationMsg}</p>}
      <button
        className="btn-primary"
        onClick={onPredict}
        disabled={!canPredict}
      >
        Predict Grade
      </button>
      <button
        className="btn-secondary"
        onClick={onClear}
      >
        Clear All
      </button>
    </div>
  )
}
