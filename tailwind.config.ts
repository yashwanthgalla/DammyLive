/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'xs': '375px',    // Small phones
      'fold': '280px',  // Foldable phones (Galaxy Fold)
      'sm': '640px',    // Large phones / small tablets
      'md': '768px',    // Tablets
      'lg': '1024px',   // Laptops / tablets landscape
      'xl': '1280px',   // Desktops
      '2xl': '1536px',  // Large desktops
      '3xl': '1920px',  // Ultra-wide
    },
    extend: {
      colors: {
        // Base theme colors from CSS variables
        card: 'var(--surface)',
        ring: 'var(--f1-red)',
        input: 'var(--bg-subtle)',
        muted: 'var(--bg-subtle)',
        accent: 'var(--surface)',
        border: 'var(--border)',
        primary: 'var(--f1-red)',
        secondary: 'var(--bg-subtle)',
        background: 'var(--bg)',
        foreground: 'var(--text-primary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        destructive: '#d32f2f',
        // F1-specific colors
        'f1-red': 'var(--f1-red)',
        'f1-green': 'var(--f1-green)',
        'f1-yellow': 'var(--f1-yellow)',
        // Team colors
        'team-mercedes': 'var(--team-mercedes)',
        'team-ferrari': 'var(--team-ferrari)',
        'team-redbull': 'var(--team-redbull)',
        'team-mclaren': 'var(--team-mclaren)',
        'team-alpine': 'var(--team-alpine)',
        'team-aston': 'var(--team-aston)',
        'team-williams': 'var(--team-williams)',
        'team-haas': 'var(--team-haas)',
        'team-rb': 'var(--team-rb)',
        'team-kick': 'var(--team-kick)',
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        DEFAULT: 'var(--shadow-md)',
      },
      transitionProperty: {
        DEFAULT: 'all',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease-out',
      },
      animation: {
        'pulse-fast': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
