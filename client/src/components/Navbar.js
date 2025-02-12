import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: ${props => props.theme.colors.background};
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: ${props => props.theme.shadows.medium};
  backdrop-filter: blur(10px);
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.8rem 1rem;
  }
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    padding: 0 1.5rem;
    gap: 2rem;
  }
`;

const Logo = styled(Link)`
  font-family: ${props => props.theme.fonts.primary};
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
  background: linear-gradient(
    to right,
    #BF953F,
    #FCF6BA,
    #B38728,
    #FBF5B7,
    #AA771C
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: ${props => props.theme.transitions.standard};

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    height: ${props => (props.$isOpen ? 'calc(100vh - 60px)' : '0')};
    background-color: rgba(26, 26, 26, 0.98);
    padding: ${props => (props.$isOpen ? '2rem' : '0')};
    gap: 1.5rem;
    box-shadow: ${props => props.theme.shadows.medium};
    backdrop-filter: blur(10px);
    transform: ${props => (props.$isOpen ? 'translateY(0)' : 'translateY(-100%)')};
    opacity: ${props => (props.$isOpen ? '1' : '0')};
    transition: ${props => props.theme.transitions.standard};
    overflow: hidden;
    z-index: 999;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  transition: ${props => props.theme.transitions.standard};
  padding: 0.5rem 1rem;
  position: relative;
  font-family: ${props => props.theme.fonts.secondary};

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 50%;
    background-color: ${props => props.theme.colors.primary};
    transition: ${props => props.theme.transitions.standard};
    transform: translateX(-50%);
  }

  &:hover {
    color: ${props => props.theme.colors.primary};
    &:after {
      width: 80%;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    text-align: center;
    padding: 1rem 0;
    font-size: 1.1rem;
  }
`;

const AppointmentButton = styled(Link)`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  transition: ${props => props.theme.transitions.standard};
  font-family: ${props => props.theme.fonts.secondary};
  border: 2px solid ${props => props.theme.colors.primary};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
    background-color: transparent;
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 80%;
    max-width: 300px;
    text-align: center;
    margin: 1rem 0;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
  transition: ${props => props.theme.transitions.standard};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <Nav style={{ backgroundColor: scrolled ? 'rgba(26, 26, 26, 0.98)' : 'transparent' }}>
      <NavContainer>
        <Logo to="/">Fabulous</Logo>
        <MenuButton onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? '✕' : '☰'}
        </MenuButton>
        <NavLinks $isOpen={isMenuOpen}>
          <NavLink to="/" onClick={closeMenu}>Accueil</NavLink>
          <NavLink to="/about" onClick={closeMenu}>À propos</NavLink>
          <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
          <NavLink to="/gallery" onClick={closeMenu}>Galerie</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          <AppointmentButton to="/appointment" onClick={closeMenu}>
            Rendez-vous
          </AppointmentButton>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
}

export default Navbar;
