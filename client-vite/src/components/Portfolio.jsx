import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
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
  background: transparent;
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
  
  @media (max-width: ${p => p.theme.breakpoints?.mobile || '480px'}) {
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

const ItemTitle = styled.p`
  margin: 0.5rem 0 0;
  color: white;
  font-size: 1rem;
  font-weight: 500;
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

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContent = styled.div`
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  
  @media (max-width: 768px) {
    max-height: 85vh;
  }
`;

const ModalImage = styled.div`
  position: relative;
  width: 100%;
  max-height: 60vh;
  border-radius: 12px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #111;
  }
`;

const ModalInfo = styled.div`
  padding: 1.5rem 0;
  color: white;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0 0 0.5rem;
  color: ${p => p.theme.colors.primary};
`;

const ModalCategory = styled.span`
  display: inline-block;
  background: rgba(212, 175, 55, 0.2);
  color: ${p => p.theme.colors.primary};
  padding: 0.3rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const ModalDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

const ModalClose = styled.button`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  z-index: 1001;
  
  &:hover {
    background: rgba(229, 57, 53, 0.5);
    transform: scale(1.1);
  }
`;

const NavButton = styled.button`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  ${p => p.$left ? 'left: 1rem;' : 'right: 1rem;'}
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  z-index: 1001;
  
  &:hover {
    background: rgba(212, 175, 55, 0.5);
    transform: translateY(-50%) scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const ALL_KEY = 'ALL__ALL';

export default function Portfolio() {
  const [gallery, setGallery] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState(ALL_KEY);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load gallery and categories in parallel
        const [galleryRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/gallery`),
          fetch(`${API_URL}/api/categories`)
        ]);
        
        if (galleryRes.ok) {
          const data = await galleryRes.json();
          setGallery(Array.isArray(data) ? data : []);
        }
        
        if (categoriesRes.ok) {
          const cats = await categoriesRes.json();
          setCategories(Array.isArray(cats) ? cats : []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Listen for gallery updates from admin
    const handler = () => loadData();
    window.addEventListener('gallery-update', handler);
    return () => window.removeEventListener('gallery-update', handler);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
      if (selectedImage) {
        if (e.key === 'ArrowLeft') navigateImage(-1);
        if (e.key === 'ArrowRight') navigateImage(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, gallery, filter]);

  const filtered = filter === ALL_KEY ? gallery : gallery.filter(g => g.theme === filter);

  const getCategoryLabel = (slug) => {
    const cat = categories.find(c => c.slug === slug);
    return cat?.label || slug || 'Non classé';
  };

  const navigateImage = (direction) => {
    const currentIndex = filtered.findIndex(img => img.id === selectedImage.id);
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = filtered.length - 1;
    if (newIndex >= filtered.length) newIndex = 0;
    
    setSelectedImage(filtered[newIndex]);
  };

  if (loading) {
    return (
      <Section id="portfolio">
        <Container>
          <SectionHeader>
            <Overline>Notre Portfolio</Overline>
            <Title>Réalisations</Title>
          </SectionHeader>
          <Loading>Chargement des créations en cours...</Loading>
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
          {categories.map(cat => (
            <FilterBtn 
              key={cat.id} 
              $active={filter === cat.slug} 
              onClick={() => setFilter(cat.slug)}
            >
              {cat.label}
            </FilterBtn>
          ))}
        </Filters>
        
        {filtered.length === 0 ? (
          <EmptyState>
            <h3>
              {filter === ALL_KEY 
                ? 'Notre galerie est en préparation' 
                : `Aucun projet dans cette catégorie`}
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
              <Item 
                key={img.id} 
                $delay={`${index * 0.1}s`}
                onClick={() => setSelectedImage(img)}
              >
                <Thumb src={img.url} alt={img.title || 'Projet'} loading="lazy" />
                <ItemOverlay>
                  <ItemBadge>{getCategoryLabel(img.theme)}</ItemBadge>
                  {img.title && <ItemTitle>{img.title}</ItemTitle>}
                </ItemOverlay>
              </Item>
            ))}
          </Grid>
        )}
      </Container>

      {/* Image Detail Modal */}
      {selectedImage && (
        <ModalOverlay onClick={() => setSelectedImage(null)}>
          <ModalClose onClick={() => setSelectedImage(null)}>
            <FontAwesomeIcon icon={faTimes} />
          </ModalClose>
          
          {filtered.length > 1 && (
            <>
              <NavButton $left onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </NavButton>
              <NavButton onClick={(e) => { e.stopPropagation(); navigateImage(1); }}>
                <FontAwesomeIcon icon={faChevronRight} />
              </NavButton>
            </>
          )}
          
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalImage>
              <img src={selectedImage.url} alt={selectedImage.title || 'Projet'} />
            </ModalImage>
            <ModalInfo>
              <ModalCategory>{getCategoryLabel(selectedImage.theme)}</ModalCategory>
              {selectedImage.title && (
                <ModalTitle>{selectedImage.title}</ModalTitle>
              )}
              {selectedImage.description && (
                <ModalDescription>{selectedImage.description}</ModalDescription>
              )}
              {!selectedImage.title && !selectedImage.description && (
                <ModalDescription style={{ fontStyle: 'italic', opacity: 0.5 }}>
                  Cliquez sur les flèches ou utilisez les touches ← → pour naviguer
                </ModalDescription>
              )}
            </ModalInfo>
          </ModalContent>
        </ModalOverlay>
      )}
    </Section>
  );
}
