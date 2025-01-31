import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faPaintBrush, faGem } from '@fortawesome/free-solid-svg-icons';

const AboutSection = styled.section`
  background-color: ${props => props.theme.colors.secondary};
  padding: 6rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const Content = styled.div`
  h2 {
    font-size: 2.5rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1.5rem;
  }

  p {
    color: ${props => props.theme.colors.text};
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 10px;
  border-left: 4px solid ${props => props.theme.colors.primary};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  h3 {
    color: ${props => props.theme.colors.primary};
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    color: ${props => props.theme.colors.text};
    opacity: 0.9;
  }

  .icon {
    font-size: 1.8rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  text-align: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  h4 {
    font-size: 2.5rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${props => props.theme.colors.text};
    font-size: 1rem;
    opacity: 0.9;
  }
`;

function About() {
  return (
    <AboutSection id="about">
      <Container>
        <Grid>
          <Content>
            <h2>À Propos de Fabulous</h2>
            <p>
              Chez Fabulous, nous transformons vos espaces en véritables œuvres d'art. 
              Notre passion pour le design d'intérieur se reflète dans chaque projet 
              que nous réalisons, créant des environnements qui allient esthétique et fonctionnalité.
            </p>
            <Stats>
              <StatItem>
                <h4>150+</h4>
                <p>Projets Réalisés</p>
              </StatItem>
              <StatItem>
                <h4>10+</h4>
                <p>Années d'Expérience</p>
              </StatItem>
              <StatItem>
                <h4>100%</h4>
                <p>Clients Satisfaits</p>
              </StatItem>
            </Stats>
          </Content>
          <Features>
            <FeatureCard>
              <h3>
                <FontAwesomeIcon icon={faAward} className="icon" />
                Excellence
              </h3>
              <p>
                Notre engagement envers l'excellence se reflète dans chaque détail 
                de nos créations, garantissant des résultats exceptionnels.
              </p>
            </FeatureCard>
            <FeatureCard>
              <h3>
                <FontAwesomeIcon icon={faPaintBrush} className="icon" />
                Créativité
              </h3>
              <p>
                Nous apportons une vision créative unique à chaque projet, 
                en repoussant les limites du design conventionnel.
              </p>
            </FeatureCard>
            <FeatureCard>
              <h3>
                <FontAwesomeIcon icon={faGem} className="icon" />
                Qualité Premium
              </h3>
              <p>
                Nous utilisons uniquement des matériaux et des finitions de la plus 
                haute qualité pour créer des espaces durables et luxueux.
              </p>
            </FeatureCard>
          </Features>
        </Grid>
      </Container>
    </AboutSection>
  );
}

export default About;