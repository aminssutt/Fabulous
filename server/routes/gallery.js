const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../config/supabase');
const crypto = require('crypto');
const FileType = require('file-type');
const sharp = require('sharp');
const { authenticateAdmin } = require('../middleware/auth');

// Configuration Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.'));
    }
  }
});

// GET - Récupérer toutes les images de la galerie
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      // Si la table n'existe pas, renvoyer un tableau vide
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return res.json([]);
      }
      throw error;
    }

    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des images',
      error: error.message 
    });
  }
});

// POST - Upload d'une nouvelle image (protégé)
router.post('/upload', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const { theme, title, description } = req.body;
    if (!theme) {
      return res.status(400).json({ message: 'Catégorie requise' });
    }

    // Validate actual file content (magic bytes check)
    const fileTypeResult = await FileType.fromBuffer(req.file.buffer);
    if (!fileTypeResult || !['image/jpeg', 'image/png', 'image/webp'].includes(fileTypeResult.mime)) {
      return res.status(400).json({ message: 'Le fichier n\'est pas une image valide.' });
    }

    // Process image: resize if too large, strip metadata, convert to WebP
    let processedBuffer = req.file.buffer;
    let finalMime = fileTypeResult.mime;
    let finalExt = fileTypeResult.ext;

    try {
      const metadata = await sharp(req.file.buffer).metadata();
      let pipeline = sharp(req.file.buffer).rotate();

      if (metadata.width > 1920 || metadata.height > 1920) {
        pipeline = pipeline.resize(1920, 1920, { fit: 'inside', withoutEnlargement: true });
      }

      pipeline = pipeline.webp({ quality: 85 });
      processedBuffer = await pipeline.toBuffer();
      finalMime = 'image/webp';
      finalExt = 'webp';
    } catch (err) {
      console.error('Image processing failed, using original:', err.message);
    }

    // Générer un nom de fichier unique
    const fileName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${finalExt}`;
    const filePath = `gallery/${fileName}`;

    // Upload vers Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, processedBuffer, {
        contentType: finalMime,
        cacheControl: 'public, max-age=31536000, immutable',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    // Enregistrer dans la base de données
    const { data: dbData, error: dbError } = await supabase
      .from('gallery_images')
      .insert([
        {
          url: publicUrl,
          theme: theme,
          filename: fileName,
          storage_path: filePath,
          title: title || null,
          description: description || null
        }
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    res.status(201).json(dbData);
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'upload de l\'image',
      error: error.message 
    });
  }
});

// PUT - Mettre à jour une image (protégé)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, theme } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (theme !== undefined) updateData.theme = theme;

    const { data, error } = await supabase
      .from('gallery_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de l\'image',
      error: error.message 
    });
  }
});

// DELETE - Supprimer une image (protégé)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer l'image pour obtenir le chemin de stockage
    const { data: image, error: fetchError } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!image) {
      return res.status(404).json({ message: 'Image non trouvée' });
    }

    // Supprimer du storage
    const { error: storageError } = await supabase.storage
      .from('images')
      .remove([image.storage_path]);

    if (storageError) {
      console.error('Erreur lors de la suppression du storage:', storageError);
    }

    // Supprimer de la base de données
    const { error: deleteError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.json({ message: 'Image supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de l\'image',
      error: error.message 
    });
  }
});

module.exports = router;
