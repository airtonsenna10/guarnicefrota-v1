
import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import { fetchData, sendData } from '../../service/api'; 
import ServidorModal from './ServidorModal';
//import '../style/style-pagina-principal.css';
import NotificationToast from '../loadingoverlay/NotificationToast'; 

const Servidor = () => {
    const API_ENDPOINT = '/api/servidor';

    // Estados Principais
    const [servidores, setServidores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado de configuração do modal (seguindo o padrão Usuario)
    const [modalConfig, setModalConfig] = useState({ 
        servidor: null, 
        mode: 'new' 
    });

    const dismissNotification = () => setNotification(null);

    // Filtros
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroSetor, setFiltroSetor] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos');

    const carregarServidores = async () => {
        try {
            setLoading(true);
            const data = await fetchData(API_ENDPOINT);
            setServidores(data);
        } catch (error) {
            console.error("Erro ao buscar servidores:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarServidores();
    }, []);

    // Função padronizada de resposta do Modal
    const handleServidorSaved = (message, type) => {
        setNotification({ message, type, id: Date.now()}); // Date.now()<--- Chave mestra para resetar o componente
        if (type === 'success') {
            carregarServidores();
        }
    };

    // --- CONTROLE DO MODAL ---
    const handleOpenModal = () => {
        setModalConfig({ servidor: null, mode: 'new' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalConfig({ servidor: null, mode: 'new' });
    };

    const handleVisualizar = (servidor) => {
        setModalConfig({ servidor, mode: 'view' });
        setIsModalOpen(true);
    };

    const handleEditar = (servidor) => {
        setModalConfig({ servidor, mode: 'edit' });
        setIsModalOpen(true);
    };

    const handleExcluir = async (servidor) => {
        if (window.confirm(`Tem certeza que deseja excluir o colaborador ${servidor.nome}?`)) {
            try {
                await sendData(`${API_ENDPOINT}/${servidor.id}`, 'DELETE');
                handleServidorSaved("Colaborador excluído com sucesso!", 'success');
            } catch (error) {
                handleServidorSaved("Erro ao excluir colaborador.", 'error');
            }
        }
    };

    const servidoresFiltrados = servidores.filter(s => {
        const matchesNome = s.pessoa?.nome?.toLowerCase().includes(filtroNome.toLowerCase());
        const matchesSetor = s.setor?.nomeSetor?.toLowerCase().includes(filtroSetor.toLowerCase());
        const matchesStatus = filtroStatus === 'Todos' || s.situacao?.toLowerCase() === filtroStatus.toLowerCase();
        return matchesNome && matchesSetor && matchesStatus;
    });

    return (
        <div className="main-list-container">
            <div className="header-container">
                <h1 className="page-title">Cadastro de Colaboradores</h1>
                <button className="btn-novo-cadastro" onClick={handleOpenModal}>
                    <FaPlus /> Novo Cadastro
                </button>
            </div>

            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo"><FaSearch /> Área de Pesquisa</h3>
                <div className="filtros-container">
                    <div className="filtro-item">
                        <label>Nome</label>
                        <input type="text" className="filtro-input" value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} placeholder="Nome..." />
                    </div>
                    <div className="filtro-item">
                        <label>Setor</label>
                        <input type="text" className="filtro-input" value={filtroSetor} onChange={(e) => setFiltroSetor(e.target.value)} placeholder="Setor..." />
                    </div>
                    <div className="filtro-item">
                        <label>Status</label>
                        <select className="filtro-input" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                            <option value="Todos">Todos</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="tabela-wrapper">
                <table className="tabela-listagem">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Matrícula</th>
                            <th>Setor</th>
                            <th>Perfil</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{textAlign: 'center'}}>Carregando...</td></tr>
                        ) : servidoresFiltrados.length > 0 ? (
                            servidoresFiltrados.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.pessoa?.nome}</td>
                                    <td>{s.matricula}</td>
                                    <td>{s.setor?.nomeSetor || 'N/A'}</td>
                                    <td><span className={`badge-perfil ${s.tipo}`}>{s.tipo}</span></td>
                                    <td>
                                        <span className={`status-indicador ${s.situacao?.toLowerCase() === 'ativo' ? 'status-ativo' : 'status-inativo'}`}>
                                            {s.situacao}
                                        </span>
                                    </td>
                                    <td className="acoes-cell">
                                        <button className="action-button view-button" title="Visualizar" onClick={() => handleVisualizar(s)}><FaEye /></button>
                                        <button className="action-button edit-button" title="Editar" onClick={() => handleEditar(s)}><FaEdit /></button>
                                        <button className="action-button delete-button" title="Excluir" onClick={() => handleExcluir(s)}><FaTrashAlt /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            /* LINHA ADICIONADA CONFORME SOLICITADO */
                            <tr>
                                <td colSpan="6" className="mensagem-tabela-vazia">
                                    Nenhum colaborador encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <ServidorModal 
                    onClose={handleCloseModal}
                    onSaveSuccess={handleServidorSaved}
                    servidorToEdit={modalConfig.servidor}
                    mode={modalConfig.mode}
                />
            )}

            {notification && (
                <NotificationToast
                    key={notification.id} // Adicionado para forçar re-montagem
                    message={notification.message}
                    type={notification.type}
                    onDismiss={dismissNotification}
                    duration={3000} 
                />
            )}
        </div>
    );
};

