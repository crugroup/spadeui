import { RefineThemes } from "@refinedev/antd";
import { ConfigProvider, theme } from "antd";
import { PropsWithChildren, createContext, useEffect, useLayoutEffect, useState } from "react";
import { darkColors, lightColors } from "./colors";

type ThemeProviderType = {
  mode: string;
  setMode: (mode: string) => void;
};

export const ThemeProviderContext = createContext<ThemeProviderType>({} as ThemeProviderType);

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const isSystemPreferenceDark = window?.matchMedia("(prefers-color-scheme: dark)").matches;
  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState(window.localStorage.getItem("colorMode") || systemPreference);

  useEffect(() => {
    window.localStorage.setItem("colorMode", mode);
  }, [mode]);

  useLayoutEffect(() => {
    const colors = mode === "light" ? lightColors : darkColors;
    const root = document.documentElement;
    const isDark = mode === "dark";

    // Always set --spade-* from the current theme tokens so both
    // light and dark stay in sync. SCSS :root defaults serve only as
    // a no-JS / initial-load fallback.
    root.style.setProperty("--spade-bg", colors.colorBgLayout);
    root.style.setProperty("--spade-surface", colors.colorBgContainer);
    root.style.setProperty("--spade-text", colors.colorTextBase);
    root.style.setProperty("--spade-border", colors.colorBorder);

    // No direct antd token equivalents — use hardcoded dark/light pairs
    root.style.setProperty("--spade-surface-soft", isDark ? "#0f1d35" : "#f7f9fc");
    root.style.setProperty("--spade-muted", isDark ? "#7a8ba3" : "#5c6b83");
    root.style.setProperty("--spade-shadow", isDark
      ? "0 6px 18px rgba(0, 0, 0, 0.25)"
      : "0 6px 18px rgba(19, 37, 70, 0.05)");
  }, [mode]);

  const setColorMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  const { darkAlgorithm, defaultAlgorithm } = theme;

  return (
    <ThemeProviderContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ConfigProvider
        theme={{
          ...RefineThemes.Blue,
          algorithm: mode === "light" ? defaultAlgorithm : darkAlgorithm,
          token: {
            fontFamily: "Manrope, Avenir Next, Segoe UI, sans-serif",
            ...(mode === "light" ? lightColors : darkColors),
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeProviderContext.Provider>
  );
};
