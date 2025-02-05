import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: ${props => props.theme.colors.background};
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-family: ${props => props.theme.fonts.primary};
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const AppointmentButton = styled(Link)`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(212, 175, 55, 0.2);
  }
`;

function Navbar() {
  return (
    <Nav>
      <NavContainer>
        <Logo to="/">Fabulous</Logo>
        <NavLinks>
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/about">À propos</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/gallery">Galerie</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <AppointmentButton to="/appointment">Rendez-vous</AppointmentButton>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
}

export default Navbar;
