import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  padding: 1rem 2.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(212, 175, 55, 0.2);
  }
`;

function Home() {
  return (
    <HomeSection>
      <Container>
        <Title>Bienvenue chez Fabulous</Title>
        <Subtitle>
          Découvrez l'excellence de la beauté dans notre salon haut de gamme.
          Une expérience unique qui allie expertise et luxe.
        </Subtitle>
        <CTAButton to="/appointment">
          Prendre Rendez-vous
        </CTAButton>
      </Container>
    </HomeSection>
  );
}

export default Home;
