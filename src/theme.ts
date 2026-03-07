import THEMES from "./themes.json";

interface Theme {
  [key: string]: string;
}

const themes = Object.keys(THEMES);

export const getTheme = (theme: string): Theme => {
  theme = theme.toLowerCase();
  if (themes.includes(theme)) {
    return (THEMES as Record<string, Theme>)[theme];
  } else {
    return (THEMES as Record<string, Theme>)[
      themes[Math.floor(Math.random() * themes.length)]
    ];
  }
};
