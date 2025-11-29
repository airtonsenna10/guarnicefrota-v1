import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaWrench, FaBell, FaUsers, FaIdBadge, FaUser, FaBuilding, FaChevronDown } from 'react-icons/fa';

const Sidebar = () => {
  const [isCadastroOpen, setCadastroOpen] = useState(false);

  const toggleCadastroMenu = () => {
    setCadastroOpen(!isCadastroOpen);
  };

  return (
    <div className="bg-light border-right" id="sidebar-wrapper">
      <div className="sidebar-heading">Menu</div>
      <div className="list-group list-group-flush">
        <Link to="/" className="list-group-item list-group-item-action bg-light">Dashboard</Link>
        <Link to="/solicitacoes" className="list-group-item list-group-item-action bg-light">Solicitações</Link>
        <Link to="/autorizacoes" className="list-group-item list-group-item-action bg-light">Autorizações</Link>
        <Link to="/viagens" className="list-group-item list-group-item-action bg-light">Viagens</Link>
        
        {/* Menu Cadastro Expansível */}
        <a href="#" className="list-group-item list-group-item-action bg-light d-flex justify-content-between align-items-center" onClick={toggleCadastroMenu}>
          Cadastro
          <FaChevronDown />
        </a>
        {isCadastroOpen && (
          <div className="list-group list-group-flush pl-4">
            <Link to="/cadastro/veiculos" className="list-group-item list-group-item-action bg-light"><FaCar className="mr-2" /> Veículos</Link>
            <Link to="/cadastro/manutencoes" className="list-group-item list-group-item-action bg-light"><FaWrench className="mr-2" /> Manutenções</Link>
            <Link to="/cadastro/alertas" className="list-group-item list-group-item-action bg-light"><FaBell className="mr-2" /> Alertas</Link>
            <Link to="/cadastro/servidores" className="list-group-item list-group-item-action bg-light"><FaUsers className="mr-2" /> Servidores</Link>
            <Link to="/cadastro/motoristas" className="list-group-item list-group-item-action bg-light"><FaIdBadge className="mr-2" /> Motoristas</Link>
            <Link to="/cadastro/usuarios" className="list-group-item list-group-item-action bg-light"><FaUser className="mr-2" /> Usuários</Link>
            <Link to="/cadastro/setores" className="list-group-item list-group-item-action bg-light"><FaBuilding className="mr-2" /> Setores</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;














/*
codigo 1


import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-light border-right" id="sidebar-wrapper">
      <div className="sidebar-heading">Guarnice Frotas</div>
      <div className="list-group list-group-flush">
        <Link to="/" className="list-group-item list-group-item-action bg-light">Dashboard</Link>
        <Link to="/solicitacoes" className="list-group-item list-group-item-action bg-light">Solicitações</Link>
        <Link to="/autorizacoes" className="list-group-item list-group-item-action bg-light">Autorizações</Link>
        <Link to="/viagens" className="list-group-item list-group-item-action bg-light">Viagens</Link>
        <Link to="/cadastro" className="list-group-item list-group-item-action bg-light">Cadastro</Link>
      </div>
    </div>
  );
};

export default Sidebar;







codigo 2


import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            
            <ul className="nav flex-column">
                <li className="nav-item">
                    <a className="nav-link active" href="#">Dashboard</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Solicitações</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Autorizações</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Viagens</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="collapse" href="#cadastroSubmenu" role="button" aria-expanded="false" aria-controls="cadastroSubmenu">
                        Cadastro
                    </a>
                    <div className="collapse" id="cadastroSubmenu">
                        <ul className="nav flex-column ms-3">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Veículos</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Manutenções</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Alertas</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Servidores</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Motoristas</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Usuários</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Setores</a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;

*/