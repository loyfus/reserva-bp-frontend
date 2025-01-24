import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Schedule as ScheduleIcon } from '@mui/icons-material';

const AppointmentForm = ({ userId }) => {
  const [brokers, setBrokers] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/usuario/usuarios`, {
          params: { tipo: 'Corretor' },
        });
        setBrokers(response.data.filter((user) => user.tipo === 'Corretor'));
      } catch (error) {
        console.error('Erro ao buscar corretores:', error);
        toast.error('Erro ao carregar corretores. Tente novamente.');
      }
    };

    fetchBrokers();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedBroker) newErrors.selectedBroker = 'Selecione um corretor.';
    if (!date) newErrors.date = 'Selecione uma data.';
    else if (new Date(date) < new Date()) newErrors.date = 'A data deve ser futura.';
    if (!time) newErrors.time = 'Selecione um horário.';
    if (!duration) newErrors.duration = 'Selecione uma duração.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const horaFim = new Date(new Date(`${date}T${time}`).getTime() + duration * 60000).toTimeString().slice(0, 5);

      await axios.post(`${process.env.REACT_APP_API_URL}/agendamento/create`, {
        idCliente: userId,
        idCorretor: selectedBroker,
        data: date,
        horaInicio: time,
        horaFim: horaFim,
      });

      toast.success('Agendamento criado com sucesso!');
      setSelectedBroker('');
      setDate('');
      setTime('');
      setDuration(30);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast.error(error.response?.status === 400 ? 'Horário indisponível. Escolha outro horário.' : 'Erro ao criar agendamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ backgroundColor: 'background.paper', p: 4, borderRadius: 2, maxWidth: '500px', margin: '0 auto', boxShadow: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ color: 'primary.main' }}>
          Novo Agendamento
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" error={!!errors.selectedBroker}>
                <InputLabel>Corretor</InputLabel>
                <Select value={selectedBroker} onChange={(e) => setSelectedBroker(e.target.value)} required>
                  {brokers.map((broker) => (
                    <MenuItem key={broker._id} value={broker._id}>
                      {broker.nome}
                    </MenuItem>
                  ))}
                </Select>
                {errors.selectedBroker && <Typography variant="body2" color="error">{errors.selectedBroker}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                margin="normal"
                required
                error={!!errors.date}
                helperText={errors.date}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                fullWidth
                margin="normal"
                required
                error={!!errors.time}
                helperText={errors.time}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" error={!!errors.duration}>
                <InputLabel>Duração</InputLabel>
                <Select value={duration} onChange={(e) => setDuration(e.target.value)} required>
                  <MenuItem value={30}>30 minutos</MenuItem>
                  <MenuItem value={60}>1 hora</MenuItem>
                  <MenuItem value={90}>1 hora e 30 minutos</MenuItem>
                  <MenuItem value={120}>2 horas</MenuItem>
                </Select>
                {errors.duration && <Typography variant="body2" color="error">{errors.duration}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
                sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
                startIcon={!isLoading && <ScheduleIcon />}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Criar Agendamento'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </motion.div>
  );
};

export default AppointmentForm;