/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark mode surfaces
        dark: {
          bg: '#0F0F0F',
          surface: '#1A1A1A',
          elevated: '#242424',
          border: '#2E2E2E',
        },
        // Light mode surfaces
        light: {
          bg: '#F7F4F0',
          surface: '#FFFFFF',
          elevated: '#F0EDE8',
          border: '#E8E4DE',
        },
        // Brand accent - warm terracotta
        accent: {
          DEFAULT: '#D4704A',
          light: '#E8896A',
          dark: '#B85A35',
        },
        // Text
        ink: {
          primary: '#1A1A1A',
          secondary: '#6B6560',
          muted: '#9E9791',
        },
        chalk: {
          primary: '#F1EDE6',
          secondary: '#B8B0A8',
          muted: '#6B6560',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'scale-in': 'scaleIn 0.2s ease forwards',
        'slide-right': 'slideRight 0.3s ease forwards',
        'cart-bounce': 'cartBounce 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        shimmer: 'shimmer 1.8s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        cartBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.3)' },
          '60%': { transform: 'scale(0.9)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.16)',
        'accent': '0 4px 20px rgba(212,112,74,0.35)',
      },
    },
  },
  plugins: [],
}
