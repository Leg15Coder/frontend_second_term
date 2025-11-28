import React from 'react'
import MockLayout from './MockLayout'

const SwaggerView: React.FC = () => {
  return (
    <MockLayout>
      <main className="flex-1 p-8">
        <div className="max-w-full mx-auto">
          <div className="glass-card p-4 mb-4">
            <h1 className="text-2xl font-bold">Swagger UI</h1>
            <p className="text-sm text-muted-foreground">Интерактивная документация API. Источник: <code className="font-mono">/openapi.yaml</code>.</p>
          </div>

          <div className="h-[80vh] bg-transparent rounded overflow-hidden border">
            <iframe src="/swagger/index.html" title="Swagger UI" className="w-full h-full border-0" />
          </div>
        </div>
      </main>
    </MockLayout>
  )
}

export default SwaggerView

