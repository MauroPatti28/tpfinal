import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Inicializar como null

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Solo establecer usuario si es admin
        if (decoded.mail === 'admin@example.com') {
          setUser({
            mail: decoded.mail,
            role: 'admin'
          });
        } else {
          localStorage.removeItem('token'); // Eliminar token no válido
        }
      } catch (error) {
        console.error('Token inválido:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token, mail) => {
    // Solo permitir login si es admin
    if (mail === 'admin@example.com') {
      localStorage.setItem('token', token);
      setUser({ mail, role: 'admin' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 