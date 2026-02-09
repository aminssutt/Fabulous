import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link as ScrollLink } from 'react-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const fadeIn = keyframes`
	from { opacity:0; transform:translateY(-20px); }
	to { opacity:1; transform:translateY(0); }
`;

const HeaderContainer = styled.header`
	position:fixed; top:0; left:0; width:100%; z-index:1000; transition:.3s; animation:${fadeIn} 1s ease;
`;
const Nav = styled.nav`
	background:${p=>p.$scrolled?'rgba(26,26,26,.95)':'transparent'}; padding:${p=>p.$scrolled?'1rem 0':'1.5rem 0'}; backdrop-filter:${p=>p.$scrolled?'blur(10px)':'none'}; transition:.3s; border-bottom:${p=>p.$scrolled?'1px solid rgba(212,175,55,.1)':'none'};
`;
const NavContent = styled.div`
	display:flex; justify-content:space-between; align-items:center; max-width:1200px; margin:0 auto; padding:0 2rem;
`;
const Logo = styled.div`
	font-family:${p=>p.theme.fonts.primary}; font-size:2rem; font-weight:700; letter-spacing:2px; cursor:pointer; background:linear-gradient(to right,#BF953F,#FCF6BA,#B38728,#FBF5B7,#AA771C); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; text-shadow:0 0 10px rgba(212,175,55,.3); transition:.3s;
	&:hover{ transform:scale(1.05); text-shadow:0 0 20px rgba(212,175,55,.5); }
	@media (max-width:${p=>p.theme.breakpoints.mobile}){ font-size:1.8rem; }
`;
const NavLinks = styled.div`
	display:flex; gap:2.5rem; align-items:center; @media (max-width:${p=>p.theme.breakpoints.mobile}){ display:none; }
`;
const NavLink = styled(ScrollLink)`
	color:${p=>p.theme.colors.text}; font-size:1rem; font-weight:500; cursor:pointer; transition:.3s; position:relative; padding:.5rem 0;
	&::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:${p=>p.theme.colors.primary};transition:width .3s;}
	&:hover{color:${p=>p.theme.colors.primary}; transform:translateY(-2px); &::after{width:100%;}}
	&.active{color:${p=>p.theme.colors.primary}; &::after{width:100%;}}
`;
const MobileMenuButton = styled.button`
	display:none; background:none; border:none; color:${p=>p.theme.colors.primary}; font-size:1.5rem; cursor:pointer; transition:.3s; @media (max-width:${p=>p.theme.breakpoints.mobile}){display:block;} &:hover{transform:rotate(90deg);} 
`;
const slideIn = keyframes`from{transform:translateX(100%);}to{transform:translateX(0);}`;
const MobileMenu = styled.div`
	display:${p=>p.$isOpen?'flex':'none'}; flex-direction:column; position:fixed; top:0; right:0; width:80%; height:100vh; background:rgba(26,26,26,.98); backdrop-filter:blur(10px); padding:5rem 2rem; gap:2rem; animation:${slideIn} .3s ease; @media (min-width:${p=>p.theme.breakpoints.mobile}){display:none;}
`;
const MobileNavLink = styled(NavLink)`font-size:1.5rem; text-align:center; padding:1rem 0; border-bottom:1px solid rgba(212,175,55,.1); &:last-child{border-bottom:none;}`;
const CloseButton = styled.button`position:absolute; top:2rem; right:2rem; background:none; border:none; color:${p=>p.theme.colors.primary}; font-size:1.5rem; cursor:pointer; transition:.3s; &:hover{transform:rotate(90deg);} `;

function Header(){
	const [scrolled,setScrolled] = useState(false);
	const [mobileMenuOpen,setMobileMenuOpen] = useState(false);
	useEffect(()=>{ const onScroll=()=> setScrolled(window.scrollY>50); window.addEventListener('scroll',onScroll); return()=>window.removeEventListener('scroll',onScroll); },[]);
	const closeMenu = ()=> setMobileMenuOpen(false);
	return (
		<HeaderContainer>
			<Nav $scrolled={scrolled}>
				<NavContent>
					<Logo onClick={()=> window.scrollTo({top:0,behavior:'smooth'})}>FABULOUS</Logo>
					<NavLinks>
						<NavLink to="about" smooth duration={500} spy activeClass="active">À propos</NavLink>
						<NavLink to="portfolio" smooth duration={500} spy activeClass="active">Réalisations</NavLink>
						<NavLink to="services" smooth duration={500} spy activeClass="active">Services</NavLink>
						<NavLink to="testimonials" smooth duration={500} spy activeClass="active">Témoignages</NavLink>
					</NavLinks>
					<MobileMenuButton onClick={()=> setMobileMenuOpen(true)}><FontAwesomeIcon icon={faBars}/></MobileMenuButton>
				</NavContent>
			</Nav>
			<MobileMenu $isOpen={mobileMenuOpen}>
				<CloseButton onClick={closeMenu}><FontAwesomeIcon icon={faTimes}/></CloseButton>
				<MobileNavLink to="about" smooth duration={500} onClick={closeMenu} spy activeClass="active">À propos</MobileNavLink>
				<MobileNavLink to="portfolio" smooth duration={500} onClick={closeMenu} spy activeClass="active">Réalisations</MobileNavLink>
				<MobileNavLink to="services" smooth duration={500} onClick={closeMenu} spy activeClass="active">Services</MobileNavLink>
				<MobileNavLink to="testimonials" smooth duration={500} onClick={closeMenu} spy activeClass="active">Témoignages</MobileNavLink>
			</MobileMenu>
		</HeaderContainer>
	);
}

export default Header;
