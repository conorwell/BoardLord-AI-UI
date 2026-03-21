export default function MatchingToggle({ isNomatch, onChange }) {
  return (
    <div className="sidebar-section">
      <h2>Matching</h2>
      <div className="toggle-row">
        <div className="toggle-label">
          <span>No Match</span>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={isNomatch}
            onChange={e => onChange(e.target.checked)}
          />
          <span className="toggle-track" />
        </label>
      </div>
    </div>
  )
}
