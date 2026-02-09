import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const Foot = styled.footer`background:${p=>p.theme.colors.secondary};padding:2rem 0;border-top:1px solid rgba(212,175,55,.1);`;
const Content = styled.div`max-width:1200px;margin:0 auto;padding:0 2rem;display:flex;justify-content:space-between;align-items:center;@media (max-width:${p=>p.theme.breakpoints.mobile}){flex-direction:column;gap:1rem;text-align:center;}`;
const Copy = styled.p`opacity:.8;margin:0;`;
const AdminLink = styled(Link)`opacity:.6;display:flex;align-items:center;gap:.5rem;transition:.3s; &:hover{opacity:1;color:${p=>p.theme.colors.primary};}`;

export default function Footer(){
  const y = new Date().getFullYear();
  return (
    <Foot id="footer">
      <Content>
        <Copy>© {y} Fabulous. Tous droits réservés.</Copy>
        <AdminLink to="/admin"><FontAwesomeIcon icon={faLock}/> Administrateur</AdminLink>
      </Content>
    </Foot>
  );
}
