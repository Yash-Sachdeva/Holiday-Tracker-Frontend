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
      // Try admin session
      const adminResponse = await fetch('http://localhost:8080/auth/admin/session', {
        credentials: 'include'
      });
      const adminData = await adminResponse.text();
      
      if (adminData.includes('User is logged in')) {
        setIsAuthenticated(true);
        setUserRole('ADMIN');
        setIsLoading(false);
        return;
      }

      // Try HR session
      const hrResponse = await fetch('http://localhost:8080/auth/session/hr', {
        credentials: 'include'
      });
      const hrData = await hrResponse.text();

      if (hrData.includes('User is logged in')) {
        setIsAuthenticated(true);
        setUserRole('HR');
        setIsLoading(false);
        return;
      }

      // Try employee session
      const employeeResponse = await fetch('http://localhost:8080/auth/session/employee', {
        credentials: 'include'
      });
      const employeeData = await employeeResponse.text();
      
      if (employeeData.includes('User is logged in')) {
        setIsAuthenticated(true);
        setUserRole('EMPLOYEE');
        setIsLoading(false);
        return;
      }

      // If no session is found
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
      let endpoint;
      switch (userRole) {
        case 'HR':
          endpoint = 'http://localhost:8080/auth/logout/hr';
          break;
        case 'ADMIN':
          endpoint = 'http://localhost:8080/auth/admin/logout';
          break;
        case 'EMPLOYEE':
          endpoint = 'http://localhost:8080/auth/logout/employee';
          break;
        default:
          endpoint = 'http://localhost:8080/auth/logout';
      }

      await fetch(endpoint, {
        credentials: 'include'
      });
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

