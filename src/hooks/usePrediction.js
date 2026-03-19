import { useState } from 'react'

const SERVICE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://board-lord-model-service-529526058550.us-central1.run.app'

export function usePrediction() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function predict(holds, angle, isNomatch) {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const resp = await fetch(`${SERVICE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holds: holds.map(h => ({ position_id: h.position_id, role: h.role })),
          angle,
          is_nomatch: isNomatch,
        }),
      })
      if (!resp.ok) {
        const text = await resp.text()
        throw new Error(`Service error ${resp.status}: ${text}`)
      }
      const data = await resp.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { predict, result, loading, error }
}
