import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-scroll';

const HeroSection = styled.section`
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0;
  overflow: hidden;
  margin-top: -60px; 

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000');
    background-size: cover;
    background-position: center;
    filter: brightness(0.4);
    z-index: -1;
    transform: scale(1.1);
    transition: ${props => props.theme.transitions.slow};
  }

  &:hover::before {
    transform: scale(1.15);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: calc(100vh - 60px);
    margin-top: 0;
    padding-top: 60px;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
  position: relative;
  z-index: 2;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0 1.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0 1rem;
  }
`;

const Title = styled.h1`
  font-size: 4.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: ${props => props.theme.shadows.text};
  font-family: ${props => props.theme.fonts.primary};
  line-height: 1.2;

  span {
    color: ${props => props.theme.colors.primary};
    display: inline-block;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${props => props.theme.colors.primary};
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
  }

  &:hover span::after {
    transform: scaleX(1);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 3.5rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.2rem;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  color: ${props => props.theme.colors.text};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
  text-shadow: ${props => props.theme.shadows.text};
  font-family: ${props => props.theme.fonts.secondary};
  opacity: 0.9;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.3rem;
    line-height: 1.6;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: ${props => props.theme.transitions.standard};
  border: 2px solid ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.secondary};
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: rgba(255, 255, 255, 0.1);
    transform: translate(-50%, -50%) rotate(45deg) scale(0);
    transition: ${props => props.theme.transitions.slow};
    z-index: -1;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.large};
    background-color: transparent;
    color: ${props => props.theme.colors.primary};

    &::before {
      transform: translate(-50%, -50%) rotate(45deg) scale(1);
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.8rem 2rem;
    font-size: 1rem;
    width: 80%;
    max-width: 300px;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.theme.colors.text};
  opacity: 0.8;
  animation: bounce 2s infinite;
  text-shadow: ${props => props.theme.shadows.text};
  font-family: ${props => props.theme.fonts.secondary};

  span {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    bottom: 1.5rem;
    
    span {
      font-size: 0.9rem;
    }
  }
`;

function Hero() {
  return (
    <HeroSection id="home">
      <HeroContent>
        <Title>
          CRÉEZ VOTRE ESPACE DE <span>RÊVE</span>
        </Title>
        <Subtitle>
          Transformez votre intérieur en un chef-d'œuvre unique qui reflète votre personnalité
          et votre style de vie avec notre expertise en design d'intérieur.
        </Subtitle>
        <CTAButton to="appointment" smooth={true} duration={500}>
          Prendre Rendez-vous
        </CTAButton>
      </HeroContent>
      <ScrollIndicator>
        <span>Découvrir</span>
        <span>↓</span>
      </ScrollIndicator>
    </HeroSection>
  );
}

export default Hero;