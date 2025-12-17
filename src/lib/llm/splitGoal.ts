import type { GoalTask } from '@/types'
import { callPerplexity } from '@/services/perplexityService'

const apiTimeout = 5000

function createId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

function extractTasksFromLines(lines: string[]): GoalTask[] {
  const tasks: GoalTask[] = []
  for (const line of lines) {
    const cleaned = line.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim()
    if (cleaned.length > 5) {
      tasks.push({ id: createId(), title: cleaned.slice(0, 100), description: cleaned.length > 100 ? cleaned.slice(100) : undefined, done: false })
    }
  }
  return tasks
}

function extractFromSentences(detailedDescription: string): GoalTask[] {
  const sentences = detailedDescription.split(/[.!?]+/).filter((s) => s.trim().length > 10)
  if (sentences.length === 0) return []
  return sentences.slice(0, 5).map((sentence) => ({ id: createId(), title: sentence.trim().slice(0, 100), done: false }))
}

function fallbackSplit(detailedDescription: string): GoalTask[] {
  const lines = detailedDescription.split(/\n/).map((line) => line.trim()).filter((line) => line.length > 0)
  const tasks = extractTasksFromLines(lines)
  if (tasks.length > 0) {
    if (tasks.length === 1) {
      const t = tasks[0].title.trim().toLowerCase()
      const d = detailedDescription.trim().toLowerCase()
      if (t === d || d.includes(t)) {
      } else return tasks
    } else return tasks
  }
  const sentenceTasks = extractFromSentences(detailedDescription)
  if (sentenceTasks.length > 0) return sentenceTasks
  return generateFromHeuristics(detailedDescription, 5, false)
}

function estimateDomain(text: string): 'study' | 'fitness' | 'project' | 'habit' | 'general' {
  const t = text.toLowerCase()
  if (/(экзамен|сдать|тест|контрольная|теормин|зачет|провести)/.test(t)) return 'study'
  if (/(пожать|жать|пробежать|трениров|kg|кг|подтянуть|бег|тренировка)/.test(t)) return 'fitness'
  if (/(проект|deploy|запустить|сделать сайт|приложение|реализовать)/.test(t)) return 'project'
  if (/(привычк|habit|ежедневно|ежеднев)/.test(t)) return 'habit'
  return 'general'
}

function makeTask(title: string, desc?: string, estimate?: number, urgent = false): GoalTask {
  return {
    id: createId(),
    title: title.slice(0, 120),
    description: desc ? desc.slice(0, 400) : undefined,
    week_estimate: urgent ? undefined : typeof estimate === 'number' ? estimate : 1,
    day_estimate: urgent ? (typeof estimate === 'number' ? estimate : 1) : undefined,
    acceptanceCriteria: desc ? `Можно проверить, если: ${desc.split(/[.\n]+/)[0].slice(0, 120)}` : undefined,
    done: false
  }
}

