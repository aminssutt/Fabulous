import { createGlobalStyle, keyframes } from 'styled-components';

// Luxury animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
  
  * { margin:0; padding:0; box-sizing:border-box; }
  
  html { 
    scroll-behavior:smooth;
    font-size: 16px;
  }
  
  body {
    font-family: ${props => props.theme.fonts.secondary};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.7;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 { 
    font-family: ${p => p.theme.fonts.primary}; 
    font-weight: 500; 
    line-height: 1.2;
    letter-spacing: 0.02em;
  }
  
  a { 
    text-decoration: none; 
    color: inherit; 
    cursor: pointer; 
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  button { 
    font-family: ${p => p.theme.fonts.secondary}; 
    cursor: pointer; 
    border: none; 
    outline: none; 
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  input, textarea, select { 
    font-family: ${p => p.theme.fonts.secondary}; 
    outline: none;
    transition: all 0.3s ease;
  }
  
  img { 
    max-width: 100%; 
    height: auto; 
  }
  
  ::selection { 
    background: ${p => p.theme.colors.primary}; 
    color: ${p => p.theme.colors.secondary}; 
  }
  
  ::-webkit-scrollbar { 
    width: 8px; 
  }
  
  ::-webkit-scrollbar-track { 
    background: ${p => p.theme.colors.background}; 
  }
  
  ::-webkit-scrollbar-thumb { 
    background: linear-gradient(180deg, #D4AF37 0%, #BF953F 50%, #AA771C 100%);
    border-radius: 10px;
    border: 2px solid ${p => p.theme.colors.background};
  }
  
  ::-webkit-scrollbar-thumb:hover { 
    background: linear-gradient(180deg, #E5C158 0%, #D4AF37 50%, #BF953F 100%);
  }

  /* Luxury gold gradient text utility */
  .gold-text {
    background: linear-gradient(135deg, #FCF6BA 0%, #D4AF37 25%, #BF953F 50%, #D4AF37 75%, #FCF6BA 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${shimmer} 4s linear infinite;
  }

  /* Smooth fade-in for sections */
  .fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Luxury button base styles */
  .luxury-btn {
    position: relative;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s ease;
    }
    &:hover::before {
      left: 100%;
    }
  }
`;

export default GlobalStyle;
