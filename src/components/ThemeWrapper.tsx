import React from 'react';
import { ThemeProvider } from 'styled-components';
import { experimental } from '@freenow/wave';

const { createGlobalStyle: createWaveGlobalStyle, theme, ColorPalette, darkTheme } = experimental;
import { createGlobalStyle as createStyledGlobalStyle } from 'styled-components';

// Define default accents if not provided
const ACCENT_COLOR = ColorPalette.marooned['50'];
const ON_ACCENT_COLOR = ColorPalette.neutral['99'];

const WaveGlobalStyles = createWaveGlobalStyle({
  accent: ACCENT_COLOR,
  onAccent: ON_ACCENT_COLOR,
});

const DarkThemeGlobal = createStyledGlobalStyle`
  ${darkTheme}
`;

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Enforce dark mode on mount
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.add('dark-scheme'); // Potentially needed by Wave
    document.body.classList.add('dark-scheme'); // Adding to body too just in case
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <WaveGlobalStyles />
      <DarkThemeGlobal />
      {children}
    </ThemeProvider>
  );
};
