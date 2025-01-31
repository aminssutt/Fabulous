import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Appointment from './components/Appointment';

const theme = {
  colors: {
    primary: '#D4AF37',    // Or
    secondary: '#1A1A1A',  // Noir profond
    background: '#1A1A1A', // Noir profond
    text: '#FFFFFF',       // Blanc
    textSecondary: '#CCCCCC' // Gris clair
  },
  fonts: {
    primary: "'Playfair Display', serif",
    secondary: "'Poppins', sans-serif"
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px'
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <Appointment />
    </ThemeProvider>
  );
}

export default App;
