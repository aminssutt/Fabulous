import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_URL } from '../config';

const PortfolioSection = styled.section`
  background-color: ${props => props.theme.colors.background};
  padding: 6rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h2 {
    color: ${props => props.theme.colors.primary};
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: ${props => props.theme.colors.text};
    max-width: 600px;
    margin: 0 auto;
    opacity: 0.9;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: transparent;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text};
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 4/3;
  cursor: pointer;

  &:hover {
    .overlay {
      opacity: 1;
    }
    
    img {
      transform: scale(1.1);
    }
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(26, 26, 26, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 2rem;
  text-align: center;
`;

const ProjectTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.6;
`;

function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects`);
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
      }
    };

    fetchProjects();
  }, []);


  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <PortfolioSection id="portfolio">
      <Container>
        <SectionTitle>
          <h2>Notre Portfolio</h2>
          <p>Découvrez nos réalisations les plus remarquables en matière de design d'intérieur</p>
        </SectionTitle>

        <FilterContainer>
          <FilterButton 
            $active={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')}
          >
            Tous les Projets
          </FilterButton>
          <FilterButton 
            $active={activeFilter === 'residential'} 
            onClick={() => setActiveFilter('residential')}
          >
            Résidentiel
          </FilterButton>
          <FilterButton 
            $active={activeFilter === 'commercial'} 
            onClick={() => setActiveFilter('commercial')}
          >
            Commercial
          </FilterButton>
        </FilterContainer>

        <ProjectsGrid>
            {filteredProjects.map(project => (
            <ProjectCard key={project._id}>
              <ProjectImage src={project.image} alt={project.title} />
              <ProjectOverlay className="overlay">
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              </ProjectOverlay>
            </ProjectCard>
            ))}
        </ProjectsGrid>
      </Container>
    </PortfolioSection>
  );
}

export default Portfolio;