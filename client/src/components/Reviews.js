import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUser, faComment } from '@fortawesome/free-solid-svg-icons';

const ReviewsSection = styled.section`
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

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const ReviewCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewAuthor = styled.p`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

const ReviewDate = styled.span`
  color: ${props => props.theme.colors.text};
  opacity: 0.6;
  font-size: 0.9rem;
`;

const ReviewRating = styled.div`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const ReviewText = styled.p`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
`;

const Form = styled.form`
  max-width: 600px;
  margin: 4rem auto;
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

const RatingContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.$isSelected ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.3)'};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
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

const API_URL = 'http://localhost:5000';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    comment: '',
    isAnonymous: false
  });
  const [status, setStatus] = useState({
    submitting: false,
    message: '',
    success: false
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, message: '', success: false });

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setStatus({
        submitting: false,
        message: 'Merci pour votre avis !',
        success: true
      });

      setFormData({
        name: '',
        rating: 0,
        comment: '',
        isAnonymous: false
      });

      // Rafraîchir la liste des avis
      fetchReviews();

    } catch (error) {
      setStatus({
        submitting: false,
        message: error.message || 'Une erreur est survenue. Veuillez réessayer.',
        success: false
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <ReviewsSection id="reviews">
      <Container>
        <Title>Avis Clients</Title>
        <Subtitle>
          Découvrez ce que nos clients pensent de nos services
        </Subtitle>

        <ReviewsGrid>
          {reviews.map((review) => (
            <ReviewCard key={review._id}>
              <ReviewHeader>
                <ReviewAuthor>{review.name}</ReviewAuthor>
                <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
              </ReviewHeader>
              <ReviewRating>
                {[...Array(5)].map((_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    color={index < review.rating ? '#D4AF37' : '#666'}
                  />
                ))}
              </ReviewRating>
              <ReviewText>{review.comment}</ReviewText>
            </ReviewCard>
          ))}
        </ReviewsGrid>

        <Form onSubmit={handleSubmit}>
          <Title>Laissez votre avis</Title>

          <FormGroup>
            <Label>
              <FontAwesomeIcon icon={faUser} /> Nom
            </Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={formData.isAnonymous}
              required={!formData.isAnonymous}
            />
          </FormGroup>

          <FormGroup>
            <Label>Note</Label>
            <RatingContainer>
              {[1, 2, 3, 4, 5].map((rating) => (
                <StarButton
                  key={rating}
                  type="button"
                  onClick={() => handleRatingClick(rating)}
                  $isSelected={formData.rating >= rating}
                >
                  <FontAwesomeIcon icon={faStar} />
                </StarButton>
              ))}
            </RatingContainer>
          </FormGroup>

          <FormGroup>
            <Label>
              <FontAwesomeIcon icon={faComment} /> Commentaire
            </Label>
            <TextArea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={500}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <Checkbox
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
              />
              Poster anonymement
            </Label>
          </FormGroup>

          <SubmitButton 
            type="submit" 
            disabled={status.submitting || !formData.rating || !formData.comment}
          >
            {status.submitting ? 'Envoi en cours...' : 'Publier l\'avis'}
          </SubmitButton>

          {status.message && (
            <Message $success={status.success}>
              {status.message}
            </Message>
          )}
        </Form>
      </Container>
    </ReviewsSection>
  );
}

export default Reviews; 