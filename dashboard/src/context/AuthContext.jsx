/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import { 
  loginOrganization, 
  registerOrganization, 
  getMyOrganization 
} from '../api/organization';

// ADDED EXPORT BACK HERE
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const orgData = await getMyOrganization();
          if (isMounted) setUser(orgData);
        } catch {
          localStorage.removeItem('token');
          if (isMounted) setUser(null);
        }
      }
      if (isMounted) setLoading(false);
    };
    initAuth();
    return () => { isMounted = false; };
  }, []);

  const login = async (email, password) => {
    const data = await loginOrganization(email, password);
    localStorage.setItem('token', data.access_token);
    setUser(data.organization);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerOrganization(name, email, password);
    localStorage.setItem('token', data.access_token);
    setUser(data.organization);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};