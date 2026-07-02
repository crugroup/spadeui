import { RefineThemes } from "@refinedev/antd";
import { ConfigProvider, theme } from "antd";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
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
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const { darkAlgorithm, defaultAlgorithm } = theme;

  return (
    <ThemeProviderContext.Provider
      value={{
        setMode: toggleColorMode,
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
