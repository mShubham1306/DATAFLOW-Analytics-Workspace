/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F8FA',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#EFF6FF',
        },
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        text: '#111827',
        muted: '#6B7280',
        border: '#E5E7EB',
        purple: {
          DEFAULT: '#7C3AED',
          dark: '#6D28D9',
          light: '#F3E8FF',
        },
        pink: {
          DEFAULT: '#EC4899',
          dark: '#DB2777',
          light: '#FDF2F8',
        },
        teal: {
          DEFAULT: '#14B8A6',
          dark: '#0D9488',
          light: '#CCFBF1',
        },
        amber: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          light: '#FEF3C7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #EFF6FF 0%, #F3E8FF 25%, #FDF2F8 50%, #FEF3C7 75%, #EFF6FF 100%)',
        'hero-gradient-dark': 'linear-gradient(135deg, #1E3A8A 0%, #4C1D95 50%, #831843 100%)',
        'card-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        'button-gradient': 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        'button-gradient-hover': 'linear-gradient(135deg, #1D4ED8 0%, #6D28D9 100%)',
        'text-gradient-primary': 'linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%)',
        'text-gradient-warm': 'linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #EC4899 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.7s ease-out forwards',
        'slide-in-right': 'slideInRight 0.7s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'gradient': 'gradientShift 8s ease infinite',
        'shimmer': 'shimmer 2s infinite',
        'blink': 'blink 1s step-end infinite',
        'marquee': 'marquee 25s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'count-up': 'countUp 2s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-15px) translateX(5px)' },
          '50%': { transform: 'translateY(-8px) translateX(-5px)' },
          '75%': { transform: 'translateY(-20px) translateX(3px)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(37, 99, 235, 0.2), 0 0 40px rgba(37, 99, 235, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(37, 99, 235, 0.4), 0 0 60px rgba(37, 99, 235, 0.2)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 40px rgba(37, 99, 235, 0.3)',
        'glow-purple': '0 0 40px rgba(124, 58, 237, 0.3)',
        'glow-pink': '0 0 40px rgba(236, 72, 153, 0.3)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(37, 99, 235, 0.05)',
        'card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        'bounce-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