function generateFromHeuristics(text: string, minCount: number, urgent: boolean): GoalTask[] {
  const domain = estimateDomain(text)
  const tasks: GoalTask[] = []
  if (domain === 'study') {
    tasks.push(makeTask('Собрать материалы для изучения', 'Найти лекции, конспекты и прошлые тесты по теме'))
    tasks.push(makeTask('Разбить тему на разделы', 'Составить список ключевых тем, которые нужно пройти'))
    tasks.push(makeTask('Изучить первый раздел', 'Прочитать конспект/лекцию и сделать заметки'))
    tasks.push(makeTask('Решить практические задачи', 'Решить 3-5 типовых задач по пройденному материалу'))
    tasks.push(makeTask('Проверка и повторение', 'Пройти пробный тест или составить контрольные вопросы'))
  } else if (domain === 'fitness') {
    tasks.push(makeTask('Оценить текущее состояние', 'Сделать замер и записать текущие показатели'))
    tasks.push(makeTask('Составить план тренировок', 'Определить частоту и базовые упражнения'))
    tasks.push(makeTask('Выполнить базовую тренировку', 'Сделать запланированную тренировку и записать результаты'))
    tasks.push(makeTask('Добавить вспомогательные упражнения', 'Включить упражнения на поддержку основных мышечных групп'))
    tasks.push(makeTask('Отслеживать прогресс', 'Записывать веса/повторы после каждой тренировки'))
  } else if (domain === 'project') {
    tasks.push(makeTask('Определить требование', 'Записать, что должно делать приложение/функция'))
    tasks.push(makeTask('Спланировать MVP', 'Выделить минимальный функционал для первого релиза'))
    tasks.push(makeTask('Реализовать базовую функциональность', 'Написать и протестировать основной флоу'))
    tasks.push(makeTask('Протестировать и деплоить', 'Провести ручное тестирование и развернуть'))
    tasks.push(makeTask('Собрать фидбек', 'Собрать отзывы и запланировать итерации'))
  } else if (domain === 'habit') {
    tasks.push(makeTask('Определить триггер и цель', 'Записать когда и при каком условии выполнять привычку'))
    tasks.push(makeTask('Установить напоминание', 'Добавить ежедневное напоминание в календарь'))
    tasks.push(makeTask('Выполнять привычку 7 дней подряд', 'Следить за выполнением и отмечать в дневнике'))
    tasks.push(makeTask('Оценить прогресс', 'Проанализировать результаты через неделю'))
    tasks.push(makeTask('Уточнить и масштабировать', 'Скорректировать сложность или частоту при необходимости'))
  } else {
    tasks.push(makeTask('Прояснить цель', 'Чётко сформулировать, чего именно хотите достичь'))
    tasks.push(makeTask('Собрать ресурсы', 'Найти статьи, видео и инструменты, которые помогут'))
    tasks.push(makeTask('Разбить на темы', 'Разделить цель на логические блоки и приоритеты'))
    tasks.push(makeTask('Выполнить первый блок', 'Сфокусироваться на первом блоке и завершить'))
    tasks.push(makeTask('Проверка результата', 'Оценить выполненное и решить следующую задачу'))
  }
  let i = 0
  const templates = ['Дополнить материал', 'Сделать короткое упражнение', 'Сделать самооценку', 'Запланировать следующую итерацию']
  while (tasks.length < minCount) {
    const t = templates[i % templates.length]
    tasks.push(makeTask(t, `Выполнить: ${t.toLowerCase()}`))
    i++
  }
  if (urgent) tasks.forEach((tk) => { tk.day_estimate = tk.week_estimate ? tk.week_estimate * 7 : (tk.day_estimate ?? 1); tk.week_estimate = undefined })
  return tasks
}

type RawTask = { title?: unknown; description?: unknown }
function isRawTask(x: unknown): x is RawTask {
  return !!x && typeof x === 'object' && ('title' in (x as Record<string, unknown>))
}

function tryParseTasksFromObject(obj: unknown): GoalTask[] | null {
  if (!obj || typeof obj !== 'object') return null
  const o = obj as Record<string, unknown>
  if (Array.isArray(o.tasks) && o.tasks.length > 0) {
    const res: GoalTask[] = []
    for (const t of o.tasks) {
      if (isRawTask(t)) {
        const obj = t as Record<string, unknown>
        res.push({
          id: createId(),
          title: String(obj.title).slice(0, 120),
          description: typeof obj.description === 'string' ? obj.description : undefined,
          week_estimate: typeof obj.week_estimate === 'number' ? obj.week_estimate : undefined,
          day_estimate: typeof obj.day_estimate === 'number' ? obj.day_estimate : undefined,
          acceptanceCriteria: typeof obj.acceptance_criteria === 'string' ? obj.acceptance_criteria : (typeof obj.acceptanceCriteria === 'string' ? obj.acceptanceCriteria : undefined),
          done: false
        })
      }
    }
    if (res.length > 0) return res
  }
  return null
}

