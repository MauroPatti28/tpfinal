import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './componentes/Navbar';
import AdminCarta from './componentes/AdminCarta';
import UserCarta from './componentes/UserCarta';
import AcercaDeNosotros from './componentes/AcercaDeNosotros';
import Reseñas from './componentes/Reseñas';
import Login from './componentes/Login';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.mail !== 'admin@example.com') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AnimatePresenceWrapper = ({ children }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        {children}
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ marginTop: '64px' }}>
          <AnimatePresenceWrapper>
            {/* Ruta principal */}
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UserCarta />
                </motion.div>
              }
            />
            
            {/* Login */}
            <Route
              path="/login"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Login />
                </motion.div>
              }
            />
            
            {/* Admin */}
            <Route
              path="/admin-carta"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AdminRoute>
                    <AdminCarta />
                  </AdminRoute>
                </motion.div>
              }
            />
            
            {/* User Carta */}
            <Route
              path="/user-carta"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UserCarta />
                </motion.div>
              }
            />
            
            {/* Acerca de Nosotros - Corregido */}
            <Route
              path="/acerca-de-nosotros" // ← Ruta actualizada
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AcercaDeNosotros />
                </motion.div>
              }
            />
            
            {/* Reseñas */}
            <Route
              path="/reseñas"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Reseñas />
                </motion.div>
              }
            />

          </AnimatePresenceWrapper>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;