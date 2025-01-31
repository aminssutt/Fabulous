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
    filter: brightness(0.3);
    z-index: -1;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 2px;

  span {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.2rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.secondary};
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.theme.colors.primary};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.8rem 2rem;
    font-size: 1rem;
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