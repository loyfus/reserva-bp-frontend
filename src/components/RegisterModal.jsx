import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Box, TextField, Button, Typography, MenuItem, IconButton, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

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

const RegisterModal = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/usuario/register`, {
          nome: name,
          email,
          senha: password,
          tipo: userType,
        });
        toast.success('Usuário registrado com sucesso!');
        onClose();
      } catch (error) {
        toast.error(error.response ? error.response.data.message : 'Erro ao registrar usuário. Tente novamente.');
      } finally {
        setLoading(false);
      }
    },
    [name, email, password, userType, onClose]
  );

  const InputField = useMemo(
    () =>
      ({ icon, label, value, onChange, type = 'text', required = true, select = false, children }) => (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {icon}
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {label}
            </Typography>
          </Box>
          <TextField
            fullWidth
            value={value}
            onChange={onChange}
            type={type}
            required={required}
            select={select}
            sx={{ borderRadius: 2 }}
          >
            {children}
          </TextField>
        </Box>
      ),
    []
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          Cadastro
        </Typography>
        <form onSubmit={handleSubmit}>
          <InputField
            icon={<PersonIcon sx={{ color: 'primary.main', mr: 1 }} />}
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            icon={<EmailIcon sx={{ color: 'primary.main', mr: 1 }} />}
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <InputField
            icon={<LockIcon sx={{ color: 'primary.main', mr: 1 }} />}
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <InputField
            icon={<AssignmentIndIcon sx={{ color: 'primary.main', mr: 1 }} />}
            label="Tipo de Usuário"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            select
          >
            <MenuItem value="Cliente">Cliente</MenuItem>
            <MenuItem value="Corretor">Corretor</MenuItem>
          </InputField>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Cadastrar'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default RegisterModal;