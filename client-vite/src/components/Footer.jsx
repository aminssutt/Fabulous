import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link as ScrollLink } from 'react-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF, faPinterestP, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Wrapper = styled.footer`
  background: #050505;
  padding: 5rem 0 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
  }
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
  
  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
  
  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }
`;

const Column = styled.div``;

const Brand = styled.div`
  font-family: ${p => p.theme.fonts.primary};
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: 3px;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #FCF6BA 0%, #D4AF37 25%, #BF953F 50%, #D4AF37 75%, #FCF6BA 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.8;
  font-size: 0.95rem;
  max-width: 300px;
  
  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    max-width: none;
    margin: 0 auto;
  }
`;

const Title = styled.h4`
  color: ${p => p.theme.colors.text};
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 1.5rem;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NavLink = styled(ScrollLink)`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 0;
  
  &:hover {
    color: ${p => p.theme.colors.primary};
    padding-left: 10px;
  }
  
  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    &:hover {
      padding-left: 0;
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  p {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.6;
  }
  
  a {
    color: ${p => p.theme.colors.primary};
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 0.7;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.primary};
  font-size: 0.9rem;
  transition: all 0.4s ease;
  
  &:hover {
    background: ${p => p.theme.colors.primary};
    color: ${p => p.theme.colors.background};
    transform: translateY(-3px);
    box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Copy = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  a {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.35);
    transition: color 0.3s ease;
    
    &:hover {
      color: ${p => p.theme.colors.primary};
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

export default function Footer() {
  return (
    <Wrapper>
      <Container>
        <Grid>
          <Column>
            <Brand>FABULOUS</Brand>
            <Description>
              Créateur d'espaces d'exception. Nous transformons vos rêves 
              en réalités luxueuses avec passion et expertise.
            </Description>
            <SocialLinks>
              <SocialLink href="#" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </SocialLink>
              <SocialLink href="#" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </SocialLink>
              <SocialLink href="#" aria-label="Pinterest">
                <FontAwesomeIcon icon={faPinterestP} />
              </SocialLink>
              <SocialLink href="#" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </SocialLink>
            </SocialLinks>
          </Column>
          
          <Column>
            <Title>Navigation</Title>
            <NavList>
              {links.map(l => (
                <NavLink key={l.to} to={l.to} smooth duration={800} offset={-80}>
                  {l.label}
                </NavLink>
              ))}
            </NavList>
          </Column>
          
          <Column>
            <Title>Services</Title>
            <NavList>
              <NavLink to="services" smooth duration={800} offset={-80}>Design Intérieur</NavLink>
              <NavLink to="services" smooth duration={800} offset={-80}>Conseil & Concept</NavLink>
              <NavLink to="services" smooth duration={800} offset={-80}>Sur Mesure</NavLink>
              <NavLink to="services" smooth duration={800} offset={-80}>Matériaux Nobles</NavLink>
            </NavList>
          </Column>
          
          <Column>
            <Title>Contact</Title>
            <ContactInfo>
              <p>
                <a href="mailto:fabulouscreationsdesign@gmail.com">fabulouscreationsdesign@gmail.com</a>
              </p>
              <p>Paris, France</p>
            </ContactInfo>
          </Column>
        </Grid>
        
        <Bottom>
          <Copy>© {new Date().getFullYear()} Fabulous. Tous droits réservés.</Copy>
          <LegalLinks>
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
          </LegalLinks>
        </Bottom>
      </Container>
    </Wrapper>
  );
}