import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const ContactSection = styled.section`
  padding: 6rem 2rem;
  background-color: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};

  svg {
    color: ${props => props.theme.colors.primary};
    margin-right: 1rem;
    font-size: 1.5rem;
  }
`;

const Form = styled.form`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.text};
  min-height: 150px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(212, 175, 55, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: ${props => props.$success ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
  color: ${props => props.$success ? '#00ff00' : '#ff0000'};
`;

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    message: '',
    success: false
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
    setStatus({ submitting: true, message: '', success: false });

    try {
      // Simuler l'envoi du formulaire
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({
        submitting: false,
        message: 'Votre message a été envoyé avec succès !',
        success: true
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      setStatus({
        submitting: false,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
        success: false
      });
    }
  };

  return (
    <ContactSection>
      <Container>
        <ContactInfo>
          <Title>Contactez-nous</Title>
          <InfoItem>
            <FontAwesomeIcon icon={faPhone} />
            <span>+33 1 23 45 67 89</span>
          </InfoItem>
          <InfoItem>
            <FontAwesomeIcon icon={faEnvelope} />
            <span>contact@fabulous.fr</span>
          </InfoItem>
          <InfoItem>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>13 Rue Cortambert, 75016 PARIS</span>
          </InfoItem>
        </ContactInfo>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nom</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Sujet</Label>
            <Input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Message</Label>
            <TextArea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={status.submitting}>
            {status.submitting ? 'Envoi en cours...' : 'Envoyer'}
          </SubmitButton>

          {status.message && (
            <Message $success={status.success}>
              {status.message}
            </Message>
          )}
        </Form>
      </Container>
    </ContactSection>
  );
}

export default Contact;
