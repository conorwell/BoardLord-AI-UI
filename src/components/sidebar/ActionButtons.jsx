export default function ActionButtons({ canPredict, onPredict, onClear }) {
  return (
    <div className="sidebar-section">
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
