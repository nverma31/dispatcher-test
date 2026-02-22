import React from 'react';
import { ThemeProvider } from 'styled-components';
import { experimental } from '@freenow/wave';
import { useTheme } from 'next-themes';
import { createGlobalStyle as createStyledGlobalStyle } from 'styled-components';
import { ModernColors } from '@freenow/wave';

const { createGlobalStyle: createWaveGlobalStyle, theme, ColorPalette, darkTheme } = experimental;

// Define default accents if not provided
const ACCENT_COLOR = ColorPalette.marooned['50'];
const ON_ACCENT_COLOR = ColorPalette.neutral['99'];

const WaveGlobalStyles = createWaveGlobalStyle({
  accent: ACCENT_COLOR,
  onAccent: ON_ACCENT_COLOR,
});

const DarkThemeGlobal = createStyledGlobalStyle`
  ${(darkTheme as any)}
`;


export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Wave specific scheme handling
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark-scheme');
      document.body.classList.add('dark-scheme');
    } else {
      document.documentElement.classList.remove('dark-scheme');
      document.body.classList.remove('dark-scheme');
    }
  }, [isDark]);

  return (
    <ThemeProvider theme={theme}>
      <ModernColors />
      <WaveGlobalStyles />
      {isDark && <DarkThemeGlobal />}
      {children}
    </ThemeProvider>
  );
};