export default Servidor;












/*

import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import { fetchData, sendData } from '../../service/api'; 
import ServidorModal from './ServidorModal'; // Certifique-se de que o caminho está correto
import '../style/style-pagina-principal.css';
import NotificationToast from '../loadingoverlay/NotificationToast'; 

const Servidor = () => {

    // Estados Principais
    const [servidores, setServidores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    // Função para dispensar a notificação
    const dismissNotification = () => setNotification(null);
    
    // Estados para o Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedServidor, setSelectedServidor] = useState(null);
    const [modalMode, setModalMode] = useState('new'); // 'new', 'edit' ou 'view'

    // Estados para os filtros
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroSetor, setFiltroSetor] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos');

    // Função para carregar os servidores
    const carregarServidores = async () => {
        try {
            setLoading(true);
            const data = await fetchData('/api/servidor');
            setServidores(data);
        } catch (error) {
            console.error("Erro ao buscar servidores:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarServidores();
    }, []);

    // Função que o MODAL chamará no sucesso ou erro
    const handleColaboradorSaved = (message, type) => {
        setNotification({ message, type });
        if (type === 'success') {
            carregarServidores();
        }
    };


    // --- FUNÇÕES DE AÇÃO ---

    const handleNovoCadastro = () => {
        setSelectedServidor(null);
        setModalMode('new');
        setIsModalOpen(true);
    };

    const handleEditar = (servidor) => {
        setSelectedServidor(servidor);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleVisualizar = (servidor) => {
        setSelectedServidor(servidor);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleExcluir = async (id, nome) => {
        if (window.confirm(`Tem certeza que deseja excluir o colaborador ${nome}?`)) {
            try {
                // DELETE não costuma precisar de body, então passamos nulo
                await sendData(`/api/servidor/${id}`, 'DELETE', null);
                handleColaboradorSaved("Colaborador excluído com sucesso!", 'success');
                
            } catch (error) {
                
                handleColaboradorSaved("Erro ao excluir colaborador. Tente novamente.", 'error');
            }
        }
    };

    // Lógica de filtragem (Ajustada para ignorar Maiúsculas/Minúsculas)
    const servidoresFiltrados = servidores.filter(s => {
        const matchesNome = s.nome?.toLowerCase().includes(filtroNome.toLowerCase());
        const matchesSetor = s.setor?.nomeSetor?.toLowerCase().includes(filtroSetor.toLowerCase());
        const matchesStatus = filtroStatus === 'Todos' || s.situacao?.toLowerCase() === filtroStatus.toLowerCase();
        return matchesNome && matchesSetor && matchesStatus;
    });

    return (
        <div className="main-list-container">
            <div className="header-container">
                <h1 className="page-title">Cadastro de Colaboradores</h1>
                <button className="btn-novo-cadastro" onClick={handleNovoCadastro}>
                    <FaPlus /> Novo Cadastro
                </button>
            </div>

            {/* Área de Pesquisa 
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo"><FaSearch /> Área de Pesquisa</h3>
                <div className="filtros-container">
                    <div className="filtro-item">
                        <label>Nome</label>
                        <input 
                            type="text" 
                            className="filtro-input" 
                            placeholder="Pesquisar por nome..."
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label>Setor</label>
                        <input 
                            type="text" 
                            className="filtro-input" 
                            placeholder="Pesquisar por setor..."
                            value={filtroSetor}
                            onChange={(e) => setFiltroSetor(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label>Status</label>
                        <select 
                            className="filtro-input"
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                        >
                            <option value="Todos">Todos</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="tabela-wrapper">
                <table className="tabela-listagem">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Matrícula</th>
                            <th>Setor</th>
                            <th>Perfil</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{textAlign: 'center'}}>Carregando...</td></tr>
                        ) : servidoresFiltrados.length > 0 ? (
                            servidoresFiltrados.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.nome}</td>
                                    <td>{s.matricula}</td>
                                    <td>{s.setor?.nomeSetor || 'N/A'}</td>
                                    <td><span className={`badge-perfil ${s.tipo}`}>{s.tipo}</span></td>
                                    <td>
                                        {/* Comparação toLowerCase para garantir a cor correta 
                                        <span className={`status-indicador ${s.situacao?.toLowerCase() === 'ativo' ? 'status-ativo' : 'status-inativo'}`}>
                                            {s.situacao}
                                        </span>
                                    </td>
                                    <td className="acoes-cell">
                                        <button 
                                            className="action-button view-button" 
                                            title="Visualizar"
                                            onClick={() => handleVisualizar(s)}
                                        >
                                            <FaEye />
                                        </button>
                                        <button 
                                            className="action-button edit-button" 
                                            title="Editar"
                                            onClick={() => handleEditar(s)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="action-button delete-button" 
                                            title="Excluir"
                                            onClick={() => handleExcluir(s.id, s.nome)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" style={{textAlign: 'center'}}>Nenhum colaborador encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Chamada do Modal 
            <ServidorModal 
                isOpen={isModalOpen}  // Controla a visibilidade do modal
                onClose={() => setIsModalOpen(false)}  // Função para fechar o modal
                servidorData={selectedServidor}  // Dados do servidor para visualizar/editar
                onSaveSuccess={handleColaboradorSaved}  // Função chamada após salvar
                mode={modalMode}  // Modo do modal: 'new', 'view', 'edit'
            />

             {/* Renderização da Notificação
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

export default Servidor;








/*


import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import { fetchData } from '../../service/api'; // Ajuste o caminho conforme seu projeto
import '../style/style-pagina-principal.css';
import ServidorModal from './ServidorModal';

const Servidor = () => {
    const [servidores, setServidores] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para os filtros conforme a imagem image_de4ac0.png
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroSetor, setFiltroSetor] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos');

    const carregarServidores = async () => {
        try {
            setLoading(true);
            const data = await fetchData('/api/servidor');
            setServidores(data);
        } catch (error) {
            console.error("Erro ao buscar servidores:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarServidores();
    }, []);

    // Lógica de filtragem
    const servidoresFiltrados = servidores.filter(s => {
        const matchesNome = s.nome?.toLowerCase().includes(filtroNome.toLowerCase());
        // Acessa o nome dentro do objeto setor retornado pela API
        const matchesSetor = s.setor?.nomeSetor?.toLowerCase().includes(filtroSetor.toLowerCase());
        const matchesStatus = filtroStatus === 'Todos' || s.situacao === filtroStatus;

        return matchesNome && matchesSetor && matchesStatus;
    });

    return (
        <div className="main-list-container">
            <div className="header-container">
                <h1 className="page-title">Cadastro de Colaboradores</h1>
                <button className="btn-novo-cadastro">
                    <FaPlus /> Novo Cadastro
                </button>
            </div>

            {/* Área de Pesquisa 
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo"><FaSearch /> Área de Pesquisa</h3>
                <div className="filtros-container">
                    <div className="filtro-item">
                        <label>Nome</label>
                        <input 
                            type="text" 
                            className="filtro-input" 
                            placeholder="Pesquisar por nome..."
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label>Setor</label>
                        <input 
                            type="text" 
                            className="filtro-input" 
                            placeholder="Pesquisar por setor..."
                            value={filtroSetor}
                            onChange={(e) => setFiltroSetor(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label>Status</label>
                        <select 
                            className="filtro-input"
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                        >
                            <option value="Todos">Todos</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabela de Dados 
            <div className="tabela-wrapper">
                <table className="tabela-listagem">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Matrícula</th>
                            <th>Setor</th>
                            <th>Perfil</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{textAlign: 'center'}}>Carregando...</td></tr>
                        ) : servidoresFiltrados.length > 0 ? (
                            servidoresFiltrados.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.nome}</td>
                                    <td>{s.matricula}</td>
                                    {/* Acesso seguro ao objeto aninhado setor 
                                    <td>{s.setor?.nomeSetor || 'N/A'}</td>
                                    {/* Mapeando 'tipo' da API para a coluna 'Perfil' da UI 
                                    <td><span className={`badge-perfil ${s.tipo}`}>{s.tipo}</span></td>
                                    <td>
                                        <span className={`status-indicador ${s.situacao === 'Ativo' ? 'status-ativo' : 'status-inativo'}`}>
                                            {s.situacao}
                                        </span>
                                    </td>
                                    <td className="acoes-cell">
                                        <button className="action-button view-button" title="Visualizar"><FaEye /></button>
                                        <button className="action-button edit-button" title="Editar"><FaEdit /></button>
                                        <button className="action-button delete-button" title="Excluir"><FaTrashAlt /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" style={{textAlign: 'center'}}>Nenhum colaborador encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Chamada do Modal 
            <ServidorModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                servidorData={selectedServidor}
                mode={modalMode}
                onSaveSuccess={carregarServidores}
            />

                        

        </div>
    );
};

export default Servidor;


*/








