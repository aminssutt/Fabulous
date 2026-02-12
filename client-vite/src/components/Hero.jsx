import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link as ScrollLink } from 'react-scroll';

// Animations luxueuses
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
`;

const scrollAnim = keyframes`
  0%, 100% { opacity: 1; transform: translateX(-50%) translateY(0); }
  50% { opacity: 0.3; transform: translateX(-50%) translateY(10px); }
`;

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  background: ${p => p.theme.colors.background};
  position: relative;
  overflow: hidden;
`;

const BackgroundElements = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
`;

const GoldOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  background: ${p => p.theme.gradients?.radialGold || 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)'};
  filter: blur(80px);
  animation: ${pulse} ${p => p.$duration || '8s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
`;

const FloatingShape = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: ${p => p.$rounded ? '50%' : '0'};
  transform: rotate(${p => p.$rotate || '0deg'});
  animation: ${float} ${p => p.$duration || '10s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  opacity: 0.3;
`;

const GradientLine = styled.div`
  position: absolute;
  width: 1px;
  height: 200px;
  background: linear-gradient(180deg, transparent 0%, rgba(212, 175, 55, 0.3) 50%, transparent 100%);
  left: ${p => p.$left};
  top: ${p => p.$top};
  animation: ${pulse} ${p => p.$duration || '4s'} ease-in-out infinite;
`;

const Content = styled.div`
  position: relative;
  max-width: 1000px;
  text-align: center;
  z-index: 2;
`;

const LogoContainer = styled.div`
  opacity: 0;
  animation: ${fadeInUp} 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0s;
  margin-bottom: 2.5rem;
`;

const HeroLogo = styled.img`
  height: 380px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 80px rgba(212, 175, 55, 0.5));
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &:hover {
    filter: drop-shadow(0 0 120px rgba(212, 175, 55, 0.7));
    transform: scale(1.02);
  }
  
  @media (max-width: ${p => p.theme.breakpoints?.mobile || '480px'}) {
    height: 220px;
  }
`

const Overline = styled.span`
  display: inline-block;
  font-family: ${p => p.theme.fonts.secondary};
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: ${p => p.theme.colors.primary};
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeInUp} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.2s;
  
  &::before, &::after {
    content: '—';
    margin: 0 1rem;
    opacity: 0.5;
  }
`;

const Title = styled.h1`
  font-size: clamp(2.8rem, 7vw, 5rem);
  font-weight: 400;
  margin: 0 0 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #FCF6BA 0%, #D4AF37 25%, #BF953F 50%, #D4AF37 75%, #FCF6BA 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeInUp} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards,
             ${shimmer} 4s linear infinite;
  animation-delay: 0.4s, 0s;
  opacity: 0;
  
  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  font-weight: 300;
  margin: 0 auto 3rem;
  max-width: 700px;
  line-height: 1.8;
  color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.7)'};
  opacity: 0;
  animation: ${fadeInUp} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.6s;
  
  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  animation: ${fadeInUp} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.8s;
`;

const Button = styled(ScrollLink)`
  position: relative;
  padding: 1.1rem 2.5rem;
  font-weight: 500;
  letter-spacing: 1px;
  font-size: 0.9rem;
  text-transform: uppercase;
  border-radius: 0;
  cursor: pointer;
  text-decoration: none;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: ${p => p.$secondary ? 'transparent' : 'linear-gradient(135deg, #D4AF37 0%, #AA771C 100%)'};
  color: ${p => p.$secondary ? p.theme.colors.primary : p.theme.colors.background};
  border: ${p => p.$secondary ? `1px solid ${p.theme.colors.primary}` : 'none'};
  box-shadow: ${p => p.$secondary ? 'none' : '0 4px 30px rgba(212, 175, 55, 0.3)'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: ${p => p.$secondary ? '0' : '-100%'};
    width: ${p => p.$secondary ? '0' : '100%'};
    height: 100%;
    background: ${p => p.$secondary ? p.theme.colors.primary : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'};
    transition: ${p => p.$secondary ? 'width 0.5s' : 'left 0.6s'} cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-3px);
    color: ${p => p.$secondary ? p.theme.colors.background : p.theme.colors.background};
    box-shadow: 0 8px 50px rgba(212, 175, 55, 0.4);
    
    &::before {
      ${p => p.$secondary ? 'width: 100%;' : 'left: 100%;'}
    }
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  animation: ${fadeInUp} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 1.2s;
`;

const MouseIcon = styled.div`
  width: 26px;
  height: 42px;
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 8px;
    background: ${p => p.theme.colors.primary};
    border-radius: 2px;
    animation: ${scrollAnim} 1.5s ease-in-out infinite;
  }
`;

const ScrollText = styled.span`
  font-size: 0.7rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(212, 175, 55, 0.5);
`;

export default function Hero() {
  return (
    <Section id="home">
      <BackgroundElements>
        <GoldOrb style={{ width: '600px', height: '600px', top: '-200px', right: '-200px' }} $duration="10s" />
        <GoldOrb style={{ width: '400px', height: '400px', bottom: '-100px', left: '-100px' }} $duration="12s" $delay="2s" />
        <GoldOrb style={{ width: '300px', height: '300px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} $duration="15s" $delay="4s" />
        
        <FloatingShape $size="150px" style={{ top: '15%', left: '10%' }} $duration="12s" $rotate="45deg" />
        <FloatingShape $size="80px" style={{ top: '70%', right: '15%' }} $duration="10s" $delay="2s" $rounded />
        <FloatingShape $size="120px" style={{ bottom: '20%', left: '20%' }} $duration="14s" $delay="4s" $rotate="15deg" />
        
        <GradientLine $left="20%" $top="10%" $duration="4s" />
        <GradientLine $left="80%" $top="30%" $duration="5s" />
      </BackgroundElements>
      
      <Content>
        <LogoContainer>
          <HeroLogo src="/logo.png" alt="Fabulous - Regenerative Interiors" />
        </LogoContainer>
        <Title>L'Art de Sublimer Vos Espaces</Title>
        <Subtitle>
          Où élégance intemporelle et raffinement contemporain se rencontrent.
        </Subtitle>
        <Actions>
          <Button to="portfolio" smooth duration={800} offset={-70}>
            Découvrir nos créations
          </Button>
          <Button to="about" smooth duration={800} offset={-70} $secondary>
            Notre philosophie
          </Button>
        </Actions>
      </Content>
      
      <ScrollIndicator>
        <MouseIcon />
        <ScrollText>Défiler</ScrollText>
      </ScrollIndicator>
    </Section>
  );
}