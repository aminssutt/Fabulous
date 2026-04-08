import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faPaintBrush, faGem } from '@fortawesome/free-solid-svg-icons';

const AboutSection = styled.section`
  background-color: ${props => props.theme.colors.background};
  padding: 6rem 0;
  position: relative;
  overflow: hidden;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 5rem 0;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 4.2rem 0;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(191, 149, 63, 0.06) 0%, rgba(26, 26, 26, 0) 100%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0 1.25rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: clamp(2rem, 4vw, 4rem);
  align-items: start;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2.25rem;
  }
`;

const Content = styled.div`
  max-width: 64ch;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    max-width: 100%;
  }

  h2 {
    font-size: clamp(2rem, 4vw, 2.6rem);
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1.25rem;
  }

  p {
    color: ${props => props.theme.colors.text};
    margin: 0 0 1.25rem;
    line-height: 1.85;
    font-size: 1.05rem;

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: 1rem;
      line-height: 1.72;
      margin-bottom: 1.05rem;
    }
  }

  > p:last-of-type {
    margin-bottom: 0;
  }
`;

const Lead = styled.p`
  font-size: clamp(1.2rem, 2vw, 1.45rem);
  line-height: 1.75;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1.6rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-bottom: 1.2rem;
    line-height: 1.65;
  }
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-self: start;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 1.85rem 1.9rem 1.9rem 2.2rem;
  border-radius: 14px;
  border: 1px solid rgba(191, 149, 63, 0.2);
  border-left: 3px solid ${props => props.theme.colors.primary};
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(191, 149, 63, 0.45);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1.35rem 1.2rem 1.45rem 1.3rem;
  }

  h3 {
    color: ${props => props.theme.colors.primary};
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    margin: 0 0 0.85rem;
    font-size: 1.15rem;
    line-height: 1.35;

    span {
      display: block;
    }

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: 1rem;
      gap: 0.65rem;
      margin-bottom: 0.7rem;
    }
  }

  p {
    color: ${props => props.theme.colors.text};
    opacity: 0.92;
    margin: 0;
    line-height: 1.75;

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: 0.97rem;
      line-height: 1.65;
    }
  }

  .icon {
    font-size: 1.1rem;
    color: ${props => props.theme.colors.primary};
    margin-top: 0.2rem;
    flex-shrink: 0;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(191, 149, 63, 0.25);
  text-align: center;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    margin-top: 2rem;
    padding-top: 1.6rem;
  }
`;

const StatItem = styled.div`
  h4 {
    font-size: 2.3rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.35rem;
  }

  p {
    color: ${props => props.theme.colors.text};
    font-size: 0.92rem;
    opacity: 0.9;
    margin: 0;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
`;

function About() {
  return (
    <AboutSection id="about">
      <Container>
        <Grid>
          <Content>
            <h2>À propos</h2>
            <Lead>
              Fabulous Interior Design est né d&apos;une conviction simple : l&apos;espace dans lequel vous vivez
              façonne profondément qui vous êtes.
            </Lead>
            <p>Nous ne concevons pas des intérieurs pour être regardés. Nous créons des environnements pour être ressentis.</p>
            <p>
              À la croisée de l&apos;architecture intérieure, du design régénératif et de la psychologie de l&apos;espace,
              chaque projet est pensé comme un écosystème vivant capable de soutenir votre bien-être, votre énergie et
              votre équilibre au quotidien.
            </p>
            <p>Lumière naturelle, matières authentiques, circulation fluide, silence visuel. Rien n&apos;est laissé au hasard.</p>
            <p>Parce qu&apos;un intérieur n&apos;est pas un décor. C&apos;est une expérience, un refuge, une extension invisible de vous-même.</p>
            <p>Chez Fabulous, nous traduisons votre essence en espace avec exigence, sensibilité et vision.</p>
            <Stats>
              <StatItem>
                <h4>150+</h4>
                <p>Projets Réalisés</p>
              </StatItem>
              <StatItem>
                <h4>10+</h4>
                <p>Années d&apos;Excellence</p>
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
                <span>01 — Beyond Aesthetics</span>
              </h3>
              <p>
                Nous ne créons pas des espaces &quot;beaux&quot;.<br />
                Nous créons des lieux qui influencent votre énergie et votre quotidien.
              </p>
            </FeatureCard>
            <FeatureCard>
              <h3>
                <FontAwesomeIcon icon={faPaintBrush} className="icon" />
                <span>02 — Designed to Be Felt</span>
              </h3>
              <p>
                Chaque projet est pensé pour être vécu, ressenti, expérimenté.<br />
                Parce que le vrai luxe, c&apos;est ce que vous ressentez chez vous.
              </p>
            </FeatureCard>
            <FeatureCard>
              <h3>
                <FontAwesomeIcon icon={faGem} className="icon" />
                <span>03 — Conscious Design</span>
              </h3>
              <p>
                Un design qui respecte votre bien-être et son environnement.<br />
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
