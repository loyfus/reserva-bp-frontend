import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Modal, Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none',
};

const LoginModal = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/usuario/login`, { email, senha });
      const { token } = response.data;

      if (token) {
        const decodedToken = jwtDecode(token);
        const { userId, tipo } = decodedToken;

        localStorage.setItem('token', token);
        login({ _id: userId, tipo }, token);

        toast.success('Login realizado com sucesso!');
        onClose();
        navigate('/appointments');
      } else {
        toast.error('Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro no login:', error.response ? error.response.data : error);
      toast.error(error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            type="email"
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            }}
            required
            sx={{ mb: 3 }}
          />
          <TextField
            type="password"
            label="Senha"
            fullWidth
            value={senha}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            }}
            required
            sx={{ mb: 4 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ py: 1.5, fontWeight: 'bold' }}
          >
            Entrar
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default LoginModal;