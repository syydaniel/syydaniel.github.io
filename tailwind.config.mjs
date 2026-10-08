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
          950: '#f3efe6',
          900: '#efebe2',
          800: '#e9e5db',
          700: '#dcd9cf',
          600: '#cfd2ca',
          500: '#a7afaa',
          400: '#7f8a86',
          300: '#5c6763',
          200: '#2a302f',
          100: '#15191a'
        },
        aqua: {
          400: '#3f7570',
          500: '#2f5e5a',
          600: '#214744'
        },
        sol: {
          400: '#b8341f',
          500: '#a52c18',
          600: '#8f2412'
        },
        moss: {
          400: '#52705f',
          500: '#3f5a4b',
          600: '#3f5a4b'
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
        'radial-fade': 'radial-gradient(ellipse at top, rgba(47,94,90,0.12), transparent 60%)',
        'grid-fade': 'linear-gradient(rgba(21,25,26,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(21,25,26,0.04) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
