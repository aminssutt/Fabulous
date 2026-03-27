const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_URL = rawApiUrl.replace(/\/+$/, '');
export const MEDIA_URL = (process.env.REACT_APP_MEDIA_URL || `${API_URL}/`).replace(/([^/])$/, '$1/');
