/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#F4F4F5',
          inset: '#FAFAFA',
          dark: '#121212',
          'dark-raised': '#1A1A1A',
          'dark-inset': '#151515',
        },
        // Borders
        edge: {
          DEFAULT: '#E4E4E7',
          dark: '#2A2A2A',
        },
        // Text
        txt: {
          DEFAULT: '#1A1A1A',
          secondary: '#71717A',
          muted: '#A1A1AA',
          inverse: '#EFEFEF',
          'dark-primary': '#EFEFEF',
          'dark-secondary': '#C8C8C8',
          'dark-muted': '#707070',
        },
        // Accent — Charcoal/Black (formerly Cobalt)
        cobalt: {
          DEFAULT: '#111111',
          light: '#2A2A2A',
          dark: '#000000',
          muted: '#1111110D', // 5% opacity
        },
        // Semantic
        sale: '#EAE1D9', // Muted beige instead of red
        success: '#111111', // Keeping success messages minimal
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '0px',
        md: '2px',
        lg: '4px',
        xl: '4px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'fade-up': 'fadeUp 0.5s ease forwards',
        'scale-in': 'scaleIn 0.2s ease forwards',
        'slide-up': 'slideUp 0.25s ease-out forwards',
        'slide-right': 'slideRight 0.3s ease forwards',
        'cart-bounce': 'cartBounce 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        shimmer: 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
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
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.1)',
        'toast': '0 8px 30px rgba(0,0,0,0.12)',
        'accent': '0 4px 20px rgba(0,85,255,0.35)',
      },
    },
  },
  plugins: [],
}
