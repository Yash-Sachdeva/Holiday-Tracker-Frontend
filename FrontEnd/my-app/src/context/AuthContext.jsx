import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const Response = await fetch('http://localhost:8000/as/auth/session', {
        credentials: 'include'
      });
      const data = await Response.json();
      
      if (data.isLoggedIn) {
        setIsAuthenticated(true);
        setUserRole(data.role.replace('ROLE_', ''));
        setIsLoading(false);
        return;
      }
      setIsAuthenticated(false);
      setUserRole(null);
    } catch (error) {
      console.error('Session check error:', error);
      setIsAuthenticated(false);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8000/as/logout', {
        method: 'POST',
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Logout failed:', errorText);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };
  

  const value = {
    isAuthenticated,
    isLoading,
    userRole,
    login,
    logout,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

