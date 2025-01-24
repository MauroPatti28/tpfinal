import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
  const [mail, setMail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', 
        {
          mail: mail.toLowerCase().trim(), // Normaliza el email
          contraseña: contraseña.trim()     // Elimina espacios
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        login(response.data.token, response.data.user.mail); // Usar mail del backend
        navigate(response.data.user.role === 'admin' ? '/Admin-Carta' : '/Platos');
      }
    } catch (error) {
      console.error('Error completo:', error);
      alert(error.response?.data?.error || 'Error desconocido');
    }
  };

  return (
    <div className="container">
      <h1>INICIAR SESIÓN</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={mail}
          onChange={(e) => setMail(e.target.value.trim())} // Limpia espacios
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;