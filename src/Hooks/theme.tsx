import React, { createContext, useState, useContext } from "react";
import { DefaultTheme, ThemeProvider as StyledThemeProvider } from "styled-components";
import dark from "../styles/themes/dark";
import light from "../styles/themes/light";

interface IColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  white: string;
  black: string;
  gray: string;
  success: string;
  info: string;
  warning: string;
}

interface ITheme {
  title: string;
  color: IColorPalette;
}

interface IThemeContext {
  toggleTheme(): void;
  theme: ITheme;
  children?: React.ReactNode;
}

const ContextTheme = createContext<IThemeContext | undefined>(undefined);

const ThemeProvider: React.FC<IThemeContext> = ({ children }) => {
  const [theme, setTheme] = useState<ITheme>(dark);

  const toggleTheme = () => {
    if (theme.title === 'dark') {
      setTheme(light);
    } else {
      setTheme(dark);
    }
  };

  return (
    <ContextTheme.Provider value={{ toggleTheme, theme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ContextTheme.Provider>
  );
};

function useTheme(): IThemeContext {
  const context = useContext(ContextTheme);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

export { ThemeProvider, useTheme };
