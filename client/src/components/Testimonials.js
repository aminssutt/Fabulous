import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight, faStar } from '@fortawesome/free-solid-svg-icons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const TestimonialsSection = styled.section`
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

  .slick-slide {
    padding: 1rem;
  }

  .slick-dots {
    bottom: -50px;

    li button:before {
      color: ${props => props.theme.colors.primary};
      opacity: 0.3;
      font-size: 8px;
    }

    li.slick-active button:before {
      opacity: 1;
    }
  }

  .slick-prev, .slick-next {
    width: 40px;
    height: 40px;
    background: rgba(212, 175, 55, 0.1);
    border-radius: 50%;
    z-index: 1;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(212, 175, 55, 0.2);
    }

    &:before {
      color: ${props => props.theme.colors.primary};
      font-size: 20px;
    }
  }

  .slick-prev {
    left: 20px;
  }

  .slick-next {
    right: 20px;
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

const TestimonialCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 15px;
  padding: 2.5rem;
  height: 100%;
  position: relative;
  border: 1px solid rgba(212, 175, 55, 0.1);
  transition: all 0.3s ease;
  animation: ${slideIn} 0.6s ease forwards;
  animation-delay: ${props => props.$delay}ms;
  opacity: 0;

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

    .quote-icon {
      transform: rotate(15deg);
    }
  }
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  color: ${props => props.theme.colors.primary};
  opacity: 0.2;
  font-size: 2rem;
  transition: all 0.3s ease;
`;

const TestimonialContent = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  font-style: italic;
`;

const ClientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ClientImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${props => props.theme.colors.primary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ClientDetails = styled.div`
  h4 {
    color: ${props => props.theme.colors.primary};
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: ${props => props.theme.colors.text};
    opacity: 0.8;
    font-size: 0.9rem;
  }
`;

const Rating = styled.div`
  color: ${props => props.theme.colors.primary};
  margin-top: 0.5rem;
  
  .star {
    margin-right: 4px;
  }
`;

const Form = styled.form`
  max-width: 600px;
  margin: 4rem auto;
  background: rgba(255, 255, 255, 0.02);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  text-align: center;
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
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

const AddReviewForm = styled(Form)`
  margin-top: 2rem;
`;

const EmailVerification = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const EmailInput = styled(Input)`
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  font-size: 1.1rem;
  
  &::placeholder {
    text-align: center;
  }
`;

const VerifyButton = styled(SubmitButton)`
  max-width: 200px;
  margin: 1.5rem auto 0;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
    background: linear-gradient(
      to right,
      #BF953F,
      #B38728
    );
  }
`;

const FormTransition = styled.div`
  animation: ${fadeIn} 0.5s ease forwards;
  opacity: 0;
  animation-delay: ${props => props.$delay}ms;
