const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all categories (public - only active)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET all categories (admin - all)
router.get('/admin/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST create category (admin)
router.post('/', async (req, res) => {
  try {
    const { slug, label, sort_order, is_active } = req.body;
    
    if (!slug || !label) {
      return res.status(400).json({ error: 'Slug et label requis' });
    }
    
    // Vérifier unicité du slug
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (existing) {
      return res.status(400).json({ error: 'Ce slug existe déjà' });
    }
    
    const { data, error } = await supabase
      .from('categories')
      .insert([{ 
        slug, 
        label, 
        sort_order: sort_order || 0,
        is_active: is_active !== false
      }])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT update category (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, label, sort_order, is_active } = req.body;
    
    const { data, error } = await supabase
      .from('categories')
      .update({ slug, label, sort_order, is_active })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE category (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
