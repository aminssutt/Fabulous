import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faTrash, faSignOutAlt, faImages, faPlus, faUpload, 
  faComments, faStar, faCalendarAlt, faTimes, faSpinner,
  faCheck, faClock, faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../config';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const Wrap = styled.div`
  min-height: 100vh;
  background: ${p => p.theme.colors.background};
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Head = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 400;
  background: linear-gradient(135deg, #FCF6BA 0%, #D4AF37 25%, #BF953F 50%, #D4AF37 75%, #FCF6BA 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
`;

const Nav = styled.nav`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Btn = styled.button`
  background: ${p => p.$active ? 'linear-gradient(135deg, #D4AF37, #AA771C)' : 'rgba(212, 175, 55, 0.1)'};
  color: ${p => p.$active ? p.theme.colors.background : p.theme.colors.primary};
  border: 1px solid ${p => p.$active ? 'transparent' : 'rgba(212, 175, 55, 0.2)'};
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${p => p.$active ? 'linear-gradient(135deg, #D4AF37, #AA771C)' : 'rgba(212, 175, 55, 0.2)'};
    transform: translateY(-2px);
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  padding-bottom: 1rem;
`;

const Tab = styled.button`
  background: ${p => p.$active ? 'rgba(212, 175, 55, 0.15)' : 'transparent'};
  color: ${p => p.$active ? p.theme.colors.primary : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(212, 175, 55, 0.1);
    color: ${p => p.theme.colors.primary};
  }
`;

const TabBadge = styled.span`
  background: ${p => p.$warning ? '#FFA726' : p.theme.colors.primary};
  color: ${p => p.theme.colors.background};
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  animation: ${p => p.$warning && p.$count > 0 ? pulse : 'none'} 2s ease infinite;
`;

const Box = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 16px;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease;
`;

const SectionTitle = styled.h2`
  color: ${p => p.theme.colors.primary};
  margin: 0 0 1.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SubTabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 10px;
  width: fit-content;
`;

const SubTab = styled.button`
  background: ${p => p.$active ? 'rgba(212, 175, 55, 0.2)' : 'transparent'};
  color: ${p => p.$active ? p.theme.colors.primary : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(212, 175, 55, 0.1);
    color: ${p => p.theme.colors.primary};
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
  margin: 0 0 2rem;
`;

const UploadArea = styled.div`
  border: 2px dashed rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 2.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.01);
  
  &:hover {
    border-color: ${p => p.theme.colors.primary};
    background: rgba(212, 175, 55, 0.03);
  }
`;

const PreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #111;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemovePreview = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(229, 57, 53, 0.9);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.7rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #E53935;
  }
`;

const Select = styled.select`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  color: ${p => p.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
  }
  
  option {
    background: #1a1a1a;
  }
`;

const Input = styled.input`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  color: ${p => p.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  color: ${p => p.theme.colors.text};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
  }
`;

const UploadBtn = styled.button`
  background: ${p => p.disabled ? 'rgba(212, 175, 55, 0.3)' : 'linear-gradient(135deg, #D4AF37, #AA771C)'};
  color: ${p => p.theme.colors.background};
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-top: 2rem;
`;

const Item = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: #111;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${Item}:hover & {
    transform: scale(1.05);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.7rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${p => p.theme.colors.primary};
  border: 1px solid rgba(212, 175, 55, 0.2);
`;

const Del = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(229, 57, 53, 0.9);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #E53935;
    transform: scale(1.05);
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${p => p.theme.colors.primary};
  font-size: 1.1rem;
`;

const Message = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  background: ${p => p.$error ? 'rgba(229, 57, 53, 0.1)' : 'rgba(67, 160, 71, 0.1)'};
  color: ${p => p.$error ? '#E53935' : '#43A047'};
  border: 1px solid ${p => p.$error ? 'rgba(229, 57, 53, 0.3)' : 'rgba(67, 160, 71, 0.3)'};
  animation: ${fadeIn} 0.3s ease;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.4);
  
  p {
    margin: 0;
    font-size: 1rem;
  }
