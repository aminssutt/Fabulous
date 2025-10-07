import React from 'react';
import styled from 'styled-components';
// Appointment link removed (static showcase)

const HomeSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('/images/hero-bg.jpg') center/cover no-repeat;
  padding: 6rem 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 4rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  font-family: ${props => props.theme.fonts.primary};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;


function Home() {
  return (
    <HomeSection>
      <Container>
        <Title>Fabulous Design Intérieur</Title>
        <Subtitle>
          Conception et réaménagement d'espaces résidentiels et commerciaux.
          Une approche sur mesure qui allie fonctionnalité, élégance et cohérence visuelle.
        </Subtitle>
        {/* CTA supprimé (plus de prise de rendez-vous) */}
      </Container>
    </HomeSection>
  );
}

export default Home;
