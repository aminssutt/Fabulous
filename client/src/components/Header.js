import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s ease;
  animation: ${fadeIn} 1s ease;
`;

const Nav = styled.nav`
  background-color: ${props => props.$scrolled ? 'rgba(26, 26, 26, 0.95)' : 'transparent'};
  padding: ${props => props.$scrolled ? '1rem 0' : '1.5rem 0'};
  backdrop-filter: ${props => props.$scrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;
  border-bottom: ${props => props.$scrolled ? '1px solid rgba(212, 175, 55, 0.1)' : 'none'};
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const logoAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Logo = styled.div`
  font-family: ${props => props.theme.fonts.primary};
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
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
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);

  &:hover {
    transform: scale(1.05);
    text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.8rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${props => props.theme.colors.primary};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    
    &::after {
      width: 100%;
    }
  }

  &.active {
    color: ${props => props.theme.colors.primary};
    
    &::after {
      width: 100%;
    }
  }
`;


const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: block;
  }

  &:hover {
    transform: rotate(90deg);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const MobileMenu = styled.div`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  height: 100vh;
  background-color: rgba(26, 26, 26, 0.98);
  backdrop-filter: blur(10px);
  padding: 5rem 2rem;
  gap: 2rem;
  animation: ${slideIn} 0.3s ease;
  
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const MobileNavLink = styled(NavLink)`
  font-size: 1.5rem;
  text-align: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(90deg);
  }
`;

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <HeaderContainer>
      <Nav $scrolled={scrolled}>
        <NavContent>
          <Logo>FABULOUS</Logo>
          <NavLinks>
            <NavLink 
              to="about" 
              smooth={true} 
              duration={500} 
              spy={true}
              activeClass="active"
            >
              À propos
            </NavLink>
            <NavLink 
              to="portfolio" 
              smooth={true} 
              duration={500}
              spy={true}
              activeClass="active"
            >
              Réalisations
            </NavLink>
            <NavLink 
              to="services" 
              smooth={true} 
              duration={500}
              spy={true}
              activeClass="active"
            >
              Services
            </NavLink>
            <NavLink 
              to="testimonials" 
              smooth={true} 
              duration={500}
              spy={true}
              activeClass="active"
            >
              Témoignages
            </NavLink>
            {/* Appointment CTA removed (static showcase) */}
          </NavLinks>
          <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
            <FontAwesomeIcon icon={faBars} />
          </MobileMenuButton>
        </NavContent>
      </Nav>
      
      <MobileMenu $isOpen={mobileMenuOpen}>
        <CloseButton onClick={closeMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
        <MobileNavLink 
          to="about" 
          smooth={true} 
          duration={500} 
          onClick={closeMenu}
          spy={true}
          activeClass="active"
        >
          À propos
        </MobileNavLink>
        <MobileNavLink 
          to="portfolio" 
          smooth={true} 
          duration={500} 
          onClick={closeMenu}
          spy={true}
          activeClass="active"
        >
          Réalisations
        </MobileNavLink>
        <MobileNavLink 
          to="services" 
          smooth={true} 
          duration={500} 
          onClick={closeMenu}
          spy={true}
          activeClass="active"
        >
          Services
        </MobileNavLink>
        <MobileNavLink 
          to="testimonials" 
          smooth={true} 
          duration={500} 
          onClick={closeMenu}
          spy={true}
          activeClass="active"
        >
          Témoignages
        </MobileNavLink>
        {/* Appointment CTA removed mobile */}
      </MobileMenu>
    </HeaderContainer>
  );
}

export default Header;