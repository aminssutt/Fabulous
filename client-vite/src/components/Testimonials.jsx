import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPaperPlane, faSpinner, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../config';

// Animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Section = styled.section`
  padding: 8rem 0;
  background: ${p => p.theme.colors.backgroundAlt || '#111111'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 80%, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 20%, rgba(212, 175, 55, 0.04) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Overline = styled.span`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: ${p => p.theme.colors.primary};
  margin-bottom: 1rem;
  
  &::before, &::after {
    content: '◆';
    margin: 0 1rem;
    font-size: 0.5rem;
    vertical-align: middle;
    opacity: 0.5;
  }
`;

const Title = styled.h2`
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 400;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #FCF6BA 0%, #D4AF37 25%, #BF953F 50%, #D4AF37 75%, #FCF6BA 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
`;

const Subtitle = styled.p`
  max-width: 600px;
  margin: 0 auto;
  color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.7)'};
  font-size: 1.1rem;
  line-height: 1.8;
`;

const Grid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  margin-bottom: 5rem;
`;

const Card = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.08);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: ${fadeInUp} 0.6s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
  opacity: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-10px);
    border-color: rgba(212, 175, 55, 0.2);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(212, 175, 55, 0.05);
    
    &::before {
      opacity: 1;
    }
  }
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: rgba(212, 175, 55, 0.15);
  font-size: 2rem;
`;

const Stars = styled.div`
  color: ${p => p.theme.colors.primary};
  margin-bottom: 1rem;
  font-size: 1rem;
  display: flex;
  gap: 0.25rem;
`;

const ReviewText = styled.p`
  color: ${p => p.theme.colors.text};
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 0 0 1.5rem;
  font-style: italic;
  font-weight: 300;
`;

const ReviewAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.primary};
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const AuthorInfo = styled.div`
  h4 {
    margin: 0 0 0.25rem;
    font-size: 1.1rem;
    font-weight: 500;
    color: ${p => p.theme.colors.primary};
  }
  
  span {
    font-size: 0.85rem;
    color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.5)'};
  }
`;

// Form Styles
const FormSection = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 24px;
  padding: 3rem;
  max-width: 650px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 600px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #D4AF37, transparent);
  }
`;

const FormTitle = styled.h3`
  text-align: center;
  color: ${p => p.theme.colors.text};
  margin: 0 0 0.5rem;
  font-size: 1.6rem;
  font-weight: 400;
`;

const FormSubtitle = styled.p`
  text-align: center;
  color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.6)'};
  margin: 0 0 2rem;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.7)'};
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  color: ${p => p.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
    background: rgba(212, 175, 55, 0.03);
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  color: ${p => p.theme.colors.text};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
    background: rgba(212, 175, 55, 0.03);
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
  }
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  flex-wrap: wrap;
  
  @media (max-width: 600px) {
    gap: 0.25rem;
    justify-content: center;
  }
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.75rem;
  color: ${p => p.$active ? p.theme.colors.primary : 'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;
  
  &:hover {
    color: ${p => p.theme.colors.primary};
    transform: scale(1.15);
  }
  
  @media (max-width: 600px) {
    font-size: 1.5rem;
    padding: 0.15rem;
  }
`;

const RatingText = styled.span`
  margin-left: 1rem;
  font-size: 0.9rem;
  color: ${p => p.theme.colors.primary};
  font-weight: 500;
  
  @media (max-width: 600px) {
    width: 100%;
    text-align: center;
    margin-left: 0;
    margin-top: 0.5rem;
  }
`;

const SubmitBtn = styled.button`
  position: relative;
  background: ${p => p.disabled ? 'rgba(212, 175, 55, 0.3)' : 'linear-gradient(135deg, #D4AF37 0%, #AA771C 100%)'};
  color: ${p => p.theme.colors.background};
  border: none;
  padding: 1.1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.4s ease;
  margin-top: 0.5rem;
  overflow: hidden;
  letter-spacing: 0.5px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.35);
    
    &::before {
      left: 100%;
    }
  }
