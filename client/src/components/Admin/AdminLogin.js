import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faSpinner, faHome } from '@fortawesome/free-solid-svg-icons';

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

const API_URL = 'http://localhost:5000';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [status, setStatus] = useState({
    state: 'idle', // 'idle' | 'loading' | 'waiting' | 'error'
    message: ''
  });

  // Vérifier si une session est déjà active
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const expiry = localStorage.getItem('adminTokenExpiry');
    
    if (token && expiry && new Date(expiry) > new Date()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({
      state: 'loading',
      message: 'Vérification des identifiants...'
    });

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          state: 'waiting',
          message: 'Un email de vérification a été envoyé. Veuillez vérifier votre boîte de réception pour finaliser la connexion.'
        });

        // Stocker les identifiants temporairement
        sessionStorage.setItem('pendingAdminEmail', formData.email);
        sessionStorage.setItem('pendingAdminAuth', 'true');
      } else {
        setStatus({
          state: 'error',
          message: data.message || "Email ou mot de passe incorrect"
        });
      }
    } catch (error) {
      setStatus({
        state: 'error',
        message: "Erreur de connexion au serveur"
      });
    }
  };

  // Vérifier si on revient d'une vérification par email
  useEffect(() => {
    const pendingAuth = sessionStorage.getItem('pendingAdminAuth');
    const pendingEmail = sessionStorage.getItem('pendingAdminEmail');
    
    if (pendingAuth && pendingEmail) {
      setFormData(prev => ({ ...prev, email: pendingEmail }));
      setStatus({
        state: 'waiting',
        message: 'Un email de vérification a été envoyé. Veuillez vérifier votre boîte de réception pour finaliser la connexion.'
      });
    }
  }, []);

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <LoginContainer>
      <HomeButton onClick={handleHomeClick}>
        <FontAwesomeIcon icon={faHome} />
        Retour à l'accueil
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
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={status.state === 'waiting'}
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
              value={formData.password}
              onChange={handleChange}
              required
              disabled={status.state === 'waiting'}
            />
          </FormGroup>
          <SubmitButton
            type="submit"
            disabled={status.state === 'loading' || status.state === 'waiting'}
          >
            {status.state === 'loading' ? (
              <>
                <LoadingSpinner icon={faSpinner} /> Vérification...
              </>
            ) : status.state === 'waiting' ? (
              'En attente de vérification email'
            ) : (
              'Se connecter'
            )}
          </SubmitButton>
          {status.message && (
            <StatusMessage $status={status.state}>
              {status.message}
            </StatusMessage>
          )}
        </Form>
      </LoginCard>
    </LoginContainer>
  );
}

export default AdminLogin; 