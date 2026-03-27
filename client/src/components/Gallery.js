import React from 'react';
import styled from 'styled-components';

const GallerySection = styled.section`
  padding: 6rem 2rem;
  background-color: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 3rem;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const GalleryItem = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 1;

  &:hover img {
    transform: scale(1.05);
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const galleryItems = [
  { id: 1, src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2fba?auto=format&fit=crop&w=800&q=60', alt: 'Interior elegant design' },
  { id: 2, src: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=60', alt: 'Contemporary living room' },
  { id: 3, src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=60', alt: 'Modern kitchen concept' },
  { id: 4, src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=60', alt: 'Cozy curated space' },
  { id: 5, src: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=60', alt: 'Luxury interior mood' },
  { id: 6, src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60', alt: 'Modern decoration details' },
];

function Gallery() {
  return (
    <GallerySection>
      <Container>
        <Title>Notre Galerie</Title>
        <GalleryGrid>
          {galleryItems.map(item => (
            <GalleryItem key={item.id}>
              <GalleryImage src={item.src} alt={item.alt} loading="lazy" />
            </GalleryItem>
          ))}
        </GalleryGrid>
      </Container>
    </GallerySection>
  );
}

export default Gallery;
