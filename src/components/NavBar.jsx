import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useAuth } from '../AuthContext';
import AppointmentForm from './AppointmentForm';
import LogoutIcon from '@mui/icons-material/Logout';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userType, logout, userId } = useAuth();
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderButton = (label, icon, onClick, to = null) => (
    <Button
      color="inherit"
      component={to ? Link : 'button'}
      to={to}
      onClick={onClick}
      sx={{ 
        color: 'primary.main', 
        '&:hover': { 
          backgroundColor: 'rgba(0, 123, 255, 0.1)', 
          transform: 'scale(1.05)', 
        },
        transition: 'all 0.3s ease',
        borderRadius: '12px',
        px: 2,
        py: 1,
      }}
      startIcon={icon}
    >
      {isMobile ? label.split(' ')[0] : label}
    </Button>
  );

  const renderClientButtons = () => (
    <>
      {renderButton('Criar Agendamento', <AddIcon />, () => setShowAppointmentForm(!showAppointmentForm))}
      {renderButton('Meus Agendamentos', <ListAltIcon />, null, "/appointments")}
    </>
  );

  const renderCorretorButtons = () => (
    <>
      {renderButton('Lista de Clientes', <GroupIcon />, null, "/clients")}
      {renderButton('Agendamentos', <EventIcon />, null, "/appointments")}
    </>
  );

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        backdropFilter: 'blur(10px)', 
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)', 
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ 
            flexGrow: 1, 
            color: 'primary.main', 
            fontWeight: 'bold', 
            textDecoration: 'none',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          Reserva BP
        </Typography>

        {isLoggedIn && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {userType === 'Cliente' && renderClientButtons()}
            {userType === 'Corretor' && renderCorretorButtons()}
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{ 
                color: 'primary.main', 
                '&:hover': { 
                  backgroundColor: 'rgba(0, 123, 255, 0.1)', 
                  transform: 'scale(1.05)', 
                },
                transition: 'all 0.3s ease',
                borderRadius: '12px',
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>

      {isLoggedIn && userType === 'Cliente' && showAppointmentForm && (
        <Box 
          sx={{ 
            padding: 2, 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <AppointmentForm userId={userId} />
        </Box>
      )}
    </AppBar>
  );
};

export default NavBar;