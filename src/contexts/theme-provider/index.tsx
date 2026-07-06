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

    // Only set --spade-* inline overrides for dark mode;
    // in light mode remove them so stylesheet :root defaults remain the source of truth.
    const root = document.documentElement;
    const isDark = mode === "dark";

    const setOrRemove = (prop: string, value: string) => {
      if (isDark) {
        root.style.setProperty(prop, value);
      } else {
        root.style.removeProperty(prop);
      }
    };

    setOrRemove("--spade-surface", colors.colorBgContainer);
    setOrRemove("--spade-surface-soft", "#0f1d35");
    setOrRemove("--spade-text", colors.colorTextBase);
    setOrRemove("--spade-muted", "#7a8ba3");
    setOrRemove("--spade-border", colors.colorBorder);
    setOrRemove("--spade-shadow", "0 6px 18px rgba(0, 0, 0, 0.25)");
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
