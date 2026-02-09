import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link as ScrollLink, animateScroll } from 'react-scroll';
import { Link, useLocation } from 'react-router-dom';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
  background: rgba(10, 10, 10, 0.85);
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  transition: all 0.4s ease;
  
  @media (max-width: 900px) {
    background: rgba(10, 10, 10, 0.95);
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 900px) {
    padding: 0.75rem 1rem;
  }
`;

const Logo = styled.div`
  font-family: ${p => p.theme.fonts.primary};
  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: 2px;
  cursor: pointer;
  background: linear-gradient(135deg, #FCF6BA 0%, #D4AF37 25%, #BF953F 50%, #D4AF37 75%, #FCF6BA 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.3s ease;
  z-index: 1002;
  
  &:hover {
    opacity: 0.8;
  }
  
  @media (max-width: 900px) {
    font-size: 1.3rem;
  }
`;

// Overlay pour fermer le menu en cliquant à côté
const Overlay = styled.div`
  display: none;
  
  @media (max-width: 900px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: ${p => p.$open ? 1 : 0};
    visibility: ${p => p.$open ? 'visible' : 'hidden'};
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 999;
  }
`;

const Menu = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
  
  @media (max-width: 900px) {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    height: 100dvh;
    background: linear-gradient(180deg, #0a0a0a 0%, #111111 100%);
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 5rem 0 2rem;
    gap: 0;
    transform: ${p => p.$open ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: ${p => p.$open ? '-10px 0 30px rgba(0, 0, 0, 0.5)' : 'none'};
    z-index: 1001;
    overflow-y: auto;
    border-left: 1px solid rgba(212, 175, 55, 0.15);
  }
`;

const Item = styled.li`
  @media (max-width: 900px) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const StyledScrollLink = styled(ScrollLink)`
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${p => p.$active ? p.theme.colors.primary : 'rgba(255, 255, 255, 0.7)'};
  position: relative;
  transition: color 0.4s ease;
  cursor: pointer;
  padding: 0.5rem 0;
  display: block;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: ${p => p.$active ? '100%' : '0'};
    background: ${p => p.theme.colors.primary};
    transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  &:hover {
    color: ${p => p.theme.colors.primary};
    
    &::after {
      width: 100%;
    }
  }
  
  @media (max-width: 900px) {
    font-size: 1rem;
    padding: 1.25rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    &::after {
      display: none;
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: ${p => p.$active ? p.theme.colors.primary : 'transparent'};
      transition: background 0.3s ease;
    }
    
    &:hover, &:active {
      background: rgba(212, 175, 55, 0.08);
    }
  }
`;

const AdminLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.4s ease;
  padding: 0.5rem 0;
  display: block;
  
  &:hover {
    color: ${p => p.theme.colors.primary};
  }
  
  @media (max-width: 900px) {
    font-size: 0.9rem;
    padding: 1.25rem 2rem;
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
  }
`;

const Burger = styled.button`
  display: none;
  
  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    z-index: 1002;
    position: relative;
  }
  
  span {
    width: 24px;
    height: 2px;
    background: ${p => p.theme.colors.primary};
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
    
    &:nth-child(1) {
      transform: ${p => p.$open ? 'translateY(7px) rotate(45deg)' : 'none'};
    }
    
    &:nth-child(2) {
      opacity: ${p => p.$open ? 0 : 1};
      transform: ${p => p.$open ? 'scaleX(0)' : 'scaleX(1)'};
    }
    
    &:nth-child(3) {
      transform: ${p => p.$open ? 'translateY(-7px) rotate(-45deg)' : 'none'};
    }
  }
`;

const CloseButton = styled.button`
  display: none;
  
  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 50%;
    cursor: pointer;
    color: ${p => p.theme.colors.primary};
    font-size: 1.5rem;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(212, 175, 55, 0.1);
    }
  }
`;

const links = [
  { to: 'home', label: 'Accueil' },
  { to: 'about', label: 'À propos' },
  { to: 'services', label: 'Services' },
  { to: 'portfolio', label: 'Réalisations' },
  { to: 'testimonials', label: 'Avis' }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    
    const handler = () => {
      const offsets = links.map(l => {
        const el = document.getElementById(l.to);
        if (!el) return { id: l.to, dist: Infinity };
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - 100);
        return { id: l.to, dist };
      });
      offsets.sort((a, b) => a.dist - b.dist);
      if (offsets[0]) setActive(offsets[0].id);
    };
    
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (location.pathname.startsWith('/admin')) {
    return (
      <Nav>
        <Container>
          <Logo onClick={() => animateScroll.scrollToTop()}>FABULOUS</Logo>
          <AdminLink to="/">← Retour au site</AdminLink>
        </Container>
      </Nav>
    );
  }

  return (
    <>
      <Overlay $open={open} onClick={() => setOpen(false)} />
      <Nav>
        <Container>
          <Logo onClick={() => { animateScroll.scrollToTop(); setOpen(false); }}>FABULOUS</Logo>
          <Menu $open={open}>
            <CloseButton onClick={() => setOpen(false)} aria-label="Fermer">×</CloseButton>
            {links.map(l => (
              <Item key={l.to}>
                <StyledScrollLink 
                  to={l.to} 
                  smooth 
                  duration={800} 
                  offset={-60} 
                  $active={active === l.to ? 1 : 0} 
                  spy
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </StyledScrollLink>
              </Item>
            ))}
            <Item style={{ marginTop: 'auto' }}>
              <AdminLink to="/admin" onClick={() => setOpen(false)}>Admin</AdminLink>
            </Item>
          </Menu>
          <Burger onClick={() => setOpen(o => !o)} $open={open} aria-label="Menu">
            <span /><span /><span />
          </Burger>
        </Container>
      </Nav>
    </>
  );
}