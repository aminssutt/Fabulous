import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.colors.secondary};
  padding: 2rem 0;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${props => props.theme.colors.text};
  opacity: 0.8;
`;

const AdminLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  opacity: 0.6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    color: ${props => props.theme.colors.primary};
  }
`;

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          © {currentYear} Fabulous. Tous droits réservés.
        </Copyright>
  <AdminLink to="/admin"> {/* simple password gate */}
          <FontAwesomeIcon icon={faLock} />
          Administrateur
        </AdminLink>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer; 