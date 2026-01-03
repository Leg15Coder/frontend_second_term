import { Database, Server, Globe, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const APISection = () => {

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm mb-4">
            <Code2 className="w-4 h-4 text-turquoise" />
            <span className="text-muted-foreground">Для разработчиков</span>
          </div>
          <h2 className="section-title text-foreground">
            Архитектура и краткий обзор API
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="glass-card-strong p-8 space-y-8">
            <h3 className="font-display text-xl font-bold text-foreground">Архитектура приложения</h3>

            <div className="flex flex-col items-center gap-4">
              <div className="glass-card p-4 w-full max-w-xs text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-turquoise" />
                  <span className="font-mono text-sm text-foreground">Client</span>
                </div>
                <span className="text-xs text-muted-foreground">React SPA + TypeScript</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-gradient-to-b from-turquoise to-gold" />
                <div className="text-xs text-muted-foreground">HTTP / REST</div>
                <div className="w-0.5 h-8 bg-gradient-to-b from-gold to-purple-light" />
              </div>

              <div className="glass-card p-4 w-full max-w-xs text-center border-turquoise/30 border">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Server className="w-5 h-5 text-gold" />
                  <span className="font-mono text-sm text-foreground">API Server</span>
                </div>
                <span className="text-xs text-muted-foreground">REST endpoints</span>
              </div>

              <div className="w-0.5 h-12 bg-gradient-to-b from-purple-light to-crystal" />

              <div className="glass-card p-4 w-full max-w-xs text-center border-purple-light/30 border">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Database className="w-5 h-5 text-purple-light" />
                  <span className="font-mono text-sm text-foreground">Database / Storage</span>
                </div>
                <span className="text-xs text-muted-foreground">Firestore</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-display text-xl font-bold text-foreground">Краткий обзор API</h3>

            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground">Основные ресурсы приложения:</p>
              <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
                <li><code className="font-mono">/api/habits</code> — привычки (GET/POST), PATCH/DELETE по id.</li>
                <li><code className="font-mono">/api/goals</code> — цели (GET/POST) и управление ими.</li>
                <li><code className="font-mono">/api/me</code> — профиль текущего пользователя (GET/PATCH).</li>
              </ul>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Для подробной документации откройте полную страницу API:</p>
                <div className="mt-3 flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link to="/public/api" className="inline-block px-4 py-2 rounded bg-turquoise text-background font-medium">Полная документация API</Link>
                  <Link to="/public/swagger" className="inline-block px-4 py-2 rounded bg-gold text-background font-medium">Открыть Swagger UI</Link>
                </div>

                <div className="mt-6 glass-card p-4">
                  <h4 className="text-md font-semibold text-foreground mb-2">Для разработчиков</h4>
                  <p className="text-sm text-muted-foreground mb-3">Кратко об архитектуре и инструментах, которые используются в проекте:</p>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                    <li>Frontend: React + TypeScript, Vite, Tailwind CSS.</li>
                    <li>State: Redux Toolkit (slices, createAsyncThunk) + React Router.</li>
                    <li>Backend: Firebase (Firestore) / REST API.</li>
                    <li>Tests & CI: Vitest (unit), Storybook + visual tests, Cypress (E2E), GitHub Actions для автоматизации.</li>
                  </ul>
                  <div className="mt-3">
                    <a href="https://github.com/Leg15Coder/frontend_second_term" target="_blank" rel="noreferrer" className="inline-block px-3 py-1 rounded bg-muted-foreground/5 text-sm text-foreground">Репозиторий на GitHub</a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default APISection;
