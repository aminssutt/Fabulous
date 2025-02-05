import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const AdminSection = styled.section`
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
  margin-bottom: 3rem;
`;

const ReviewsTable = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 15px;
  border: 1px solid rgba(212, 175, 55, 0.1);
  overflow: hidden;
`;

const ReviewRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  align-items: center;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const HeaderRow = styled(ReviewRow)`
  background: rgba(212, 175, 55, 0.1);
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const Cell = styled.div`
  color: ${props => props.theme.colors.text};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.$approve ? '#4CAF50' : props.$delete ? '#f44336' : props.theme.colors.primary};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Message = styled.div`
  text-align: center;
  margin: 1rem;
  padding: 1rem;
  border-radius: 5px;
  color: ${props => props.$success ? '#4CAF50' : '#f44336'};
  background: ${props => props.$success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  border: 1px solid ${props => props.$success ? '#4CAF50' : '#f44336'};
`;

const API_URL = 'http://localhost:5000';

function Admin() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState({
    message: '',
    success: false
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error);
      setStatus({
        message: 'Erreur lors de la récupération des avis',
        success: false
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/reviews/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setStatus({
        message: 'Avis supprimé avec succès',
        success: true
      });

      // Rafraîchir la liste
      fetchReviews();
    } catch (error) {
      setStatus({
        message: 'Erreur lors de la suppression de l\'avis',
        success: false
      });
    }
  };

  const handleApproval = async (id, isApproved) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/reviews/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isApproved })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification');
      }

      setStatus({
        message: `Avis ${isApproved ? 'approuvé' : 'désapprouvé'} avec succès`,
        success: true
      });

      // Rafraîchir la liste
      fetchReviews();
    } catch (error) {
      setStatus({
        message: 'Erreur lors de la modification de l\'avis',
        success: false
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <AdminSection>
      <Container>
        <Title>Administration des Avis</Title>

        {status.message && (
          <Message $success={status.success}>
            {status.message}
          </Message>
        )}

        <ReviewsTable>
          <HeaderRow>
            <Cell>Auteur</Cell>
            <Cell>Commentaire</Cell>
            <Cell>Date</Cell>
            <Cell>Statut</Cell>
            <Cell>Actions</Cell>
          </HeaderRow>

          {reviews.map((review) => (
            <ReviewRow key={review._id}>
              <Cell>{review.name}</Cell>
              <Cell>
                <div>
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={faStar}
                      color={index < review.rating ? '#D4AF37' : '#666'}
                    />
                  ))}
                </div>
                {review.comment}
              </Cell>
              <Cell>{formatDate(review.createdAt)}</Cell>
              <Cell>
                {review.isApproved ? (
                  <span style={{ color: '#4CAF50' }}>Approuvé</span>
                ) : (
                  <span style={{ color: '#f44336' }}>En attente</span>
                )}
              </Cell>
              <ActionButtons>
                {!review.isApproved && (
                  <ActionButton
                    $approve
                    onClick={() => handleApproval(review._id, true)}
                    title="Approuver"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </ActionButton>
                )}
                {review.isApproved && (
                  <ActionButton
                    onClick={() => handleApproval(review._id, false)}
                    title="Désapprouver"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </ActionButton>
                )}
                <ActionButton
                  $delete
                  onClick={() => handleDelete(review._id)}
                  title="Supprimer"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </ActionButton>
              </ActionButtons>
            </ReviewRow>
          ))}
        </ReviewsTable>
      </Container>
    </AdminSection>
  );
}

export default Admin; 