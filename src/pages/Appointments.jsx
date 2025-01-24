import React from 'react';
import AppointmentList from '../components/AppointmentList';
import { useAuth } from '../AuthContext';
import { Box, Typography, CircularProgress, Container } from '@mui/material';

const Appointments = () => {
  const { userId, userType, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress color="primary" size={60} thickness={4} />
      </Box>
    );
  }

  if (!userId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={4}>
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: 3,
            p: 5,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#007BFF' }}>
            Você não está autenticado.
          </Typography>
          <Typography variant="body1" sx={{ color: '#555' }}>
            Por favor, faça login para visualizar seus agendamentos.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={4}>
      <Container
        maxWidth="md"
        sx={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: 3,
          p: 5,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#007BFF', textAlign: 'center', mb: 4 }}
        >
          Agendamentos
        </Typography>
        <AppointmentList userId={userId} userType={userType} />
      </Container>
    </Box>
  );
};

export default Appointments;
