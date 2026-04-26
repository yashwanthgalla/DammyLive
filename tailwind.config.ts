/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'xs': '375px',
      'fold': '280px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        // Luxury Editorial palette
        card: 'var(--surface)',
        ring: 'var(--accent)',
        input: 'var(--bg-subtle)',
        muted: 'var(--bg-subtle)',
        accent: 'var(--accent)',
        border: 'var(--border)',
        primary: 'var(--text-primary)',
        secondary: 'var(--bg-subtle)',
        background: 'var(--bg)',
        foreground: 'var(--text-primary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        destructive: '#8B0000',
        // Gold accent (replaces f1-red across the UI)
        'f1-red': 'var(--accent)',
        'f1-green': 'var(--text-muted)',
        'f1-yellow': 'var(--accent)',
        // Team colors remain for data accuracy
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
        sm: '0px',
        md: '0px',
        lg: '0px',
        full: '0px',
        DEFAULT: '0px',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.02)',
        md: '0 4px 20px rgba(0, 0, 0, 0.06)',
        lg: '0 8px 32px rgba(0, 0, 0, 0.08)',
        xl: '0 8px 32px rgba(0, 0, 0, 0.12)',
        DEFAULT: '0 4px 20px rgba(0, 0, 0, 0.06)',
      },
      transitionProperty: {
        DEFAULT: 'all',
      },
      transitionDuration: {
        DEFAULT: '500ms',
        '700': '700ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      maxWidth: {
        'editorial': '1600px',
      },
    },
  },
  plugins: [],
}
