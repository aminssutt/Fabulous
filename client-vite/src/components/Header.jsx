import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
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
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  
  &:hover {
    opacity: 0.8;
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
    left: 0;
    right: 0;
    bottom: 0;
    background: #0a0a0a;
    backdrop-filter: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    transform: ${p => p.$open ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`;

const Item = styled.li``;

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
    font-size: 1.2rem;
    padding: 1rem 0;
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
  
  &:hover {
    color: ${p => p.theme.colors.primary};
  }
  
  @media (max-width: 900px) {
    font-size: 1rem;
    padding: 1rem 0;
  }
`;

const Burger = styled.button`
  display: none;
  
  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    z-index: 1001;
  }
  
  span {
    width: 28px;
    height: 2px;
    background: ${p => p.theme.colors.primary};
    border-radius: 2px;
    transition: all 0.4s ease;
    
    &:nth-child(1) {
      transform: ${p => p.$open ? 'translateY(8px) rotate(45deg)' : 'none'};
    }
    
    &:nth-child(2) {
      opacity: ${p => p.$open ? 0 : 1};
    }
    
    &:nth-child(3) {
      transform: ${p => p.$open ? 'translateY(-8px) rotate(-45deg)' : 'none'};
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
    <Nav>
      <Container>
        <Logo onClick={() => animateScroll.scrollToTop()}>FABULOUS</Logo>
        <Menu $open={open}>
          {links.map(l => (
            <Item key={l.to}>
              <StyledScrollLink 
                to={l.to} 
                smooth 
                duration={800} 
                offset={-80} 
                $active={active === l.to ? 1 : 0} 
                spy
                onClick={() => setOpen(false)}
              >
                {l.label}
              </StyledScrollLink>
            </Item>
          ))}
          <Item>
            <AdminLink to="/admin">Admin</AdminLink>
          </Item>
        </Menu>
        <Burger onClick={() => setOpen(o => !o)} $open={open} aria-label="Menu">
          <span /><span /><span />
        </Burger>
      </Container>
    </Nav>
  );
}