import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faPaintBrush, faGem } from '@fortawesome/free-solid-svg-icons';

const AboutSection = styled.section`
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
            <h2>À propos</h2>
            <p>Fabulous Interior Design est né d'une conviction simple :</p>
            <p>l'espace dans lequel vous vivez façonne profondément qui vous êtes.</p>
            <p>Nous ne concevons pas des intérieurs pour être regardés.</p>
            <p>Nous créons des environnements pour être ressentis.</p>
            <p>
              À la croisée de l'architecture intérieure, du design régénératif et de la psychologie
              de l'espace, chaque projet est pensé comme un écosystème vivant capable de soutenir
              votre bien-être, votre énergie et votre équilibre au quotidien.
            </p>
            <p>Lumière naturelle, matières authentiques, circulation fluide, silence visuel...</p>
            <p>Rien n'est laissé au hasard. Chaque choix est intentionnel.</p>
            <p>
              Parce qu'un intérieur n'est pas un décor. C'est une expérience. Un refuge.
              Une extension invisible de vous-même.
            </p>
            <p>Chez Fabulous, nous traduisons votre essence en espace. Avec exigence, sensibilité et vision.</p>
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
                01 — Beyond Aesthetics
              </h3>
              <p>
                Nous ne créons pas des espaces "beaux". Nous créons des lieux qui
                influencent votre énergie et votre quotidien.
              </p>
            </FeatureCard>
            <FeatureCard>
              <h3>
                <FontAwesomeIcon icon={faPaintBrush} className="icon" />
                02 — Designed to Be Felt
              </h3>
              <p>
                Chaque projet est pensé pour être vécu, ressenti, expérimenté.
                Parce que le vrai luxe, c'est ce que vous ressentez chez vous.
              </p>
            </FeatureCard>
            <FeatureCard>
              <h3>
                <FontAwesomeIcon icon={faGem} className="icon" />
                03 — Conscious Design
              </h3>
              <p>
                Un design qui respecte votre bien-être et son environnement.
                Plus sain, plus juste, plus durable.
              </p>
            </FeatureCard>
          </Features>
        </Grid>
      </Container>
    </AboutSection>
  );
}

export default About;