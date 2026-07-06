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
    document.body.style.backgroundColor = colors.colorBgLayout;
    document.body.style.color = colors.colorTextBase;

    // Update --spade-* CSS custom properties for dark/light mode
    const root = document.documentElement;
    const isDark = mode === "dark";
    root.style.setProperty("--spade-surface", isDark ? "#11223f" : "#ffffff");
    root.style.setProperty("--spade-surface-soft", isDark ? "#0f1d35" : "#f7f9fc");
    root.style.setProperty("--spade-text", isDark ? "#f2f6ff" : "#18253d");
    root.style.setProperty("--spade-muted", isDark ? "#7a8ba3" : "#5c6b83");
    root.style.setProperty("--spade-border", isDark ? "#233f65" : "#d7deea");
    root.style.setProperty("--spade-shadow", isDark ? "0 6px 18px rgba(0, 0, 0, 0.25)" : "0 6px 18px rgba(19, 37, 70, 0.05)");
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
