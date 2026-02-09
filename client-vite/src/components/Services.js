import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch, faPencilRuler, faLightbulb, faHome, faStore, faPalette } from '@fortawesome/free-solid-svg-icons';

const fadeInUp = keyframes`from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}`;
const Section = styled.section`background:${p=>p.theme.colors.background};padding:6rem 0;position:relative;overflow:hidden;`;
const Container = styled.div`max-width:1200px;margin:0 auto;padding:0 2rem;`;
const Title = styled.div`text-align:center;margin:0 0 4rem;animation:${fadeInUp} 1s ease;h2{color:${p=>p.theme.colors.primary};font-size:2.5rem;margin:0 0 1rem;} p{max-width:600px;margin:0 auto;opacity:.9;}`;
const Grid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem;`;
const Card = styled.div`background:rgba(255,255,255,.02);border:1px solid rgba(212,175,55,.1);border-radius:15px;padding:2.5rem;position:relative;overflow:hidden;transition:.3s;animation:${fadeInUp} 1s ease;animation-delay:${p=>p.$delay}ms; &:hover{transform:translateY(-10px); box-shadow:0 20px 40px rgba(0,0,0,.1); .icon{transform:scale(1.1) rotate(5deg); color:${p=>p.theme.colors.primary};}}
`;
const IconWrap = styled.div`font-size:2.5rem;color:${p=>p.theme.colors.primary};margin:0 0 1.5rem; .icon{transition:.3s;}`;
const CardTitle = styled.h3`margin:0 0 1rem;font-size:1.5rem;color:${p=>p.theme.colors.primary};`;
const Desc = styled.p`margin:0;opacity:.9;line-height:1.6;`;

const SERVICES = [
  { icon:faPencilRuler, title:'Conception sur Mesure', desc:'Plans et designs personnalisés pour optimiser vos espaces.'},
  { icon:faCouch, title:'Aménagement Intérieur', desc:'Mobilier et agencement pour des espaces fonctionnels.'},
  { icon:faLightbulb, title:'Conseil en Décoration', desc:'Couleurs, matériaux, textures et éclairages adaptés.'},
  { icon:faHome, title:'Rénovation Complète', desc:'Accompagnement de la conception à la coordination travaux.'},
  { icon:faStore, title:'Design Commercial', desc:'Espaces commerciaux attractifs et cohérents.'},
  { icon:faPalette, title:'Personnalisation', desc:'Éléments sur mesure pour un intérieur qui vous ressemble.'},
];

export default function Services(){
  return (
    <Section id="services">
      <Container>
        <Title>
          <h2>Nos Services</h2>
          <p>Une gamme complète pour transformer votre espace en un lieu unique, harmonieux et fonctionnel.</p>
        </Title>
        <Grid>
          {SERVICES.map((s,i)=>(
            <Card key={s.title} $delay={i*150}>
              <IconWrap><FontAwesomeIcon icon={s.icon} className="icon"/></IconWrap>
              <CardTitle>{s.title}</CardTitle>
              <Desc>{s.desc}</Desc>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
