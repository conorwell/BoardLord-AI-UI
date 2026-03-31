import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePrediction } from './usePrediction'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function mockFetch(status, body) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  })
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('clientId', () => {
  it('generates a valid UUID and persists it', () => {
    mockFetch(200, {})
    const first = localStorage.getItem('clientId')
    expect(first).toBeNull()

    // Trigger a predict call so getClientId() runs
    global.fetch = mockFetch(200, { grade: 'V5', probabilities: {} })
    const { result } = renderHook(() => usePrediction())
    act(() => { result.current.predict([], 40, false) })

    const stored = localStorage.getItem('clientId')
    expect(stored).toMatch(UUID_RE)
  })

  it('reuses the same clientId across calls', async () => {
    global.fetch = mockFetch(200, { grade: 'V5', probabilities: {} })
    const { result } = renderHook(() => usePrediction())

    await act(() => result.current.predict([], 40, false))
    const id1 = localStorage.getItem('clientId')

    await act(() => result.current.predict([], 40, false))
    const id2 = localStorage.getItem('clientId')

    expect(id1).toBe(id2)
  })
})

describe('request headers', () => {
  it('sends X-Client-ID and X-Session-ID on every request', async () => {
    global.fetch = mockFetch(200, { grade: 'V5', probabilities: {} })
    const { result } = renderHook(() => usePrediction())

    await act(() => result.current.predict([], 40, false))

    const [, options] = global.fetch.mock.calls[0]
    expect(options.headers['X-Client-ID']).toMatch(UUID_RE)
    expect(options.headers['X-Session-ID']).toMatch(UUID_RE)
  })

  it('sends the same session ID on repeated calls', async () => {
    global.fetch = mockFetch(200, { grade: 'V5', probabilities: {} })
    const { result } = renderHook(() => usePrediction())

    await act(() => result.current.predict([], 40, false))
    await act(() => result.current.predict([], 40, false))

    const sid1 = global.fetch.mock.calls[0][1].headers['X-Session-ID']
    const sid2 = global.fetch.mock.calls[1][1].headers['X-Session-ID']
    expect(sid1).toBe(sid2)
  })
})

describe('error messages', () => {
  const cases = [
    [422, 'Something looks wrong with the problem data.'],
    [429, 'Slow down — too many requests. Try again in a moment.'],
    [503, 'Service is starting up. Try again in a few seconds.'],
    [500, 'Prediction failed. Please try again.'],
  ]

  it.each(cases)('status %i → correct message', async (status, expected) => {
    global.fetch = mockFetch(status, { detail: 'raw server message' })
    const { result } = renderHook(() => usePrediction())

    await act(() => result.current.predict([], 40, false))

    expect(result.current.error).toBe(expected)
    expect(result.current.result).toBeNull()
  })
})

describe('success', () => {
  it('sets result on 200', async () => {
    const payload = { grade: 'V5', probabilities: { V4: 0.2, V5: 0.6, V6: 0.2 } }
    global.fetch = mockFetch(200, payload)
    const { result } = renderHook(() => usePrediction())

    await act(() => result.current.predict([], 40, false))

    expect(result.current.result).toEqual(payload)
    expect(result.current.error).toBeNull()
  })
})
