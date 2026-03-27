import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSpinner, faHome, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../config';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 15px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  padding-left: 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 5px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
  }
`;

const Icon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.primary};
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled(FontAwesomeIcon)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StatusMessage = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 5px;
  background: ${props => props.$status === 'waiting' ? 'rgba(212, 175, 55, 0.1)' : 
    props.$status === 'error' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  border: 1px solid ${props => props.$status === 'waiting' ? '#D4AF37' : 
    props.$status === 'error' ? '#f44336' : '#4CAF50'};
  color: ${props => props.$status === 'waiting' ? '#D4AF37' : 
    props.$status === 'error' ? '#f44336' : '#4CAF50'};
`;

const HomeButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    background: #4CAF50;
    color: ${props => props.theme.colors.background};
    transform: translateY(-2px);
  }
`;

// Simple admin login using a single password stored in env (REACT_APP_ADMIN_PASSWORD_HASH optional)
// We store an in-memory session flag in localStorage (not secure but sufficient for static showcase site)

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          navigate('/admin/dashboard');
        }
      } catch { /* token invalide */ }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', message: 'Vérification...' });

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('pendingAdminEmail', email);
        setStatus({ state: 'success', message: 'Code de vérification envoyé par email.' });
        setTimeout(() => navigate('/admin/verify'), 1000);
      } else {
        setAttempts(a => a + 1);
        setStatus({ state: 'error', message: data.message || 'Identifiants incorrects.' });
      }
    } catch (error) {
      setStatus({ state: 'error', message: 'Erreur de connexion au serveur.' });
    }
  };

  return (
    <LoginContainer>
      <HomeButton onClick={() => navigate('/')}> 
        <FontAwesomeIcon icon={faHome} /> Accueil
      </HomeButton>
      <LoginCard>
        <Title>Administration</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Icon>
              <FontAwesomeIcon icon={faEnvelope} />
            </Icon>
            <Input
              type="email"
              name="email"
              placeholder="Email administrateur"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Icon>
              <FontAwesomeIcon icon={faLock} />
            </Icon>
            <Input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          <SubmitButton type="submit" disabled={status.state === 'loading'}>
            {status.state === 'loading' ? <><LoadingSpinner icon={faSpinner} /> Vérification...</> : 'Se connecter'}
          </SubmitButton>
          {status.message && (
            <StatusMessage $status={status.state === 'error' ? 'error' : status.state === 'success' ? 'success' : 'idle'}>
              {status.message}
            </StatusMessage>
          )}
        </Form>
      </LoginCard>
    </LoginContainer>
  );
}

export default AdminLogin;