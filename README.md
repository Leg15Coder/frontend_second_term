# Habit Quest — SPA на React + TypeScript

Проект — SPA-приложение для трекинга привычек, целей и челленджей. Это шаблон и простая реализация архитектуры, пригодной для масштабируемого фронтенда: React + TypeScript + Redux Toolkit + React Router + Vite. В проекте также настроены Storybook для UI и Vitest для unit-тестов.

Главная идея
- Представить гибкую архитектуру для продуктовой frontend-части: отдельные страницы (public макеты), повторно используемые UI-компоненты, слайсы Redux Toolkit для доменной логики и лёгкая интеграция с REST API.
- Удобство разработки: быстрый запуск через Vite, визуальная проверка компонентов через Storybook и автоматические тесты/CI.

Ключевые технологии
- React 19 + TypeScript
- Vite (dev сервер и сборка)
- Redux Toolkit (createSlice, createAsyncThunk)
- React Router (внутренний роутинг, маршруты `/public/*`)
- Axios для REST вызовов
- Storybook (UI-документация и визуальные тесты)
- Vitest + Testing Library (юнит/смоук тесты, покрытие)
- MSW (mock server) — можно включить для разработки и тестов

Архитектура и структура проекта
```
src/
  app/
    store.ts            # конфигурация Redux store, хелперы useAppDispatch/useAppSelector
    api.ts              # базовый axios-инстанс для вызовов API
  features/             # Redux-слайсы (habits, goals, user)
  pages/
    Public/             # public-страницы, макеты и MockLayout
    Dashboard/ ...
  shared/
    public/             # повторно используемые публичные UI (PublicHero, GoalCard...)
    ui/                 # общие UI элементы (Modal, Toast, Button)
  stories/              # Storybook stories для визуального тестирования
  types.ts              # общие интерфейсы: Habit, Goal, User
  index.css             # глобальные стили
vite.config.ts
package.json
.storybook/             # storybook конфиг
vitest.config.ts        # конфиг vitest

public/                 # статические макеты (HTML/изображения)
```

Основные конвенции
- TypeScript-first: все типы описаны в `src/types.ts` и используются в слайсах/компонентах.
- Redux Toolkit: один слайс = одна доменная сущность (habits, goals, user).
- Public макеты: `src/pages/Public` — верстка сконцентрирована здесь и доступна через `/public/*` роуты.
- Storybook: каждый ключевой UI и страница имеет story для быстрого визуального осмотра.

Установка и быстрый старт
Требования: Node.js 18+ и npm (или pnpm/yarn). В репозитории используется npm-скрипты.

1) Установить зависимости

```bash
npm ci
```

2) Запустить dev-сервер (Vite)

```bash
npm run dev
```
Откройте http://localhost:5173 и проверьте страницы.

3) Storybook (визуальная инспекция компонентов)

```bash
npm run storybook
```
Откройте http://localhost:6006

4) Тесты
- Запустить все тесты

```bash
npm test
```

- Запустить unit tests (run)

```bash
npm run test:unit
```

- Сбор покрытия

```bash
npm run test:coverage
```

5) Линт и форматирование

```bash
npm run lint
npm run format
```

6) Сборка

```bash
npm run build
```

# Состояние сборки и покрытие

[![CI](https://github.com/Leg15Coder/frontend_second_term/actions/workflows/ci.yml/badge.svg)](https://github.com/Leg15Coder/frontend_second_term/actions/workflows/ci.yml)
[![Storybook](https://github.com/Leg15Coder/frontend_second_term/actions/workflows/deploy_storybook.yml/badge.svg)](https://leg15coder.github.io/frontend_second_term)
[![Coverage](https://codecov.io/gh/Leg15Coder/frontend_second_term/branch/main/graph/badge.svg)](https://codecov.io/gh/Leg15Coder/frontend_second_term)

## Пример API

В проекте используется `axios` и базовый экземпляр `src/app/api.ts`.

Пример простого REST-запроса к списку привычек:

```ts
import api from '../app/api'
import type { Habit } from '../types'

export async function loadHabits(): Promise<Habit[]> {
  const res = await api.get<Habit[]>('/habits')
  return res.data
}
```

Пример создания ресурса (POST):

```ts
export async function createHabit(payload: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) {
  const res = await api.post<Habit>('/habits', payload)
  return res.data
}
```

Пример обработки ошибок с try/catch:

```ts
try {
  const habit = await createHabit({ title: 'Meditate', description: '10 min' })
} catch (err) {
  console.error('API error', err)
}
```

## Шаблон Pull Request

Используйте простой шаблон PR, который помогает ревьюерам быстро понять изменения:

- Заголовок (title): краткое описание фичи/фикса.
- Описание (body): что сделано, почему, какие файлы затронуты.
- Список чеков:
  - [ ] Код отформатирован (Prettier)
  - [ ] Линт пройден (ESLint)
  - [ ] Тесты добавлены/обновлены
  - [ ] Storybook-стори добавлены для новых компонентов

Файл шаблона PR добавлен в `.github/PULL_REQUEST_TEMPLATE.md`.

CI (GitHub Actions)
- В проект добавлён workflow: `.github/workflows/ci.yml`. Он выполняет `npm ci`, линт, тесты с покрытием и билд Storybook.

Notes / распространённые проблемы
- Если `vitest` жалуется на отсутствие `jsdom`, убедитесь, что `jsdom` установлен как devDependency (в нашем package.json уже добавлен). Выполните `npm ci`.
- В конфиге `vitest.config.ts` используется окружение `jsdom` и выделенный setup-файл `src/setupTests.ts`.
- Storybook конфиг минимален; при проблемах с аддонами (msw-storybook-addon) временно отключайте проблемный аддон.

Рекомендации по разработке и расширению
- Для добавления новой public-страницы: положите React-компонент в `src/pages/Public`, добавьте экспорт в `src/pages/Public/index.ts` и маршрут в `src/App.tsx`.
- Добавляйте stories для новых UI-компонентов — это облегчит ревью и визуальные тесты.
- Для асинхронных операций используйте `createAsyncThunk` и мокируйте ответы в тестах через MSW.

Производительность и стили
- Проект использует CSS-уровень (Tailwind-подобные классы и SCSS модули можно подключать при необходимости). Для глобального стиля используйте `src/index.css`.
- Поддерживается light/dark через CSS media query `prefers-color-scheme`.

Безопасность и секреты
- Никогда не храните секреты/креденшелы в репозитории. Используйте `.env` и CI secrets.

Что ещё можно сделать (roadmap)
- Полный набор Storybook stories для всех страниц и состояний.
- MSW handlers для всех API-вызовов для локальной разработки и Storybook.
- Добавить e2e тесты (Playwright/Cypress) для ключевых пользовательских сценариев.
- Настроить автоматический деплой Storybook (GitHub Pages / Chromatic).

Контрибьюция
- Открывайте PR в одну ветку с логичной одному функционалу. В PR указывайте scope, summary и тесты.

Контакты и авторство
- Проект создан как учебный/шаблонный репозиторий для практики SPA-архитектур и UI-разработки.

---
