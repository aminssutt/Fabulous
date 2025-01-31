import React, { useState, useEffect } from 'react';
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

const TimeSlotList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-bottom: 1.5rem;
`;

const TimeSlotButton = styled.button`
  width: 100%;
  padding: 10px;
  background: ${props => props.$isSelected ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => {
    if (!props.$isAvailable) return 'rgba(255, 255, 255, 0.3)';
    return props.$isSelected ? props.theme.colors.background : props.theme.colors.text;
  }};
  border: 1px solid ${props => props.$isSelected ? props.theme.colors.primary : 'rgba(212, 175, 55, 0.2)'};
  border-radius: 5px;
  font-size: 1rem;
  cursor: ${props => props.$isAvailable ? 'pointer' : 'not-allowed'};
  transition: all 0.3s ease;
  opacity: ${props => props.$isAvailable ? 1 : 0.5};

  &:hover {
    background: ${props => props.$isAvailable && !props.$isSelected ? 'rgba(212, 175, 55, 0.1)' : ''};
    transform: ${props => props.$isAvailable ? 'translateY(-2px)' : 'none'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
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

  const [availableSlots, setAvailableSlots] = useState([]);
  const [status, setStatus] = useState({
    submitting: false,
    message: '',
    success: false
  });

  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await fetch(`${API_URL}/api/available-slots?date=${date}`);
      const data = await response.json();
      setAvailableSlots(data.slots || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des créneaux:', error);
      setAvailableSlots([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({
      ...prev,
      time
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

  return (
    <AppointmentSection id="appointment">
      <Container>
        <Title>Prendre Rendez-vous</Title>
        <Subtitle>
          Réservez votre moment de bien-être dès maintenant
        </Subtitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <IconWrapper>
                <FontAwesomeIcon icon={faUser} />
              </IconWrapper>
              Nom
            </Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
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
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <IconWrapper>
                <FontAwesomeIcon icon={faCalendar} />
              </IconWrapper>
              Date
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

          {formData.date && (
            <FormGroup>
              <Label>
                <IconWrapper>
                  <FontAwesomeIcon icon={faClock} />
                </IconWrapper>
                Heure
              </Label>
              <TimeSlotList>
                {availableSlots.map((slot) => (
                  <TimeSlotButton
                    key={slot.time}
                    type="button"
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    $isAvailable={slot.available}
                    $isSelected={formData.time === slot.time}
                    title={!slot.available ? slot.reason : ''}
                  >
                    {slot.time}
                  </TimeSlotButton>
                ))}
              </TimeSlotList>
            </FormGroup>
          )}

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
            />
          </FormGroup>

          <SubmitButton 
            type="submit" 
            disabled={status.submitting}
          >
            {status.submitting ? 'Envoi en cours...' : 'Prendre Rendez-vous'}
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