import { createContext, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemeContextType, Children } from "@/types";

export const ThemeContext = createContext<ThemeContextType>({
  colorScheme: "light",
  setColorScheme: () => {},
  theme: Colors.light,
});

export const ThemeProvider = ({ children }: Children) => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
