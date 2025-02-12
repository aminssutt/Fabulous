// Utilitaires pour la gestion sécurisée de l'authentification
import { jwtDecode } from 'jwt-decode';

// Fonction pour encoder les caractères spéciaux (protection XSS)
const encodeHTML = (str) => {
  return str.replace(/[&<>"']/g, (match) => {
    const escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escape[match];
  });
};

// Stockage sécurisé du token
export const setAuthToken = (token) => {
  if (token) {
    try {
      // Vérifier la validité du token avant de le stocker
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      
      if (decoded.exp && decoded.exp < now) {
        throw new Error('Token expiré');
      }
      
      // Stocker le token de manière sécurisée
      sessionStorage.setItem('authToken', token);
      return true;
    } catch (error) {
      console.error('Erreur lors du stockage du token:', error);
      return false;
    }
  }
  return false;
};

// Récupération sécurisée du token
export const getAuthToken = () => {
  try {
    const token = sessionStorage.getItem('authToken');
    if (!token) return null;

    // Vérifier si le token est toujours valide
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    
    if (decoded.exp && decoded.exp < now) {
      // Token expiré, le supprimer
      sessionStorage.removeItem('authToken');
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    sessionStorage.removeItem('authToken');
    return null;
  }
};

// Suppression sécurisée du token
export const removeAuthToken = () => {
  try {
    sessionStorage.removeItem('authToken');
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du token:', error);
    return false;
  }
};

// Vérification de l'authentification
export const isAuthenticated = () => {
  return getAuthToken() !== null;
};

// Nettoyage des données utilisateur (protection XSS)
export const sanitizeUserInput = (input) => {
  if (typeof input === 'string') {
    return encodeHTML(input.trim());
  }
  if (typeof input === 'object' && input !== null) {
    return Object.keys(input).reduce((acc, key) => {
      acc[key] = sanitizeUserInput(input[key]);
      return acc;
    }, {});
  }
  return input;
};

// Gestion sécurisée des erreurs
export const handleAuthError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        removeAuthToken();
        return 'Session expirée. Veuillez vous reconnecter.';
      case 403:
        return 'Accès non autorisé.';
      case 429:
        return 'Trop de tentatives. Veuillez réessayer plus tard.';
      default:
        return 'Une erreur est survenue. Veuillez réessayer.';
    }
  }
  return 'Erreur de connexion au serveur.';
}; 