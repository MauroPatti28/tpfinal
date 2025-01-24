import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Button, 
  Menu, 
  MenuItem, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  DialogActions, 
  List, 
  ListItem, 
  ListItemText, 
  Typography,
  Avatar
} from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Logo from '../imagenes/Logo.png';
import axios from 'axios';
import "../estilos/chat.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const isAdmin = user?.mail === 'admin@example.com';
  const userInitial = user?.mail?.[0]?.toUpperCase() || '';

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChatOpen = () => {
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setMessage('');
    setChatHistory([]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    const userMessage = { sender: 'Vos', text: message.trim() };
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');
  
    try {
      const res = await axios.post('http://localhost:3000/api/chatbot', { message: userMessage.text });
      const botMessage = { sender: 'El parador', text: res.data.response };
      setChatHistory((prevChatHistory) => [...prevChatHistory, botMessage]);
    } catch (error) {
      console.error('Error en el chat:', error);
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#222' }}>
        <Toolbar>
          <img src={Logo} alt="Logo" style={{ height: '40px', width: '40px' }} />
          
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <img src="./src/imagenes/Parador.png" alt="Parador" style={{ height: '40px' }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Navegación principal */}
            {!isAdmin && (
              <Button color="inherit" component={Link} to="/user-carta">
                User Carta
              </Button>
            )}
            {isAdmin && (
              <Button color="inherit" component={Link} to="/admin-carta">
                Admin Carta
              </Button>
            )}
            
            <Button 
              color="inherit" 
              component={Link} 
              to="/acerca-de-nosotros"
              sx={{ textTransform: 'none' }}
            >
              Acerca de Nosotros
            </Button>
            
            <Button 
              color="inherit" 
              component={Link} 
              to="/reseñas"
              sx={{ textTransform: 'none' }}
            >
              Reseñas
            </Button>
            
            <Button 
              color="inherit" 
              onClick={handleChatOpen}
              sx={{ textTransform: 'none' }}
            >
              Chat en Vivo
            </Button>

            {/* Sección de autenticación */}
            {user ? (
              <>
                <Avatar sx={{ bgcolor: isAdmin ? '#dc3545' : '#007bff' }}>
                  {userInitial}
                </Avatar>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuClick}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <Button 
                variant="contained"
                component={Link} 
                to="/login"
                sx={{ 
                  backgroundColor: '#28a745',
                  '&:hover': { backgroundColor: '#218838' }
                }}
              >
                Acceso Admin
              </Button>
            )}
          </Box>

          {/* Menú desplegable */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: '#2c3e50',
                color: 'white',
                minWidth: '200px'
              }
            }}
          >
            {isAdmin && (
              <MenuItem 
                component={Link} 
                to="/admin-carta" 
                onClick={handleMenuClose}
                sx={{ '&:hover': { backgroundColor: '#34495e' } }}
              >
                Panel Administrativo
              </MenuItem>
            )}
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                color: '#e74c3c',
                '&:hover': { backgroundColor: '#e74c3c', color: 'white' }
              }}
            >
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Diálogo del Chat */}
      <Dialog 
        open={chatOpen} 
        onClose={handleChatClose} 
        fullWidth 
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#2c3e50',
          color: 'white',
          borderBottom: '2px solid #34495e'
        }}>
          <Typography variant="h6">Chat - El Parador</Typography>
        </DialogTitle>
        
        <DialogContent dividers sx={{ height: '60vh', backgroundColor: '#ecf0f1' }}>
          <List sx={{ height: '100%', overflowY: 'auto' }}>
            {chatHistory.map((msg, index) => (
              <ListItem 
                key={index} 
                sx={{ 
                  justifyContent: msg.sender === 'Vos' ? 'flex-end' : 'flex-start',
                  py: 1
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    p: 2,
                    borderRadius: '15px',
                    backgroundColor: msg.sender === 'Vos' ? '#3498db' : '#bdc3c7',
                    color: msg.sender === 'Vos' ? 'white' : '#2c3e50',
                    boxShadow: 1
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    {msg.sender}
                  </Typography>
                  <Typography variant="body1">{msg.text}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        
        <DialogActions sx={{ 
          backgroundColor: '#dfe6e9',
          px: 3,
          py: 2
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Escribe tu mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                backgroundColor: 'white'
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            sx={{
              ml: 2,
              borderRadius: '25px',
              px: 3,
              backgroundColor: '#3498db',
              '&:hover': { backgroundColor: '#2980b9' }
            }}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;