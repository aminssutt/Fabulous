import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTrash, faSignOutAlt, faImages, faPlus } from '@fortawesome/free-solid-svg-icons';

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
  font-size: 2.2rem;
  letter-spacing:.5px;
  @media (max-width: 768px) {
    font-size: 1.8rem;
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
  
`;

// Separate styled components (gallery management)
const GalleryContainer = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 15px;
  padding: 2rem;
`;

const ImageForm = styled.form`
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
  grid-template-columns: 1.2fr 1fr 1fr auto;
  align-items: end;
  font-size:.95rem;
  @media (max-width: 900px){ grid-template-columns: 1fr 1fr auto; }
  @media (max-width: 700px){ grid-template-columns: 1fr; }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 6px;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.9rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 6px;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
`;

const AddButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border: none;
  padding: 0.9rem 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-weight: 600;
  font-size:.95rem;
  letter-spacing:.5px;
  &:hover { opacity: .92; }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(200px,1fr));
  gap: 1rem;
`;

const GalleryItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: #111;
`;

const Thumb = styled.img`
  width: 100%; height: 100%; object-fit: cover; transition: .3s;
  &:hover { transform: scale(1.05); }
`;

const Badge = styled.span`
  position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px; font-size: .7rem; letter-spacing: 1px; text-transform: uppercase; color: ${p=>p.theme.colors.primary};
`;

const DeleteButton = styled.button`
  position: absolute; top: 8px; right: 8px; background: rgba(244,67,54,0.8); color: #fff; border: none; border-radius: 4px; padding: 4px 6px; font-size: .7rem; cursor: pointer; font-weight: 600; letter-spacing: 1px; &:hover { background: #f44336; }
`;

const Helper = styled.p`
  grid-column:1 / -1;
  margin:-.3rem 0 0;
  font-size:.7rem;
  letter-spacing:.5px;
  opacity:.55;
  line-height:1.25;
`;

