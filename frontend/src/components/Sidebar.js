
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCar, 
  FaWrench, 
  FaBell, 
  FaUsers, 
  FaIdBadge, 
  FaUser, 
  FaBuilding, 
  FaChevronDown,
  FaTachometerAlt,
  FaFileAlt,
  FaCheckSquare,
  FaRoute,
  FaDatabase,
  FaBars
} from 'react-icons/fa';

import './Sidebar.css';

const Sidebar = () => {
  const [isCadastroOpen, setCadastroOpen] = useState(false);
  const [isRecolhida, setIsRecolhida] = useState(false);

  
   // 3. Função corrigida: Só permite abrir o submenu se a sidebar estiver expandida.
  const toggleCadastroMenu = () => {
    if (!isRecolhida) {
      setCadastroOpen(!isCadastroOpen);
    }
  };

  const toggleRecolher = () => {
    // 2. Fecha o submenu de cadastro ao recolher a sidebar.
    if (!isRecolhida) {
      setCadastroOpen(false);
    }
    setIsRecolhida(!isRecolhida);
  };

 

  return (
    <div id="sidebar-wrapper" className={`bg-light border-right ${isRecolhida ? 'recolhida' : ''}`}>
      <div className="sidebar-heading">
        <span>Menu</span>
         {/* 3. Adicionei o botão ao lado do título. Por enquanto, ele é apenas visual e não tem função. */}
          {/* 3. O evento onClick do botão agora chama a função para alternar o estado. */}
        <button className="hamburger-button" onClick={toggleRecolher}>
          <FaBars />
        </button>
        
      </div>

      <div className="list-group list-group-flush">

        {/* Dashboard */}
        <Link to="/" className="list-group-item list-group-item-action bg-light d-flex align-items-center">
          <div className="menu-icon"><FaTachometerAlt /></div>
          <span>Dashboard</span>
        </Link>

        {/* Solicitações */}
        <Link to="/solicitacoes" className="list-group-item list-group-item-action bg-light d-flex align-items-center">
          <div className="menu-icon"><FaFileAlt /></div>
          <span>Solicitações</span>
        </Link>

        {/* Autorizações */}
        <Link to="/autorizacoes" className="list-group-item list-group-item-action bg-light d-flex align-items-center">
          <div className="menu-icon"><FaCheckSquare /></div>
          <span>Autorizações</span>
        </Link>

        {/* Viagens */}
        <Link to="/viagens" className="list-group-item list-group-item-action bg-light d-flex align-items-center">
          <div className="menu-icon"><FaRoute /></div>
          <span>Viagens</span>
        </Link>

        {/* CADASTRO — EXPANDÍVEL */}
        {/* CORREÇÃO: 
            A classe `justify-content-between` só é aplicada quando o menu NÃO está recolhido. 
            Quando está recolhido, a classe `justify-content-center` é usada no seu lugar. */}
        <a 
          href="#"
          className={"list-group-item list-group-item-action d-flex align-items-center"}
          onClick={toggleCadastroMenu}
        >
      
          <div className="d-flex align-items-center">
            <div className="menu-icon"><FaDatabase /></div>
            <span>Cadastro</span>
          </div>
          {/*<FaChevronDown className={isCadastroOpen ? "rotate-icon" : ""} />*/}
          {/* A seta também some quando está recolhido */}
          {!isRecolhida && <FaChevronDown className={isCadastroOpen ? "rotate-icon" : ""} />}
        </a>

        {/* Subitens do Cadastro */}
        {isCadastroOpen && (
          <div className="list-group list-group-flush pl-4">

            <Link to="/cadastro/veiculos" className="list-group-item list-group-item-action bg-light d-flex align-items-center">
              <div className="menu-icon"><FaCar /></div>
              <span>Veículos</span>
            </Link>

            <Link to="/cadastro/manutencoes" className="list-group-item list-group-item-action bg-light d-flex align-items-center">
              <div className="menu-icon"><FaWrench /></div>
              <span>Manutenções</span>
            </Link>

            <Link to="/cadastro/alertas" className="list-group-item list-group-item-action bg-light d-flex align-items-center">
              <div className="menu-icon"><FaBell /></div>
              <span>Alertas</span>
            </Link>

            <Link to="/cadastro/servidores" className="list-group-item list-group-item-action bg-light d-flex align-items-center">
              <div className="menu-icon"><FaUsers /></div>
              <span>Servidores</span>
            </Link>

            <Link to="/cadastro/motoristas" className="list-group-item list-group-item-action bg-light d-flex align-items-center">
              <div className="menu-icon"><FaIdBadge /></div>
              <span>Motoristas</span>
            </Link>

            <Link to="/cadastro/usuarios" className="list-group-item list-group-item-action bg-light d-flex align-items-center">
              <div className="menu-icon"><FaUser /></div>
              <span>Usuários</span>
            </Link>

            <Link to="/cadastro/setores" className="list-group-item list-group-item-action bg-light d-flex align-items-center">
              <div className="menu-icon"><FaBuilding /></div>
              <span>Setores</span>
            </Link>

          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;





