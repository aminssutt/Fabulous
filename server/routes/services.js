const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all services (public - only active)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors du chargement des services:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET all services (admin - all)
router.get('/admin/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors du chargement des services:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST create service (admin)
router.post('/', async (req, res) => {
  try {
    const { icon, title, description, sort_order, is_active } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Titre et description requis' });
    }
    
    const { data, error } = await supabase
      .from('services')
      .insert([{ 
        icon: icon || 'faGem', 
        title, 
        description, 
        sort_order: sort_order || 0,
        is_active: is_active !== false
      }])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Erreur lors de la création du service:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT update service (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title, description, sort_order, is_active } = req.body;
    
    const { data, error } = await supabase
      .from('services')
      .update({ icon, title, description, sort_order, is_active })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE service (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du service:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
