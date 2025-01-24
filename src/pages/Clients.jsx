import React, { useState, useEffect } from 'react';
import ClientList from '../components/ClientList';
import { Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/usuario/usuarios`);
        setClients(response.data);
      } catch (err) {
        setError('Erro ao carregar os clientes. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={4}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: '12px', boxShadow: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={4}>
      <Box sx={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: 3, p: 5, width: '100%', maxWidth: '800px' }}>
        <ClientList clients={clients} />
      </Box>
    </Box>
  );
};

export default Clients;