import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faPaintBrush, faGem, faStar } from '@fortawesome/free-solid-svg-icons';

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const countUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AboutSection = styled.section`
  background: ${p => p.theme.colors.background};
  padding: 8rem 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 80% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 20% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
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
    content: '◆';
    margin: 0 1rem;
    font-size: 0.5rem;
    vertical-align: middle;
    opacity: 0.5;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 400;
  margin: 0;
  background: linear-gradient(135deg, #FCF6BA 0%, #D4AF37 25%, #BF953F 50%, #D4AF37 75%, #FCF6BA 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  
  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const Content = styled.div`
  p {
    font-size: 1.1rem;
    line-height: 2;
    color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.7)'};
    margin: 0 0 2rem;
    font-weight: 300;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(212, 175, 55, 0.15);
  
  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Stat = styled.div`
  text-align: center;
  animation: ${countUp} 0.8s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
  opacity: 0;
  
  h4 {
    font-size: 3rem;
    font-weight: 300;
    margin: 0 0 0.5rem;
    background: linear-gradient(135deg, #D4AF37, #FCF6BA);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (max-width: ${p => p.theme.breakpoints.mobile}) {
      font-size: 2.5rem;
    }
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.7)'};
  }
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  padding: 2rem 2rem 2rem 2.5rem;
  border-radius: 16px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, #D4AF37, #AA771C);
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-5px) translateX(5px);
    border-color: rgba(212, 175, 55, 0.3);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(212, 175, 55, 0.1);
    
    &::before {
      opacity: 1;
    }
    
    &::after {
      opacity: 1;
    }
  }
  
  h3 {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin: 0 0 1rem;
    font-size: 1.3rem;
    font-weight: 500;
    color: ${p => p.theme.colors.text};
    position: relative;
    z-index: 1;
    
    svg {
      color: ${p => p.theme.colors.primary};
      font-size: 1.1rem;
    }
  }
  
  p {
    color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.7)'};
    margin: 0;
    line-height: 1.7;
    position: relative;
    z-index: 1;
  }
`;

export default function About() {
  return (
    <AboutSection id="about">
      <Container>
        <SectionHeader>
          <Overline>Notre Histoire</Overline>
          <SectionTitle>À Propos de Fabulous</SectionTitle>
        </SectionHeader>
        
        <Grid>
          <Content>
            <p>
              Chez Fabulous, nous transformons vos espaces en véritables œuvres d'art. 
              Notre passion pour le design d'intérieur se reflète dans chaque projet que 
              nous réalisons, créant des environnements qui allient esthétique raffinée 
              et fonctionnalité absolue.
            </p>
            <p>
              Chaque création est une invitation au voyage sensoriel, où les textures 
              nobles rencontrent les lignes épurées, où la lumière sculpte l'espace 
              pour révéler sa beauté intrinsèque.
            </p>
            <Stats>
              <Stat $delay="0.2s">
                <h4>150+</h4>
                <p>Projets Réalisés</p>
              </Stat>
              <Stat $delay="0.4s">
                <h4>10+</h4>
                <p>Années d'Excellence</p>
              </Stat>
              <Stat $delay="0.6s">
                <h4>100%</h4>
                <p>Clients Satisfaits</p>
              </Stat>
            </Stats>
          </Content>
          
          <Features>
            <Card>
              <h3><FontAwesomeIcon icon={faAward} /> Excellence & Prestige</h3>
              <p>Un engagement total dans chaque détail pour garantir un résultat irréprochable, digne des plus grands standards du luxe.</p>
            </Card>
            <Card>
              <h3><FontAwesomeIcon icon={faPaintBrush} /> Créativité Signature</h3>
              <p>Une vision unique pour sublimer chaque espace avec style, cohérence et une touche d'audace qui fait la différence.</p>
            </Card>
            <Card>
              <h3><FontAwesomeIcon icon={faGem} /> Matériaux Nobles</h3>
              <p>Sélection rigoureuse de matériaux et finitions haut de gamme pour un intérieur durable, élégant et intemporel.</p>
            </Card>
          </Features>
        </Grid>
      </Container>
    </AboutSection>
  );
}