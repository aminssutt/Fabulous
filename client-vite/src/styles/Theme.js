export const theme = {
  colors: {
    primary: '#D4AF37',
    primaryLight: '#E5C158',
    primaryDark: '#AA771C',
    secondary: '#000000',
    text: '#F5F5F5',
    textMuted: 'rgba(245, 245, 245, 0.7)',
    background: '#0A0A0A',
    backgroundAlt: '#111111',
    cardBg: 'rgba(255, 255, 255, 0.03)',
    accent: '#D4AF37',
    error: '#E53935',
    success: '#43A047',
    warning: '#FB8C00',
    gold: {
      light: '#FCF6BA',
      main: '#D4AF37',
      dark: '#AA771C'
    }
  },
  fonts: {
    primary: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    secondary: "'Montserrat', 'Helvetica Neue', Arial, sans-serif"
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px'
  },
  shadows: {
    soft: '0 4px 20px rgba(0, 0, 0, 0.15)',
    medium: '0 8px 40px rgba(0, 0, 0, 0.2)',
    strong: '0 16px 60px rgba(0, 0, 0, 0.3)',
    gold: '0 4px 30px rgba(212, 175, 55, 0.3)',
    goldStrong: '0 8px 50px rgba(212, 175, 55, 0.4)'
  },
  transitions: {
    smooth: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    bounce: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    fast: 'all 0.2s ease'
  },
  gradients: {
    gold: 'linear-gradient(135deg, #FCF6BA 0%, #D4AF37 25%, #BF953F 50%, #D4AF37 75%, #FCF6BA 100%)',
    goldSimple: 'linear-gradient(135deg, #D4AF37 0%, #AA771C 100%)',
    dark: 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
    radialGold: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)'
  }
};
