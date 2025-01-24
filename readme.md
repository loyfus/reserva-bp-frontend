# Front-end da Reserva BP

O **Reserva BP** é uma aplicação web desenvolvida para facilitar o agendamento de horários entre clientes e corretores. Este repositório contém o código-fonte do front-end da aplicação, construído com **React.js**

## Funcionalidades

- **Autenticação de Usuários**: Login e registro de usuários (clientes e corretores).
- **Agendamentos**:
  - Clientes podem criar e visualizar seus agendamentos.
  - Corretores podem visualizar todos os agendamentos relacionados a eles.
- **Lista de Clientes**: Corretores podem visualizar e gerenciar a lista de clientes.
- **Interface Responsiva**: Design adaptável para diferentes tamanhos de tela.

## Tecnologias Utilizadas

- **React.js**: Biblioteca JavaScript para construção de interfaces de usuário.
- **React Router**: Gerenciamento de rotas na aplicação.
- **Material-UI (MUI)**: Biblioteca de componentes UI para React.
- **Axios**: Cliente HTTP para fazer requisições à API.
- **React Toastify**: Exibição de notificações (toasts) na interface.
- **Framer Motion**: Biblioteca para animações e transições.

## Estrutura do Projeto

- **`App.js`**: Configuração das rotas da aplicação.
- **`AuthContext.js`**: Contexto de autenticação para gerenciar o estado do usuário.
- **`global.css`**: Estilos globais da aplicação.
- **`index.js`**: Ponto de entrada da aplicação.
- **Páginas**:
  - **`Home.jsx`**: Página inicial com opções de login e registro.
  - **`Appointments.jsx`**: Página de agendamentos.
  - **`Clients.jsx`**: Página de lista de clientes (apenas para corretores).
  - **`Register.jsx`**: Página de registro de novos usuários.
- **Componentes**:
  - **`NavBar.jsx`**: Barra de navegação superior.
  - **`ProtectedRoute.jsx`**: Componente para proteger rotas que requerem autenticação.
  - **`LoginModal.jsx`**: Modal de login.
  - **`RegisterModal.jsx`**: Modal de registro.
  - **`AppointmentForm.jsx`**: Formulário para criação de agendamentos.
  - **`AppointmentList.jsx`**: Lista de agendamentos.
  - **`ClientList.jsx`**: Lista de clientes.
