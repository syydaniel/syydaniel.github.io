/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        ink: {
          950: '#05060a',
          900: '#0a0b12',
          800: '#10121d',
          700: '#1a1d2b',
          600: '#262a3d',
          500: '#3a3f57',
          400: '#6b7190',
          300: '#a0a5c0',
          200: '#d0d3e4',
          100: '#eef0fa'
        },
        aqua: {
          400: '#38e4d2',
          500: '#14c7b8',
          600: '#0ea89a'
        },
        sol: {
          400: '#ffc46b',
          500: '#ff9f43',
          600: '#e67e22'
        },
        moss: {
          400: '#7cd97c',
          500: '#42b883',
          600: '#2d8f5f'
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
        'radial-fade': 'radial-gradient(ellipse at top, rgba(56,228,210,0.15), transparent 60%)',
        'grid-fade': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
