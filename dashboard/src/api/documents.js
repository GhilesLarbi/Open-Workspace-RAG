import api from './axios';

/**
 * Get paginated documents for a workspace
 * @param {string} workspaceSlug 
 * @param {number} skip 
 * @param {number} limit 
 */
export const getDocuments = async (workspaceSlug, skip = 0, limit = 10) => {
  const response = await api.get(`/documents/${workspaceSlug}`, {
    params: { skip, limit }
  });
  return response.data;
};

/**
 * Scrape and add a single document URL
 * @param {string} workspaceSlug 
 * @param {string} url 
 */
export const addSingleDocument = async (workspaceSlug, url) => {
  const response = await api.post(`/documents/${workspaceSlug}`, null, {
    params: { url }
  });
  return response.data;
};

/**
 * Trigger deep scrape for the workspace
 * @param {string} workspaceSlug 
 * @param {number} maxPages 
 * @param {number} depth 
 */
export const scrapeWorkspace = async (workspaceSlug, maxPages = 1000, depth = 10) => {
  const response = await api.post(`/documents/${workspaceSlug}/scrape`, null, {
    params: { max_pages: maxPages, depth }
  });
  return response.data;
};