import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './Topbar.css';

const Topbar = ({ toggleSidebar }) => {
    return (
        <Navbar bg="light" expand="lg" className="topbar">
            <Navbar.Brand href="#">Guarnice Frota</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    <NavDropdown title="Usuário" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Perfil</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Configurações</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Sair</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Topbar;