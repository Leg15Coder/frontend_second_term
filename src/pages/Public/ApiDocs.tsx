import React from 'react'
import MockLayout from './MockLayout'
import { Link } from 'react-router-dom'

const ApiDocs: React.FC = () => {
  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Полная документация API</h1>
          <p className="text-muted-foreground">Здесь собрана расширенная документация по REST API приложения: схемы ресурсов, примеры запросов/ответов и рекомендации по интеграции.</p>

          <div className="flex gap-3">
            <Link to="/openapi.yaml" className="inline-block px-4 py-2 rounded bg-turquoise text-background">Скачать OpenAPI (raw)</Link>
            <Link to="/public/swagger" className="inline-block px-4 py-2 rounded bg-gold text-background">Открыть Swagger (статический)</Link>
          </div>

          <section className="glass-card p-6">
            <h2 className="text-xl font-semibold">Общие сведения</h2>
            <p className="mt-2 text-sm text-muted-foreground">Base URL: <code className="font-mono">{`<VITE_API_BASE_URL>`}</code>.</p>
            <p className="mt-2 text-sm text-muted-foreground">Аутентификация: JWT в заголовке <code className="font-mono">Authorization: Bearer &lt;token&gt;</code>. Клиент автоматически добавляет токен из localStorage (ключ 'token').</p>
          </section>

          <section className="glass-card p-6">
            <h3 className="text-lg font-semibold">/api/habits</h3>
            <p className="text-sm text-muted-foreground">GET /api/habits — получить список привычек.</p>
            <pre className="mt-3 bg-[#0b1220] p-3 rounded text-[12px] overflow-x-auto">{`Response 200
[
  {
    "id": "h1",
    "title": "Drink water",
    "description": "Drink 2L",
    "completed": false,
    "streak": 3,
    "createdAt": "2025-11-27T...Z",
    "updatedAt": null
  }
]`}</pre>

            <p className="mt-3 text-sm text-muted-foreground">POST /api/habits — создать привычку.</p>
            <pre className="mt-3 bg-[#0b1220] p-3 rounded text-[12px] overflow-x-auto">{`Request
{ "title": "Read", "description": "30 min" }

Response 201
{ "id": "h123", "title": "Read", "description": "30 min", "completed": false, "streak": 0, "createdAt": "..." }`}</pre>
          </section>

          <section className="glass-card p-6">
            <h3 className="text-lg font-semibold">/api/habits/{'{id}'}</h3>
            <p className="text-sm text-muted-foreground">PATCH /api/habits/{'{id}'} — частичное обновление.</p>
            <pre className="mt-3 bg-[#0b1220] p-3 rounded text-[12px] overflow-x-auto">{`Request
{ "completed": true }

Response 200
{ "id": "h123", "title": "Read", "completed": true, ... }`}</pre>
            <p className="mt-3 text-sm text-muted-foreground">DELETE /api/habits/{'{id}'} — удалить привычку (204).</p>
          </section>

          <section className="glass-card p-6">
            <h3 className="text-lg font-semibold">/api/habits/{'{id}'}/toggle</h3>
            <p className="text-sm text-muted-foreground">PATCH — переключить состояние completed (mock helper).</p>
          </section>

          <section className="glass-card p-6">
            <h3 className="text-lg font-semibold">/api/goals</h3>
            <p className="text-sm text-muted-foreground">GET /api/goals — список целей.</p>
            <p className="text-sm text-muted-foreground mt-2">POST /api/goals — создать цель.</p>
          </section>

          <section className="glass-card p-6">
            <h3 className="text-lg font-semibold">/api/me</h3>
            <p className="text-sm text-muted-foreground">GET /api/me — профиль текущего пользователя.</p>
            <p className="text-sm text-muted-foreground mt-2">PATCH /api/me — обновить профиль (Partial&lt;User&gt;).</p>
            <pre className="mt-3 bg-[#0b1220] p-3 rounded text-[12px] overflow-x-auto">{`Response 200
{ "id":"u1","name":"Demo User","email":"demo@example.com","avatar":null }
`}</pre>
          </section>

          <section className="glass-card p-6">
            <h3 className="text-lg font-semibold">/api/challenges</h3>
            <p className="text-sm text-muted-foreground">GET /api/challenges — получить список вызовов.</p>
          </section>

          <section className="glass-card p-6">
            <h3 className="text-lg font-semibold">Схемы и форматы</h3>
            <p className="text-sm text-muted-foreground">Схемы описаны в OpenAPI (см. <code className="font-mono">/openapi.yaml</code>).</p>
          </section>

        </div>
      </main>
    </MockLayout>
  )
}

export default ApiDocs
