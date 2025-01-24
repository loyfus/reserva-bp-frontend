import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Pagination, Button } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/usuario/usuarios`);
      setClients(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar a lista de clientes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, page) => setCurrentPage(page);

  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsEditing(true);
  };

  const handleDelete = (client) => {
    setSelectedClient(client);
    setIsDeleting(true);
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/usuario/usuarios/${selectedClient._id}`, selectedClient);
      toast.success('Usuário atualizado com sucesso.');
      setIsEditing(false);
      fetchClients();
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
      toast.error('Erro ao atualizar o cliente.');
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/usuario/usuarios/${selectedClient._id}`);
      toast.success('Usuário excluído com sucesso.');
      setIsDeleting(false);
      fetchClients();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast.error('Erro ao excluir o cliente.');
    }
  };

  const paginatedClients = clients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: 'primary.main' }}>
        Lista de Clientes
      </Typography>
      <Paper sx={{ borderRadius: 2, boxShadow: 3, p: 3 }}>
        {clients.length > 0 ? (
          <>
            <List>
              {paginatedClients.map((client) => (
                <Paper key={client._id} sx={{ mb: 2, borderRadius: 2, boxShadow: 1, p: 2 }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 'bold' }}>{client.nome}</Typography>}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <EmailIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {client.email}
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton onClick={() => handleEdit(client)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(client)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                </Paper>
              ))}
            </List>
            <Pagination
              count={Math.ceil(clients.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
            />
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Nenhum cliente encontrado.
            </Typography>
          </Box>
        )}
      </Paper>

      {isEditing && (
        <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogContent>
            <TextField
              label="Nome"
              fullWidth
              margin="dense"
              value={selectedClient.nome}
              onChange={(e) => setSelectedClient({ ...selectedClient, nome: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              margin="dense"
              value={selectedClient.email}
              onChange={(e) => setSelectedClient({ ...selectedClient, email: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button onClick={saveEdit} color="primary">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {isDeleting && (
        <Dialog open={isDeleting} onClose={() => setIsDeleting(false)}>
          <DialogTitle>Excluir Cliente</DialogTitle>
          <DialogContentText sx={{ p: 2 }}>
            Tem certeza de que deseja excluir o cliente "{selectedClient.nome}"?
          </DialogContentText>
          <DialogActions>
            <Button onClick={() => setIsDeleting(false)}>Cancelar</Button>
            <Button onClick={confirmDelete} color="error">
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ClientList;