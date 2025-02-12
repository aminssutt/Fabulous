import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTrash, faCalendarWeek, faComments, faSignOutAlt, faChevronLeft, faChevronRight, faImages } from '@fortawesome/free-solid-svg-icons';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;

  @media (max-width: 1024px) {
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 1rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;

  @media (max-width: 1024px) {
    gap: 0.5rem;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
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

  @media (max-width: 1024px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    flex: 1 1 auto;
    min-width: 120px;
    margin: 0.25rem;
  }
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

  @media (max-width: 1024px) {
    gap: 0.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
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

  @media (max-width: 480px) {
    padding: 1rem;
  }
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

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
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

const ProjectsContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 15px;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProjectForm = styled.form`
  margin-bottom: 2rem;
  display: grid;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 5px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 5px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }

  option {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const ProjectCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    
    img {
      width: 100%;
      height: 200px;
    }
  }
`;

const ProjectImage = styled.img`
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
`;

const ProjectInfo = styled.div`
  flex: 1;
`;

const ProjectTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin: 0 0 0.5rem 0;
`;

const ProjectDescription = styled.p`
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const ProjectCategory = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 15px;
  color: ${props => props.theme.colors.primary};
  font-size: 0.9rem;
`;

const SubmitButton = styled(NavButton)`
  width: 100%;
  justify-content: center;
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
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: 'residential',
    image: ''
  });

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
      let endpoint;
      let headers = {
        'Content-Type': 'application/json'
      };

      if (activeTab === 'calendar') {
        endpoint = 'admin/appointments';
        headers['Authorization'] = `Bearer ${token}`;
      } else if (activeTab === 'reviews') {
        endpoint = 'admin/reviews';
        headers['Authorization'] = `Bearer ${token}`;
      } else if (activeTab === 'projects') {
        endpoint = 'projects'; // Public endpoint for projects
      }
      
      const response = await fetch(`${API_URL}/api/${endpoint}`, {
        headers: headers
      });

      if (response.ok) {
        const data = await response.json();
        if (activeTab === 'calendar') {
          setAppointments(data);
        } else if (activeTab === 'reviews') {
          setReviews(data);
        } else if (activeTab === 'projects') {
          setProjects(data);
        }
      } else if (response.status === 401 && activeTab !== 'projects') {
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

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`${API_URL}/api/admin/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectForm)
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([newProject, ...projects]);
        setProjectForm({
          title: '',
          description: '',
          category: 'residential',
          image: ''
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du projet:', error);
    }
  };

  const handleProjectDelete = async (projectId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_URL}/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setProjects(projects.filter(project => project._id !== projectId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
    }
  };




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
            $active={activeTab === 'projects'}
            onClick={() => setActiveTab('projects')}
            >
            <FontAwesomeIcon icon={faImages} />
            Projets
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
        ) : activeTab === 'reviews' && (
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

        {activeTab === 'projects' && (
        <ProjectsContainer>
          <ProjectForm onSubmit={handleProjectSubmit}>
          <Input
            type="text"
            placeholder="Titre du projet"
            value={projectForm.title}
            onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
            required
          />
          <Input
            type="text"
            placeholder="Description"
            value={projectForm.description}
            onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
            required
          />
          <Select
            value={projectForm.category}
            onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
            required
          >
            <option value="residential">Résidentiel</option>
            <option value="commercial">Commercial</option>
          </Select>
          <Input
            type="url"
            placeholder="URL de l'image"
            value={projectForm.image}
            onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
            required
          />
          <SubmitButton type="submit">Ajouter le projet</SubmitButton>
          </ProjectForm>

          {projects.map((project) => (
          <ProjectCard key={project._id}>
            <ProjectImage src={project.image} alt={project.title} />
            <ProjectInfo>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectDescription>{project.description}</ProjectDescription>
            <ProjectCategory>
              {project.category === 'residential' ? 'Résidentiel' : 'Commercial'}
            </ProjectCategory>
            </ProjectInfo>
            <DeleteButton onClick={() => handleProjectDelete(project._id)}>
            <FontAwesomeIcon icon={faTrash} />
            </DeleteButton>
          </ProjectCard>
          ))}
        </ProjectsContainer>
        )}
      </DashboardContainer>
  );
}

export default AdminDashboard; 