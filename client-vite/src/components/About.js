import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faPaintBrush, faGem } from '@fortawesome/free-solid-svg-icons';

const AboutSection = styled.section`background:${p=>p.theme.colors.background}; padding:6rem 0; position:relative; overflow:hidden; &::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(212,175,55,.05) 0%,rgba(26,26,26,0) 100%);}`;
const Container = styled.div`max-width:1200px;margin:0 auto;padding:0 2rem;`;
const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center; @media (max-width:${p=>p.theme.breakpoints.mobile}){grid-template-columns:1fr;gap:2rem;}`;
const Content = styled.div`h2{font-size:2.5rem;color:${p=>p.theme.colors.primary};margin:0 0 1.5rem;} p{line-height:1.8;margin:0 0 1.5rem;}`;
const Features = styled.div`display:grid;gap:2rem;`;
const Card = styled.div`background:rgba(255,255,255,.05);padding:2rem;border-radius:10px;border-left:4px solid ${p=>p.theme.colors.primary};transition:.3s; &:hover{transform:translateY(-5px);box-shadow:0 10px 20px rgba(0,0,0,.1);} h3{display:flex;gap:1rem;align-items:center;margin:0 0 1rem;font-size:1.5rem;color:${p=>p.theme.colors.primary};} p{opacity:.9;margin:0;}`;
const Stats = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;margin-top:3rem;text-align:center; @media (max-width:${p=>p.theme.breakpoints.mobile}){grid-template-columns:1fr;}`;
const Stat = styled.div`h4{font-size:2.5rem;margin:0 0 .5rem;color:${p=>p.theme.colors.primary};} p{margin:0;opacity:.9;}`;

export default function About(){
  return (
    <AboutSection id="about">
      <Container>
        <Grid>
          <Content>
            <h2>À Propos de Fabulous</h2>
            <p>Chez Fabulous, nous transformons vos espaces en véritables œuvres d'art. Notre passion pour le design d'intérieur se reflète dans chaque projet que nous réalisons, créant des environnements qui allient esthétique et fonctionnalité.</p>
            <Stats>
              <Stat><h4>150+</h4><p>Projets Réalisés</p></Stat>
              <Stat><h4>10+</h4><p>Années d'Expérience</p></Stat>
              <Stat><h4>100%</h4><p>Clients Satisfaits</p></Stat>
            </Stats>
          </Content>
          <Features>
            <Card><h3><FontAwesomeIcon icon={faAward}/> Excellence</h3><p>Engagement total dans chaque détail pour garantir un résultat irréprochable.</p></Card>
            <Card><h3><FontAwesomeIcon icon={faPaintBrush}/> Créativité</h3><p>Une vision unique pour sublimer chaque espace avec style et cohérence.</p></Card>
            <Card><h3><FontAwesomeIcon icon={faGem}/> Qualité Premium</h3><p>Matériaux et finitions haut de gamme pour un intérieur durable et luxueux.</p></Card>
          </Features>
        </Grid>
      </Container>
    </AboutSection>
  );
}
