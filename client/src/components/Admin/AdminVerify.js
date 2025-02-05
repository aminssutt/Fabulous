import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const VerifyContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
`;

const VerifyCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 15px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Message = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 5px;
  color: ${props => props.$success ? '#4CAF50' : '#f44336'};
  background: ${props => props.$success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  border: 1px solid ${props => props.$success ? '#4CAF50' : '#f44336'};
`;

const API_URL = 'http://localhost:5000';

function AdminVerify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    loading: true,
    message: 'Vérification en cours...',
    success: false
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (response.ok) {
          // Stocker le token et sa date d'expiration
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminTokenExpiry', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
          
          // Nettoyer les données temporaires
          sessionStorage.removeItem('pendingAdminAuth');
          sessionStorage.removeItem('pendingAdminEmail');
          
          setStatus({
            loading: false,
            message: 'Connexion réussie ! Redirection...',
            success: true
          });

          // Redirection vers le dashboard
          setTimeout(() => {
            navigate('/admin/dashboard', { replace: true });
          }, 1000);
        } else {
          setStatus({
            loading: false,
            message: data.message || "Le lien de vérification est invalide ou a expiré",
            success: false
          });

          setTimeout(() => {
            navigate('/admin', { replace: true });
          }, 3000);
        }
      } catch (error) {
        console.error('Erreur de vérification:', error);
        setStatus({
          loading: false,
          message: "Une erreur s'est produite lors de la vérification",
          success: false
        });

        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 3000);
      }
    };

    if (token) {
      verifyToken();
    } else {
      navigate('/admin', { replace: true });
    }
  }, [token, navigate]);

  return (
    <VerifyContainer>
      <VerifyCard>
        <Message $success={status.success}>
          {status.message}
        </Message>
      </VerifyCard>
    </VerifyContainer>
  );
}

export default AdminVerify; 