async function performRequest(apiUrl: string, apiKey: string, payload: Record<string, unknown>) {
  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const contentType = resp.headers.get('content-type') || ''
  const text = await resp.text()
  return { ok: resp.ok, contentType, text }
}

function tryParseJsonSafe(s: unknown): unknown | null {
  if (typeof s === 'object' && s !== null) return s
  if (typeof s === 'string') {
    try { return JSON.parse(s) } catch { return null }
  }
  return null
}

export const handler = async (event: unknown) => {
  try {
    const isPost = typeof event === 'object' && event !== null && ('httpMethod' in (event as Record<string, unknown>)) && (event as Record<string, unknown>).httpMethod === 'POST'
    if (!isPost) return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }

    const bodyRaw = (event as Record<string, unknown>)?.body ?? '{}'
    let body: Record<string, unknown>
    try { body = JSON.parse(String(bodyRaw)) } catch { body = {} }

    const prompt = String(body.prompt ?? body.query ?? '')
    const apiKey = process.env.PERPLEXITY_API_KEY
    const apiUrl = 'https://api.perplexity.ai/chat/completions'
    if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: 'Missing PERPLEXITY_API_KEY' }) }

    const responseSchema = {
      type: 'json_schema',
      json_schema: {
        name: 'tasks_schema',
        schema: {
          type: 'object',
          properties: {
            tasks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  week_estimate: { type: 'number' },
                  day_estimate: { type: 'number' },
                  acceptance_criteria: { type: 'string' }
                },
                required: ['title']
              }
            }
          },
          required: ['tasks']
        },
        strict: true
      }
    }

    const payload: Record<string, unknown> = {
      model: 'sonar-pro',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 512,
      temperature: 0.2,
      response_format: responseSchema
    }

    const { ok, contentType, text } = await performRequest(apiUrl, apiKey, payload)

    let result: unknown
    if (contentType.includes('application/json')) {
      try {
        const parsed = JSON.parse(text)
        const choice = (parsed && Array.isArray(parsed.choices)) ? parsed.choices[0] : undefined
        const messageContent = choice?.message?.content ?? choice?.message ?? parsed
        result = tryParseJsonSafe(messageContent) ?? messageContent
      } catch {
        result = text
      }
    } else {
      result = tryParseJsonSafe(text) ?? text
    }

    return {
      statusCode: ok ? 200 : 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result })
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) }
  }
}
