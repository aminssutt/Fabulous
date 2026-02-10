import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faTrash, faSignOutAlt, faImages, faPlus, faUpload, 
  faComments, faStar, faTimes, faSpinner, faCheck, faClock, 
  faCheckCircle, faTimesCircle, faCog, faLayerGroup, faEdit,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../config';

// ==================== ANIMATIONS ====================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ==================== STYLED COMPONENTS ====================
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
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Btn = styled.button`
  background: ${p => p.$active ? 'linear-gradient(135deg, #D4AF37, #AA771C)' : 'rgba(212, 175, 55, 0.1)'};
  color: ${p => p.$active ? p.theme.colors.background : p.theme.colors.primary};
  border: 1px solid ${p => p.$active ? 'transparent' : 'rgba(212, 175, 55, 0.2)'};
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${p => p.$active ? 'linear-gradient(135deg, #D4AF37, #AA771C)' : 'rgba(212, 175, 55, 0.2)'};
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
`;

const Box = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 16px;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
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

const Form = styled.form`
  display: grid;
  gap: 1rem;
  margin: 0 0 2rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$cols || '1fr'};
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  padding: 0.9rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  color: ${p => p.theme.colors.text};
  font-size: 0.95rem;
  transition: all 0.3s ease;
  
  &::placeholder { color: rgba(255, 255, 255, 0.3); }
  &:focus { outline: none; border-color: ${p => p.theme.colors.primary}; }
`;

const TextArea = styled.textarea`
  padding: 0.9rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  color: ${p => p.theme.colors.text};
  font-size: 0.95rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &::placeholder { color: rgba(255, 255, 255, 0.3); }
  &:focus { outline: none; border-color: ${p => p.theme.colors.primary}; }
`;

const Select = styled.select`
  padding: 0.9rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  color: ${p => p.theme.colors.text};
  font-size: 0.95rem;
  transition: all 0.3s ease;
  
  &:focus { outline: none; border-color: ${p => p.theme.colors.primary}; }
  option { background: #1a1a1a; }
`;

const ActionBtn = styled.button`
  background: ${p => p.$danger ? 'rgba(229, 57, 53, 0.2)' : p.$success ? 'rgba(76, 175, 80, 0.2)' : 'linear-gradient(135deg, #D4AF37, #AA771C)'};
  color: ${p => p.$danger ? '#E53935' : p.$success ? '#4CAF50' : p.theme.colors.background};
  border: 1px solid ${p => p.$danger ? 'rgba(229, 57, 53, 0.3)' : p.$success ? 'rgba(76, 175, 80, 0.3)' : 'transparent'};
  padding: ${p => p.$small ? '0.5rem 0.75rem' : '0.9rem 1.5rem'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: ${p => p.$small ? '0.75rem' : '0.9rem'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover { transform: translateY(-2px); opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${p => p.$min || '200px'}, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover { border-color: rgba(212, 175, 55, 0.3); }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: ${p => p.theme.colors.primary};
`;

const CardDesc = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const IconBtn = styled.button`
  background: ${p => p.$danger ? 'rgba(229, 57, 53, 0.2)' : 'rgba(212, 175, 55, 0.1)'};
  color: ${p => p.$danger ? '#E53935' : p.theme.colors.primary};
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover { transform: scale(1.1); }
`;

const Badge = styled.span`
  background: ${p => p.$color || 'rgba(212, 175, 55, 0.2)'};
  color: ${p => p.$textColor || p.theme.colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  background: ${p => p.$error ? 'rgba(229, 57, 53, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  border: 1px solid ${p => p.$error ? 'rgba(229, 57, 53, 0.3)' : 'rgba(76, 175, 80, 0.3)'};
  color: ${p => p.$error ? '#E53935' : '#4CAF50'};
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${p => p.theme.colors.primary};
  font-size: 1.1rem;
`;

const UploadArea = styled.div`
  border: 2px dashed rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.01);
  
  &:hover {
    border-color: ${p => p.theme.colors.primary};
    background: rgba(212, 175, 55, 0.03);
  }
`;

