import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { useScrollReveal } from '../hooks/useScrollReveal';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
`;

const Section = styled.section`
  padding: 8rem 0;
  background: ${p => p.theme.colors.background};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const RevealWrapper = styled.div`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? '0' : '40px'});
  transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: ${p => p.$delay || '0s'};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Overline = styled.span`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: ${p => p.theme.colors.primary};
  margin-bottom: 1rem;

  &::before, &::after {
    content: '\u25C6';
    margin: 0 1rem;
    font-size: 0.5rem;
    vertical-align: middle;
    opacity: 0.5;
  }
`;

const Title = styled.h2`
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 400;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #FCF6BA 0%, #D4AF37 25%, #BF953F 50%, #D4AF37 75%, #FCF6BA 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
`;

const Subtitle = styled.p`
  max-width: 600px;
  margin: 0 auto;
  color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.7)'};
  font-size: 1.1rem;
  line-height: 1.8;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: ${p => p.theme.breakpoints?.tablet || '1024px'}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const InfoSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.08);
  border-radius: 16px;
  transition: all 0.4s ease;

  &:hover {
    border-color: rgba(212, 175, 55, 0.25);
    transform: translateX(8px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const IconCircle = styled.div`
  width: 56px;
  height: 56px;
  min-width: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(212, 175, 55, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.primary};
  font-size: 1.2rem;
  transition: all 0.4s ease;

  ${InfoCard}:hover & {
    background: linear-gradient(135deg, #D4AF37, #AA771C);
    color: ${p => p.theme.colors.background};
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  }
`;

const InfoContent = styled.div`
  h4 {
    margin: 0 0 0.3rem;
    font-size: 1.1rem;
    font-weight: 500;
    color: ${p => p.theme.colors.text};
  }

  p {
    margin: 0;
    color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.6)'};
    font-size: 0.95rem;
    line-height: 1.6;
  }

  a {
    color: ${p => p.theme.colors.primary};
    text-decoration: none;
    transition: opacity 0.3s ease;

    &:hover { opacity: 0.7; }
  }
`;

const CTASide = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #D4AF37, transparent);
  }

  @media (max-width: 600px) {
    padding: 2rem;
  }
`;

const CTATitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 400;
  margin: 0 0 1rem;
  color: ${p => p.theme.colors.text};

  @media (max-width: 600px) {
    font-size: 1.4rem;
  }
`;

const CTAText = styled.p`
  color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.7)'};
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 0 0 2rem;
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.1rem 2.5rem;
  background: linear-gradient(135deg, #D4AF37 0%, #AA771C 100%);
  color: ${p => p.theme.colors.background};
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 40px rgba(212, 175, 55, 0.4);

    &::before { left: 100%; }

    svg { transform: translateX(4px); }
  }

  svg {
    transition: transform 0.3s ease;
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
`;

const SocialBtn = styled.a`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.primary};
  font-size: 1rem;
  transition: all 0.4s ease;
  text-decoration: none;

  &:hover {
    background: ${p => p.theme.colors.primary};
    color: ${p => p.theme.colors.background};
    transform: translateY(-3px);
    box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
  }
`;

const Decoration = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
  filter: blur(60px);
  animation: ${pulse} 8s ease-in-out infinite;
  pointer-events: none;
`;

export default function Contact() {
  const [headerRef, headerVisible] = useScrollReveal();
  const [leftRef, leftVisible] = useScrollReveal();
  const [rightRef, rightVisible] = useScrollReveal();

  return (
    <Section id="contact">
      <Decoration style={{ top: '-100px', right: '-100px' }} />
      <Decoration style={{ bottom: '-100px', left: '-100px', animationDelay: '3s' }} />

      <Container>
        <RevealWrapper ref={headerRef} $visible={headerVisible}>
          <SectionHeader>
            <Overline>Nous Contacter</Overline>
            <Title>Parlons de Votre Projet</Title>
            <Subtitle>
              Chaque espace a une histoire. Racontez-nous la vôtre,
              et ensemble, donnons-lui vie.
            </Subtitle>
          </SectionHeader>
        </RevealWrapper>

        <Grid>
          <RevealWrapper ref={leftRef} $visible={leftVisible} $delay="0.2s">
            <InfoSide>
              <InfoCard>
                <IconCircle>
                  <FontAwesomeIcon icon={faEnvelope} />
                </IconCircle>
                <InfoContent>
                  <h4>Email</h4>
                  <p><a href="mailto:fabulouscreationsdesign@gmail.com">fabulouscreationsdesign@gmail.com</a></p>
                </InfoContent>
              </InfoCard>

              <InfoCard>
                <IconCircle>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </IconCircle>
                <InfoContent>
                  <h4>Localisation</h4>
                  <p>Paris, France</p>
                </InfoContent>
              </InfoCard>
            </InfoSide>
          </RevealWrapper>

          <RevealWrapper ref={rightRef} $visible={rightVisible} $delay="0.4s">
            <CTASide>
              <CTATitle>Prêt à Transformer Votre Espace ?</CTATitle>
              <CTAText>
                Réservez une consultation gratuite et découvrez
                comment nous pouvons sublimer votre intérieur
                avec élégance et raffinement.
              </CTAText>
              <CTAButton href="mailto:fabulouscreationsdesign@gmail.com">
                Demander une consultation
                <FontAwesomeIcon icon={faArrowRight} />
              </CTAButton>

              <SocialRow>
                <SocialBtn href="https://www.instagram.com/fahima_faroukhi" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FontAwesomeIcon icon={faInstagram} />
                </SocialBtn>
                <SocialBtn href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <FontAwesomeIcon icon={faTiktok} />
                </SocialBtn>
              </SocialRow>
            </CTASide>
          </RevealWrapper>
        </Grid>
      </Container>
    </Section>
  );
}
