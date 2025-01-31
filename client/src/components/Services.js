import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCouch, 
  faPencilRuler, 
  faLightbulb,
  faHome,
  faStore,
  faPalette
} from '@fortawesome/free-solid-svg-icons';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ServicesSection = styled.section`
  background-color: ${props => props.theme.colors.background};
  padding: 6rem 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(26, 26, 26, 0) 100%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  animation: ${fadeInUp} 1s ease;

  h2 {
    color: ${props => props.theme.colors.primary};
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: ${props => props.theme.colors.text};
    max-width: 600px;
    margin: 0 auto;
    opacity: 0.9;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ServiceCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 15px;
  padding: 2.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 1s ease;
  animation-delay: ${props => props.$delay}ms;
  border: 1px solid rgba(212, 175, 55, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(26, 26, 26, 0) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

    &::before {
      opacity: 1;
    }

    .icon {
      transform: scale(1.1) rotate(5deg);
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  
  .icon {
    transition: all 0.3s ease;
  }
`;

const ServiceTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  opacity: 0.9;
`;

const services = [
  {
    icon: faPencilRuler,
    title: "Conception sur Mesure",
    description: "Création de plans et designs personnalisés pour optimiser vos espaces selon vos besoins et votre style de vie."
  },
  {
    icon: faCouch,
    title: "Aménagement Intérieur",
    description: "Sélection de mobilier, agencement des pièces et conseils pour créer des espaces fonctionnels et esthétiques."
  },
  {
    icon: faLightbulb,
    title: "Conseil en Décoration",
    description: "Recommandations sur les couleurs, matériaux, textures et éclairages pour sublimer votre intérieur."
  },
  {
    icon: faHome,
    title: "Rénovation Complète",
    description: "Accompagnement dans vos projets de rénovation, de la conception à la coordination des travaux."
  },
  {
    icon: faStore,
    title: "Design Commercial",
    description: "Création d'espaces commerciaux attractifs et fonctionnels pour optimiser l'expérience client."
  },
  {
    icon: faPalette,
    title: "Personnalisation",
    description: "Création de pièces et éléments sur mesure pour un intérieur unique qui vous ressemble."
  }
];

function Services() {
  return (
    <ServicesSection id="services">
      <Container>
        <SectionTitle>
          <h2>Nos Services</h2>
          <p>
            Découvrez notre gamme complète de services d'architecture d'intérieur 
            pour transformer votre espace en un lieu unique et fonctionnel.
          </p>
        </SectionTitle>

        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard key={index} $delay={index * 200}>
              <IconWrapper>
                <FontAwesomeIcon icon={service.icon} className="icon" />
              </IconWrapper>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Container>
    </ServicesSection>
  );
}

export default Services;