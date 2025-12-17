import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App.tsx";
import "./index.css";
import { connectEmulators, initAnalytics } from './firebase'
import { initSentry } from './lib/sentry'

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(
  <Provider store={store}>
    <App />
  </Provider>
);

connectEmulators();
initSentry(import.meta.env.VITE_SENTRY_DSN as string | undefined);
initAnalytics().catch((err) => console.warn('Analytics init failed:', err));
