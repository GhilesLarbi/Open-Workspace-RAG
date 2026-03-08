import api from './axios';

export const getWorkspaces = async () => {
  const response = await api.get('/workspaces/');
  return response.data;
};

/**
 * @param {string} slug 
 */
export const getWorkspaceBySlug = async (slug) => {
  const response = await api.get(`/workspaces/${slug}`);
  return response.data;
};

/**
 * @param {string} name 
 * @param {string} slug 
 * @param {string} url 
 */
export const createWorkspace = async (name, slug, url) => {
  const response = await api.post('/workspaces/', { name, slug, url });
  return response.data;
};

/**
 * @param {string} currentSlug - The slug used for the URL path
 * @param {Object} updates - { name, slug, url }
 */
export const updateWorkspace = async (currentSlug, { name, slug, url }) => {
  const response = await api.patch(`/workspaces/${currentSlug}`, { name, slug, url });
  return response.data;
};

/**
 * @param {string} slug 
 */
export const deleteWorkspace = async (slug) => {
  const response = await api.delete(`/workspaces/${slug}`);
  return response.data;
};