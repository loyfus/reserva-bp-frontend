import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const login = async (email, password) => {
  const response = await api.post('/usuarios/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/usuarios', userData);
  return response.data;
};

export const getBrokers = async () => {
  const response = await api.get('/usuarios', { params: { tipo: 'Corretor' } });
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await api.post('/agendamentos', appointmentData);
  return response.data;
};