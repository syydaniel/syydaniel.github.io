/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    // One border language for the whole site: hairlines and small radii, never pills (except controls).
    borderRadius: { none: '0', sm: '3px', DEFAULT: '4px', md: '5px', lg: '6px', xl: '6px', '2xl': '8px', '3xl': '10px', full: '9999px' },
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', '"Noto Serif SC"', 'Georgia', 'serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        ink: {
          950: '#06080a',
          900: '#090c0d',
          800: '#0f1414',
          700: '#171d1c',
          600: '#2a3330',
          500: '#4a5652',
          400: '#6f7d78',
          300: '#9aa8a2',
          200: '#cfd8d3',
          100: '#eef2ec'
        },
        aqua: {
          400: '#8fbdb6',
          500: '#5f948f',
          600: '#3f6f6b'
        },
        sol: {
          400: '#d9735b',
          500: '#cf5a3e',
          600: '#bd3620'
        },
        moss: {
          400: '#b3c6b9',
          500: '#7d9c8c',
          600: '#587468'
        }
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
        'radial-fade': 'radial-gradient(ellipse at top, rgba(95,148,143,0.15), transparent 60%)',
        'grid-fade': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
