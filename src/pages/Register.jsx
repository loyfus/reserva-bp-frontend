import React, { useState } from 'react';
import RegisterModal from '../components/RegisterModal';
import { Box, Button, Typography } from '@mui/material';

const Register = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleOpenModal = () => setIsRegisterModalOpen(true);
  const handleCloseModal = () => setIsRegisterModalOpen(false);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" p={4}>
      <Box sx={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', p: 5, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#007BFF', mb: 4 }}>
          Crie sua conta no Reserva BP
        </Typography>
        <Button variant="contained" onClick={handleOpenModal} sx={{ px: 6, py: 1.5, borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Abrir Cadastro
        </Button>
      </Box>
      <RegisterModal open={isRegisterModalOpen} onClose={handleCloseModal} />
    </Box>
  );
};

export default Register;