const PreviewImage = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #111;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SubTab = styled.button`
  background: ${p => p.$active ? 'rgba(212, 175, 55, 0.2)' : 'transparent'};
  color: ${p => p.$active ? p.theme.colors.primary : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;
  
  &:hover { background: rgba(212, 175, 55, 0.1); color: ${p => p.theme.colors.primary}; }
`;

const SubTabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 10px;
  width: fit-content;
  flex-wrap: wrap;
`;

const TabBadge = styled.span`
  background: ${p => p.$warning ? '#FFA726' : p.theme.colors.primary};
  color: ${p => p.theme.colors.background};
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
`;

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover { color: #E53935; }
`;

function Modal({ children, onClose }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalClose onClick={onClose}>×</ModalClose>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
}

// Icon options for services
const ICON_OPTIONS = [
  { value: 'faCouch', label: '🛋️ Canapé' },
  { value: 'faLightbulb', label: '💡 Ampoule' },
  { value: 'faRulerCombined', label: '📐 Règle' },
  { value: 'faPalette', label: '🎨 Palette' },
  { value: 'faGem', label: '💎 Diamant' },
  { value: 'faHome', label: '🏠 Maison' },
  { value: 'faPaintBrush', label: '🖌️ Pinceau' },
  { value: 'faCube', label: '📦 Cube' },
  { value: 'faHammer', label: '🔨 Marteau' },
  { value: 'faMagic', label: '✨ Baguette' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State principal
  const [tab, setTab] = useState('gallery');
  const [subTab, setSubTab] = useState('pending');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [gallery, setGallery] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // Form states
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Edit modals
  const [editingService, setEditingService] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  
  // New item forms
  const [newService, setNewService] = useState({ icon: 'faGem', title: '', description: '' });
  const [newCategory, setNewCategory] = useState({ slug: '', label: '' });

  const token = localStorage.getItem('adminToken');

  // ==================== LOAD DATA ====================
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      loadGallery(),
      loadCategories(),
      loadServices(),
      loadReviews()
    ]);
    setLoading(false);
  };

  const loadGallery = async () => {
    try {
      const res = await fetch(`${API_URL}/api/gallery`);
      if (res.ok) setGallery(await res.json());
    } catch (e) { console.error('Erreur gallery:', e); }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories/admin/all`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0 && !uploadCategory) setUploadCategory(data[0].slug);
      }
    } catch (e) { console.error('Erreur categories:', e); }
  };

  const loadServices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/services/admin/all`);
      if (res.ok) setServices(await res.json());
    } catch (e) { console.error('Erreur services:', e); }
  };

  const loadReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setReviews(await res.json());
    } catch (e) { console.error('Erreur reviews:', e); }
  };

  // ==================== MESSAGE HELPER ====================
  const showMessage = (text, error = false) => {
    setMessage({ text, error });
    setTimeout(() => setMessage(null), 4000);
  };

  // ==================== GALLERY HANDLERS ====================
  const handleFilesSelect = (e) => {
    const files = Array.from(e.target.files);
    setUploadFiles(prev => [...prev, ...files]);
  };

  const removePreviewFile = (index) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (uploadFiles.length === 0 || !uploadCategory) return;
    
    setUploading(true);
    let successCount = 0;
    
    for (const file of uploadFiles) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('theme', uploadCategory);
      if (uploadTitle) formData.append('title', uploadTitle);
      if (uploadDesc) formData.append('description', uploadDesc);
      
      try {
        const res = await fetch(`${API_URL}/api/gallery/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        if (res.ok) successCount++;
      } catch (e) { console.error('Upload error:', e); }
    }
    
    setUploading(false);
    setUploadFiles([]);
    setUploadTitle('');
    setUploadDesc('');
    loadGallery();
    showMessage(`${successCount}/${uploadFiles.length} image(s) uploadée(s)`);
  };

  const deleteImage = async (id) => {
    if (!window.confirm('Supprimer cette image ?')) return;
    try {
      const res = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadGallery();
        showMessage('Image supprimée');
      }
    } catch (e) { showMessage('Erreur de suppression', true); }
  };

  const updateImage = async (id, data) => {
    try {
      const res = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        loadGallery();
        setEditingImage(null);
        showMessage('Image mise à jour');
      }
    } catch (e) { showMessage('Erreur de mise à jour', true); }
  };

  // ==================== SERVICES HANDLERS ====================
  const createService = async (e) => {
    e.preventDefault();
    if (!newService.title || !newService.description) return;
    
    try {
      const res = await fetch(`${API_URL}/api/services`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ ...newService, sort_order: services.length })
      });
      if (res.ok) {
        loadServices();
        setNewService({ icon: 'faGem', title: '', description: '' });
        showMessage('Service créé');
      }
    } catch (e) { showMessage('Erreur de création', true); }
  };

  const updateService = async (id, data) => {
    try {
      const res = await fetch(`${API_URL}/api/services/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        loadServices();
        setEditingService(null);
        showMessage('Service mis à jour');
      }
    } catch (e) { showMessage('Erreur de mise à jour', true); }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Supprimer ce service ?')) return;
    try {
      const res = await fetch(`${API_URL}/api/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadServices();
        showMessage('Service supprimé');
      }
    } catch (e) { showMessage('Erreur de suppression', true); }
  };

  // ==================== CATEGORIES HANDLERS ====================
  const createCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.slug || !newCategory.label) return;
    
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ ...newCategory, sort_order: categories.length })
      });
      if (res.ok) {
        loadCategories();
        setNewCategory({ slug: '', label: '' });
        showMessage('Catégorie créée');
      } else {
        const err = await res.json();
        showMessage(err.error || 'Erreur', true);
      }
    } catch (e) { showMessage('Erreur de création', true); }
  };

  const updateCategory = async (id, data) => {
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        loadCategories();
        setEditingCategory(null);
        showMessage('Catégorie mise à jour');
      }
    } catch (e) { showMessage('Erreur de mise à jour', true); }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ? Les images associées ne seront plus classifiées.')) return;
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadCategories();
        showMessage('Catégorie supprimée');
      }
    } catch (e) { showMessage('Erreur de suppression', true); }
  };

  // ==================== REVIEWS HANDLERS ====================
  const approveReview = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/admin/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadReviews();
        showMessage('Avis approuvé');
      }
    } catch (e) { showMessage('Erreur', true); }
  };

  const rejectReview = async (id) => {
    if (!window.confirm('Rejeter et supprimer cet avis ?')) return;
    try {
      const res = await fetch(`${API_URL}/api/reviews/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadReviews();
        showMessage('Avis rejeté');
      }
    } catch (e) { showMessage('Erreur', true); }
  };

  // ==================== LOGOUT ====================
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  // ==================== RENDER ====================
  const pendingReviews = reviews.filter(r => !r.is_approved);
  const approvedReviews = reviews.filter(r => r.is_approved);

  if (loading) {
    return (
      <Wrap>
        <Loading><FontAwesomeIcon icon={faSpinner} spin /> Chargement...</Loading>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <Head>
        <Title>Administration Fabulous</Title>
        <Nav>
          <Btn $active={tab === 'gallery'} onClick={() => setTab('gallery')}>
            <FontAwesomeIcon icon={faImages} /> Galerie
          </Btn>
          <Btn $active={tab === 'categories'} onClick={() => setTab('categories')}>
            <FontAwesomeIcon icon={faLayerGroup} /> Catégories
          </Btn>
          <Btn $active={tab === 'services'} onClick={() => setTab('services')}>
            <FontAwesomeIcon icon={faCog} /> Services
          </Btn>
          <Btn $active={tab === 'reviews'} onClick={() => setTab('reviews')}>
            <FontAwesomeIcon icon={faComments} /> Avis
            {pendingReviews.length > 0 && <TabBadge $warning>{pendingReviews.length}</TabBadge>}
          </Btn>
          <Btn onClick={() => navigate('/')}>
            <FontAwesomeIcon icon={faHome} />
          </Btn>
          <Btn onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </Btn>
        </Nav>
      </Head>

      {message && <Message $error={message.error}>{message.text}</Message>}

      {/* ==================== GALLERY TAB ==================== */}
      {tab === 'gallery' && (
        <Box>
          <SectionTitle><FontAwesomeIcon icon={faImages} /> Gestion de la Galerie</SectionTitle>
          
          <Form onSubmit={handleUpload}>
            <UploadArea onClick={() => fileInputRef.current?.click()}>
              <FontAwesomeIcon icon={faUpload} size="2x" style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>
                Cliquez pour sélectionner des images
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFilesSelect}
              />
            </UploadArea>
            
            {uploadFiles.length > 0 && (
              <Grid $min="100px">
                {uploadFiles.map((file, i) => (
                  <PreviewImage key={i}>
                    <img src={URL.createObjectURL(file)} alt="" />
                    <IconBtn 
                      $danger 
                      style={{ position: 'absolute', top: 4, right: 4 }}
                      onClick={() => removePreviewFile(i)}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </IconBtn>
                  </PreviewImage>
                ))}
              </Grid>
            )}
            
            <FormRow $cols="1fr 1fr">
              <Select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.label}</option>
                ))}
              </Select>
              <Input 
                placeholder="Titre (optionnel)" 
                value={uploadTitle} 
                onChange={e => setUploadTitle(e.target.value)} 
              />
            </FormRow>
            
            <TextArea 
              placeholder="Description (optionnelle)" 
              value={uploadDesc} 
              onChange={e => setUploadDesc(e.target.value)} 
            />
            
            <ActionBtn type="submit" disabled={uploadFiles.length === 0 || uploading}>
              {uploading ? <><FontAwesomeIcon icon={faSpinner} spin /> Upload en cours...</> 
                        : <><FontAwesomeIcon icon={faUpload} /> Uploader {uploadFiles.length} image(s)</>}
            </ActionBtn>
          </Form>
          
          <SectionTitle style={{ marginTop: '2rem' }}>Images existantes ({gallery.length})</SectionTitle>
          
          <Grid $min="180px">
            {gallery.map(img => (
              <Card key={img.id}>
                <PreviewImage style={{ marginBottom: '0.75rem' }}>
                  <img src={img.url} alt={img.title || ''} />
                </PreviewImage>
                <Badge>{categories.find(c => c.slug === img.theme)?.label || img.theme}</Badge>
                {img.title && <CardTitle style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{img.title}</CardTitle>}
                {img.description && <CardDesc style={{ fontSize: '0.8rem' }}>{img.description.substring(0, 50)}...</CardDesc>}
                <CardActions>
                  <IconBtn onClick={() => setEditingImage(img)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </IconBtn>
                  <IconBtn $danger onClick={() => deleteImage(img.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconBtn>
                </CardActions>
              </Card>
            ))}
          </Grid>
        </Box>
      )}

      {/* ==================== CATEGORIES TAB ==================== */}
      {tab === 'categories' && (
        <Box>
          <SectionTitle><FontAwesomeIcon icon={faLayerGroup} /> Gestion des Catégories</SectionTitle>
          
          <Form onSubmit={createCategory}>
            <FormRow $cols="1fr 1fr auto">
              <Input 
                placeholder="Slug (ex: luxe)" 
                value={newCategory.slug} 
                onChange={e => setNewCategory({ ...newCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} 
              />
              <Input 
                placeholder="Label (ex: Luxe & Prestige)" 
                value={newCategory.label} 
                onChange={e => setNewCategory({ ...newCategory, label: e.target.value })} 
              />
              <ActionBtn type="submit" disabled={!newCategory.slug || !newCategory.label}>
                <FontAwesomeIcon icon={faPlus} /> Ajouter
              </ActionBtn>
            </FormRow>
          </Form>
          
          <Grid $min="250px">
            {categories.map(cat => (
              <Card key={cat.id}>
                <CardHeader>
                  <div>
                    <CardTitle>{cat.label}</CardTitle>
                    <Badge style={{ marginTop: '0.25rem' }}>{cat.slug}</Badge>
                  </div>
                  <Badge $color={cat.is_active ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.1)'} 
                         $textColor={cat.is_active ? '#4CAF50' : 'rgba(255,255,255,0.4)'}>
                    {cat.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                </CardHeader>
                <CardDesc>{gallery.filter(g => g.theme === cat.slug).length} image(s)</CardDesc>
                <CardActions>
                  <IconBtn onClick={() => setEditingCategory(cat)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </IconBtn>
                  <IconBtn $danger onClick={() => deleteCategory(cat.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconBtn>
                </CardActions>
              </Card>
            ))}
          </Grid>
        </Box>
      )}

      {/* ==================== SERVICES TAB ==================== */}
      {tab === 'services' && (
        <Box>
          <SectionTitle><FontAwesomeIcon icon={faCog} /> Gestion des Services</SectionTitle>
          
          <Form onSubmit={createService}>
            <FormRow $cols="auto 1fr">
              <Select value={newService.icon} onChange={e => setNewService({ ...newService, icon: e.target.value })}>
                {ICON_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
              <Input 
                placeholder="Titre du service" 
                value={newService.title} 
                onChange={e => setNewService({ ...newService, title: e.target.value })} 
              />
            </FormRow>
            <TextArea 
              placeholder="Description du service" 
              value={newService.description} 
              onChange={e => setNewService({ ...newService, description: e.target.value })} 
            />
            <ActionBtn type="submit" disabled={!newService.title || !newService.description}>
              <FontAwesomeIcon icon={faPlus} /> Ajouter un service
            </ActionBtn>
          </Form>
          
          <Grid $min="280px">
            {services.map(srv => (
              <Card key={srv.id}>
                <CardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {ICON_OPTIONS.find(o => o.value === srv.icon)?.label.split(' ')[0] || '💎'}
                    </span>
                    <CardTitle>{srv.title}</CardTitle>
                  </div>
                  <Badge $color={srv.is_active ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.1)'} 
                         $textColor={srv.is_active ? '#4CAF50' : 'rgba(255,255,255,0.4)'}>
                    {srv.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                </CardHeader>
                <CardDesc>{srv.description}</CardDesc>
                <CardActions>
                  <IconBtn onClick={() => setEditingService(srv)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </IconBtn>
                  <IconBtn $danger onClick={() => deleteService(srv.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconBtn>
                </CardActions>
              </Card>
            ))}
          </Grid>
        </Box>
      )}

      {/* ==================== REVIEWS TAB ==================== */}
      {tab === 'reviews' && (
        <Box>
          <SectionTitle><FontAwesomeIcon icon={faComments} /> Gestion des Avis</SectionTitle>
          
          <SubTabContainer>
            <SubTab $active={subTab === 'pending'} onClick={() => setSubTab('pending')}>
              <FontAwesomeIcon icon={faClock} /> En attente
              {pendingReviews.length > 0 && <TabBadge $warning>{pendingReviews.length}</TabBadge>}
            </SubTab>
            <SubTab $active={subTab === 'approved'} onClick={() => setSubTab('approved')}>
              <FontAwesomeIcon icon={faCheckCircle} /> Approuvés
              <TabBadge>{approvedReviews.length}</TabBadge>
            </SubTab>
          </SubTabContainer>
          
          {(subTab === 'pending' ? pendingReviews : approvedReviews).length === 0 ? (
            <CardDesc style={{ textAlign: 'center', padding: '2rem' }}>
              {subTab === 'pending' ? 'Aucun avis en attente' : 'Aucun avis approuvé'}
            </CardDesc>
          ) : (
            <Grid $min="300px">
              {(subTab === 'pending' ? pendingReviews : approvedReviews).map(review => (
                <Card key={review.id}>
                  <CardHeader>
                    <CardTitle>{review.name}</CardTitle>
                    <div style={{ color: '#D4AF37' }}>
                      {[...Array(review.rating)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} style={{ marginLeft: 2 }} />
                      ))}
                    </div>
                  </CardHeader>
                  <CardDesc>{review.comment || 'Pas de commentaire'}</CardDesc>
                  <CardDesc style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.5 }}>
                    {new Date(review.created_at).toLocaleDateString('fr-FR')}
                  </CardDesc>
                  <CardActions>
                    {!review.is_approved && (
                      <ActionBtn $small $success onClick={() => approveReview(review.id)}>
                        <FontAwesomeIcon icon={faCheck} /> Approuver
                      </ActionBtn>
                    )}
                    <ActionBtn $small $danger onClick={() => rejectReview(review.id)}>
                      <FontAwesomeIcon icon={faTimes} /> {review.is_approved ? 'Supprimer' : 'Rejeter'}
                    </ActionBtn>
                  </CardActions>
                </Card>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* ==================== EDIT IMAGE MODAL ==================== */}
      {editingImage && (
        <Modal onClose={() => setEditingImage(null)}>
          <SectionTitle>Modifier l'image</SectionTitle>
          <Form onSubmit={e => { e.preventDefault(); updateImage(editingImage.id, editingImage); }}>
            <Select 
              value={editingImage.theme} 
              onChange={e => setEditingImage({ ...editingImage, theme: e.target.value })}
            >
              {categories.map(c => <option key={c.id} value={c.slug}>{c.label}</option>)}
            </Select>
            <Input 
              placeholder="Titre" 
              value={editingImage.title || ''} 
              onChange={e => setEditingImage({ ...editingImage, title: e.target.value })} 
            />
            <TextArea 
              placeholder="Description" 
              value={editingImage.description || ''} 
              onChange={e => setEditingImage({ ...editingImage, description: e.target.value })} 
            />
            <ActionBtn type="submit"><FontAwesomeIcon icon={faSave} /> Enregistrer</ActionBtn>
          </Form>
        </Modal>
      )}

      {/* ==================== EDIT SERVICE MODAL ==================== */}
      {editingService && (
        <Modal onClose={() => setEditingService(null)}>
          <SectionTitle>Modifier le service</SectionTitle>
          <Form onSubmit={e => { e.preventDefault(); updateService(editingService.id, editingService); }}>
            <Select 
              value={editingService.icon} 
              onChange={e => setEditingService({ ...editingService, icon: e.target.value })}
            >
              {ICON_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </Select>
            <Input 
              placeholder="Titre" 
              value={editingService.title} 
              onChange={e => setEditingService({ ...editingService, title: e.target.value })} 
            />
            <TextArea 
              placeholder="Description" 
              value={editingService.description} 
              onChange={e => setEditingService({ ...editingService, description: e.target.value })} 
            />
            <FormRow $cols="1fr 1fr">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
                <input 
                  type="checkbox" 
                  checked={editingService.is_active} 
                  onChange={e => setEditingService({ ...editingService, is_active: e.target.checked })} 
                />
                Actif
              </label>
              <Input 
                type="number" 
                placeholder="Ordre" 
                value={editingService.sort_order || 0} 
                onChange={e => setEditingService({ ...editingService, sort_order: parseInt(e.target.value) || 0 })} 
              />
            </FormRow>
            <ActionBtn type="submit"><FontAwesomeIcon icon={faSave} /> Enregistrer</ActionBtn>
          </Form>
        </Modal>
      )}

      {/* ==================== EDIT CATEGORY MODAL ==================== */}
      {editingCategory && (
        <Modal onClose={() => setEditingCategory(null)}>
          <SectionTitle>Modifier la catégorie</SectionTitle>
          <Form onSubmit={e => { e.preventDefault(); updateCategory(editingCategory.id, editingCategory); }}>
            <Input 
              placeholder="Slug" 
              value={editingCategory.slug} 
              onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value })} 
            />
            <Input 
              placeholder="Label" 
              value={editingCategory.label} 
              onChange={e => setEditingCategory({ ...editingCategory, label: e.target.value })} 
            />
            <FormRow $cols="1fr 1fr">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
                <input 
                  type="checkbox" 
                  checked={editingCategory.is_active} 
                  onChange={e => setEditingCategory({ ...editingCategory, is_active: e.target.checked })} 
                />
                Actif
              </label>
              <Input 
                type="number" 
                placeholder="Ordre" 
                value={editingCategory.sort_order || 0} 
                onChange={e => setEditingCategory({ ...editingCategory, sort_order: parseInt(e.target.value) || 0 })} 
              />
            </FormRow>
            <ActionBtn type="submit"><FontAwesomeIcon icon={faSave} /> Enregistrer</ActionBtn>
          </Form>
        </Modal>
      )}
    </Wrap>
  );
}
