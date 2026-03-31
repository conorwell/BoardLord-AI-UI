import { useState } from 'react'

const SERVICE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://board-lord-model-service-529526058550.us-central1.run.app'

function getClientId() {
  let id = localStorage.getItem('clientId')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('clientId', id)
  }
  return id
}

const sessionId = crypto.randomUUID()

function errorMessageForStatus(status) {
  switch (status) {
    case 422: return 'Something looks wrong with the problem data.'
    case 429: return 'Slow down — too many requests. Try again in a moment.'
    case 503: return 'Service is starting up. Try again in a few seconds.'
    default:  return 'Prediction failed. Please try again.'
  }
}

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
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': getClientId(),
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({
          holds: holds.map(h => ({ position_id: h.position_id, role: h.role })),
          angle,
          is_nomatch: isNomatch,
        }),
      })
      if (!resp.ok) {
        throw new Error(errorMessageForStatus(resp.status))
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
