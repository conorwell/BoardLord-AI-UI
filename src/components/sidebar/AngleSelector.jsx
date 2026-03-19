export default function AngleSelector({ angle, onAngleChange }) {
  return (
    <div className="sidebar-section">
      <div className="angle-header">
        <h2>Angle</h2>
        <span className="angle-value">{angle}°</span>
      </div>
      <input
        type="range"
        className="angle-slider"
        min={0}
        max={65}
        step={5}
        value={angle}
        onChange={e => onAngleChange(Number(e.target.value))}
        style={{ '--pct': angle / 65 }}
      />
      <svg viewBox="0 0 100 70" className="angle-viz">
        <line x1="35" y1="55" x2="35" y2="65"
          stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" />
        <line x1="35" y1="55" x2="35" y2="13"
          stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"
          style={{
            transformOrigin: '35px 55px',
            transform: `rotate(${angle}deg)`,
            transition: 'transform 0.2s ease',
          }}
        />
      </svg>
    </div>
  )
}
