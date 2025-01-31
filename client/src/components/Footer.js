import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const FooterSection = styled.footer`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 4rem 2rem 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
`;

const FooterColumn = styled.div``;

const ColumnTitle = styled.h3`
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
`;

const FooterText = styled.p`
  font-family: ${props => props.theme.fonts.secondary};
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
`;

const ContactInfo = styled.div`
  margin-bottom: 1rem;
  
  p {
    margin-bottom: 0.5rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SocialIcon = styled.a`
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    transform: translateY(-3px);
  }
`;

const QuickLinks = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    margin-bottom: 0.8rem;
  }
  
  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-family: ${props => props.theme.fonts.secondary};
    transition: color 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-family: ${props => props.theme.fonts.secondary};
  color: rgba(255, 255, 255, 0.6);
`;

const Footer = () => {
  return (
    <FooterSection>
      <Container>
        <FooterContent>
          <FooterColumn>
            <ColumnTitle>À Propos</ColumnTitle>
            <FooterText>
              Fabulous est une agence créative spécialisée dans le développement web
              et le design. Notre mission est de créer des expériences numériques
              exceptionnelles pour nos clients.
            </FooterText>
            <SocialLinks>
              <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebookF} />
              </SocialIcon>
              <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
              </SocialIcon>
              <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </SocialIcon>
              <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </SocialIcon>
            </SocialLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Liens Rapides</ColumnTitle>
            <QuickLinks>
              <li><a href="#accueil">Accueil</a></li>
              <li><a href="#a-propos">À Propos</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#temoignages">Témoignages</a></li>
              <li><a href="#contact">Contact</a></li>
            </QuickLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Contact</ColumnTitle>
            <ContactInfo>
              <FooterText>
                <strong>Adresse:</strong><br />
                123 Rue du Commerce<br />
                75001 Paris, France
              </FooterText>
              <FooterText>
                <strong>Téléphone:</strong><br />
                +33 1 23 45 67 89
              </FooterText>
              <FooterText>
                <strong>Email:</strong><br />
                contact@fabulous.fr
              </FooterText>
            </ContactInfo>
          </FooterColumn>
        </FooterContent>
        
        <Copyright>
          © {new Date().getFullYear()} Fabulous. Tous droits réservés.
        </Copyright>
      </Container>
    </FooterSection>
  );
};

export default Footer; 