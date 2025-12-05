export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Функции</h1>
        <p className="text-muted-foreground mb-2">Здесь список ключевых функций приложения и примеры использования.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Трекинг привычек и статистика прогресса</li>
          <li>Челленджи и streaks</li>
          <li>Геймификация и мотивационные механики</li>
        </ul>
      </div>
    </div>
  )
}