`;

// Reviews Section Styles
const ReviewCard = styled.div`
  background: ${p => p.$pending ? 'rgba(255, 167, 38, 0.05)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${p => p.$pending ? 'rgba(255, 167, 38, 0.2)' : 'rgba(212, 175, 55, 0.1)'};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease;
  animation-delay: ${p => p.$delay || '0s'};
  
  &:hover {
    border-color: ${p => p.$pending ? 'rgba(255, 167, 38, 0.4)' : 'rgba(212, 175, 55, 0.2)'};
    background: ${p => p.$pending ? 'rgba(255, 167, 38, 0.08)' : 'rgba(255, 255, 255, 0.03)'};
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ReviewAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.primary};
  font-weight: 600;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const ReviewContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ReviewName = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: ${p => p.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.span`
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  background: ${p => p.$approved ? 'rgba(67, 160, 71, 0.15)' : 'rgba(255, 167, 38, 0.15)'};
  color: ${p => p.$approved ? '#43A047' : '#FFA726'};
`;

const ReviewEmail = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 0.25rem;
  display: block;
`;

const ReviewDate = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
`;

const ReviewStars = styled.div`
  color: ${p => p.theme.colors.primary};
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
`;

const ReviewText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const ReviewActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const ActionBtn = styled.button`
  background: ${p => {
    if (p.$approve) return 'rgba(67, 160, 71, 0.1)';
    if (p.$danger) return 'rgba(229, 57, 53, 0.1)';
    return 'rgba(212, 175, 55, 0.1)';
  }};
  color: ${p => {
    if (p.$approve) return '#43A047';
    if (p.$danger) return '#E53935';
    return p.theme.colors.primary;
  }};
  border: 1px solid ${p => {
    if (p.$approve) return 'rgba(67, 160, 71, 0.2)';
    if (p.$danger) return 'rgba(229, 57, 53, 0.2)';
    return 'rgba(212, 175, 55, 0.2)';
  }};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${p => {
      if (p.$approve) return 'rgba(67, 160, 71, 0.2)';
      if (p.$danger) return 'rgba(229, 57, 53, 0.2)';
      return 'rgba(212, 175, 55, 0.2)';
    }};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const THEME_LABELS = {
  general: 'Général',
  residential: 'Résidentiel',
  commercial: 'Commercial'
};

export default function AdminDashboard() {
  const nav = useNavigate();
  const fileInputRef = useRef(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('gallery');
  const [reviewSubTab, setReviewSubTab] = useState('pending');
  
  // Gallery state
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [theme, setTheme] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  // Reviews state
  const [allReviews, setAllReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [processingReview, setProcessingReview] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('adminLogged') !== 'true') {
      nav('/admin');
    }
  }, [nav]);

  useEffect(() => {
    loadGallery();
    loadReviews();
  }, []);

  const loadGallery = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gallery`);
      if (response.ok) {
        const data = await response.json();
        setImages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      showMessage('Erreur lors du chargement de la galerie', true);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/reviews/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const reviews = Array.isArray(data) ? data : [];
        setAllReviews(reviews);
        setPendingReviews(reviews.filter(r => !r.is_approved));
        setApprovedReviews(reviews.filter(r => r.is_approved));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const showMessage = (text, isError = false) => {
    setMessage({ text, error: isError });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      
      if (!isValidType) {
        showMessage(`${file.name}: Format non supporté`, true);
        return false;
      }
      if (!isValidSize) {
        showMessage(`${file.name}: Fichier trop volumineux (max 5MB)`, true);
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removePreview = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      showMessage('Sélectionnez au moins une image', true);
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        showMessage('Session expirée, veuillez vous reconnecter', true);
        nav('/admin');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('theme', theme);
        formData.append('title', postTitle);
        formData.append('description', postDescription);

        try {
          const response = await fetch(`${API_URL}/api/gallery/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          if (response.ok) {
            successCount++;
          } else {
            const error = await response.json();
            console.error('Erreur upload:', error);
            errorCount++;
          }
        } catch (error) {
          console.error('Erreur réseau:', error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        showMessage(`${successCount} image(s) uploadée(s) avec succès !`);
        setSelectedFiles([]);
        setPostTitle('');
        setPostDescription('');
        await loadGallery();
        window.dispatchEvent(new Event('gallery-update'));
      }

      if (errorCount > 0) {
        showMessage(`${errorCount} erreur(s) lors de l'upload`, true);
      }

    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur lors de l\'upload', true);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm('Supprimer cette image ?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showMessage('Image supprimée avec succès');
        await loadGallery();
        window.dispatchEvent(new Event('gallery-update'));
      } else {
        const error = await response.json();
        showMessage(error.message || 'Erreur lors de la suppression', true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur lors de la suppression', true);
    }
  };

  const handleApproveReview = async (id) => {
    setProcessingReview(id);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/reviews/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showMessage('Avis approuvé et publié ! ✓');
        await loadReviews();
      } else {
        const error = await response.json();
        showMessage(error.message || 'Erreur lors de l\'approbation', true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur lors de l\'approbation', true);
    } finally {
      setProcessingReview(null);
    }
  };

  const handleRejectReview = async (id) => {
    if (!window.confirm('Rejeter et supprimer cet avis ? Cette action est irréversible.')) return;

    setProcessingReview(id);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/reviews/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showMessage('Avis rejeté et supprimé');
        await loadReviews();
      } else {
        const error = await response.json();
        showMessage(error.message || 'Erreur lors du rejet', true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur lors du rejet', true);
    } finally {
      setProcessingReview(null);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Supprimer cet avis ? Cette action est irréversible.')) return;

    setProcessingReview(id);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showMessage('Avis supprimé avec succès');
        await loadReviews();
      } else {
        const error = await response.json();
        showMessage(error.message || 'Erreur lors de la suppression', true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur lors de la suppression', true);
    } finally {
      setProcessingReview(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminLogged');
    localStorage.removeItem('adminToken');
    nav('/admin');
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
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

  const currentReviews = reviewSubTab === 'pending' ? pendingReviews : approvedReviews;

  return (
    <Wrap>
      <Head>
        <Title>Administration</Title>
        <Nav>
          <Btn onClick={() => nav('/')}>
            <FontAwesomeIcon icon={faHome} /> Accueil
          </Btn>
          <Btn onClick={logout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
          </Btn>
        </Nav>
      </Head>

      <TabContainer>
        <Tab $active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')}>
          <FontAwesomeIcon icon={faImages} /> Galerie
          <TabBadge>{images.length}</TabBadge>
        </Tab>
        <Tab $active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>
          <FontAwesomeIcon icon={faComments} /> Avis
          <TabBadge $warning={pendingReviews.length > 0} $count={pendingReviews.length}>
            {pendingReviews.length > 0 ? `${pendingReviews.length} en attente` : allReviews.length}
          </TabBadge>
        </Tab>
      </TabContainer>

      {message && (
        <Message $error={message.error}>
          {message.text}
        </Message>
      )}

      {activeTab === 'gallery' && (
        <Box>
          <SectionTitle>
            <FontAwesomeIcon icon={faImages} /> Gestion de la galerie
          </SectionTitle>

          <Form onSubmit={handleUpload}>
            <UploadArea onClick={() => fileInputRef.current?.click()}>
              <FontAwesomeIcon icon={faUpload} size="3x" color="#D4AF37" style={{ marginBottom: '1rem' }} />
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>
                Cliquez pour sélectionner des images
              </p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', opacity: 0.6 }}>
                JPG, PNG ou WebP - Maximum 5MB par image
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </UploadArea>

            {selectedFiles.length > 0 && (
              <>
                <PreviewContainer>
                  {selectedFiles.map((file, index) => (
                    <PreviewItem key={index}>
                      <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                      <RemovePreview onClick={() => removePreview(index)}>
                        <FontAwesomeIcon icon={faTimes} />
                      </RemovePreview>
                    </PreviewItem>
                  ))}
                </PreviewContainer>

                <Select value={theme} onChange={e => setTheme(e.target.value)}>
                  {Object.entries(THEME_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </Select>

                <Input
                  type="text"
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  placeholder="Titre du projet (optionnel)"
                />

                <TextArea
                  value={postDescription}
                  onChange={e => setPostDescription(e.target.value)}
                  placeholder="Description du projet (optionnel)"
                />

                <UploadBtn type="submit" disabled={uploading}>
                  <FontAwesomeIcon icon={uploading ? faSpinner : faPlus} spin={uploading} />
                  {uploading ? `Upload en cours...` : `Uploader ${selectedFiles.length} image(s)`}
                </UploadBtn>
              </>
            )}
          </Form>

          {loading ? (
            <Loading>
              <FontAwesomeIcon icon={faSpinner} spin /> Chargement de la galerie...
            </Loading>
          ) : images.length === 0 ? (
            <EmptyState>
              <p>Aucune image dans la galerie. Uploadez votre première image !</p>
            </EmptyState>
          ) : (
            <>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1rem' }}>
                {images.length} image(s) dans la galerie
              </p>
              <Grid>
                {images.map(img => (
                  <Item key={img.id}>
                    <Thumb src={img.url} alt={img.theme} />
                    <Badge>{THEME_LABELS[img.theme] || img.theme}</Badge>
                    <Del onClick={() => handleDeleteImage(img.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Del>
                  </Item>
                ))}
              </Grid>
            </>
          )}
        </Box>
      )}

      {activeTab === 'reviews' && (
        <Box>
          <SectionTitle>
            <FontAwesomeIcon icon={faComments} /> Gestion des avis
          </SectionTitle>

          <SubTabContainer>
            <SubTab $active={reviewSubTab === 'pending'} onClick={() => setReviewSubTab('pending')}>
              <FontAwesomeIcon icon={faClock} />
              En attente ({pendingReviews.length})
            </SubTab>
            <SubTab $active={reviewSubTab === 'approved'} onClick={() => setReviewSubTab('approved')}>
              <FontAwesomeIcon icon={faCheckCircle} />
              Approuvés ({approvedReviews.length})
            </SubTab>
          </SubTabContainer>

          {reviewsLoading ? (
            <Loading>
              <FontAwesomeIcon icon={faSpinner} spin /> Chargement des avis...
            </Loading>
          ) : currentReviews.length === 0 ? (
            <EmptyState>
              <p>
                {reviewSubTab === 'pending' 
                  ? 'Aucun avis en attente de validation.' 
                  : 'Aucun avis approuvé pour le moment.'}
              </p>
            </EmptyState>
          ) : (
            <ReviewsList>
              {currentReviews.map((review, index) => (
                <ReviewCard key={review.id} $delay={`${index * 0.1}s`} $pending={!review.is_approved}>
                  <ReviewAvatar>{getInitials(review.name)}</ReviewAvatar>
                  <ReviewContent>
                    <ReviewHeader>
                      <div>
                        <ReviewName>
                          {review.name}
                          <StatusBadge $approved={review.is_approved}>
                            {review.is_approved ? 'Approuvé' : 'En attente'}
                          </StatusBadge>
                        </ReviewName>
                        <ReviewEmail>{review.email}</ReviewEmail>
                        <ReviewStars>{renderStars(review.rating)}</ReviewStars>
                      </div>
                      <ReviewDate>
                        <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '0.4rem' }} />
                        {new Date(review.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </ReviewDate>
                    </ReviewHeader>
                    <ReviewText>
                      {review.comment || 'Aucun commentaire'}
                    </ReviewText>
                    <ReviewActions>
                      {!review.is_approved && (
                        <ActionBtn 
                          $approve 
                          onClick={() => handleApproveReview(review.id)}
                          disabled={processingReview === review.id}
                        >
                          <FontAwesomeIcon icon={processingReview === review.id ? faSpinner : faCheck} spin={processingReview === review.id} />
                          Approuver
                        </ActionBtn>
                      )}
                      <ActionBtn 
                        $danger 
                        onClick={() => review.is_approved ? handleDeleteReview(review.id) : handleRejectReview(review.id)}
                        disabled={processingReview === review.id}
                      >
                        <FontAwesomeIcon icon={processingReview === review.id ? faSpinner : faTimesCircle} spin={processingReview === review.id} />
                        {review.is_approved ? 'Supprimer' : 'Rejeter'}
                      </ActionBtn>
                    </ReviewActions>
                  </ReviewContent>
                </ReviewCard>
              ))}
            </ReviewsList>
          )}
        </Box>
      )}
    </Wrap>
  );
}
