import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./index.css";
import { connectEmulators, initAnalytics } from './firebase'
import { initSentry } from './lib/sentry'

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

rootEl.innerHTML = `
  <div style="padding:24px;color:#fff;background:#111;min-height:100vh;display:flex;flex-direction:column;gap:12px;">
    <div style="font-size:18px;">⚙️ Загрузка приложения…</div>
    <div style="opacity:0.8">Если это сообщение не исчезнет автоматически — произошла ошибка загрузки. Сейчас мы пытаемся восстановить приложение.</div>
  </div>
`;

function escapeHtml(s: string) {
  return s.replace(/[&<>"'`]/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  }[c] as string));
}

(async () => {
  try {
    const mod = await import('./App.tsx')
    const App = mod.default
    ReactDOM.createRoot(rootEl).render(
      <Provider store={store}>
        <App />
      </Provider>
    )
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.stack || err.message : String(err);
    console.error('Dynamic import/render error:', err);
    rootEl.innerHTML = `<pre style="padding:16px;color:#fff;background:#111;white-space:pre-wrap;">Dynamic import/render error:\n${escapeHtml(msg)}</pre>`;
  }
})();

try {
  connectEmulators();
} catch (e) {
  console.warn('connectEmulators failed:', e);
}
try {
  initSentry(import.meta.env.VITE_SENTRY_DSN as string | undefined);
} catch (e) {
  console.warn('initSentry failed:', e);
}
initAnalytics().catch((err) => console.warn('Analytics init failed:', err));
