import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faEnvelope, 
  faPhone, 
  faUser,
  faHome,
  faComments
} from '@fortawesome/free-solid-svg-icons';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AppointmentSection = styled.section`
  background-color: ${props => props.theme.colors.background};
  padding: 6rem 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(26, 26, 26, 0) 100%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  animation: ${fadeInUp} 1s ease;

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

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.02);
  padding: 3rem;
  border-radius: 15px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  animation: ${fadeInUp} 1s ease;
  animation-delay: 200ms;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 2rem;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const InputGroup = styled.div`
  position: relative;

  .icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.primary};
    opacity: 0.8;
    transition: all 0.3s ease;
  }

  &:focus-within .icon {
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  min-height: 150px;
  grid-column: 1 / -1;
  resize: vertical;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;

  option {
    background: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.text};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SubmitButton = styled.button`
  grid-column: 1 / -1;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.secondary};
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.theme.colors.primary};

  &:hover {
    background: transparent;
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  color: #4CAF50;
  margin-top: 1rem;
  font-weight: 500;
  animation: ${fadeInUp} 0.5s ease;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #f44336;
  margin-top: 1rem;
  font-weight: 500;
  animation: ${fadeInUp} 0.5s ease;
`;

function Appointment() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    date: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: false });

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus({
        submitting: false,
        success: true,
        error: false
      });

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        date: '',
        message: ''
      });

      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);

    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        error: true
      });

      // Réinitialiser le message d'erreur après 5 secondes
      setTimeout(() => {
        setStatus(prev => ({ ...prev, error: false }));
      }, 5000);
    }
  };

  return (
    <AppointmentSection id="appointment">
      <Container>
        <SectionTitle>
          <h2>Prendre Rendez-vous</h2>
          <p>
            Planifiez une consultation pour discuter de votre projet 
            d'aménagement intérieur et donnez vie à vos idées.
          </p>
        </SectionTitle>

        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <FontAwesomeIcon icon={faUser} className="icon" />
              <Input
                type="text"
                name="name"
                placeholder="Votre nom"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <Input
                type="email"
                name="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <FontAwesomeIcon icon={faPhone} className="icon" />
              <Input
                type="tel"
                name="phone"
                placeholder="Votre téléphone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <FontAwesomeIcon icon={faHome} className="icon" />
              <Select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
              >
                <option value="">Type de projet</option>
                <option value="residential">Résidentiel</option>
                <option value="commercial">Commercial</option>
                <option value="renovation">Rénovation</option>
                <option value="consultation">Consultation</option>
              </Select>
            </InputGroup>

            <InputGroup>
              <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <FontAwesomeIcon icon={faComments} className="icon" />
              <TextArea
                name="message"
                placeholder="Décrivez votre projet..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <SubmitButton 
              type="submit" 
              disabled={status.submitting}
            >
              {status.submitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </SubmitButton>
          </Form>

          {status.success && (
            <SuccessMessage>
              Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.
            </SuccessMessage>
          )}

          {status.error && (
            <ErrorMessage>
              Une erreur est survenue. Veuillez réessayer plus tard.
            </ErrorMessage>
          )}
        </FormContainer>
      </Container>
    </AppointmentSection>
  );
}

export default Appointment;