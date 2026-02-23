import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@/index.css";
// Initialize i18n
import "../i18n/config";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { ThemeProvider as NextThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <ThemeWrapper>
      <App />
    </ThemeWrapper>
  </NextThemeProvider>
);