function AdminDashboard(){
  const navigate = useNavigate();
  const [images,setImages] = useState([]); // {id, url, theme}
  const [form,setForm] = useState({ url:'', theme:'general' });
  const themes = ['general','residential','commercial'];

  // Protect simple session
  useEffect(()=>{
    const logged = localStorage.getItem('adminLogged')==='true';
    if(!logged) navigate('/admin');
  },[navigate]);

  // Load from localStorage (backward compatibility: older entries may have data: base64)
  useEffect(()=>{
    try{
      const stored = JSON.parse(localStorage.getItem('galleryImages')||'[]');
      const normalized = Array.isArray(stored) ? stored.map(it=> ({
        id: it.id || Date.now().toString(36)+Math.random().toString(36).slice(2),
        theme: it.theme || 'general',
        url: it.url || it.data || ''
      })) : [];
      setImages(normalized);
      if(!normalized.length){
        fetch('/gallery.json')
          .then(r=> r.ok ? r.json(): [])
          .then(data=> { if(Array.isArray(data) && data.length){
            const norm = data.map(it=> ({ id: it.id || Date.now().toString(36)+Math.random().toString(36).slice(2), theme: it.theme || 'general', url: it.url || it.data || '' }));
            setImages(norm);
          } })
          .catch(()=>{});
      }
    }catch(e){ console.warn('Erreur lecture stockage local',e); }
  },[]);

  const persist = (list)=>{
    setImages(list);
    localStorage.setItem('galleryImages', JSON.stringify(list));
    try { window.dispatchEvent(new Event('gallery-update')); } catch{}
  };

  // --- Normalisation & validation d'URL (focus Imgur) ---
  const normalizeUrl = (raw) => {
    const url = raw.trim();
    if(!url) throw new Error('URL vide');
    if(/https?:\/\/imgur\.com\/(a|gallery)\//i.test(url)) {
      throw new Error("Lien d'album Imgur (imgur.com/a/...). Ouvrir l'image seule puis copier le lien direct.");
    }
    const single = url.match(/^https?:\/\/imgur\.com\/([A-Za-z0-9]+)$/);
    if(single) return `https://i.imgur.com/${single[1]}.jpg`;
    const base = url.split('?')[0];
    const hasImageExt = /\.(jpe?g|png|webp|gif|avif)$/i.test(base);
    if(url.includes('i.imgur.com') && !hasImageExt) {
      throw new Error('Lien i.imgur.com sans extension (.jpg/.png/.webp).');
    }
    return url;
  };

  const testImageLoads = (url) => new Promise((resolve,reject)=>{
    const img = new Image();
    const timer = setTimeout(()=> reject(new Error('Timeout de chargement')), 8000);
    img.onload = ()=> { clearTimeout(timer); resolve(true); };
    img.onerror = ()=> { clearTimeout(timer); reject(new Error('Impossible de charger cette image.')); };
    img.src = url;
  });

  const addImage = async (e)=>{
    e.preventDefault();
    if(!form.url.trim()) { alert('Coller une URL directe vers une image.'); return; }
    let finalUrl;
    try {
      finalUrl = normalizeUrl(form.url);
      await testImageLoads(finalUrl);
    } catch(err){
      alert(err.message);
      return;
    }
    const item = { id: Date.now().toString(36), theme: form.theme, url: finalUrl };
    persist([item, ...images]);
    setForm({ url:'', theme: form.theme });
  };

  const removeImage = (id)=>{
    if(!window.confirm('Supprimer cette image ?')) return;
    persist(images.filter(i=>i.id!==id));
  };

  const logout = ()=>{ localStorage.removeItem('adminLogged'); navigate('/admin'); };

  // --- Export / Import / Clear helpers (static hosting strategy) ---
  const exportGallery = () => {
    try{
      const data = JSON.stringify(images, null, 2);
      const blob = new Blob([data], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'gallery-export.json'; a.click();
      URL.revokeObjectURL(url);
    }catch(err){ alert('Export impossible'); }
  };

  const importGallery = (file) => {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target.result);
        if(!Array.isArray(json)) throw new Error('Format');
        // basic shape normalization
        const cleaned = json.filter(it=> (it.url||it.data) && it.theme).map(it=> ({
          id: it.id || Date.now().toString(36)+Math.random().toString(36).slice(2),
          url: it.url || undefined,
          data: it.data || undefined,
          theme: themes.includes(it.theme)? it.theme : 'general'
        }));
        persist(cleaned);
        alert('Import réussi');
      } catch(err){ alert('Fichier invalide'); }
    };
    reader.readAsText(file);
  };

  const clearGallery = () => {
    if(window.confirm('Vider totalement la galerie ?')){
      persist([]);
    }
  };

  const hiddenInputId = 'import-gallery-input';

  return (
    <DashboardContainer>
      <Header>
        <Title>Administration</Title>
        <Nav>
          <NavButton $isHome onClick={()=>navigate('/')}> <FontAwesomeIcon icon={faHome}/> Accueil</NavButton>
          <NavButton onClick={logout}><FontAwesomeIcon icon={faSignOutAlt}/> Déconnexion</NavButton>
        </Nav>
      </Header>
      <GalleryContainer>
        <h2 style={{color:'#D4AF37',marginTop:0,marginBottom:'1.5rem',fontSize:'1.6rem',display:'flex',alignItems:'center',gap:'.6rem'}}>
          <FontAwesomeIcon icon={faImages}/> Gestion de la galerie
        </h2>
        <div style={{display:'flex',flexWrap:'wrap',gap:'.6rem',marginBottom:'1rem'}}>
          <button type="button" onClick={exportGallery} style={actionBtnStyle}>Exporter JSON</button>
          <button type="button" onClick={()=> document.getElementById(hiddenInputId).click()} style={actionBtnStyle}>Importer JSON</button>
          <button type="button" onClick={clearGallery} style={{...actionBtnStyle,background:'rgba(244,67,54,0.15)',color:'#f44336',border:'1px solid #f44336'}}>Vider</button>
          <input id={hiddenInputId} type="file" accept="application/json" style={{display:'none'}} onChange={e=> importGallery(e.target.files?.[0])} />
          <small style={{opacity:.55,width:'100%',fontSize:'.65rem',letterSpacing:'.5px'}}>Exporter puis commiter le fichier (public/gallery.json) dans GitHub pour rendre la galerie persistante sur GitHub Pages.</small>
        </div>
        <ImageForm onSubmit={addImage}>
          <Input placeholder="URL directe (ex: https://i.imgur.com/xxxxx.jpg)" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} />
          <Select value={form.theme} onChange={e=>setForm({...form,theme:e.target.value})}> 
            {themes.map(t=> <option key={t} value={t}>{t}</option>)}
          </Select>
          <AddButton type="submit"><FontAwesomeIcon icon={faPlus}/> Ajouter</AddButton>
          <Helper>
            Imgur: ouvrir l'image seule (pas un album). Si tu as un lien comme imgur.com/a/XXXX, clique l'image, puis clic droit "Ouvrir l'image dans un nouvel onglet" et copie l'URL qui commence par i.imgur.com et finit par .jpg / .png / .webp.
          </Helper>
        </ImageForm>
        {images.length===0 && <p style={{opacity:.7}}>Aucune image pour le moment. Ajoutez-en avec le formulaire ci-dessus.</p>}
        <GalleryGrid>
          {images.map(img=> (
            <GalleryItem key={img.id}>
              <Thumb src={img.url} alt={img.theme} />
              <Badge>{img.theme}</Badge>
              <DeleteButton onClick={()=>removeImage(img.id)}>Suppr</DeleteButton>
            </GalleryItem>
          ))}
        </GalleryGrid>
      </GalleryContainer>
    </DashboardContainer>
  );
}

// Inline style object for utility buttons
const actionBtnStyle = {
  background:'rgba(212,175,55,0.12)',
  color:'#D4AF37',
  border:'1px solid rgba(212,175,55,0.4)',
  padding:'.55rem .9rem',
  borderRadius:'6px',
  fontSize:'.7rem',
  letterSpacing:'.5px',
  cursor:'pointer',
  fontWeight:600,
  textTransform:'uppercase'
};

export default AdminDashboard;