function parseRawToTasks(raw: unknown, originalTextFallback: string): GoalTask[] | null {
  const fromObj = tryParseTasksFromObject(raw)
  if (fromObj) return fromObj

  let text: string
  if (typeof raw === 'string') text = raw
  else {
    try { text = JSON.stringify(raw) } catch { text = originalTextFallback }
  }

  try {
    const parsed = JSON.parse(text)
    const fromParsed = tryParseTasksFromObject(parsed)
    if (fromParsed) return fromParsed
  } catch (err) {
    console.warn('splitGoal: response not json', err)
  }

  const lines = (text || originalTextFallback || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  const tasks = extractTasksFromLines(lines)
  if (tasks.length > 0) return tasks

  return null
}

export type SplitGoalOptions = {
  baseline?: number | string
  unit?: string
  frequency?: number | string
  constraints?: string
  targetDate?: string
  forceDaily?: boolean
  tempo?: 'conservative' | 'normal' | 'aggressive'
}

export async function splitGoal(detailedDescription: string, options?: SplitGoalOptions): Promise<GoalTask[]> {
  if (!detailedDescription || detailedDescription.trim().length === 0) return []

  const ctxParts: string[] = []
  if (options?.baseline) ctxParts.push(`baseline=${options.baseline}`)
  if (options?.unit) ctxParts.push(`unit=${options.unit}`)
  if (options?.frequency) ctxParts.push(`frequency=${options.frequency}`)
  if (options?.constraints) ctxParts.push(`constraints=${options.constraints}`)
  if (options?.targetDate) ctxParts.push(`target_date=${options.targetDate}`)
  const ctxLine = ctxParts.length > 0 ? `Контекст: ${ctxParts.join('; ')}.` : ''

  let urgent = false
  try {
    const textLow = detailedDescription.toLowerCase()
    if (textLow.includes('завтра') || textLow.includes('сегодня') || textLow.includes('срочно') || textLow.includes('утром')) urgent = true
    if (!urgent && options?.targetDate) {
      const td = new Date(String(options.targetDate))
      if (!Number.isNaN(td.getTime())) {
        const now = new Date()
        const diffMs = td.getTime() - now.getTime()
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
        if (diffDays <= 3) urgent = true
      }
    }
  } catch {
    urgent = false
  }

  const ctxNote = ctxLine ? `${ctxLine} Используй контекст при наличии, но не ограничивай план, если контекст не задан.` : 'Контекст не задан — предложи универсальные шаги.'

  const wordCount = detailedDescription.split(/\s+/).filter(Boolean).length
  const sentenceCount = Math.max(1, detailedDescription.split(/[.\n!?]+/).map(s => s.trim()).filter(Boolean).length)
  let desiredMin = 5
  if (options?.forceDaily) urgent = true
  if (urgent) {
    desiredMin = Math.max(5, Math.min(12, sentenceCount + 2))
  } else {
    desiredMin = Math.max(3, Math.min(12, Math.ceil(wordCount / 40) + Math.floor(sentenceCount / 2)))
  }
  const tempo = options?.tempo ?? 'normal'
  const tempoFactor = tempo === 'conservative' ? 0.7 : tempo === 'aggressive' ? 1.4 : 1.0
  desiredMin = Math.max(1, Math.round(desiredMin * tempoFactor))

  const tempoNote = tempo === 'conservative' ? 'темп: консервативный — небольшие стабильные шаги.' : tempo === 'aggressive' ? 'темп: агрессивный — более мелкие и частые шаги.' : 'темп: нормальный.'
  const basePrompt = urgent
    ? `Ты — ассистент, который разбивает любую цель на очень короткие, выполнимые микро‑задачи (дневные). ${ctxNote} Требования к ответу:
1) Верни МИНИМУМ ${desiredMin} микро‑задач, упорядоченных по дням (последовательность выполнения).
2) Для каждой подзадачи верни: title (коротко), description (1-2 предложения), day_estimate (число дней, обычно 1), acceptance_criteria (как проверить, выполнена ли подзадача).
3) Сделай шаги практическими и проверяемыми, избегай аморфных формулировок.
4) Верни STRICT JSON: {"tasks":[{"title":"...","description":"...","day_estimate":1,"acceptance_criteria":"..."}]}.
${tempoNote}

Описание цели:
${detailedDescription}`
    : `Ты — ассистент, который разбивает любую цель на короткие, понятные и выполнимые шаги по неделям. ${ctxNote} Требования к ответу:
1) Верни МИНИМУМ ${desiredMin} шагов, упорядоченных последовательно.
2) Для каждой подзадачи верни: title (коротко), description (1-2 предложения), week_estimate (число недель), acceptance_criteria (как проверить выполнение).
3) Делай шаги практическими, конкретными и проверяемыми.
4) Верни STRICT JSON: {"tasks":[{"title":"...","description":"...","week_estimate":1,"acceptance_criteria":"..."}]}.
${tempoNote}

Описание цели:
${detailedDescription}`

  const retryPrompts: string[] = []
  if (urgent) {
    retryPrompts.push(basePrompt)
    retryPrompts.push(`Верни ТОЛЬКО валидный JSON в формате {"tasks":[{"title":"...","description":"...","day_estimate":1}]} без лишних пояснений.\nОписание:\n${detailedDescription}`)
    retryPrompts.push(`Если предыдущий ответ не был валидным JSON, верни корректный JSON строго по схеме: {"tasks": [{"title":"...","description":"...","day_estimate":1}]}.\nОписание:\n${detailedDescription}`)
  } else {
    retryPrompts.push(basePrompt)
    retryPrompts.push(`Верни ТОЛЬКО валидный JSON в формате {"tasks":[{"title":"...","description":"...","week_estimate":1}]} без лишних пояснений.\nОписание:\n${detailedDescription}`)
    retryPrompts.push(`Если предыдущий ответ не был валидным JSON, верни корректный JSON строго по схеме: {"tasks": [{"title":"...","description":"...","week_estimate":1}]}.\nОписание:\n${detailedDescription}`)
  }

  function expandTasksLocal(existing: GoalTask[], originalText: string, needed: number): GoalTask[] {
    const out: GoalTask[] = [...existing]
    for (const t of existing) {
      if (out.length >= needed) break
      const desc = t.description || ''
      const parts = desc.split(/[.\n;:\-–—]+/).map(s => s.trim()).filter(Boolean)
      for (const p of parts) {
        if (out.length >= needed) break
        if (p.length > 10) {
          out.push({ id: createId(), title: p.slice(0, 120), description: undefined, done: false })
        }
      }
    }
    if (out.length >= needed) return out
    const sentences = originalText.split(/[.\n!?]+/).map(s => s.trim()).filter(Boolean)
    for (const s of sentences) {
      if (out.length >= needed) break
      if (s.length > 10) out.push({ id: createId(), title: s.slice(0, 120), description: undefined, done: false })
    }
    if (out.length >= needed) return out
    const templates = [
      'Сформировать список ключевых тем и материалов для изучения',
      'Разбить тему на подпункты и изучить первый подпункт',
      'Прочитать конспект/лекцию по теме и сделать краткие заметки',
      'Выполнить практическое задание или решить примерные задачи',
      'Повторить выученное и сделать самопроверку'
    ]
    let i = 0
    while (out.length < needed) {
      const t = templates[i % templates.length]
      out.push({ id: createId(), title: t, description: undefined, done: false })
      i++
    }
    return out
  }

  async function attemptWithRetries(): Promise<GoalTask[] | null> {
    for (let i = 0; i < retryPrompts.length; i++) {
      const p = retryPrompts[i]
      try {
        const raw = await Promise.race([
          callPerplexity(p),
          new Promise<unknown>((_, rej) => setTimeout(() => rej(new Error('Perplexity timeout')), apiTimeout))
        ])
        const tasks = parseRawToTasks(raw, detailedDescription)
        if (tasks && tasks.length > 0) return tasks
      } catch (err) {
        console.warn(`splitGoal: attempt ${i + 1} failed:`, err)
      }
      const delay = Math.min(1000, 200 * Math.pow(2, i))
      await new Promise((res) => setTimeout(res, delay))
    }
    return null
  }

  try {
    const tried = await attemptWithRetries()
    if (tried && tried.length > 0) {
      const singleEcho = tried.length === 1 && tried[0].title.trim().length > 0 && detailedDescription.trim().length > 0 && (tried[0].title.trim().toLowerCase() === detailedDescription.trim().toLowerCase() || detailedDescription.trim().toLowerCase().includes(tried[0].title.trim().toLowerCase()))
      if (singleEcho) {
        try {
          const schemaField = urgent ? 'day_estimate' : 'week_estimate'
          const strictPrompt = `НЕ ПОВТОРЯЙ исходную формулировку. Разбей цель на минимум ${desiredMin} конкретных, проверяемых шагов. Для каждой подзадачи верни title, description, ${schemaField} и acceptance_criteria. Пример правильного элемента: {"title":"Прочитать лекцию 1","description":"Просмотреть лекцию и выписать определения","${schemaField}":1,"acceptance_criteria":"Есть записи по ключевым определениям"}. Верни STRICT JSON: {"tasks":[...]}.\n\nОписание цели:\n${detailedDescription}`
          const rawStrict = await callPerplexity(strictPrompt)
          const parsedStrict = parseRawToTasks(rawStrict, detailedDescription)
          if (parsedStrict && parsedStrict.length >= desiredMin) return parsedStrict
        } catch (e) {
          console.warn('splitGoal: strict attempt failed', e)
        }
      }
      if (tried.length >= desiredMin) return tried
      const expanded = expandTasksLocal(tried, detailedDescription, desiredMin)
      if (expanded.length >= desiredMin) return expanded
      try {
        const schemaField = urgent ? 'day_estimate' : 'week_estimate'
        const expandPrompt = `Разверни и разбей существующие задачи до как минимум ${desiredMin} коротких выполнимых шагов. Верни STRICT JSON формата: {"tasks":[{"title":"...","description":"...","${schemaField}":1}]}.
 
 Существующие задачи:
 ${JSON.stringify(tried)}
 
 Описание цели:
 ${detailedDescription}`
        const raw2 = await callPerplexity(expandPrompt)
        const parsed2 = parseRawToTasks(raw2, detailedDescription)
        if (parsed2 && parsed2.length >= desiredMin) return parsed2
      } catch (e) {
        console.warn('splitGoal: expand attempt failed', e)
      }
      return expandTasksLocal(tried, detailedDescription, desiredMin)
    }
  } catch (err) {
    console.warn('splitGoal: retries failed', err)
  }

  return generateFromHeuristics(detailedDescription, desiredMin, urgent)
 }
