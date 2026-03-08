import api from './axios';

/**
 * Register a new organization
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 */
export const registerOrganization = async (name, email, password) => {
  const response = await api.post('/organizations/', { name, email, password });
  return response.data;
};

/**
 * Login to an organization (FastAPI OAuth2 compatible)
 * @param {string} email 
 * @param {string} password 
 */
export const loginOrganization = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await api.post('/organizations/login', formData);
  return response.data;
};

/**
 * Get current organization details via token
 */
export const getMyOrganization = async () => {
  const response = await api.get('/organizations/me');
  return response.data;
};

/**
 * Delete the current organization
 */
export const deleteMyOrganization = async () => {
  const response = await api.delete('/organizations/');
  return response.data;
};