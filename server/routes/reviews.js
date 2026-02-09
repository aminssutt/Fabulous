const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { Resend } = require('resend');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

// Configuration Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Rate limiter spécifique pour les avis - max 3 avis par heure par IP
const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 avis maximum par heure
  message: {
    error: 'Vous avez atteint la limite d\'avis. Veuillez réessayer plus tard.',
    message: 'Trop de soumissions. Veuillez patienter avant de soumettre un nouvel avis.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Utiliser l'IP ou l'email comme clé
    return req.body?.email || req.ip;
  }
});

// Middleware pour protéger les routes admin
const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    req.adminEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

// Fonction pour anonymiser un nom
const anonymizeName = (name) => {
  if (!name || name.length < 2) return 'Client';
  const firstName = name.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();
  const lastChar = firstName.slice(-1).toLowerCase();
  return `${initial}***${lastChar}.`;
};

// Fonction pour envoyer un email de notification pour un nouvel avis
const sendReviewNotification = async (review) => {
  if (!ADMIN_EMAIL || !process.env.RESEND_API_KEY) {
    console.log('⚠️ Configuration email manquante - notification non envoyée');
    console.log('  ADMIN_EMAIL:', ADMIN_EMAIL ? '✓' : '✗');
    console.log('  RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✓' : '✗');
    return;
  }

  const stars = '⭐'.repeat(review.rating);
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <h2 style="color: #D4AF37; text-align: center; margin-bottom: 30px;">💬 Nouvel Avis Client - En Attente d'Approbation</h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 8px 0;"><strong>Client:</strong> ${review.name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> ${review.email}</p>
          <p style="margin: 8px 0;"><strong>Note:</strong> ${stars} (${review.rating}/5)</p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px; color: #333;">Commentaire:</h4>
          <p style="margin: 0; color: #555; font-style: italic;">"${review.comment || 'Aucun commentaire'}"</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; margin-bottom: 20px;">Cet avis est en attente de validation. Connectez-vous à l'administration pour l'approuver ou le refuser.</p>
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/dashboard" 
             style="display: inline-block; background: linear-gradient(135deg, #D4AF37, #AA771C); color: #fff; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Gérer les avis
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">Fabulous Creations Design - Notification automatique</p>
      </div>
    </body>
    </html>
  `;

  try {
    console.log('📧 Envoi de notification email à:', ADMIN_EMAIL);
    
    const { data, error } = await resend.emails.send({
      from: 'Fabulous <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `📝 Nouvel avis ${stars} de ${review.name} - En attente`,
      html: htmlContent
    });
    
    if (error) {
      console.error('⚠️ Erreur Resend:', error);
    } else {
      console.log('✅ Email de notification envoyé avec succès! ID:', data?.id);
    }
  } catch (error) {
    console.error('⚠️ Erreur envoi email notification:', error.message);
  }
};

// GET - Récupérer les avis approuvés (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, name, rating, comment, created_at')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Anonymiser les noms pour l'affichage public
    const anonymizedReviews = (data || []).map(review => ({
      ...review,
      name: anonymizeName(review.name),
      // Ne pas exposer l'email
    }));

    res.json(anonymizedReviews);
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des avis',
      error: error.message 
    });
  }
});

// GET - Récupérer tous les avis (admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des avis',
      error: error.message 
    });
  }
});

// GET - Récupérer les avis en attente (admin)
router.get('/admin/pending', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des avis en attente:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des avis',
      error: error.message 
    });
  }
});

// POST - Créer un nouvel avis (avec rate limiting)
router.post('/', reviewLimiter, async (req, res) => {
  try {
    const { name, email, rating, comment } = req.body;

    // Validation
    if (!name || !rating) {
      return res.status(400).json({ message: 'Nom et note sont requis' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
    }

    // Vérifier si cet email a déjà soumis un avis récemment (24h)
    if (email) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data: existingReviews, error: checkError } = await supabase
        .from('reviews')
        .select('id')
        .eq('email', email)
        .gte('created_at', yesterday.toISOString());

      if (!checkError && existingReviews && existingReviews.length > 0) {
        return res.status(429).json({ 
          message: 'Vous avez déjà soumis un avis récemment. Veuillez patienter 24h.' 
        });
      }
    }

    // Créer l'avis avec is_approved = false par défaut
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          name: name.trim(),
          email: email?.trim() || 'anonyme@fabulous.com',
          rating: parseInt(rating),
          comment: comment?.trim() || '',
          is_approved: false // En attente de validation
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Envoyer un email de notification à l'admin
    await sendReviewNotification(data);

    res.status(201).json({
      ...data,
      message: 'Merci pour votre avis ! Il sera publié après validation par notre équipe.'
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'avis:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'avis',
      error: error.message 
    });
  }
});

// PUT - Approuver un avis (admin)
router.put('/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      message: 'Avis approuvé avec succès',
      review: data 
    });
  } catch (error) {
    console.error('Erreur lors de l\'approbation:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'approbation de l\'avis',
      error: error.message 
    });
  }
});

// PUT - Rejeter un avis (admin) - supprime l'avis
router.put('/:id/reject', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Avis rejeté et supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors du rejet:', error);
    res.status(500).json({ 
      message: 'Erreur lors du rejet de l\'avis',
      error: error.message 
    });
  }
});

// DELETE - Supprimer un avis (admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Avis supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de l\'avis',
      error: error.message 
    });
  }
});

module.exports = router;
