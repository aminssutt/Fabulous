import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link as ScrollLink, animateScroll } from 'react-scroll';
import { Link, useLocation } from 'react-router-dom';

const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
  background: ${p => p.$scrolled ? 'rgba(10, 10, 10, 0.92)' : 'rgba(10, 10, 10, 0.6)'};
  border-bottom: 1px solid ${p => p.$scrolled ? 'rgba(212, 175, 55, 0.15)' : 'rgba(212, 175, 55, 0.05)'};
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: ${fadeDown} 0.8s ease;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${p => p.$scrolled ? '0.6rem 2rem' : '0.9rem 2rem'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: padding 0.4s ease;

  @media (max-width: 1024px) {
    padding: 0.6rem 1.25rem;
  }
`;

const Logo = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  z-index: 1002;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.85;
    transform: scale(1.03);
  }
`;

const LogoImage = styled.img`
  height: ${p => p.$scrolled ? '42px' : '50px'};
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.3));
  transition: all 0.4s ease;

  ${Logo}:hover & {
    filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.5));
  }

  @media (max-width: 1024px) {
    height: 40px;
  }

  @media (max-width: 480px) {
    height: 36px;
  }
`;

const Overlay = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    opacity: ${p => p.$open ? 1 : 0};
    visibility: ${p => p.$open ? 'visible' : 'hidden'};
    transition: opacity 0.4s ease, visibility 0.4s ease;
    z-index: 999;
  }
`;

const Menu = styled.ul`
  display: flex;
  gap: 0.4rem;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;

  @media (max-width: 1200px) {
    gap: 0.15rem;
  }

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    max-width: 85vw;
    height: 100vh;
    height: 100dvh;
    background: linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%);
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 6rem 0 2rem;
    gap: 0;
    transform: ${p => p.$open ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: ${p => p.$open ? '-20px 0 60px rgba(0, 0, 0, 0.5)' : 'none'};
    z-index: 1001;
    overflow-y: auto;
    border-left: 1px solid rgba(212, 175, 55, 0.1);
  }
`;

const Item = styled.li`
  @media (max-width: 1024px) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }
`;

const StyledScrollLink = styled(ScrollLink)`
  text-decoration: none;
  font-weight: 500;
  font-size: 0.78rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${p => p.$active ? p.theme.colors.primary : 'rgba(255, 255, 255, 0.65)'};
  position: relative;
  transition: color 0.3s ease;
  cursor: pointer;
  padding: 0.5rem 0.6rem;
  display: block;
  border-radius: 6px;
  white-space: nowrap;

  @media (max-width: 1200px) {
    font-size: 0.7rem;
    letter-spacing: 1px;
    padding: 0.5rem 0.4rem;
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 2px;
    height: 2px;
    width: ${p => p.$active ? 'calc(100% - 1.5rem)' : '0'};
    transform: translateX(-50%);
    background: ${p => p.theme.colors.primary};
    transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border-radius: 1px;
  }

  &:hover {
    color: ${p => p.theme.colors.primary};

    &::after {
      width: calc(100% - 1.5rem);
    }
  }

  @media (max-width: 1024px) {
    font-size: 0.95rem;
    letter-spacing: 2px;
    padding: 1.2rem 2rem;
    border-radius: 0;

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
      background: rgba(212, 175, 55, 0.06);
    }
  }
`;

const AdminLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 0.7rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.25);
  transition: color 0.3s ease;
  padding: 0.5rem 0.5rem;
  display: block;

  &:hover {
    color: ${p => p.theme.colors.primary};
  }

  @media (max-width: 1024px) {
    font-size: 0.85rem;
    padding: 1.2rem 2rem;
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    text-align: center;
    color: rgba(255, 255, 255, 0.3);
  }
`;

const ReturnLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${p => p.theme.colors.primary};
    transform: translateX(-4px);
  }
`;

const Burger = styled.button`
  display: none;

  @media (max-width: 1024px) {
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
    transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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

const MobileLogoWrap = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2rem 1.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid rgba(212, 175, 55, 0.08);
    position: absolute;
    top: 1.5rem;
    left: 0;
    right: 0;
  }

  img {
    height: 36px;
    width: auto;
    filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.3));
  }
`;

const links = [
  { to: 'home', label: 'Accueil' },
  { to: 'about', label: 'À propos' },
  { to: 'services', label: 'Services' },
  { to: 'portfolio', label: 'Réalisations' },
  { to: 'testimonials', label: 'Avis' },
  { to: 'contact', label: 'Contact' }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    const handler = () => {
      const offsets = links.map(l => {
        const el = document.getElementById(l.to);
        if (!el) return { id: l.to, dist: Infinity };
        const rect = el.getBoundingClientRect();
        return { id: l.to, dist: Math.abs(rect.top - 100) };
      });
      offsets.sort((a, b) => a.dist - b.dist);
      if (offsets[0]) setActive(offsets[0].id);
    };

    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [location.pathname]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (location.pathname.startsWith('/admin')) {
    return (
      <Nav $scrolled>
        <Container $scrolled>
          <Logo onClick={() => animateScroll.scrollToTop()}>
            <LogoImage src="/logo.png" alt="Fabulous" $scrolled />
          </Logo>
          <ReturnLink to="/">← Retour au site</ReturnLink>
        </Container>
      </Nav>
    );
  }

  return (
    <>
      <Overlay $open={open} onClick={() => setOpen(false)} />
      <Nav $scrolled={scrolled}>
        <Container $scrolled={scrolled}>
          <Logo onClick={() => { animateScroll.scrollToTop(); setOpen(false); }}>
            <LogoImage src="/logo.png" alt="Fabulous" $scrolled={scrolled} />
          </Logo>
          <Menu $open={open}>
            <MobileLogoWrap>
              <img src="/logo.png" alt="Fabulous" />
            </MobileLogoWrap>
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