/*

import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'; 
import './Servidor.css'; 
import { fetchData, sendData } from '../../service/api'; 
//import ServidorModal from './ServidorModal'; // Iremos criar este arquivo

const Servidores = () => {
    // Estado para a lista de colaboradores (servidores)
    const [servidores, setServidores] = useState([]);
    
    // Estado do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [servidorParaEdicao, setServidorParaEdicao] = useState(null);

    // Estados de Filtro (conforme sua imagem)
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroSetor, setFiltroSetor] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos');

    // --- Carregamento de Dados ---
    
    const fetchServidores = async () => {
        try {
            // Supondo que o endpoint para servidores seja 'servidores'
            const data = await fetchData('servidores'); 
            setServidores(data);
        } catch (error) {
            console.error("Erro ao carregar colaboradores (servidores):", error);
        }
    };

    useEffect(() => {
        fetchServidores();
    }, []);

    // --- Funções do Modal ---

    const handleOpenModal = (servidor = null) => {
        setServidorParaEdicao(servidor); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setServidorParaEdicao(null);
        fetchServidores(); // Recarrega a lista após fechar
    };

    // --- Funções CRUD (Ações) ---

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
            try {
                // Supondo que o endpoint de exclusão seja 'servidores/{id}'
                await sendData('DELETE', `servidores/${id}`);
                fetchServidores();
            } catch (error) {
                console.error("Erro ao excluir colaborador:", error);
                alert("Falha ao excluir o colaborador.");
            }
        }
    };
    
    // Função para renderizar o Status
    const renderStatus = (status) => {
        const statusClasses = {
            'ATIVO': 'status-ativo',
            'INATIVO': 'status-inativo',
            'AFASTADO': 'status-afastado',
        };
        return <span className={`status-pill ${statusClasses[status] || ''}`}>{status}</span>;
    };

    // --- Lógica de Filtro (Frontend - para demonstração) ---
    const servidoresFiltrados = servidores.filter(servidor => {
        const nomeMatch = servidor.nome.toLowerCase().includes(filtroNome.toLowerCase());
        const setorMatch = servidor.setor.toLowerCase().includes(filtroSetor.toLowerCase());
        const statusMatch = filtroStatus === 'Todos' || servidor.status === filtroStatus;
        
        return nomeMatch && setorMatch && statusMatch;
    });

    // --- Renderização ---

    return (
        <div className="servidores-container">
            <div className="header-container">
                <h1 className="page-title">Cadastro de Colaboradores</h1>
                <button 
                    className="btn-novo-cadastro" 
                    onClick={() => handleOpenModal(null)}
                >
                    <FaPlus /> Novo Cadastro
                </button>
            </div>

            {/* Área de Pesquisa/Filtros 
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>

                <div className="filtros-container">
                    <div className="filtro-item">
                        <label htmlFor="nome-colaborador">Nome</label>
                        <input 
                            type="text" 
                            id="nome-colaborador" 
                            className="filtro-input" 
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="setor">Setor</label>
                        <input 
                            type="text" 
                            id="setor" 
                            className="filtro-input" 
                            value={filtroSetor}
                            onChange={(e) => setFiltroSetor(e.target.value)}
                        />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="status">Status</label>
                        <select 
                            id="status" 
                            className="filtro-input"
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                        >
                            <option value="Todos">Todos</option>
                            <option value="ATIVO">ATIVO</option>
                            <option value="INATIVO">INATIVO</option>
                            <option value="AFASTADO">AFASTADO</option>
                        </select>
                    </div>
                </div>
            </div>


            {/* Tabela de Colaboradores 
            <div className="tabela-wrapper">
                <table className="tabela-servidores">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Matrícula</th>
                            <th>Setor</th>
                            <th>Perfil</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servidoresFiltrados.map((servidor) => (
                            <tr key={servidor.id_servidor}>
                                <td>{servidor.nome}</td>
                                <td>{servidor.matricula}</td>
                                <td>{servidor.setor}</td>
                                <td>{servidor.perfil}</td>
                                <td>{renderStatus(servidor.status)}</td>
                                <td className="acoes-cell">
                                    <button className="btn-acao visualizar" title="Visualizar">
                                        <FaEye />
                                    </button>
                                    <button 
                                        className="btn-acao editar" 
                                        onClick={() => handleOpenModal(servidor)}
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="btn-acao excluir" 
                                        onClick={() => handleDelete(servidor.id_servidor)}
                                        title="Excluir"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {servidores.length === 0 && (
                    <p className="tabela-vazia-mensagem">Nenhum colaborador cadastrado.</p>
                )}
            </div>
            
            {/* Modal 
            {isModalOpen && (
                <ServidorModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    servidorData={servidorParaEdicao}
                />
            )}

            
        </div>
    );
};

export default Servidores;

*/