`;

const Message = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  text-align: center;
  background: ${p => p.$error ? 'rgba(229, 57, 53, 0.1)' : 'rgba(67, 160, 71, 0.1)'};
  color: ${p => p.$error ? '#E53935' : '#43A047'};
  border: 1px solid ${p => p.$error ? 'rgba(229, 57, 53, 0.3)' : 'rgba(67, 160, 71, 0.3)'};
  font-weight: 500;
  animation: ${fadeInUp} 0.4s ease;
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${p => p.theme.colors.primary};
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  margin-bottom: 3rem;
  
  h3 {
    color: ${p => p.theme.colors.text};
    font-weight: 400;
    margin: 0 0 0.5rem;
  }
  
  p {
    color: ${p => p.theme.colors.textMuted || 'rgba(245, 245, 245, 0.5)'};
  }
`;

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setMessage({ text: 'Veuillez entrer votre nom', error: true });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ text: 'Merci pour votre avis ! Il sera publié après validation par notre équipe. 🎉', error: false });
        setFormData({ name: '', email: '', rating: 5, comment: '' });
        // Ne pas recharger les avis car le nouveau n'est pas encore approuvé
      } else {
        const error = await response.json();
        setMessage({ text: error.message || 'Une erreur est survenue', error: true });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ text: 'Erreur de connexion au serveur', error: true });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FontAwesomeIcon 
        key={i} 
        icon={faStar} 
        style={{ opacity: i < rating ? 1 : 0.2 }} 
      />
    ));
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2);
  };

  return (
    <Section id="testimonials">
      <Container>
        <SectionHeader>
          <Overline>Témoignages</Overline>
          <Title>Ce Que Disent Nos Clients</Title>
          <Subtitle>
            Découvrez les expériences de ceux qui nous ont fait confiance 
            pour transformer leurs espaces.
          </Subtitle>
        </SectionHeader>
        
        {loading ? (
          <Loading>Chargement des avis...</Loading>
        ) : reviews.length === 0 ? (
          <EmptyState>
            <h3>Aucun avis pour le moment</h3>
            <p>Soyez le premier à partager votre expérience avec Fabulous !</p>
          </EmptyState>
        ) : (
          <Grid>
            {reviews.map((review, index) => (
              <Card key={review.id} $delay={`${index * 0.15}s`}>
                <QuoteIcon>
                  <FontAwesomeIcon icon={faQuoteLeft} />
                </QuoteIcon>
                <Stars>{renderStars(review.rating)}</Stars>
                <ReviewText>"{review.comment || 'Une expérience exceptionnelle avec Fabulous !'}"</ReviewText>
                <ReviewAuthor>
                  <AuthorAvatar>{getInitials(review.name)}</AuthorAvatar>
                  <AuthorInfo>
                    <h4>{review.name}</h4>
                    <span>{new Date(review.created_at).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</span>
                  </AuthorInfo>
                </ReviewAuthor>
              </Card>
            ))}
          </Grid>
        )}

        <FormSection>
          <FormTitle>Partagez Votre Expérience</FormTitle>
          <FormSubtitle>Votre avis compte beaucoup pour nous</FormSubtitle>
          
          {message && (
            <Message $error={message.error} style={{ marginBottom: '1.5rem' }}>
              {message.text}
            </Message>
          )}

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>Votre nom *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Jean Dupont"
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Votre email (optionnel)</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="jean@exemple.com"
              />
            </InputGroup>

            <InputGroup>
              <Label>Votre note</Label>
              <RatingContainer>
                {[1, 2, 3, 4, 5].map(star => (
                  <StarButton
                    key={star}
                    type="button"
                    $active={star <= formData.rating}
                    onClick={() => setFormData({...formData, rating: star})}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </StarButton>
                ))}
                <RatingText>{formData.rating}/5</RatingText>
              </RatingContainer>
            </InputGroup>

            <InputGroup>
              <Label>Votre commentaire</Label>
              <TextArea
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                placeholder="Partagez votre expérience avec Fabulous..."
              />
            </InputGroup>

            <SubmitBtn type="submit" disabled={submitting}>
              <FontAwesomeIcon icon={submitting ? faSpinner : faPaperPlane} spin={submitting} />
              {submitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
            </SubmitBtn>
          </Form>
        </FormSection>
      </Container>
    </Section>
  );
}
