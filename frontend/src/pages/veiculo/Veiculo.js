
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaPlus ,FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importa os novos ícones
import { fetchData, sendData } from '../../service/api'; // Adiciona sendData para exclusão
import VeiculoModal from './VeiculoModal'; 
import NotificationToast from '../loadingoverlay/NotificationToast'; 
//import './Veiculos.css';
import '../style/style-pagina-principal.css'; // Importa o CSS principal

const Veiculo = () => {

    const API_ENDPOINT = '/api/veiculos'; 

    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a visibilidade do modal
    const [notification, setNotification] = useState(null);  // Estado para a notificação


    //Estado para configurar o modal (veículo e modo de operação)
    const [modalConfig, setModalConfig] = useState({ 
        veiculo: null, 
        mode: 'new'    // 'new', 'view', 'edit'
    });
    
    // Função para recarregar a lista de veículos
    const getVeiculos = async () => {
        try {
            const data = await fetchData(API_ENDPOINT); 
            setVeiculos(data);
            setLoading(false);
            return data; 
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return null;
        } 
    };

    useEffect(() => {
        getVeiculos();
    }, []);

    // Função que o MODAL chamará no sucesso ou erro
    const handleVeiculoSaved = (message, type) => {
        setNotification({ message, type });
        
        if (type === 'success') {
            getVeiculos();
        }
    };
    
    // Função para fechar a notificação (passada para o Toast)
    const dismissNotification = () => setNotification(null);

    // FUNÇÕES PARA ABRIR/FECHAR O MODAL
    const handleOpenModal = () => {
        setModalConfig({ veiculo: null, mode: 'new' }); // Novo Cadastro
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalConfig({ veiculo: null, mode: 'new' }); // Limpa o estado
    };

    // ----------------------------------------------------------------------
    // FUNÇÕES DE AÇÃO NA TABELA (CRUD)
    // ----------------------------------------------------------------------

    const handleVisualizar = (veiculo) => {
        // Ação: Define o veículo e o modo 'view'
        setModalConfig({ veiculo: veiculo, mode: 'view' }); 
        setIsModalOpen(true);
    };

    const handleEditar = (veiculo) => {
        // Ação: Define o veículo e o modo 'edit'
        setModalConfig({ veiculo: veiculo, mode: 'edit' }); 
        setIsModalOpen(true);
    };

    const handleExcluir = async (veiculo) => {
        if (window.confirm(`Tem certeza que deseja excluir o veículo Placa: ${veiculo.placa}?`)) {
            try {
                await sendData(`/api/veiculos/${veiculo.id}`, 'DELETE');
                handleVeiculoSaved("Veículo excluído com sucesso!", 'success');
            } catch (error) {
                console.error("Erro ao excluir veículo:", error);
                handleVeiculoSaved("Erro ao excluir veículo. Tente novamente.", 'error');
            }
        }
    };

    // ----------------------------------------------------------------------
    // Função para renderizar a etiqueta de status (mantida)
    // ----------------------------------------------------------------------
    const renderStatusVeiculo = (status) => {
        // ... (código existente da função renderStatusVeiculo)
        if (!status) return null;

        const normalizado = status
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
            .replace(/[\s_]/g, "-"); 

        let statusClass = '';
        switch (normalizado) {
            case 'disponivel': statusClass = 'status-disponivel'; break;
            case 'em-uso': statusClass = 'status-em-uso'; break;
            case 'em-manutencao': statusClass = 'status-em-manutencao'; break;
            case 'inativo': statusClass = 'status-inativo'; break;
            default: statusClass = 'status-desconhecido';
        }
        return <span className={`status-pill ${statusClass}`}>{status}</span>;
    };

    if (loading) {
        return <div className="solicitacoes-container">Carregando...</div>;
    }

    if (error) {
        return <div className="solicitacoes-container">Erro: {error}</div>;
    }

    return (
        <div className="main-list-container">
            {/* ... (Cabeçalho e Área de Pesquisa) ... */}
            <div className="header-container">
                <h1 className="page-title">Cadastro de Veículos</h1>
                <button className="btn-novo-cadastro" onClick={handleOpenModal}>
                    <FaPlus /> Novo Cadastro
                </button>
                  
            </div>
            {/* ... (Área de Pesquisa) ... */}
            <div className="area-pesquisa-container">
                 {/* ... (Filtros e Inputs) ... */}
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>
                <div className="filtros-container">
                    <div className="filtro-item">
                        <label htmlFor="placa-veiculo">Placa do Veículo</label>
                        <input type="text" id="placa-veiculo" className="filtro-input" />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="status-select">Status</label>
                        <select id="status-select" className="filtro-select">
                            <option>Todos</option>
                            <option>Disponível</option>
                            <option>Em Uso</option>
                            <option>Em Manutenção</option>
                            <option>Inativo</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabela de Veículos */}
            <div className="tabela-wrapper">
                <table className="tabela-listagem">
                    <thead>
                        <tr>
                            <th>Modelo</th>
                            <th>Marca</th>
                            <th>Placa</th>
                            <th>Tipo de Veículo</th>
                            <th>Capacidade</th>
                            <th>Status</th>
                            <th>Ações</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {veiculos.length > 0 ? (
                            veiculos.map((veiculo) => (
                                <tr key={veiculo.id}> 
                                    <td>{veiculo.modelo}</td>
                                    <td>{veiculo.marca}</td>
                                    <td>{veiculo.placa}</td>
                                    <td>{veiculo.tipoVeiculo}</td>
                                    <td>{veiculo.capacidade}</td>
                                    <td>{renderStatusVeiculo(veiculo.status)}</td>
                                    
                                    {/* CÉLULA DE AÇÕES */}
                                    <td className="acoes-cell">
                                        <button 
                                            className="action-button view-button" 
                                            title="Visualizar" 
                                            onClick={() => handleVisualizar(veiculo)} // Chamada ajustada
                                        >
                                            <FaEye />
                                        </button>
                                        <button 
                                            className="action-button edit-button" 
                                            title="Editar" 
                                            onClick={() => handleEditar(veiculo)} // Chamada ajustada
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="action-button delete-button" 
                                            title="Excluir" 
                                            onClick={() => handleExcluir(veiculo)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>
                                    Nenhum veículo cadastrado.
                                </td>
                                </tr>
                            ) 
                        }
                    </tbody>
                </table>
            </div>
            
            {/* RENDERIZAÇÃO CONDICIONAL DO MODAL */}
            {isModalOpen && (
                <VeiculoModal
                    onClose={handleCloseModal}
                    onVeiculoSaved={handleVeiculoSaved}
                    //PASSANDO AS NOVAS PROPS
                    veiculoToEdit={modalConfig.veiculo} 
                    mode={modalConfig.mode}
                />
            )}
            
            {/* RENDERIZAÇÃO DO TOAST */}
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

export default Veiculo;







/*  Página de Listagem de Veículos funcional

import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importa os novos ícones
import { fetchData, sendData } from '../../service/api'; // Adiciona sendData para exclusão
import VeiculoModal from './VeiculoModal'; 
import NotificationToast from '../loadingoverlay/NotificationToast'; 
import './Veiculos.css';

const Veiculos = () => {

    const API_ENDPOINT = '/api/veiculos'; 

    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   
    const [isModalOpen, setIsModalOpen] = useState(false);   // Estado para controlar a visibilidade do modal
    const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);  // Estado para armazenar o veículo a ser editado/visualizado (opcionalmente)

    // Estado para a notificação
    const [notification, setNotification] = useState(null); 
    
    // Função para recarregar a lista de veículos
    const getVeiculos = async () => {
        // ... (código existente da função getVeiculos)
        try {
            const data = await fetchData(API_ENDPOINT); 
            setVeiculos(data);
            setLoading(false);
            return data; 
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return null;
        } 
    };

    useEffect(() => {
        getVeiculos();
    }, []);

    // Função que o MODAL chamará no sucesso ou erro
    const handleVeiculoSaved = (message, type) => {
        setNotification({ message, type });
        
        if (type === 'success') {
            getVeiculos();
        }
    };
    
    // Função para fechar a notificação (passada para o Toast)
    const dismissNotification = () => setNotification(null);

    // FUNÇÕES PARA ABRIR/FECHAR O MODAL (Adicionado reset do veículo selecionado no close)
    const handleOpenModal = () => {
        setVeiculoSelecionado(null); // Limpa o veículo se for Novo Cadastro
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setVeiculoSelecionado(null); // Garante que o estado seja limpo ao fechar
    };

    // ----------------------------------------------------------------------
    // NOVAS FUNÇÕES DE AÇÃO NA TABELA
    // ----------------------------------------------------------------------

    const handleVisualizar = (veiculo) => {
        // Por enquanto, apenas um alerta. Futuramente, pode abrir o modal em modo read-only.
        alert(`Visualizando Veículo:\nModelo: ${veiculo.modelo}\nPlaca: ${veiculo.placa}`);
        // Exemplo: setVeiculoSelecionado(veiculo); setIsModalOpen(true);
    };

    const handleEditar = (veiculo) => {
        // Para editar, você precisará setar o veículo e abrir o modal.
        // O modal precisará ser adaptado para receber e preencher o formulário com 'veiculo'.
        alert(`Preparando para Editar Veículo ID: ${veiculo.id}`);
        // Exemplo: setVeiculoSelecionado(veiculo); setIsModalOpen(true);
    };

    const handleExcluir = async (veiculo) => {
        if (window.confirm(`Tem certeza que deseja excluir o veículo Placa: ${veiculo.placa}?`)) {
            try {
                // Supondo que a API DELETE seja /api/veiculos/{id}
                await sendData(`/api/veiculos/${veiculo.id}`, 'DELETE');
                handleVeiculoSaved("Veículo excluído com sucesso!", 'success');
            } catch (error) {
                console.error("Erro ao excluir veículo:", error);
                handleVeiculoSaved("Erro ao excluir veículo. Tente novamente.", 'error');
            }
        }
    };

    // ----------------------------------------------------------------------
    // Função para renderizar a etiqueta de status (mantida)
    // ----------------------------------------------------------------------
    const renderStatusVeiculo = (status) => {
        // ... (código existente da função renderStatusVeiculo)
        if (!status) return null;

        const normalizado = status
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
            .replace(/[\s_]/g, "-"); 

        let statusClass = '';
        switch (normalizado) {
            case 'disponivel': statusClass = 'status-disponivel'; break;
            case 'em-uso': statusClass = 'status-em-uso'; break;
            case 'em-manutencao': statusClass = 'status-em-manutencao'; break;
            case 'inativo': statusClass = 'status-inativo'; break;
            default: statusClass = 'status-desconhecido';
        }
        return <span className={`status-pill ${statusClass}`}>{status}</span>;
    };

    if (loading) {
        return <div className="solicitacoes-container">Carregando...</div>;
    }

    if (error) {
        return <div className="solicitacoes-container">Erro: {error}</div>;
    }

    return (
        <div className="solicitacoes-container">
            {/* ... (Cabeçalho e Área de Pesquisa) ... 
            <div className="header-container">
                <h1 className="page-title">Cadastro de Veículos</h1>
                <button className="btn-nova-solicitacao" onClick={handleOpenModal}>Novo Cadastro</button>
            </div>
            {/* ... (Área de Pesquisa) ... 
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>
                <div className="filtros-container">
                    <div className="filtro-item">
                        <label htmlFor="placa-veiculo">Placa do Veículo</label>
                        <input type="text" id="placa-veiculo" className="filtro-input" />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="status-select">Status</label>
                        <select id="status-select" className="filtro-select">
                            <option>Todos</option>
                            <option>Disponível</option>
                            <option>Em Uso</option>
                            <option>Em Manutenção</option>
                            <option>Inativo</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabela de Veículos 
            <div className="tabela-wrapper">
                <table className="tabela-veiculos">
                    <thead>
                        <tr>
                            <th>Modelo</th>
                            <th>Marca</th>
                            <th>Placa</th>
                            <th>Tipo de Veículo</th>
                            <th>Capacidade</th>
                            <th>Status</th>
                            <th>Ações</th> {/*COLUNA DE AÇÕES 
                        </tr>
                    </thead>
                    <tbody>
                        {veiculos.length > 0 ? (
                            veiculos.map((veiculo) => (
                                // Certifique-se de que a chave é única (id_veiculo ou apenas id)
                                <tr key={veiculo.id}> 
                                    <td>{veiculo.modelo}</td>
                                    <td>{veiculo.marca}</td>
                                    <td>{veiculo.placa}</td>
                                    <td>{veiculo.tipoVeiculo}</td>
                                    <td>{veiculo.capacidade}</td>
                                    <td>{renderStatusVeiculo(veiculo.status)}</td>
                                    
                                    {/* CÉLULA DE AÇÕES 
                                    <td className="acoes-cell">
                                        <button 
                                            className="action-button view-button" 
                                            title="Visualizar" 
                                            onClick={() => handleVisualizar(veiculo)}
                                        >
                                            <FaEye />
                                        </button>
                                        <button 
                                            className="action-button edit-button" 
                                            title="Editar" 
                                            onClick={() => handleEditar(veiculo)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="action-button delete-button" 
                                            title="Excluir" 
                                            onClick={() => handleExcluir(veiculo)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                    
                                </tr>
                            ))
                            ) : (
                                <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>
                                    Nenhum veículo cadastrado.
                                </td>
                                </tr>
                            ) 
                        }
                    </tbody>
                </table>
            </div>
            
            {/* RENDERIZAÇÃO CONDICIONAL DO MODAL 
            {isModalOpen && (
                <VeiculoModal
                    onClose={handleCloseModal}
                    onVeiculoSaved={handleVeiculoSaved}
                    // Você pode passar o veiculoSelecionado aqui para edição:
                    // veiculoToEdit={veiculoSelecionado} 
                />
            )}
            
            {/* RENDERIZAÇÃO DO TOAST 
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

export default Veiculos;


*/















