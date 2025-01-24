import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

const Home = () => {
  const { isLoggedIn, userType } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleModal = (setter, value) => () => setter(value);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center', p: 2 }}>
      <Container maxWidth="sm">
        <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Reserva BP
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            {isLoggedIn && userType === 'Cliente' ? 'Agende seu horário com um corretor' : 'Faça login ou crie uma conta para agendar.'}
          </Typography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
            {isLoggedIn && userType === 'Cliente' ? (
              <Typography variant="body1">Explore suas opções no painel do cliente!</Typography>
            ) : (
              <>
                <Grid item>
                  <Button variant="contained" onClick={handleModal(setIsLoginModalOpen, true)}>
                    Login
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={handleModal(setIsRegisterModalOpen, true)}>
                    Cadastro
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Container>
      <LoginModal open={isLoginModalOpen} onClose={handleModal(setIsLoginModalOpen, false)} />
      <RegisterModal open={isRegisterModalOpen} onClose={handleModal(setIsRegisterModalOpen, false)} />
    </Box>
  );
};

export default Home;