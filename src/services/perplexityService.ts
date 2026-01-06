export async function callPerplexity(prompt: string): Promise<unknown> {
  const isDev = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  
  if (isDev) {
    console.warn('Perplexity service not available in development, returning mock data')
    return {
      tasks: [
        { title: 'Изучить основы', done: false },
        { title: 'Практика', done: false },
        { title: 'Создать проект', done: false }
      ]
    }
  }
  
  const res = await fetch('/.netlify/functions/perplexity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  const text = await res.text()
  let parsed: unknown
  try { parsed = JSON.parse(text) } catch { parsed = null }
  if (parsed && typeof parsed === 'object') {
    const p = parsed as Record<string, unknown>
    if ('error' in p) throw new Error(String(p.error))
    if ('result' in p) return p.result
  }
  if (!res.ok) throw new Error(`Perplexity proxy error: ${res.status}`)
  return parsed
}
