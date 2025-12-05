export default function RoadmapPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Roadmap</h1>
        <p className="text-muted-foreground mb-2">Планы и этапы развития проекта.</p>
        <ol className="list-decimal pl-6 space-y-2 text-sm text-muted-foreground">
          <li>Версия 1.0 — основные возможности трекинга и профили.</li>
          <li>Версия 1.1 — социальные функции и челленджи.</li>
          <li>Версия 2.0 — расширенная аналитика и интеграции.</li>
        </ol>
      </div>
    </div>
  )
}

