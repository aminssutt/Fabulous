import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTrash, faCalendarWeek, faComments, faSignOutAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 2rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: ${props => props.$active ? props.theme.colors.primary : 'rgba(212, 175, 55, 0.1)'};
  color: ${props => props.$active ? props.theme.colors.background : props.theme.colors.primary};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.background};
  }

  ${props => props.$isHome && `
    background: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
    &:hover {
      background: #4CAF50;
      color: ${props.theme.colors.background};
    }
  `}
`;

const Calendar = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 15px;
  padding: 2rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CalendarTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
`;

const WeekNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WeekButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
`;

const DayColumn = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  padding: 1rem;
`;

const DayHeader = styled.div`
  color: ${props => props.theme.colors.primary};
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  margin-bottom: 1rem;

  h3 {
    margin: 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0.5rem 0 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const TimeSlot = styled.div`
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 5px;
  background: ${props => props.$hasAppointment ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
`;

const Appointment = styled.div`
  padding: 0.5rem;
  background: rgba(212, 175, 55, 0.15);
  border-radius: 5px;
  margin-top: 0.5rem;
  font-size: 0.8rem;

  p {
    margin: 0.2rem 0;
  }
`;

const ReviewsContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 15px;
  padding: 2rem;
`;

const ReviewCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ReviewContent = styled.div`
  flex: 1;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ReviewAuthor = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-size: 1.1rem;
`;

const ReviewDate = styled.p`
  color: ${props => props.theme.colors.text};
  opacity: 0.7;
  margin: 0;
  font-size: 0.9rem;
`;

const ReviewText = styled.p`
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.6;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const API_URL = 'http://localhost:5000';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Vérifier la validité de la session
    const checkSession = () => {
      const token = localStorage.getItem('adminToken');
      const expiry = localStorage.getItem('adminTokenExpiry');

      if (!token || !expiry) {
        navigate('/admin');
        return false;
      }

      if (new Date(expiry) < new Date()) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiry');
        navigate('/admin');
        return false;
      }

      return true;
    };

    // Vérifier la session toutes les minutes
    const sessionCheck = setInterval(checkSession, 60000);
    
    // Vérification initiale
    if (!checkSession()) return;

    // Charger les données
    fetchData();

    // Cleanup
    return () => clearInterval(sessionCheck);
  }, [navigate, activeTab, currentWeek]);

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const endpoint = activeTab === 'calendar' ? 'appointments' : 'reviews';
      const response = await fetch(`${API_URL}/api/admin/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (activeTab === 'calendar') {
          setAppointments(data);
        } else {
          setReviews(data);
        }
      } else if (response.status === 401) {
        // Token invalide ou expiré
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiry');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    navigate('/admin');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setReviews(reviews.filter(review => review._id !== reviewId));
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiry');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avis:', error);
    }
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getAppointmentsForDay = (date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  const timeSlots = Array.from({ length: 9 }, (_, i) => `${i + 9}:00`);

  return (
    <DashboardContainer>
      <Header>
        <Title>Administration</Title>
        <Nav>
          <NavButton
            $active={activeTab === 'calendar'}
            onClick={() => setActiveTab('calendar')}
          >
            <FontAwesomeIcon icon={faCalendarWeek} />
            Emploi du temps
          </NavButton>
          <NavButton
            $active={activeTab === 'reviews'}
            onClick={() => setActiveTab('reviews')}
          >
            <FontAwesomeIcon icon={faComments} />
            Avis
          </NavButton>
          <NavButton
            $isHome
            onClick={handleHomeClick}
          >
            <FontAwesomeIcon icon={faHome} />
            Accueil
          </NavButton>
          <NavButton onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            Déconnexion
          </NavButton>
        </Nav>
      </Header>

      {activeTab === 'calendar' ? (
        <Calendar>
          <CalendarHeader>
            <CalendarTitle>
              Semaine du {formatDate(getWeekDays()[0])}
            </CalendarTitle>
            <WeekNavigation>
              <WeekButton onClick={() => navigateWeek('prev')}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </WeekButton>
              <WeekButton onClick={() => navigateWeek('next')}>
                <FontAwesomeIcon icon={faChevronRight} />
              </WeekButton>
            </WeekNavigation>
          </CalendarHeader>

          <WeekGrid>
            {getWeekDays().map((day, index) => (
              <DayColumn key={index}>
                <DayHeader>
                  <h3>{day.toLocaleDateString('fr-FR', { weekday: 'long' })}</h3>
                  <p>{day.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                </DayHeader>
                {timeSlots.map((time, timeIndex) => {
                  const dayAppointments = getAppointmentsForDay(day);
                  const appointment = dayAppointments.find(a => a.time === time);
                  
                  return (
                    <TimeSlot key={timeIndex} $hasAppointment={!!appointment}>
                      {time}
                      {appointment && (
                        <Appointment>
                          <p><strong>{appointment.name}</strong></p>
                          <p>{appointment.email}</p>
                          <p>{appointment.phone}</p>
                        </Appointment>
                      )}
                    </TimeSlot>
                  );
                })}
              </DayColumn>
            ))}
          </WeekGrid>
        </Calendar>
      ) : (
        <ReviewsContainer>
          {reviews.map((review) => (
            <ReviewCard key={review._id}>
              <ReviewContent>
                <ReviewHeader>
                  <ReviewAuthor>{review.name}</ReviewAuthor>
                  <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
                </ReviewHeader>
                <ReviewText>{review.comment}</ReviewText>
              </ReviewContent>
              <DeleteButton onClick={() => handleDeleteReview(review._id)}>
                <FontAwesomeIcon icon={faTrash} />
              </DeleteButton>
            </ReviewCard>
          ))}
        </ReviewsContainer>
      )}
    </DashboardContainer>
  );
}

export default AdminDashboard; 