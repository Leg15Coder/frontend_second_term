import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { connectEmulators, initAnalytics } from './firebase'

connectEmulators()

await initAnalytics()

createRoot(document.getElementById("root")!).render(<App />);
