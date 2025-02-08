import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEnvelope } from '@fortawesome/free-solid-svg-icons';

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
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(
    to right,
    #BF953F,
    #FCF6BA,
    #B38728,
    #FBF5B7,
    #AA771C
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const CodeInputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
`;

const CodeInput = styled.input`
  width: 100%;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  color: ${props => props.theme.colors.text};
  font-size: 1.8rem;
  text-align: center;
  letter-spacing: 0.8rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.1);
  }

  &::placeholder {
    letter-spacing: 0.3rem;
    color: rgba(255, 255, 255, 0.3);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  max-width: 300px;
  padding: 1.2rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
    background: linear-gradient(
      to right,
      #BF953F,
      #B38728
    );
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const Message = styled.div`
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 10px;
  color: ${props => props.$success ? '#4CAF50' : '#f44336'};
  background: ${props => props.$success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  border: 1px solid ${props => props.$success ? '#4CAF50' : '#f44336'};
  font-size: 1rem;
  line-height: 1.5;
`;

const LoadingSpinner = styled(FontAwesomeIcon)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const API_URL = 'http://localhost:5000';

function AdminVerify() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState({
    loading: false,
    message: '',
    success: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setStatus({
        loading: false,
        message: "Le code doit contenir 6 chiffres",
        success: false
      });
      return;
    }

    setStatus({
      loading: true,
      message: 'Vérification en cours...',
      success: false
    });

    try {
      const response = await fetch(`${API_URL}/api/admin/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          email: sessionStorage.getItem('pendingAdminEmail')
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminTokenExpiry', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
        
        sessionStorage.removeItem('pendingAdminAuth');
        sessionStorage.removeItem('pendingAdminEmail');
        
        setStatus({
          loading: false,
          message: 'Connexion réussie ! Redirection...',
          success: true
        });

        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 1000);
      } else {
        setStatus({
          loading: false,
          message: data.message || "Code invalide",
          success: false
        });
      }
    } catch (error) {
      console.error('Erreur de vérification:', error);
      setStatus({
        loading: false,
        message: "Une erreur s'est produite lors de la vérification",
        success: false
      });
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(value);
  };

  return (
    <VerifyContainer>
      <VerifyCard>
        <Title>Vérification</Title>
        <Subtitle>
          Veuillez saisir le code à 6 chiffres envoyé à votre adresse email
        </Subtitle>
        <Form onSubmit={handleSubmit}>
          <CodeInputContainer>
            <CodeInput
              type="text"
              placeholder="000000"
              value={code}
              onChange={handleCodeChange}
              disabled={status.loading}
              autoFocus
            />
          </CodeInputContainer>
          <SubmitButton type="submit" disabled={status.loading || code.length !== 6}>
            {status.loading ? (
              <LoadingSpinner icon={faSpinner} />
            ) : (
              <>
                <FontAwesomeIcon icon={faEnvelope} />
                Vérifier le code
              </>
            )}
          </SubmitButton>
        </Form>
        {status.message && (
          <Message $success={status.success}>
            {status.message}
          </Message>
        )}
      </VerifyCard>
    </VerifyContainer>
  );
}

export default AdminVerify; 