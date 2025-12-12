import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'; 
import './Usuario.css'; 
import { fetchData, sendData } from '../../service/api'; 
//import UsuarioModal from './UsuarioModal'; // Iremos criar este arquivo

const Usuarios = () => {
    // Estado para a lista de usuários
    const [usuarios, setUsuarios] = useState([]);
    
    // Estado do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarioParaEdicao, setUsuarioParaEdicao] = useState(null);

    // Estados de Filtro
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroPerfil, setFiltroPerfil] = useState('Todos');
    const [filtroStatus, setFiltroStatus] = useState('Todos');

    // --- Funções de Carregamento de Dados ---
    
    const fetchUsuarios = async () => {
        try {
            // Supondo que o endpoint para usuários seja 'usuarios'
            const data = await fetchData('usuarios'); 
            setUsuarios(data);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    // --- Funções do Modal ---

    const handleOpenModal = (usuario = null) => {
        setUsuarioParaEdicao(usuario); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUsuarioParaEdicao(null);
        fetchUsuarios(); // Recarrega a lista após fechar
    };

    // --- Funções CRUD (Ações) ---

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                // Supondo que o endpoint de exclusão seja 'usuarios/{id}'
                await sendData('DELETE', `usuarios/${id}`);
                fetchUsuarios();
            } catch (error) {
                console.error("Erro ao excluir usuário:", error);
                alert("Falha ao excluir o usuário.");
            }
        }
    };
    
    // Função para renderizar o Status (status_conta)
    const renderStatus = (status) => {
        const statusClasses = {
            'ATIVO': 'status-ativo',
            'INATIVO': 'status-inativo',
        };
        return <span className={`status-pill ${statusClasses[status] || ''}`}>{status}</span>;
    };
    
    // Função para renderizar o Perfil (papel)
    const renderPerfil = (papel) => {
        // Você pode adicionar classes ou cores aqui se desejar
        return <span className="perfil-pill">{papel}</span>;
    };


    // --- Lógica de Filtro (Frontend) ---
    const usuariosFiltrados = usuarios.filter(usuario => {
        const nomeMatch = usuario.nome.toLowerCase().includes(filtroNome.toLowerCase());
        const perfilMatch = filtroPerfil === 'Todos' || usuario.papel === filtroPerfil;
        const statusMatch = filtroStatus === 'Todos' || usuario.status_conta === filtroStatus;
        
        return nomeMatch && perfilMatch && statusMatch;
    });

    // --- Renderização ---

    return (
        <div className="usuarios-container">
            <div className="header-container">
                <h1 className="page-title">Cadastro de Usuários</h1>
                <button 
                    className="btn-novo-cadastro" 
                    onClick={() => handleOpenModal(null)}
                >
                    <FaPlus /> Novo Cadastro
                </button>
            </div>

            {/* Área de Pesquisa/Filtros */}
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>

                <div className="filtros-container">
                    <div className="filtro-item">
                        <label htmlFor="nome-usuario">Nome</label>
                        <input 
                            type="text" 
                            id="nome-usuario" 
                            className="filtro-input" 
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="perfil">Perfil</label>
                        <select 
                            id="perfil" 
                            className="filtro-input"
                            value={filtroPerfil}
                            onChange={(e) => setFiltroPerfil(e.target.value)}
                        >
                            <option value="Todos">Todos</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="GESTOR">GESTOR</option>
                            <option value="OPERADOR">OPERADOR</option>
                        </select>
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="status">Status da Conta</label>
                        <select 
                            id="status" 
                            className="filtro-input"
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                        >
                            <option value="Todos">Todos</option>
                            <option value="ATIVO">ATIVO</option>
                            <option value="INATIVO">INATIVO</option>
                        </select>
                    </div>
                </div>
            </div>


            {/* Tabela de Usuários */}
            <div className="tabela-wrapper">
                <table className="tabela-usuarios">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>CPF</th>
                            <th>Celular</th>
                            <th>Perfil</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.nome}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.cpf}</td>
                                <td>{usuario.celular}</td>
                                <td>{renderPerfil(usuario.papel)}</td>
                                <td>{renderStatus(usuario.status_conta)}</td>
                                <td className="acoes-cell">
                                    <button className="btn-acao visualizar" title="Visualizar">
                                        <FaEye />
                                    </button>
                                    <button 
                                        className="btn-acao editar" 
                                        onClick={() => handleOpenModal(usuario)}
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="btn-acao excluir" 
                                        onClick={() => handleDelete(usuario.id)}
                                        title="Excluir"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {usuarios.length === 0 && (
                    <p className="tabela-vazia-mensagem">Nenhum usuário cadastrado.</p>
                )}
            </div>
            
            {/* Modal 
            {isModalOpen && (
                <UsuarioModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    usuarioData={usuarioParaEdicao}
                />
            )}
                */}
        </div>
    );
};

export default Usuarios;