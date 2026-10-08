/** @type {import('tailwindcss').Config} */
// The palette reads the theme tokens in src/styles/theme.css, so every utility
// (and every /opacity modifier) follows the light and dark inks.
const tone = (token) => `color-mix(in srgb, var(${token}) calc(<alpha-value> * 100%), transparent)`;

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    // One border language for the whole site: hairlines and small radii, never pills (except controls).
    borderRadius: { none: '0', sm: '3px', DEFAULT: '4px', md: '5px', lg: '6px', xl: '6px', '2xl': '6px', '3xl': '8px', full: '9999px' },
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', '"Noto Serif SC"', 'Georgia', 'serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        // 950 is the page, 100 the strongest ink, in both themes.
        ink: {
          950: tone('--paper'),
          900: tone('--paper-2'),
          800: tone('--paper-3'),
          700: tone('--paper-4'),
          600: tone('--ink-6'),
          500: tone('--ink-5'),
          400: tone('--ink-4'),
          300: tone('--ink-3'),
          200: tone('--ink-2'),
          100: tone('--ink')
        },
        paper: tone('--paper'),
        aqua: { 400: tone('--daiqing-2'), 500: tone('--daiqing'), 600: tone('--daiqing-3') },
        sol: { 400: tone('--zhusha'), 500: tone('--zhusha-2'), 600: tone('--zhusha-3') },
        moss: { 400: tone('--moss'), 500: tone('--moss-2'), 600: tone('--moss-2') },
        seal: tone('--seal'),
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        ondark: tone('--on-dark')
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite'
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(ellipse at top, color-mix(in srgb, var(--daiqing) 12%, transparent), transparent 60%)',
        'grid-fade': 'linear-gradient(color-mix(in srgb, var(--ink) 4%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--ink) 4%, transparent) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
