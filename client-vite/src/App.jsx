import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle.js';
import { theme } from './styles/Theme.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Services from './components/Services.jsx';
import Portfolio from './components/Portfolio.jsx';
import Testimonials from './components/Testimonials.jsx';
import Footer from './components/Footer.jsx';
import AdminLogin from './components/Admin/AdminLogin.jsx';
import AdminDashboard from './components/Admin/AdminDashboard.jsx';

function App() {
  const rawBase = import.meta.env.BASE_URL || '/';
  const basename = rawBase === '/' ? undefined : rawBase.replace(/\/$/, '');
  return (
    <Router basename={basename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/" element={
            <>
              <Header />
              <Hero />
              <About />
              <Services />
              <Portfolio />
              <Testimonials />
              <Footer />
            </>
          } />
          <Route path="*" element={<Hero />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
