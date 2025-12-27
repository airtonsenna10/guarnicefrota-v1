import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import { fetchData, sendData } from '../../service/api'; 
import SetorModal from './SetorModal'; // Certifique-se de criar este arquivo
import NotificationToast from '../loadingoverlay/NotificationToast'; 

const Setor = () => {
    const API_ENDPOINT = '/api/organograma'; // Ajuste conforme seu backend

    const [setores, setSetores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    // Estado para configurar o modal (setor e modo de operação)
    const [modalConfig, setModalConfig] = useState({ 
        setor: null, 
        mode: 'new' 
    });

    // Estados de Filtro
    const [filtroNome, setFiltroNome] = useState('');

    // --- Funções de Carregamento ---
    const getSetores = async () => {
        try {
            setLoading(true);
            const data = await fetchData(API_ENDPOINT); 
            
            // Mapeia para incluir o nome do pai para exibição na tabela
            const setoresComPai = data.map(setor => ({
                ...setor,
                //*nome_pai: setor.setorSuperior ? data.find(p => p.id === setor.setorSuperior?.id)?.nome_setor || 'N/A' : 'Diretoria/Raiz'*/}
                nome_pai: setor.setorSuperior ? setor.setorSuperior.nomeSetor : 'Secretaria/Raiz'
            }));

            setSetores(setoresComPai);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        getSetores();
    }, []);

    const handleSetorSaved = (message, type) => {
        setNotification({ message, type });
        if (type === 'success') {
            getSetores();
        }
    };
    
    const dismissNotification = () => setNotification(null);

    // --- Funções de Modal ---
    const handleOpenModal = () => {
        setModalConfig({ setor: null, mode: 'new' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // --- Funções de Ação (CRUD Padronizado)
    const handleVisualizar = (setor) => {
        setModalConfig({ setor: setor, mode: 'view' }); 
        setIsModalOpen(true);
    };

    const handleEditar = (setor) => {
        setModalConfig({ setor: setor, mode: 'edit' }); 
        setIsModalOpen(true);
    };

    const handleExcluir = async (setor) => {
        if (window.confirm(`Deseja excluir o setor: ${setor.nomeSetor}?`)) {
            try {
                // Seguindo a ordem correta: URL, depois MÉTODO
                await sendData(`${API_ENDPOINT}/${setor.id}`, 'DELETE');
                handleSetorSaved("Setor excluído com sucesso!", 'success');
            } catch (error) {
                console.error("Erro ao excluir setor:", error);
                handleSetorSaved("Erro ao excluir. Verifique se há servidores vinculados.", 'error');
            }
        }
    };

    // --- Lógica de Filtro ---
    const setoresFiltrados = setores.filter(setor => 
        setor.nomeSetor?.toLowerCase().includes(filtroNome.toLowerCase())
    );

    if (loading) return <div className="main-list-container">Carregando setores...</div>;
    if (error) return <div className="main-list-container">Erro: {error}</div>;

    return (
        <div className="main-list-container">
            <div className="header-container">
                <h1 className="page-title">Cadastro de Setores (Organograma)</h1>
                <button className="btn-novo-cadastro" onClick={handleOpenModal}>
                    <FaPlus /> Novo Setor
                </button>
            </div>

            {/* Área de Pesquisa */}
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo"><FaSearch /> Área de Pesquisa</h3>
                <div className="filtros-container">
                    <div className="filtro-item" style={{ flex: 1 }}>
                        <label>Nome do Setor</label>
                        <input 
                            type="text" 
                            className="filtro-input" 
                            placeholder="Pesquisar por nome..."
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="tabela-wrapper">
                <table className="tabela-listagem">
                    <thead>
                        <tr>
                            <th>Nome do Setor</th>
                            <th>Gestor(a)</th>
                            <th>Descrição</th>
                            <th>Setor Superior</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {setoresFiltrados.length > 0 ? (
                            setoresFiltrados.map((setor) => (
                                <tr key={setor.id}>
                                    <td>{setor.nomeSetor}</td>
                                    <td>{setor.responsavel}</td>
                                    <td className="descricao-cell">
                                    <div className="text-truncate" title={setor.descricao}>{setor.descricao}</div>
                                    </td>
                                    <td>{setor.nome_pai}</td>
                                    <td className="acoes-cell">
                                        <button className="action-button view-button" title="Visualizar" onClick={() => handleVisualizar(setor)}>
                                            <FaEye />
                                        </button>
                                        <button className="action-button edit-button" title="Editar" onClick={() => handleEditar(setor)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-button delete-button" title="Excluir" onClick={() => handleExcluir(setor)}>
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="mensagem-tabela-vazia">Nenhum setor encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <SetorModal 
                    onClose={handleCloseModal}
                    onSetorSaved={handleSetorSaved}
                    setorToEdit={modalConfig.setor}
                    mode={modalConfig.mode}
                    allSetores={setores} // Útil para o select de "Setor Pai"
                />
            )}
                

            {/* Notificação */}
            {notification && (
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    onDismiss={dismissNotification}
                />
            )}
        </div>
    );
};

export default Setor;











/*

import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; 
import './Setor.css'; 
import { fetchData, sendData } from '../../service/api'; 
//import SetorModal from './SetorModal'; 

const Setor = () => {
    const [setores, setSetores] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [setorParaEdicao, setSetorParaEdicao] = useState(null);

    // Estados de Filtro
    const [filtroNome, setFiltroNome] = useState('');

    // --- Funções de Carregamento de Dados ---
    
    const fetchSetores = async () => {
        try {
            // Supondo que o endpoint para setores (tb02_organograma) seja 'setores'
            const data = await fetchData('setores'); 
            // Para simplificar a exibição, vamos mapear a lista de setores para incluir o nome do setor pai
            const setoresComPai = data.map(setor => ({
                ...setor,
                nome_pai: setor.pai ? data.find(p => p.id === setor.pai)?.nome_setor || 'N/A' : 'Nenhum'
            }));

            setSetores(setoresComPai);
        } catch (error) {
            console.error("Erro ao carregar setores:", error);
        }
    };

    useEffect(() => {
        fetchSetores();
    }, []);

    // --- Funções do Modal ---

    const handleOpenModal = (setor = null) => {
        setSetorParaEdicao(setor); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSetorParaEdicao(null);
        fetchSetores(); // Recarrega a lista
    };

    // --- Funções CRUD (Ações) ---

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este setor? Isso pode afetar servidores e veículos ligados a ele.')) {
            try {
                // Supondo que o endpoint de exclusão seja 'setores/{id}'
                await sendData('DELETE', `setores/${id}`);
                fetchSetores();
            } catch (error) {
                console.error("Erro ao excluir setor:", error);
                alert("Falha ao excluir o setor. Verifique se há dependências (servidores/veículos).");
            }
        }
    };
    
    // --- Lógica de Filtro ---
    const setoresFiltrados = setores.filter(setor => {
        const nomeMatch = setor.nome_setor.toLowerCase().includes(filtroNome.toLowerCase());
        return nomeMatch;
    });

    // --- Renderização ---

    return (
        <div className="setores-container">
            <div className="header-container">
                <h1 className="page-title">Cadastro de Setores (Organograma)</h1>
                <button 
                    className="btn-novo-cadastro" 
                    onClick={() => handleOpenModal(null)}
                >
                    <FaPlus /> Novo Setor
                </button>
            </div>

            {/* Área de Pesquisa/Filtros 
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>
                <div className="filtros-container">
                    <div className="filtro-item">
                        <label htmlFor="nome-setor">Nome do Setor</label>
                        <input 
                            type="text" 
                            id="nome-setor" 
                            className="filtro-input" 
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                    </div>
                </div>
            </div>


            {/* Tabela de Setores 
            <div className="tabela-wrapper">
                <table className="tabela-setores">
                    <thead>
                        <tr>
                            <th>Nome do Setor</th>
                            <th>Responsável</th>
                            <th>Descrição</th>
                             <th>Setor Pai</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {setoresFiltrados.map((setor) => (
                            <tr key={setor.id}>
                                <td>{setor.nome_setor}</td>
                                <td>{setor.responsavel}</td>
                                <td>{setor.descricao}</td>
                                <td>{setor.nome_pai}</td>
                                <td className="acoes-cell">
                                    <button 
                                        className="btn-acao editar" 
                                        onClick={() => handleOpenModal(setor)}
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="btn-acao excluir" 
                                        onClick={() => handleDelete(setor.id)}
                                        title="Excluir"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {setores.length === 0 && (
                    <p className="tabela-vazia-mensagem">Nenhum setor cadastrado.</p>
                )}
            </div>
            
            {/* Modal 
            {isModalOpen && (
                <SetorModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    setorData={setorParaEdicao}
                    allSetores={setores} // Passamos a lista para que o modal possa selecionar o Setor Pai
                />
            )}
                
        </div>
    );
};

export default Setor;

*/