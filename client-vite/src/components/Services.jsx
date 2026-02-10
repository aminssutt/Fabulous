import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCouch, faLightbulb, faRulerCombined, faPalette, faArrowRight,
  faGem, faHome, faPaintBrush, faCube, faHammer, faMagic, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../config';

// Map icon names to FontAwesome icons
const ICON_MAP = {
  faCouch: faCouch,
  faLightbulb: faLightbulb,
  faRulerCombined: faRulerCombined,
  faPalette: faPalette,
  faGem: faGem,
  faHome: faHome,
  faPaintBrush: faPaintBrush,
  faCube: faCube,
  faHammer: faHammer,
  faMagic: faMagic
};

// Animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const Section = styled.section`
  padding: 8rem 0;
  background: ${p => p.theme.colors.backgroundAlt || '#111111'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 60%);
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${p => p.theme.breakpoints?.mobile || '480px'}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  padding: 2.5rem 2rem;
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.08);
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #D4AF37, transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-15px);
    border-color: rgba(212, 175, 55, 0.25);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(212, 175, 55, 0.08);
    
    &::before, &::after {
      opacity: 1;
    }
  }
  
  h3 {
    margin: 1.5rem 0 1rem;
    font-size: 1.25rem;
    font-weight: 500;
    color: ${p => p.theme.colors.text};
    position: relative;
    z-index: 1;
  }
  
  p {
    margin: 0;
    color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.7)'};
    line-height: 1.7;
    font-size: 0.95rem;
    position: relative;
    z-index: 1;
  }
`;

const IconWrap = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%);
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: ${p => p.theme.colors.primary};
  font-size: 1.6rem;
  position: relative;
  z-index: 1;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  ${Card}:hover & {
    background: linear-gradient(135deg, #D4AF37 0%, #AA771C 100%);
    color: ${p => p.theme.colors.background};
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
    animation: ${float} 2s ease-in-out infinite;
  }
`;

const LearnMore = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${p => p.theme.colors.primary};
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;
  z-index: 1;
  
  svg {
    font-size: 0.75rem;
    transition: transform 0.3s ease;
  }
  
  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
  
  &:hover svg {
    transform: translateX(5px);
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${p => p.theme.colors.primary};
  font-size: 1.2rem;
`;

// Fallback services if API fails or is empty
const FALLBACK_SERVICES = [
  { 
    icon: 'faCouch', 
    title: 'Design Intérieur', 
    description: "Création d'espaces harmonieux et fonctionnels qui reflètent votre personnalité unique."
  },
  { 
    icon: 'faLightbulb', 
    title: 'Conseil & Concept', 
    description: 'Accompagnement personnalisé pour définir votre identité décorative avec précision.'
  },
  { 
    icon: 'faRulerCombined', 
    title: 'Sur Mesure', 
    description: 'Optimisation des volumes et agencement intelligent pour maximiser chaque espace.'
  },
  { 
    icon: 'faPalette', 
    title: 'Matériaux Nobles', 
    description: 'Sélection de textures et finitions exclusives pour un rendu véritablement unique.'
  }
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        if (res.ok) {
          const data = await res.json();
          setServices(data.length > 0 ? data : FALLBACK_SERVICES);
        } else {
          setServices(FALLBACK_SERVICES);
        }
      } catch (error) {
        console.error('Erreur chargement services:', error);
        setServices(FALLBACK_SERVICES);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  if (loading) {
    return (
      <Section id="services">
        <Container>
          <SectionHeader>
            <Overline>Ce Que Nous Offrons</Overline>
            <Title>Nos Services</Title>
          </SectionHeader>
          <Loading><FontAwesomeIcon icon={faSpinner} spin /> Chargement...</Loading>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="services">
      <Container>
        <SectionHeader>
          <Overline>Ce Que Nous Offrons</Overline>
          <Title>Nos Services</Title>
          <Subtitle>
            Une expertise complète pour transformer vos rêves en réalité, 
            avec un souci constant de l'excellence et du détail.
          </Subtitle>
        </SectionHeader>
        
        <Grid>
          {services.map((s, index) => (
            <Card key={s.id || s.title} style={{ animationDelay: `${index * 0.1}s` }}>
              <IconWrap>
                <FontAwesomeIcon icon={ICON_MAP[s.icon] || faGem} />
              </IconWrap>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <LearnMore>
                En savoir plus <FontAwesomeIcon icon={faArrowRight} />
              </LearnMore>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
