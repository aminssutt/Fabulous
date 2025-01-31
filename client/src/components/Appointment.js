import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faUser, faEnvelope, faPhone, faComment } from '@fortawesome/free-solid-svg-icons';

const AppointmentSection = styled.section`
  padding: 6rem 0;
  background-color: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text};
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3rem;
  opacity: 0.8;
`;

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.02);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(212, 175, 55, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
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

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
`;

const TimeSelect = styled.select`
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 5px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
  }

  option {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 5px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
  }
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

const Message = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 5px;
  color: ${props => props.$success ? '#4CAF50' : '#f44336'};
  background: ${props => props.$success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  border: 1px solid ${props => props.$success ? '#4CAF50' : '#f44336'};
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
  opacity: 0.8;
`;

const API_URL = 'http://localhost:5000';

const TimeOption = styled.option`
  background: ${props => props.theme.colors.background};
  color: ${props => props.$isAvailable ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.3)'};
  cursor: ${props => props.$isAvailable ? 'pointer' : 'not-allowed'};
`;

function Appointment() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    message: '',
    success: false
  });

  // Générer tous les créneaux horaires de 9h à 18h
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      slots.push(`${formattedHour}:00`);
    }
    return slots;
  };

  // Simuler les créneaux non disponibles (à remplacer par la vraie logique plus tard)
  const isSlotAvailable = (time) => {
    // Pour l'exemple, les créneaux de 12h et 13h sont non disponibles
    const unavailableSlots = ['12:00', '13:00'];
    return !unavailableSlots.includes(time);
  };

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
      console.log('Envoi de la demande de rendez-vous:', formData);
      const response = await fetch(`${API_URL}/api/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Réponse reçue:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setStatus({
        submitting: false,
        message: 'Votre demande de rendez-vous a été envoyée avec succès ! Vous allez recevoir un email de confirmation.',
        success: true
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: ''
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setStatus({
        submitting: false,
        message: error.message || 'Une erreur est survenue. Veuillez réessayer.',
        success: false
      });
    }
  };

  const timeSlots = generateTimeSlots();

  return (
    <AppointmentSection id="appointment">
      <Container>
        <Title>Prendre Rendez-vous</Title>
        <Subtitle>
          Planifiez une consultation personnalisée pour discuter de votre projet d'intérieur
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <IconWrapper>
                <FontAwesomeIcon icon={faUser} />
              </IconWrapper>
              Nom complet
            </Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Votre nom"
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <IconWrapper>
                <FontAwesomeIcon icon={faEnvelope} />
              </IconWrapper>
              Email
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <IconWrapper>
                <FontAwesomeIcon icon={faPhone} />
              </IconWrapper>
              Téléphone
            </Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Votre numéro de téléphone"
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <IconWrapper>
                <FontAwesomeIcon icon={faCalendar} />
              </IconWrapper>
              Date souhaitée
            </Label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <IconWrapper>
                <FontAwesomeIcon icon={faClock} />
              </IconWrapper>
              Heure souhaitée
            </Label>
            <TimeSelect
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une heure</option>
              {timeSlots.map(time => (
                <TimeOption 
                  key={time} 
                  value={time}
                  $isAvailable={isSlotAvailable(time)}
                  disabled={!isSlotAvailable(time)}
                >
                  {time}
                </TimeOption>
              ))}
            </TimeSelect>
          </FormGroup>

          <FormGroup>
            <Label>
              <IconWrapper>
                <FontAwesomeIcon icon={faComment} />
              </IconWrapper>
              Message
            </Label>
            <TextArea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Décrivez brièvement votre projet..."
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={status.submitting}>
            {status.submitting ? 'Envoi en cours...' : 'Demander un rendez-vous'}
          </SubmitButton>

          {status.message && (
            <Message $success={status.success}>
              {status.message}
            </Message>
          )}
        </Form>
      </Container>
    </AppointmentSection>
  );
}

export default Appointment;