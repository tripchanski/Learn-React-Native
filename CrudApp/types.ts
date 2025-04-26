import { Colors } from "@/constants/Colors";
import { ColorSchemeName } from "react-native";
import { ReactNode } from "react";

export interface Children {
  children: ReactNode;
}

export type Theme = (typeof Colors)[keyof typeof Colors];

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface ThemeContextType {
  colorScheme: ColorSchemeName;
  setColorScheme: (scheme: ColorSchemeName) => void;
  theme: Theme;
}
