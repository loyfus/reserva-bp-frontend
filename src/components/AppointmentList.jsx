import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,
  Box, CircularProgress, IconButton, useMediaQuery, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AppointmentList = ({ userId, userType }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    data: '',
    horaInicio: '',
    horaFim: '',
    idCliente: '',
    idCorretor: '',
  });
  const [clientes, setClientes] = useState([]);
  const [corretores, setCorretores] = useState([]);
  const [saving, setSaving] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    fetchAppointments();
    fetchUsuarios();
  }, [userId]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/agendamento/list`, {
        params: userType === 'Corretor' ? { idCorretor: userId } : { idCliente: userId },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setError(true);
      toast.error('Erro ao carregar agendamentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      // Busca clientes
      const clientesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/usuario/usuarios`, {
        params: { tipo: 'Cliente' },
      });
      setClientes(clientesResponse.data);

      // Busca corretores
      const corretoresResponse = await axios.get(`${process.env.REACT_APP_API_URL}/usuario/usuarios`, {
        params: { tipo: 'Corretor' },
      });
      setCorretores(corretoresResponse.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao carregar usuários. Tente novamente.');
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/agendamento/${id}`, {
        status: 'cancelado',
      });
      setAppointments((prevAppointments) => prevAppointments.filter((app) => app._id !== id));
      toast.success('Agendamento cancelado com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      toast.error('Erro ao cancelar agendamento. Tente novamente.');
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      data: appointment.data.split('T')[0],
      horaInicio: appointment.horaInicio,
      horaFim: appointment.horaFim,
      idCliente: appointment.idCliente?._id || '', //mantndo cliente original //
      idCorretor: appointment.idCorretor?._id || '',
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    const startTime = new Date(`1970-01-01T${formData.horaInicio}:00`);
    const endTime = new Date(`1970-01-01T${formData.horaFim}:00`);

    const durationInMs = endTime - startTime;

    const durationInMinutes = durationInMs / (1000 * 60);

    if (durationInMinutes < 30 || durationInMinutes > 120) {
      toast.error('A duração do agendamento deve ser entre 30 minutos e 2 horas.');
      return;
    }

    if (startTime >= endTime) {
      toast.error('A hora de início deve ser anterior à hora de fim.');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/agendamento/${selectedAppointment._id}`,
        formData
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app._id === response.data.agendamento._id ? response.data.agendamento : app
        )
      );
      toast.success('Agendamento atualizado com sucesso!');
      setEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao editar agendamento:', error);
      toast.error('Erro ao editar agendamento. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '200px' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Erro ao carregar os dados.
        </Typography>
        <Button variant="contained" color="primary" onClick={fetchAppointments} startIcon={<RefreshIcon />}>
          Tentar Novamente
        </Button>
      </Box>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ backgroundColor: 'background.paper', p: isMobile ? 2 : 4, borderRadius: 2, maxWidth: isMobile ? '100%' : '1200px', margin: '0 auto', boxShadow: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ color: 'primary.main' }}>
            Lista de Agendamentos
          </Typography>
          <IconButton onClick={fetchAppointments} sx={{ color: 'primary.main' }}>
            <RefreshIcon />
          </IconButton>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Corretor</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Data</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hora Início</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hora Fim</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <TableRow key={appointment._id} sx={{ '&:hover': { backgroundColor: 'rgba(0, 123, 255, 0.1)' } }}>
                    <TableCell>{appointment.idCliente ? appointment.idCliente.nome : 'N/A'}</TableCell>
                    <TableCell>{appointment.idCorretor ? appointment.idCorretor.nome : 'N/A'}</TableCell>
                    <TableCell>{new Date(appointment.data).toLocaleDateString()}</TableCell>
                    <TableCell>{appointment.horaInicio}</TableCell>
                    <TableCell>{appointment.horaFim}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(appointment)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleCancel(appointment._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary' }}>
                    Nenhum agendamento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Agendamento</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Data"
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Hora Início"
            type="time"
            name="horaInicio"
            value={formData.horaInicio}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Hora Fim"
            type="time"
            name="horaFim"
            value={formData.horaFim}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            select
            label="Corretor"
            name="idCorretor"
            value={formData.idCorretor}
            onChange={handleChange}
            margin="normal"
          >
            {corretores.map((corretor) => (
              <MenuItem key={corretor._id} value={corretor._id}>
                {corretor.nome}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} color="primary" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default AppointmentList;