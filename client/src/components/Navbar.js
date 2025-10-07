import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { animateScroll as scroll } from 'react-scroll';

const Nav = styled.nav`
  position:fixed; top:0; left:0; width:100%; z-index:1000;
  padding:.85rem 2rem; display:flex; justify-content:center;
  background:rgba(20,20,20,.55);
  backdrop-filter:blur(14px) saturate(160%);
  border-bottom:1px solid rgba(255,255,255,.05);
  transition:background .4s ease, box-shadow .4s ease, padding .3s;
  ${p=>p.$scrolled && 'background:rgba(14,14,14,.92); box-shadow:0 4px 18px -4px rgba(0,0,0,.55); padding:.55rem 2rem;'}
  @media (max-width:${p=>p.theme.breakpoints.mobile}){padding:.7rem 1rem;}
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
  display:flex; gap:2.4rem; align-items:center; transition:.4s; position:absolute; left:50%; top:50%; transform:translate(-50%, -50%);
  @media (max-width:1250px){gap:2rem;}
  @media (max-width:1100px){gap:1.8rem;}
  @media (max-width:980px){gap:1.4rem;}
  @media (max-width:${p=>p.theme.breakpoints.tablet}){
    position:fixed; flex-direction:column; inset:0; top:60px; padding:2.6rem 2rem 3rem; background:rgba(16,16,16,.96); backdrop-filter:blur(18px);
    transform:${p=>p.$isOpen?'translateY(0)':'translateY(-100%)'}; left:0; top:60px; width:100%;
    opacity:${p=>p.$isOpen?1:0}; visibility:${p=>p.$isOpen?'visible':'hidden'}; overflow-y:auto; gap:1.4rem;
  }
`;



const NavLink = styled.button`
  background:none; border:none; cursor:pointer;
  font:600 .8rem ${p=>p.theme.fonts.secondary}; letter-spacing:.65px; text-transform:uppercase;
  color:${p=>p.$active?p.theme.colors.primary:p.theme.colors.text}; position:relative; padding:.6rem .7rem; transition:.35s; display:inline-flex; align-items:center; gap:.35rem;
  &:after{content:'';position:absolute;left:50%;bottom:0;height:2px;width:${p=>p.$active?'68%':'0'};background:${p=>p.theme.colors.primary};transform:translateX(-50%);transition:.45s cubic-bezier(.65,.05,.36,1);}
  &:hover{color:${p=>p.theme.colors.primary}; &:after{width:68%;}}
  @media (max-width:1200px){font-size:.75rem;}
  @media (max-width:${p=>p.theme.breakpoints.tablet}){font-size:1rem;width:100%;justify-content:center;}
`;

const AdminLink = styled(Link)`
  font:500 .7rem ${p=>p.theme.fonts.secondary};letter-spacing:.55px;padding:.55rem .85rem;border:1px solid rgba(212,175,55,.35);border-radius:30px;color:${p=>p.theme.colors.primary};display:inline-flex;align-items:center;gap:.4rem;transition:.35s;background:linear-gradient(120deg,rgba(212,175,55,.18),rgba(212,175,55,0));
  &:hover{background:rgba(212,175,55,.18);border-color:${p=>p.theme.colors.primary};}
  @media (max-width:${p=>p.theme.breakpoints.tablet}){font-size:.9rem;width:100%;justify-content:center;}
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
  const [active, setActive] = useState('home');

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

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if(el){
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({top:y,behavior:'smooth'});
      setActive(id);
      closeMenu();
    }
  };

  return (
    <Nav $scrolled={scrolled}>
  <NavContainer style={{position:'relative'}}>
        <Logo to="/" onClick={()=>{scroll.scrollToTop({duration:600}); setActive('home'); closeMenu();}}>Fabulous</Logo>
        <MenuButton onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? '✕' : '☰'}
        </MenuButton>
        <NavLinks $isOpen={isMenuOpen}>
          <NavLink onClick={()=>scrollTo('home')} $active={active==='home'}>Accueil</NavLink>
          <NavLink onClick={()=>scrollTo('about')} $active={active==='about'}>À propos</NavLink>
          <NavLink onClick={()=>scrollTo('services')} $active={active==='services'}>Services</NavLink>
          <NavLink onClick={()=>scrollTo('portfolio')} $active={active==='portfolio'}>Galerie</NavLink>
          <NavLink onClick={()=>scrollTo('testimonials')} $active={active==='testimonials'}>Avis</NavLink>
          <NavLink onClick={()=>scrollTo('footer')} $active={active==='footer'}>Contact</NavLink>
          <AdminLink to="/admin" onClick={closeMenu}>Admin</AdminLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
}

export default Navbar;
