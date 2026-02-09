import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { API_URL } from '../config';

// Animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 8rem 0;
  background: ${p => p.theme.colors.background};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 20% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Overline = styled.span`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: ${p => p.theme.colors.primary};
  margin-bottom: 1rem;
  
  &::before, &::after {
    content: '◆';
    margin: 0 1rem;
    font-size: 0.5rem;
    vertical-align: middle;
    opacity: 0.5;
  }
`;

const Title = styled.h2`
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 400;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #FCF6BA 0%, #D4AF37 25%, #BF953F 50%, #D4AF37 75%, #FCF6BA 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
`;

const Subtitle = styled.p`
  max-width: 600px;
  margin: 0 auto;
  color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.7)'};
  font-size: 1.1rem;
  line-height: 1.8;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 4rem;
`;

const FilterBtn = styled.button`
  position: relative;
  background: ${p => p.$active ? 'transparent' : 'transparent'};
  color: ${p => p.$active ? p.theme.colors.primary : p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.5)'};
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${p => p.$active ? '100%' : '0'};
    height: 2px;
    background: linear-gradient(90deg, transparent, #D4AF37, transparent);
    transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  &:hover {
    color: ${p => p.theme.colors.primary};
    
    &::after {
      width: 100%;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: #0a0a0a;
  cursor: pointer;
  animation: ${fadeIn} 0.6s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
  opacity: 0;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, 
      transparent 0%, 
      transparent 50%, 
      rgba(0, 0, 0, 0.8) 100%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    border-radius: 16px;
    transition: border-color 0.5s ease;
    z-index: 2;
    pointer-events: none;
  }
  
  &:hover {
    &::before {
      opacity: 1;
    }
    
    &::after {
      border-color: rgba(212, 175, 55, 0.5);
    }
    
    img {
      transform: scale(1.1);
      filter: brightness(1);
    }
  }
`;

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
              filter 0.5s ease;
  filter: brightness(0.85);
`;

const ItemOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  z-index: 2;
  transform: translateY(100%);
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  ${Item}:hover & {
    transform: translateY(0);
  }
`;

const ItemBadge = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.9), rgba(170, 119, 28, 0.9));
  color: ${p => p.theme.colors.background};
  padding: 0.4rem 1rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Loading = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${p => p.theme.colors.primary};
  font-size: 1.2rem;
  
  &::after {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-left: 10px;
    border: 2px solid ${p => p.theme.colors.primary};
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  
  h3 {
    font-size: 1.5rem;
    color: ${p => p.theme.colors.text};
    margin: 0 0 1rem;
    font-weight: 400;
  }
  
  p {
    color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.5)'};
    font-size: 1rem;
  }
`;

const RAW_THEMES = ['general', 'residential', 'commercial'];
const THEME_LABELS = {
  general: 'Général',
  residential: 'Résidentiel',
  commercial: 'Commercial'
};
const ALL_KEY = 'ALL__ALL';

export default function Portfolio() {
  const [gallery, setGallery] = useState([]);
  const [filter, setFilter] = useState(ALL_KEY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await fetch(`${API_URL}/api/gallery`);
        if (response.ok) {
          const data = await response.json();
          setGallery(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la galerie:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();

    const handler = () => loadGallery();
    window.addEventListener('gallery-update', handler);
    return () => window.removeEventListener('gallery-update', handler);
  }, []);

  const filtered = filter === ALL_KEY ? gallery : gallery.filter(g => g.theme === filter);

  if (loading) {
    return (
      <Section id="portfolio">
        <Container>
          <SectionHeader>
            <Overline>Notre Portfolio</Overline>
            <Title>Réalisations</Title>
          </SectionHeader>
          <Loading>Chargement de la galerie</Loading>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="portfolio">
      <Container>
        <SectionHeader>
          <Overline>Notre Portfolio</Overline>
          <Title>Réalisations</Title>
          <Subtitle>
            Découvrez nos créations uniques qui témoignent de notre passion 
            pour l'excellence et le design d'exception.
          </Subtitle>
        </SectionHeader>
        
        <Filters>
          <FilterBtn 
            $active={filter === ALL_KEY} 
            onClick={() => setFilter(ALL_KEY)}
          >
            Tous les projets
          </FilterBtn>
          {RAW_THEMES.map(t => (
            <FilterBtn 
              key={t} 
              $active={filter === t} 
              onClick={() => setFilter(t)}
            >
              {THEME_LABELS[t] || t}
            </FilterBtn>
          ))}
        </Filters>
        
        {filtered.length === 0 ? (
          <EmptyState>
            <h3>
              {filter === ALL_KEY 
                ? 'Notre galerie est en préparation' 
                : `Aucun projet ${THEME_LABELS[filter] || filter}`}
            </h3>
            <p>
              {filter === ALL_KEY 
                ? 'Revenez bientôt pour découvrir nos créations.' 
                : 'Explorez nos autres catégories pour découvrir nos réalisations.'}
            </p>
          </EmptyState>
        ) : (
          <Grid>
            {filtered.map((img, index) => (
              <Item key={img.id} $delay={`${index * 0.1}s`}>
                <Thumb src={img.url} alt={img.theme || 'Projet'} loading="lazy" />
                <ItemOverlay>
                  <ItemBadge>{THEME_LABELS[img.theme] || img.theme}</ItemBadge>
                </ItemOverlay>
              </Item>
            ))}
          </Grid>
        )}
      </Container>
    </Section>
  );
}