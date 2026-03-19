import { useEffect, useRef, useState } from 'react'

// Board coordinate ranges from position_map.json
const X_MIN = -64, X_MAX = 64   // inches, left to right
const Y_MIN = 4,   Y_MAX = 140  // inches, bottom to top

// Convert board (x, y) to percentage positions on the image.
// These offsets calibrate hold positions to the actual board area within the image.
// Adjust CAL_* values if holds appear misaligned.
const CAL_LEFT_PAD  = 0.04   // fraction of image width before left board edge
const CAL_RIGHT_PAD = 0.04   // fraction of image width after right board edge
const CAL_TOP_PAD   = 0.02   // fraction of image height above top board edge
const CAL_BOT_PAD   = 0.08   // fraction of image height below bottom board edge
const CAL_V_SCALE   = 1.07   // vertical stretch — increase if holds are too bunched vertically

function toPercent(x, y) {
  const xFrac = (x - X_MIN) / (X_MAX - X_MIN)  // 0 (left) → 1 (right)
  const yFrac = (Y_MAX - y) / (Y_MAX - Y_MIN)  // 0 (top)  → 1 (bottom)

  const left = CAL_LEFT_PAD + xFrac * (1 - CAL_LEFT_PAD - CAL_RIGHT_PAD)
  const top  = CAL_TOP_PAD  + yFrac * (1 - CAL_TOP_PAD  - CAL_BOT_PAD) * CAL_V_SCALE

  return { left: left * 100, top: top * 100 }
}

export default function BoardOverlay({ selectedHolds, activeTool, onHoldClick }) {
  const [positionMap, setPositionMap] = useState(null)
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const imgRef = useRef(null)

  useEffect(() => {
    fetch('/position_map.json')
      .then(r => r.json())
      .then(setPositionMap)
  }, [])

  function handleImgLoad(e) {
    setImgSize({ w: e.target.naturalWidth, h: e.target.naturalHeight })
  }

  // Button size scales with image height (clamped 10–18px)
  const btnSize = Math.max(14, Math.min(18, (imgSize.h || 800) * 0.015))

  return (
    <div className="board-area">
      <div className="board-container">
        <img
          ref={imgRef}
          src="/TB2_Mirror_Image.png"
          alt="Tension Board 2 Mirror"
          onLoad={handleImgLoad}
          draggable={false}
        />
        {positionMap && Object.entries(positionMap).map(([posId, [x, y]]) => {
          const pos = toPercent(x, y)
          const selectedHold = selectedHolds.find(h => h.position_id === Number(posId))
          const role = selectedHold?.role ?? null
          return (
            <button
              key={posId}
              className={`hold-btn${role ? ` role-${role}` : ''}`}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                width: btnSize,
                height: btnSize,
              }}
              onClick={() => onHoldClick(Number(posId), x, y)}
              title={`Position ${posId}  (${x}, ${y})`}
            />
          )
        })}
      </div>
    </div>
  )
}
