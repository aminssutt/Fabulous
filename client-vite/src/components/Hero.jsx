import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link as ScrollLink } from 'react-scroll';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const kenBurns1 = keyframes`
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.15) translate(-2%, -1%); }
`;

const kenBurns2 = keyframes`
  0% { transform: scale(1.05) translate(-1%, 0); }
  100% { transform: scale(1.2) translate(2%, -2%); }
`;

const kenBurns3 = keyframes`
  0% { transform: scale(1.1) translate(1%, -1%); }
  100% { transform: scale(1) translate(-1%, 1%); }
`;

const scrollAnim = keyframes`
  0%, 100% { opacity: 1; transform: translateX(-50%) translateY(0); }
  50% { opacity: 0.3; transform: translateX(-50%) translateY(10px); }
`;

const SLIDES = [
  {
    url: 'https://naupcnnsgioimxbhhyiu.supabase.co/storage/v1/object/public/images/gallery/1770641230635-7636fbb9e356f25e.jpg',
    animation: kenBurns1
  },
  {
    url: 'https://naupcnnsgioimxbhhyiu.supabase.co/storage/v1/object/public/images/gallery/1770641230103-4bb79961713a0cfd.jpg',
    animation: kenBurns2
  },
  {
    url: 'https://naupcnnsgioimxbhhyiu.supabase.co/storage/v1/object/public/images/gallery/1770641229226-5ce4fd94e9055ff1.jpg',
    animation: kenBurns3
  },
  {
    url: 'https://naupcnnsgioimxbhhyiu.supabase.co/storage/v1/object/public/images/gallery/1770641227809-fe8f73a73029a36e.jpg',
    animation: kenBurns1
  }
];

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  position: relative;
  overflow: hidden;
  background: #050505;
`;

const SlideBg = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${p => p.$url});
  background-size: cover;
  background-position: center;
  opacity: ${p => p.$active ? 1 : 0};
  transition: opacity 1.8s ease-in-out;
  animation: ${p => p.$animation} 12s ease-in-out infinite alternate;
  will-change: transform, opacity;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(5, 5, 5, 0.75) 0%,
    rgba(5, 5, 5, 0.55) 40%,
    rgba(5, 5, 5, 0.65) 70%,
    rgba(5, 5, 5, 0.85) 100%
  );
  z-index: 1;
`;

const VignetteOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(5, 5, 5, 0.6) 100%);
  z-index: 2;
`;

const GoldGlow = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 60%, rgba(212, 175, 55, 0.06) 0%, transparent 60%);
  z-index: 2;
`;

const Content = styled.div`
  position: relative;
  max-width: 900px;
  text-align: center;
  z-index: 10;
`;

const Overline = styled.span`
  display: inline-block;
  font-family: ${p => p.theme.fonts.secondary};
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: ${p => p.theme.colors.primary};
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeInUp} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.3s;

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
  animation-delay: 0.5s, 0s;
  opacity: 0;

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  font-weight: 300;
  margin: 0 auto 3rem;
  max-width: 650px;
  line-height: 1.8;
  color: rgba(245, 245, 245, 0.8);
  opacity: 0;
  animation: ${fadeInUp} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.7s;

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  animation: ${fadeInUp} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.9s;
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
  border: ${p => p.$secondary ? '1px solid rgba(212, 175, 55, 0.6)' : 'none'};
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
    color: ${p => p.theme.colors.background};
    box-shadow: 0 8px 50px rgba(212, 175, 55, 0.4);

    &::before {
      ${p => p.$secondary ? 'width: 100%;' : 'left: 100%;'}
    }
  }

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    padding: 1rem 2rem;
    font-size: 0.8rem;
  }
`;

const SlideIndicators = styled.div`
  position: absolute;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 10;
  opacity: 0;
  animation: ${fadeInUp} 1s ease forwards;
  animation-delay: 1.5s;
`;

const Dot = styled.button`
  width: ${p => p.$active ? '28px' : '8px'};
  height: 8px;
  border-radius: 4px;
  border: none;
  background: ${p => p.$active ? p.theme.colors.primary : 'rgba(255, 255, 255, 0.3)'};
  cursor: pointer;
  transition: all 0.4s ease;
  padding: 0;

  &:hover {
    background: ${p => p.theme.colors.primary};
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
  gap: 0.5rem;
  opacity: 0;
  animation: ${fadeInUp} 1s ease forwards;
  animation-delay: 1.8s;
  z-index: 10;
`;

const MouseIcon = styled.div`
  width: 24px;
  height: 38px;
  border: 2px solid rgba(212, 175, 55, 0.35);
  border-radius: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 7px;
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    height: 7px;
    background: ${p => p.theme.colors.primary};
    border-radius: 2px;
    animation: ${scrollAnim} 1.5s ease-in-out infinite;
  }
`;

const ScrollText = styled.span`
  font-size: 0.65rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(212, 175, 55, 0.4);
`;

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Section id="home">
      {SLIDES.map((slide, i) => (
        <SlideBg
          key={i}
          $url={slide.url}
          $active={i === current}
          $animation={slide.animation}
        />
      ))}
      <Overlay />
      <VignetteOverlay />
      <GoldGlow />

      <Content>
        <Overline>Design d'intérieur</Overline>
        <Title>L'Art de Sublimer Vos Espaces</Title>
        <Subtitle>
          Conception et réaménagement d'espaces résidentiels et commerciaux.
          Une approche sur mesure qui allie fonctionnalité, élégance et cohérence visuelle.
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

      <SlideIndicators>
        {SLIDES.map((_, i) => (
          <Dot key={i} $active={i === current} onClick={() => setCurrent(i)} />
        ))}
      </SlideIndicators>

      <ScrollIndicator>
        <MouseIcon />
        <ScrollText>Défiler</ScrollText>
      </ScrollIndicator>
    </Section>
  );
}
