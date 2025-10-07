import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight, faStar, faUser } from '@fortawesome/free-solid-svg-icons';

// Single clean static component
const Section = styled.section`background:${p=>p.theme.colors.background};padding:6rem 0;`;
const Inner = styled.div`max-width:1200px;margin:0 auto;padding:0 2rem;`;
const Heading = styled.div`text-align:center;margin-bottom:3rem;h2{margin:0 0 1rem;font-size:2.4rem;color:${p=>p.theme.colors.primary};}p{margin:0 auto;max-width:640px;color:${p=>p.theme.colors.text};opacity:.85;}`;
const Cards = styled.div`display:grid;gap:2rem;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));`;
const TCard = styled.div`position:relative;background:rgba(255,255,255,.03);border:1px solid rgba(212,175,55,.12);padding:1.75rem 1.5rem;border-radius:14px;display:flex;flex-direction:column;gap:1rem;transition:.3s;&:hover{transform:translateY(-6px);border-color:${p=>p.theme.colors.primary};}`;
const QuoteIcon = styled.div`position:absolute;top:10px;right:12px;color:${p=>p.theme.colors.primary};opacity:.18;font-size:2rem;`;
const Body = styled.p`font-style:italic;line-height:1.55;font-size:.95rem;color:${p=>p.theme.colors.text};margin:0;`;
const Row = styled.div`display:flex;align-items:center;gap:.85rem;`;
const Avatar = styled.div`width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid ${p=>p.theme.colors.primary};flex-shrink:0;background:rgba(212,175,55,0.08);color:${p=>p.theme.colors.primary};`;
const Meta = styled.div`h4{margin:0 0 .25rem;font-size:.95rem;color:${p=>p.theme.colors.primary};letter-spacing:.5px;}span{display:block;font-size:.65rem;text-transform:uppercase;opacity:.5;letter-spacing:1px;}`;
const Stars = styled.div`color:${p=>p.theme.colors.primary};font-size:.7rem;display:flex;gap:2px;margin-top:.15rem;`;

const REVIEWS = [
  { id:'1', name:'Claire M.', date:'14 JAN 2025', rating:5, text:"Un accompagnement exceptionnel. Mon appartement a retrouvé cohérence et lumière." },
  { id:'2', name:'Julien M.', date:'02 FÉV 2025', rating:5, text:"Optimisation remarquable des volumes de notre loft. Circulation fluide désormais." },
  { id:'3', name:'Sophie A.', date:'09 MAR 2025', rating:5, text:"Subtil équilibre couleurs / textures. Ambiance chaleureuse et raffinée." },
  { id:'4', name:'Maison Lune', date:'18 AVR 2025', rating:5, text:"Nouvelle identité commerciale fidèle à notre marque. Retours clients excellents." }
];

export default function Testimonials(){
  return (
    <Section id="testimonials">
      <Inner>
        <Heading>
          <h2>Témoignages</h2>
          <p>Retours clients sur des projets d'architecture intérieure réalisés avec précision, sens du détail et écoute.</p>
        </Heading>
        <Cards>
          {REVIEWS.map(r=> (
            <TCard key={r.id}>
              <QuoteIcon><FontAwesomeIcon icon={faQuoteRight}/></QuoteIcon>
              <Body>{r.text}</Body>
              <Row>
                <Avatar><FontAwesomeIcon icon={faUser} /></Avatar>
                <Meta>
                  <h4>{r.name}</h4>
                  <Stars>{Array.from({length:5}).map((_,i)=>(<FontAwesomeIcon key={i} icon={faStar} style={{opacity:i<r.rating?1:.25}}/>))}</Stars>
                  <span>{r.date}</span>
                </Meta>
              </Row>
            </TCard>
          ))}
        </Cards>
      </Inner>
    </Section>
  );
}