`;

const API_URL = 'http://localhost:5000';

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [emailVerification, setEmailVerification] = useState({
    email: '',
    verified: false,
    checking: false,
    error: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    comment: '',
    email: ''
  });
  const [status, setStatus] = useState({
    submitting: false,
    message: '',
    success: false
  });
  const [sliderKey, setSliderKey] = useState(0);

  const settings = {
    dots: true,
    infinite: reviews.length > 1,
    speed: 500,
    slidesToShow: Math.min(2, reviews.length),
    slidesToScroll: 1,
    autoplay: reviews.length > 1,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reviews`);
      const data = await response.json();
      const sortedReviews = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(sortedReviews);
      setSliderKey(prev => prev + 1);
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error);
    }
  };

  const verifyEmail = async (e) => {
    e.preventDefault();
    setEmailVerification(prev => ({ ...prev, checking: true, error: '' }));

    try {
      const response = await fetch(`${API_URL}/api/appointments/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailVerification.email })
      });

      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
          setEmailVerification(prev => ({
            ...prev,
            verified: true,
            checking: false,
            error: ''
          }));
          setFormData(prev => ({
            ...prev,
            email: emailVerification.email,
            name: data.name || ''
          }));
        }, 500);
      } else {
        setEmailVerification(prev => ({
          ...prev,
          verified: false,
          checking: false,
          error: data.message || "Une erreur s'est produite"
        }));
      }
    } catch (error) {
      setEmailVerification(prev => ({
        ...prev,
        verified: false,
        checking: false,
        error: "Une erreur s'est produite lors de la vérification"
      }));
    }
  };

  const handleEmailChange = (e) => {
    setEmailVerification(prev => ({
      ...prev,
      email: e.target.value,
      verified: false,
      error: ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

      if (response.ok) {
        setStatus({
          submitting: false,
          message: 'Votre avis a été ajouté avec succès !',
          success: true
        });

        setTimeout(() => {
          setFormData({
            name: '',
            rating: 0,
            comment: '',
            email: ''
          });
          setEmailVerification({
            email: '',
            verified: false,
            checking: false,
            error: ''
          });
          fetchReviews();
        }, 1500);
      } else {
        setStatus({
          submitting: false,
          message: data.message || "Une erreur s'est produite",
          success: false
        });
      }
    } catch (error) {
      setStatus({
        submitting: false,
        message: "Une erreur s'est produite lors de l'envoi",
        success: false
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <TestimonialsSection id="testimonials">
      <Container>
        <SectionTitle>
          <h2>Témoignages</h2>
          <p>Découvrez ce que nos clients pensent de nos services</p>
        </SectionTitle>

        <Slider {...settings} key={sliderKey}>
          {reviews.map((review, index) => (
            <TestimonialCard key={review._id || index} $delay={index * 200}>
              <QuoteIcon className="quote-icon">
                <FontAwesomeIcon icon={faQuoteRight} />
              </QuoteIcon>
              <TestimonialContent>{review.comment}</TestimonialContent>
              <ClientInfo>
                <ClientDetails>
                  <h4>{review.name}</h4>
                  <Rating>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className="star"
                        style={{ color: i < review.rating ? '#D4AF37' : '#666' }}
                      />
                    ))}
                  </Rating>
                  <p>{formatDate(review.createdAt)}</p>
                </ClientDetails>
              </ClientInfo>
            </TestimonialCard>
          ))}
        </Slider>

        <SectionTitle style={{ marginTop: '4rem' }}>
          <h2>Partagez votre expérience</h2>
          <p>Votre avis compte pour nous</p>
        </SectionTitle>

        {!emailVerification.verified ? (
          <FormTransition $delay={200}>
            <Form onSubmit={verifyEmail}>
              <FormGroup>
                <Label>Adresse email utilisée lors de votre rendez-vous</Label>
                <EmailInput
                  type="email"
                  value={emailVerification.email}
                  onChange={handleEmailChange}
                  placeholder="Votre email"
                  required
                />
              </FormGroup>
              <VerifyButton
                type="submit"
                disabled={emailVerification.checking}
              >
                {emailVerification.checking ? 'Vérification...' : 'Vérifier'}
              </VerifyButton>
              {emailVerification.error && (
                <Message $success={false}>{emailVerification.error}</Message>
              )}
            </Form>
          </FormTransition>
        ) : (
          <FormTransition $delay={200}>
            <AddReviewForm onSubmit={handleSubmit}>
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
                <Label>Note</Label>
                <RatingContainer>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarButton
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      $isSelected={formData.rating >= star}
                    >
                      <FontAwesomeIcon icon={faStar} />
                    </StarButton>
                  ))}
                </RatingContainer>
              </FormGroup>
              <FormGroup>
                <Label>Commentaire</Label>
                <TextArea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={500}
                  placeholder="Partagez votre expérience avec nous..."
                />
              </FormGroup>
              <SubmitButton
                type="submit"
                disabled={status.submitting}
              >
                {status.submitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
              </SubmitButton>
              {status.message && (
                <Message $success={status.success}>{status.message}</Message>
              )}
            </AddReviewForm>
          </FormTransition>
        )}
      </Container>
    </TestimonialsSection>
  );
}

export default Testimonials;