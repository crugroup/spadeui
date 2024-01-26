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
  const isSystemPreferenceDark = window?.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState(window.localStorage.getItem("colorMode") || systemPreference);

  useEffect(() => {
    window.localStorage.setItem("colorMode", mode);
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
      }}>
      <ConfigProvider
        theme={{
          ...RefineThemes.Blue,
          algorithm: mode === "light" ? defaultAlgorithm : darkAlgorithm,
          token: {
            fontFamily: "Inter, sans-serif",
            ...mode === "light" ? lightColors : darkColors,
          },
        }}>
        {children}
      </ConfigProvider>
    </ThemeProviderContext.Provider>
  );
};
