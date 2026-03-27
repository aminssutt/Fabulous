const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateAdmin } = require('../middleware/auth');

// Récupérer tout le contenu (public)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .order('key', { ascending: true });
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Récupérer un contenu spécifique par key
router.get('/:key', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .eq('key', req.params.key)
            .single();
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Mettre à jour un contenu (authentifié)
router.put('/:key', authenticateAdmin, async (req, res) => {
    try {
        const { title, content } = req.body;
        
        const { data, error } = await supabase
            .from('site_content')
            .update({
                title,
                content,
                updated_at: new Date().toISOString()
            })
            .eq('key', req.params.key)
            .select()
            .single();
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Créer un nouveau contenu (authentifié)
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const { key, title, content } = req.body;
        
        const { data, error } = await supabase
            .from('site_content')
            .insert({
                key,
                title,
                content
            })
            .select()
            .single();
        
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating content:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer un contenu (authentifié)
router.delete('/:key', authenticateAdmin, async (req, res) => {
    try {
        const { error } = await supabase
            .from('site_content')
            .delete()
            .eq('key', req.params.key);
        
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
