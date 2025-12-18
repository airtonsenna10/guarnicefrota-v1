import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import { fetchData, sendData } from '../../service/api'; 
import '../style/style-pagina-principal.css'; // Importa o CSS principal padronizado
import UsuarioModal from './UsuarioModal'; // Descomentar após criar o arquivo
import NotificationToast from '../loadingoverlay/NotificationToast'; // Descomentar após criar o arquivo

const Usuario = () => {
    const API_ENDPOINT = '/api/pessoas'; 

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    // Estado para configurar o modal (usuário e modo de operação)
    const [modalConfig, setModalConfig] = useState({ 
        usuario: null, 
        mode: 'new'    // 'new', 'view', 'edit'
    });

    // Estados de Filtro
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroPerfil, setFiltroPerfil] = useState('Todos');
    const [filtroStatus, setFiltroStatus] = useState('Todos');

    // --- Funções de Carregamento de Dados ---
    const getUsuarios = async () => {
        try {
            setLoading(true);
            const data = await fetchData(API_ENDPOINT); 
            setUsuarios(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsuarios();
    }, []);

    // Função que o MODAL chamará no sucesso ou erro
    const handleUsuarioSaved = (message, type) => {
        setNotification({ message, type });
        if (type === 'success') {
            getUsuarios();
        }
    };
    
    const dismissNotification = () => setNotification(null);


    // FUNÇÕES PARA ABRIR/FECHAR O MODAL
    const handleOpenModal = () => {
        setModalConfig({ usuario: null, mode: 'new' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalConfig({ usuario: null, mode: 'new' });
    };

    // --- Funções de Ação (CRUD Padronizado) ---
    const handleVisualizar = (usuario) => {
        setModalConfig({ usuario: usuario, mode: 'view' }); 
        setIsModalOpen(true);
    };

    const handleEditar = (usuario) => {
        setModalConfig({ usuario: usuario, mode: 'edit' }); 
        setIsModalOpen(true);
    };

    const handleExcluir = async (usuario) => {
        if (window.confirm(`Tem certeza que deseja excluir o usuário: ${usuario.nome}?`)) {
            try {
                await sendData(`${API_ENDPOINT}/${usuario.id}`,'DELETE');
                handleUsuarioSaved("Usuário excluído com sucesso!", 'success');
            } catch (error) {
                console.error("Erro ao excluir usuário:", error);
                handleUsuarioSaved("Erro ao excluir usuário. Tente novamente.", 'error');
            }
        }
    };

   

    // --- Filtro ---
    const usuariosFiltrados = usuarios.filter(usuario => {
        const nomeMatch = usuario.nome?.toLowerCase().includes(filtroNome.toLowerCase());
        const perfilMatch = filtroPerfil === 'Todos' || usuario.perfil === filtroPerfil;
        const statusMatch = filtroStatus === 'Todos' || usuario.statusConta === filtroStatus;
        return nomeMatch && perfilMatch && statusMatch;
    });

    if (loading) return <div className="main-list-container">Carregando...</div>;
    if (error) return <div className="main-list-container">Erro: {error}</div>;

    return (
        <div className="main-list-container">
            <div className="header-container">
                <h1 className="page-title">Cadastro de Usuários</h1>
                <button className="btn-novo-cadastro" onClick={handleOpenModal}>
                    <FaPlus /> Novo Cadastro
                </button>
            </div>

            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo"><FaSearch /> Área de Pesquisa</h3>
                <div className="filtros-container">
                    <div className="filtro-item">
                        <label>Nome</label>
                        <input 
                            type="text" 
                            className="filtro-input" 
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label>Perfil</label>
                        <select className="filtro-select" value={filtroPerfil} onChange={(e) => setFiltroPerfil(e.target.value)}>
                            <option value="Todos">Todos</option>
                            <option value="ADMIN">Admin</option>
                            <option value="USUARIO">Usuario</option>
                        </select>
                    </div>
                    <div className="filtro-item">
                        <label>Status</label>
                        <select className="filtro-select" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                            <option value="Todos">Todos</option>
                            <option value="ATIVO">Ativo</option>
                            <option value="INATIVO">Inativo</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="tabela-wrapper">
                <table className="tabela-listagem">
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
                        {usuariosFiltrados.length > 0 ? (
                            usuariosFiltrados.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.cpf}</td>
                                    <td>{usuario.celular}</td>
                                    <td>{usuario.perfil}</td>
                                    <td>{usuario.statusConta}</td>
                                    <td className="acoes-cell">
                                        <button 
                                            className="action-button view-button" 
                                            title="Visualizar" 
                                            onClick={() => handleVisualizar(usuario)}>
                                            <FaEye />
                                        </button>
                                        <button className="action-button edit-button" title="Editar" onClick={() => handleEditar(usuario)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-button delete-button" title="Excluir" onClick={() => handleExcluir(usuario)}>
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="mensagem-tabela-vazia">Nenhum usuário encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Renderização do Modal*/}
            {isModalOpen && (
                <UsuarioModal 
                //isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUsuarioSaved={handleUsuarioSaved}
                usuarioToEdit={modalConfig.usuario}
                mode={modalConfig.mode}
                />
        
            )}

            {/* Renderização da Notificação */}
            {notification && (
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    onDismiss={dismissNotification}
                    duration={3000} 
                />
            )}

        </div>
    );
};

export default Usuario;











/*=========================================================================

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

            {/* Área de Pesquisa/Filtros *
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


            {/* Tabela de Usuários *
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
            
        </div>
    );
};

export default Usuarios;

*/