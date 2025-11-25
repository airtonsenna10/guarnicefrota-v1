import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Guarnice Frota</h2>
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