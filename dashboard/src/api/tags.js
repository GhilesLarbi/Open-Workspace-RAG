import api from './axios';

/**
 * Add a new tag to the workspace
 * @param {string} workspaceSlug 
 * @param {string} path - dot notation (e.g. 'engineering.docs')
 */
export const addTagToWorkspace = async (workspaceSlug, path) => {
  const response = await api.post(`/tags/${workspaceSlug}`, null, {
    params: { path }
  });
  return response.data;
};

/**
 * Remove a tag and its sub-hierarchy
 * @param {string} workspaceSlug 
 * @param {string} path 
 */
export const removeTagFromWorkspace = async (workspaceSlug, path) => {
  const response = await api.delete(`/tags/${workspaceSlug}`, {
    params: { path }
  });
  return response.data;
};

/**
 * Rename a tag hierarchy
 * @param {string} workspaceSlug 
 * @param {string} oldPath 
 * @param {string} newPath 
 */
export const renameTagInWorkspace = async (workspaceSlug, oldPath, newPath) => {
  const response = await api.patch(`/tags/${workspaceSlug}`, null, {
    params: { 
      old_path: oldPath, 
      new_path: newPath 
    }
  });
  return response.data;
};