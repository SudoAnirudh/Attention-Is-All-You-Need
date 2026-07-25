import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tokyo: {
          bg: '#1a1b26',
          'bg-dark': '#16161e',
          surface: '#24283b',
          'surface-hover': '#2f354f',
          border: '#292e42',
          text: '#c0caf5',
          subtext: '#9aa5ce',
          muted: '#565f89',
          purple: '#bb9af7',
          blue: '#7aa2f7',
          cyan: '#7dcfff',
          green: '#9ece6a',
          orange: '#ff9e64',
          yellow: '#e0af68',
          red: '#f7768e',
        },
      },
      fontFamily: {
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
