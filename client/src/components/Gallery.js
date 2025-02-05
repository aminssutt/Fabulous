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
  { id: 1, src: '/images/gallery/1.jpg', alt: 'Coiffure élégante' },
  { id: 2, src: '/images/gallery/2.jpg', alt: 'Maquillage professionnel' },
  { id: 3, src: '/images/gallery/3.jpg', alt: 'Soins du visage' },
  { id: 4, src: '/images/gallery/4.jpg', alt: 'Manucure' },
  { id: 5, src: '/images/gallery/5.jpg', alt: 'Coupe tendance' },
  { id: 6, src: '/images/gallery/6.jpg', alt: 'Soins des cheveux' },
];

function Gallery() {
  return (
    <GallerySection>
      <Container>
        <Title>Notre Galerie</Title>
        <GalleryGrid>
          {galleryItems.map(item => (
            <GalleryItem key={item.id}>
              <GalleryImage src={item.src} alt={item.alt} />
            </GalleryItem>
          ))}
        </GalleryGrid>
      </Container>
    </GallerySection>
  );
}

export default Gallery;
