import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faPaintBrush, faGem } from '@fortawesome/free-solid-svg-icons';

const AboutSection = styled.section`background:${p=>p.theme.colors.background}; padding:6rem 0; position:relative; overflow:hidden; &::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(212,175,55,.05) 0%,rgba(26,26,26,0) 100%);}`;
const Container = styled.div`max-width:1200px;margin:0 auto;padding:0 2rem;`;
const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center; @media (max-width:${p=>p.theme.breakpoints.mobile}){grid-template-columns:1fr;gap:2rem;}`;
const Content = styled.div`h2{font-size:2.5rem;color:${p=>p.theme.colors.primary};margin:0 0 1.5rem;} p{line-height:1.8;margin:0 0 1.5rem;}`;
const Features = styled.div`display:grid;gap:2rem;`;
const Card = styled.div`background:rgba(255,255,255,.05);padding:2rem;border-radius:10px;border-left:4px solid ${p=>p.theme.colors.primary};transition:.3s; &:hover{transform:translateY(-5px);box-shadow:0 10px 20px rgba(0,0,0,.1);} h3{display:flex;gap:.8rem;align-items:flex-start;margin:0 0 .85rem;font-size:1.15rem;line-height:1.35;color:${p=>p.theme.colors.primary};} h3 span{display:block;} h3 svg{font-size:1rem;margin-top:.15rem;flex-shrink:0;} p{opacity:.9;margin:0;line-height:1.75;}`;
const Stats = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;margin-top:3rem;text-align:center; @media (max-width:${p=>p.theme.breakpoints.mobile}){grid-template-columns:1fr;}`;
const Stat = styled.div`h4{font-size:2.5rem;margin:0 0 .5rem;color:${p=>p.theme.colors.primary};} p{margin:0;opacity:.9;}`;

export default function About(){
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
            <p>À la croisée de l'architecture intérieure, du design régénératif et de la psychologie de l'espace, chaque projet est pensé comme un écosystème vivant capable de soutenir votre bien-être, votre énergie et votre équilibre au quotidien.</p>
            <p>Lumière naturelle, matières authentiques, circulation fluide, silence visuel...</p>
            <p>Rien n'est laissé au hasard. Chaque choix est intentionnel.</p>
            <p>Parce qu'un intérieur n'est pas un décor. C'est une expérience. Un refuge. Une extension invisible de vous-même.</p>
            <p>Chez Fabulous, nous traduisons votre essence en espace. Avec exigence, sensibilité et vision.</p>
            <Stats>
              <Stat><h4>150+</h4><p>Projets Réalisés</p></Stat>
              <Stat><h4>10+</h4><p>Années d'Expérience</p></Stat>
              <Stat><h4>100%</h4><p>Clients Satisfaits</p></Stat>
            </Stats>
          </Content>
          <Features>
            <Card><h3><FontAwesomeIcon icon={faAward}/><span>01 — Beyond Aesthetics</span></h3><p>Nous ne créons pas des espaces "beaux".<br/>Nous créons des lieux qui influencent votre énergie et votre quotidien.</p></Card>
            <Card><h3><FontAwesomeIcon icon={faPaintBrush}/><span>02 — Designed to Be Felt</span></h3><p>Chaque projet est pensé pour être vécu, ressenti, expérimenté.<br/>Parce que le vrai luxe, c'est ce que vous ressentez chez vous.</p></Card>
            <Card><h3><FontAwesomeIcon icon={faGem}/><span>03 — Conscious Design</span></h3><p>Un design qui respecte votre bien-être et son environnement.<br/>Plus sain, plus juste, plus durable.</p></Card>
          </Features>
        </Grid>
      </Container>
    </AboutSection>
  );
}
