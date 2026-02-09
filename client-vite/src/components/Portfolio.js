import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Section = styled.section`background:${p=>p.theme.colors.background}; padding:6rem 0;`;
const Container = styled.div`max-width:1200px;margin:0 auto;padding:0 2rem;`;
const Title = styled.div`text-align:center;margin:0 0 4rem; h2{color:${p=>p.theme.colors.primary}; font-size:2.5rem; margin:0 0 1rem;} p{max-width:600px;margin:0 auto;opacity:.9;}`;
const Filters = styled.div`display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin:0 0 3rem;`;
const FilterBtn = styled.button`background:transparent;border:2px solid ${p=>p.$active?p.theme.colors.primary:'transparent'};color:${p=>p.$active?p.theme.colors.primary:p.theme.colors.text};padding:.8rem 1.5rem;border-radius:30px;cursor:pointer;transition:.3s;font-size:.9rem;letter-spacing:1px;text-transform:uppercase; &:hover{border-color:${p=>p.theme.colors.primary}; color:${p=>p.theme.colors.primary};}`;
const Grid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:2rem; @media (max-width:${p=>p.theme.breakpoints.mobile}){grid-template-columns:1fr;}`;
const Card = styled.div`position:relative;border-radius:10px;overflow:hidden;aspect-ratio:4/3;cursor:pointer; &:hover .overlay{opacity:1;} &:hover img{transform:scale(1.1);} `;
const Img = styled.img`width:100%;height:100%;object-fit:cover;transition:.3s;`;
const Overlay = styled.div`position:absolute;inset:0;background:rgba(26,26,26,.9);display:flex;flex-direction:column;justify-content:center;align-items:center;opacity:0;transition:.3s;padding:2rem;text-align:center;`;
const CardTitle = styled.h3`color:${p=>p.theme.colors.primary};margin:0 0 1rem;font-size:1.5rem;`;
const CardDesc = styled.p`margin:0;color:${p=>p.theme.colors.text};opacity:.9;line-height:1.6;`;

export default function Portfolio(){
  const [active,setActive] = useState('all');
  const [items,setItems] = useState([]);

  useEffect(()=>{
    const load = () => { try { setItems(JSON.parse(localStorage.getItem('galleryImages')||'[]')); } catch(e){ console.warn('Erreur lecture galerie', e);} };
    load();
    const storageListener = () => load();
    const customListener = () => load();
    window.addEventListener('storage', storageListener);
    window.addEventListener('gallery-update', customListener);
    return ()=> { window.removeEventListener('storage', storageListener); window.removeEventListener('gallery-update', customListener); };
  },[]);

  const filtered = active==='all'? items : items.filter(i=> i.theme===active);

  return (
    <Section id="portfolio">
      <Container>
        <Title>
          <h2>Galerie</h2>
        </Title>
        <Filters>
          {['all','residential','commercial','general'].map(f=> (
            <FilterBtn key={f} onClick={()=> setActive(f)} $active={active===f}>
              {f==='all'?'Tous les Projets': f==='residential'?'Résidentiel': f==='commercial'?'Commercial':'Général'}
            </FilterBtn>
          ))}
        </Filters>
        <Grid>
          {filtered.map(it=> (
            <Card key={it.id}>
              <Img src={it.data || it.url} alt={it.theme} />
              <Overlay className="overlay">
                <CardTitle>{it.theme}</CardTitle>
                <CardDesc>Ajoutée par l'admin</CardDesc>
              </Overlay>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
