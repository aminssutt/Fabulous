import React from 'react';
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
  animation: ${fadeInUp} 1s ease;
  animation-delay: ${props => props.$delay}ms;

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

const testimonials = [
  {
    id: 1,
    content: "Fabulous a transformé notre maison en un véritable havre de paix. Leur attention aux détails et leur créativité ont dépassé toutes nos attentes.",
    name: "Sophie Martin",
    position: "Propriétaire",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    rating: 5
  },
  {
    id: 2,
    content: "Un travail exceptionnel pour notre boutique. L'espace est maintenant parfaitement optimisé et nos clients adorent le nouveau design.",
    name: "Marc Dubois",
    position: "Gérant de boutique",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    rating: 5
  },
  {
    id: 3,
    content: "Professionnalisme et créativité au rendez-vous. Notre salon est méconnaissable et tellement plus fonctionnel maintenant.",
    name: "Julie Leroux",
    position: "Cliente particulière",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    rating: 5
  },
  {
    id: 4,
    content: "Une collaboration exceptionnelle. Ils ont su capturer notre vision et la transformer en réalité. Le résultat est époustouflant.",
    name: "Thomas Bernard",
    position: "Propriétaire",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    rating: 5
  }
];

function Testimonials() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
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

  return (
    <TestimonialsSection id="testimonials">
      <Container>
        <SectionTitle>
          <h2>Témoignages</h2>
          <p>
            Découvrez ce que nos clients disent de notre travail et de leur 
            expérience avec Fabulous Design.
          </p>
        </SectionTitle>

        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id}>
              <TestimonialCard $delay={index * 200}>
                <QuoteIcon className="quote-icon">
                  <FontAwesomeIcon icon={faQuoteRight} />
                </QuoteIcon>
                <TestimonialContent>
                  {testimonial.content}
                </TestimonialContent>
                <ClientInfo>
                  <ClientImage>
                    <img src={testimonial.image} alt={testimonial.name} />
                  </ClientImage>
                  <ClientDetails>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.position}</p>
                    <Rating>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FontAwesomeIcon 
                          key={i} 
                          icon={faStar} 
                          className="star" 
                        />
                      ))}
                    </Rating>
                  </ClientDetails>
                </ClientInfo>
              </TestimonialCard>
            </div>
          ))}
        </Slider>
      </Container>
    </TestimonialsSection>
  );
}

export default Testimonials;