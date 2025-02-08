import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/Theme';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Appointment from './components/Appointment';
import Footer from './components/Footer';
import AdminLogin from './components/Admin/AdminLogin';
import AdminVerify from './components/Admin/AdminVerify';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/verify" element={<AdminVerify />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/" element={
            <>
              <Header />
              <Hero />
              <About />
              <Services />
              <Portfolio />
              <Testimonials />
              <Appointment />
              <Footer />
            </>
          } />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