/*  Página de Servidores - Cadastro e Gerenciamento de Colaboradores - Original

import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importa o ícone de lupa

import './Servidores.css'; // Arquivo de estilos que também vamos criar

const Solicitacoes = () => {

  // Dados fictícios para a tabela
  const veiculosCadastrados = [
  { id: 1, nome: 'Flavio Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
  { id: 2, nome: 'Flavio Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
  { id: 3, nome: 'Flavio Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
  { id: 4, nome: 'Flavio Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
  { id: 5, nome: 'Flavio Santos', matricula: 'ma2025', setor: 'SAOFC', perfil: 'Servidor', status: 'Ativo' },
];

  // Função para renderizar a etiqueta de status com a cor correta
  const renderStatus = (status) => {
    const statusClasses = {
      'Aprovado': 'status-aprovado',
      'Aguardando': 'status-aguardando',
      'Rejeitado': 'status-rejeitado',
    };
    return <span className={`status-pill ${statusClasses[status] || ''}`}>{status}</span>;
  };

  return (
    <div className="solicitacoes-container">
      {/* Cabeçalho com Título e Botão 
      <div className="header-container">
        <h1 className="page-title">Cadastro de Colaboradores</h1>
        <button className="btn-nova-solicitacao">Novo Cadastro</button>
      </div>

      {/* Área de Pesquisa - NOVO CONTAINER 
        <div className="area-pesquisa-container">
          <h3 className="area-pesquisa-titulo">
            <FaSearch /> Área de Pesquisa
          </h3>

          {/* Área de Filtros 
          <div className="filtros-container">
            <div className="filtro-item">
              <label htmlFor="nome-colaborador">Nome</label>
              <input type="text" id="nome-colaborador" className="filtro-input" />
            </div>
            <div className="filtro-item">
              <label htmlFor="nome-setor">Setor</label>
              <input type="text" id="nome-setor" className="filtro-input" />
            </div>
            <div className="filtro-item">
              <label htmlFor="status-select">Status</label>
              <select id="status-select" className="filtro-select">
                <option>Todos</option>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>
          </div>

        </div>


      {/* Tabela de Solicitações 
      <div className="tabela-wrapper">
        <table className="tabela-solicitacoes">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Matricula</th>
              <th>Setor</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {veiculosCadastrados.map((sol) => (
              <tr key={sol.id}>
                <td>{sol.nome}</td>
                <td>{sol.matricula}</td>
                <td>{sol.setor}</td>
                <td>{sol.perfil}</td>
                <td>{renderStatus(sol.status)}</td>
                <td className="acoes-cell">
                  {/* Espaço para futuros ícones de ação 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Solicitacoes;
*/