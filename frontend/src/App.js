import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Solicitacoes from './pages/Solicitacoes';
import Autorizacoes from './pages/Autorizacoes';
import Viagens from './pages/Viagens';
import Veiculos from './pages/veiculo/Veiculos';
import Manutencoes from './pages/manutencao/Manutencoes';
import Alertas from './pages/alerta/Alertas';
import Servidores from './pages/servidor/Servidor';
import Motoristas from './pages/motorista/Motorista';
import Usuarios from './pages/usuario/Usuario';
import Setores from './pages/setor/Setor';
import './App.css';

function App() {
  const [isSidebarToggled, setSidebarToggled] = useState(false);

  const toggleSidebar = () => {
    setSidebarToggled(!isSidebarToggled);
  };

  return (
    <Router>
      <div className={`app-container ${isSidebarToggled ? 'sidebar-toggled' : ''}`}>
        <Topbar toggleSidebar={toggleSidebar} />
        <div id="wrapper">
          <Sidebar />
          <div id="page-content-wrapper">
            <div className="container-fluid">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/solicitacoes" element={<Solicitacoes />} />
                <Route path="/autorizacoes" element={<Autorizacoes />} />
                <Route path="/viagens" element={<Viagens />} />
                <Route path="/cadastro/veiculos" element={<Veiculos />} />
                <Route path="/cadastro/manutencoes" element={<Manutencoes />} />
                <Route path="/cadastro/alertas" element={<Alertas />} />
                <Route path="/cadastro/servidores" element={<Servidores />} />
                <Route path="/cadastro/motoristas" element={<Motoristas />} />
                <Route path="/cadastro/usuarios" element={<Usuarios />} />
                <Route path="/cadastro/setores" element={<Setores />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;





























/*
codigo 1




import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Solicitacoes from './pages/Solicitacoes';
import Autorizacoes from './pages/Autorizacoes';
import Viagens from './pages/Viagens';
// Páginas de Cadastro
import Veiculos from './pages/Veiculos';
import Manutencoes from './pages/Manutencoes';
import Alertas from './pages/Alertas';
import Servidores from './pages/Servidores';
import Motoristas from './pages/Motoristas';
import Usuarios from './pages/Usuarios';
import Setores from './pages/Setores';
import './App.css';

function App() {
  const [isSidebarToggled, setSidebarToggled] = useState(false);

  const toggleSidebar = () => {
    setSidebarToggled(!isSidebarToggled);
  };

  return (
    <Router>
      <div className={`d-flex ${isSidebarToggled ? 'toggled' : ''}`} id="wrapper">
        <Sidebar />
        <div id="page-content-wrapper">
          <Topbar toggleSidebar={toggleSidebar} />
          <div className="container-fluid">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/solicitacoes" element={<Solicitacoes />} />
              <Route path="/autorizacoes" element={<Autorizacoes />} />
              <Route path="/viagens" element={<Viagens />} />
              {/* Rotas de Cadastro 
              <Route path="/cadastro/veiculos" element={<Veiculos />} />
              <Route path="/cadastro/manutencoes" element={<Manutencoes />} />
              <Route path="/cadastro/alertas" element={<Alertas />} />
              <Route path="/cadastro/servidores" element={<Servidores />} />
              <Route path="/cadastro/motoristas" element={<Motoristas />} />
              <Route path="/cadastro/usuarios" element={<Usuarios />} />
              <Route path="/cadastro/setores" element={<Setores />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;





codigo 2

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Solicitacoes from './pages/Solicitacoes';
import Autorizacoes from './pages/Autorizacoes';
import Viagens from './pages/Viagens';
import Cadastro from './pages/Cadastro';
import './App.css';

function App() {
  const [isSidebarToggled, setSidebarToggled] = useState(false);

  const toggleSidebar = () => {
    setSidebarToggled(!isSidebarToggled);
  };

  return (
    <Router>
      <div className={`d-flex ${isSidebarToggled ? 'toggled' : ''}`} id="wrapper">
        <Sidebar />
        <div id="page-content-wrapper">
          <Topbar toggleSidebar={toggleSidebar} />
          <div className="container-fluid">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/solicitacoes" element={<Solicitacoes />} />
              <Route path="/autorizacoes" element={<Autorizacoes />} />
              <Route path="/viagens" element={<Viagens />} />
              <Route path="/cadastro" element={<Cadastro />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;








/*

codigo-3


import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import './App.css';


function App() {
  const [isSidebarToggled, setSidebarToggled] = useState(false);


  const toggleSidebar = () => {
    setSidebarToggled(!isSidebarToggled);
  };


  return (
    <div className={`d-flex ${isSidebarToggled ? 'toggled' : ''}`} id="wrapper">
      <Sidebar />
      <div id="page-content-wrapper">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="container-fluid">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}


export default App;




codigo - 3




import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import './App.css';


function App() {
  const [isSidebarToggled, setSidebarToggled] = useState(false);


  const toggleSidebar = () => {
    setSidebarToggled(!isSidebarToggled);
  };


  return (
    <div className="d-flex" id="wrapper">
      <Sidebar isToggled={isSidebarToggled} />
      <div id="page-content-wrapper">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="container-fluid">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}


export default App;












*/