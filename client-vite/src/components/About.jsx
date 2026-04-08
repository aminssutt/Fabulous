import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faPaintBrush, faGem } from '@fortawesome/free-solid-svg-icons';

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

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    padding: 5.8rem 0;
  }

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    padding: 4.4rem 0;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 80% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
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

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    padding: 0 1.2rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    margin-bottom: 2.5rem;
  }
`;

const Overline = styled.span`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: ${p => p.theme.colors.primary};
  margin-bottom: 1rem;

  &::before,
  &::after {
    content: '\25C6';
    margin: 0 1rem;
    font-size: 0.5rem;
    vertical-align: middle;
    opacity: 0.5;
  }

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    font-size: 0.72rem;
    letter-spacing: 2.6px;
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
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: clamp(2rem, 4.6vw, 5rem);
  align-items: start;

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2.35rem;
  }
`;

const Content = styled.div`
  max-width: 66ch;

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    max-width: 100%;
  }
`;

const Lead = styled.p`
  font-size: clamp(1.18rem, 1.8vw, 1.45rem);
  line-height: 1.8;
  color: ${p => p.theme.colors.text};
  margin: 0 0 1.4rem;
  font-weight: 350;

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    line-height: 1.65;
    margin-bottom: 1.15rem;
  }
`;

const Narrative = styled.p`
  font-size: 1.08rem;
  line-height: 1.85;
  color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.72)'};
  margin: 0 0 1.15rem;
  font-weight: 320;

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 1rem;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: min(100%, 920px);
  gap: 1.8rem;
  margin: 2.75rem auto 0;
  padding-top: 2.4rem;
  border-top: 1px solid rgba(212, 175, 55, 0.15);

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    gap: 1.2rem;
  }

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1.4rem;
    margin-top: 2rem;
    padding-top: 1.8rem;
  }
`;

const Stat = styled.div`
  text-align: center;
  animation: ${countUp} 0.8s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
  opacity: 0;

  h4 {
    font-size: 2.85rem;
    font-weight: 300;
    margin: 0 0 0.45rem;
    background: linear-gradient(135deg, #D4AF37, #FCF6BA);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: ${p => p.theme.breakpoints.mobile}) {
      font-size: 2.35rem;
    }
  }

  p {
    margin: 0;
    font-size: 0.86rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.72)'};
  }
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  align-self: start;

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    gap: 1rem;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  padding: 1.9rem 2rem 2rem 2.35rem;
  border-radius: 16px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    padding: 1.35rem 1.2rem 1.45rem 1.35rem;
    border-radius: 14px;
  }

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
    border-color: rgba(212, 175, 55, 0.28);
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
    gap: 0.8rem;
    align-items: flex-start;
    margin: 0 0 0.85rem;
    font-size: 1.1rem;
    font-weight: 500;
    line-height: 1.35;
    letter-spacing: 0.02em;
    color: ${p => p.theme.colors.text};
    position: relative;
    z-index: 1;

    span {
      display: block;
    }

    svg {
      color: ${p => p.theme.colors.primary};
      font-size: 1rem;
      margin-top: 0.15rem;
      flex-shrink: 0;
    }

    @media (max-width: ${p => p.theme.breakpoints.mobile}) {
      font-size: 1rem;
      gap: 0.65rem;
      margin-bottom: 0.72rem;
    }
  }

  p {
    color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.7)'};
    margin: 0;
    line-height: 1.75;
    position: relative;
    z-index: 1;

    @media (max-width: ${p => p.theme.breakpoints.mobile}) {
      font-size: 0.97rem;
      line-height: 1.65;
    }
  }
`;

export default function About() {
  return (
    <AboutSection id="about">
      <Container>
        <SectionHeader>
          <Overline>Fabulous Interior Design</Overline>
          <SectionTitle>Ã€ propos</SectionTitle>
        </SectionHeader>

        <Grid>
          <Content>
            <Lead>
              Fabulous Interior Design est nÃ© d&apos;une conviction simple : l&apos;espace dans lequel vous vivez
              faÃ§onne profondÃ©ment qui vous Ãªtes.
            </Lead>
            <Narrative>Nous ne concevons pas des intÃ©rieurs pour Ãªtre regardÃ©s. Nous crÃ©ons des environnements pour Ãªtre ressentis.</Narrative>
            <Narrative>
              Ã€ la croisÃ©e de l&apos;architecture intÃ©rieure, du design rÃ©gÃ©nÃ©ratif et de la psychologie de l&apos;espace,
              chaque projet est pensÃ© comme un Ã©cosystÃ¨me vivant capable de soutenir votre bien-Ãªtre, votre Ã©nergie et
              votre Ã©quilibre au quotidien.
            </Narrative>
            <Narrative>LumiÃ¨re naturelle, matiÃ¨res authentiques, circulation fluide, silence visuel. Chaque choix est intentionnel.</Narrative>
            <Narrative>Parce qu&apos;un intÃ©rieur n&apos;est pas un dÃ©cor : c&apos;est une expÃ©rience, un refuge, une extension invisible de vous-mÃªme.</Narrative>
            <Narrative>Chez Fabulous, nous traduisons votre essence en espace avec exigence, sensibilitÃ© et vision.</Narrative>

          </Content>

          <Features>
            <Card>
              <h3><FontAwesomeIcon icon={faAward} /> <span>01 â€” Beyond Aesthetics</span></h3>
              <p>Nous ne crÃ©ons pas des espaces &quot;beaux&quot;.<br />Nous crÃ©ons des lieux qui influencent votre Ã©nergie et votre quotidien.</p>
            </Card>
            <Card>
              <h3><FontAwesomeIcon icon={faPaintBrush} /> <span>02 â€” Designed to Be Felt</span></h3>
              <p>Chaque projet est pensÃ© pour Ãªtre vÃ©cu, ressenti, expÃ©rimentÃ©.<br />Parce que le vrai luxe, c&apos;est ce que vous ressentez chez vous.</p>
            </Card>
            <Card>
              <h3><FontAwesomeIcon icon={faGem} /> <span>03 â€” Conscious Design</span></h3>
              <p>Un design qui respecte votre bien-Ãªtre et son environnement.<br />Plus sain, plus juste, plus durable.</p>
            </Card>
          </Features>
        </Grid>
        <Stats>
          <Stat $delay="0.2s">
            <h4>150+</h4>
            <p>Projets RÃ©alisÃ©s</p>
          </Stat>
          <Stat $delay="0.4s">
            <h4>10+</h4>
            <p>AnnÃ©es d&apos;Excellence</p>
          </Stat>
          <Stat $delay="0.6s">
            <h4>100%</h4>
            <p>Clients Satisfaits</p>
          </Stat>
        </Stats>
      </Container>
    </AboutSection>
  );
}

