/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { getWorkspaces } from '../api/workspace';
import { AuthContext } from './AuthContext';

export const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchedForUser = useRef(null);

  const refreshWorkspaces = useCallback(async () => {
    try {
      const data = await getWorkspaces();
      setWorkspaces(data);
      return data;
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setLoading(false);
      fetchedForUser.current = null;
      return;
    }

    const init = async () => {
      // Only fetch if we haven't fetched for this specific user yet
      if (fetchedForUser.current !== user.id) {
        setLoading(true);
        const list = await refreshWorkspaces();
        if (list && list.length > 0) {
          setCurrentWorkspace(list[0]);
        }
        fetchedForUser.current = user.id;
        setLoading(false);
      }
    };

    init();
  }, [user, authLoading, refreshWorkspaces]);

  return (
    <WorkspaceContext.Provider value={{ 
      workspaces, 
      currentWorkspace, 
      setCurrentWorkspace, 
      refreshWorkspaces,
      loading 
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);