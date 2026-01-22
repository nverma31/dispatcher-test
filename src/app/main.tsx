import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@/index.css";
import { ThemeWrapper } from "@/components/ThemeWrapper";

createRoot(document.getElementById("root")!).render(
  <ThemeWrapper>
    <App />
  </ThemeWrapper>
);