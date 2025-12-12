
/*

import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { fetchData, sendData } from '../../service/api'; 
import NotificationToast from '../loadingoverlay/NotificationToast'; 

import './Manutencoes.css'; 

const Manutencoes = () => {
    
    // ENDPOINT REAL (Baseado na tabela tb08_manutencao)
    const API_ENDPOINT = '/api/manutencoes'; 
    
    // 1. INICIALIZAÇÃO CORRETA PARA USO DA API
    const [manutencoes, setManutencoes] = useState([]); // Inicia vazio, sem mockData
    const [loading, setLoading] = useState(true); // Começa true para buscar dados
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [manutencaoSelecionada, setManutencaoSelecionada] = useState(null); 
    const [notification, setNotification] = useState(null); 
    
    // ----------------------------------------------------------------------
    // FUNÇÃO DE CARREGAMENTO REAL DA API
    // ----------------------------------------------------------------------
    const getManutencoes = async () => {
        try {
            setLoading(true);
            const data = await fetchData(API_ENDPOINT);
            setManutencoes(data);
            setError(null); 
        } catch (err) {
            console.error("Erro ao buscar manutenções:", err);
            setError("Erro ao carregar dados de manutenção. Verifique o servidor.");
        } finally {
            setLoading(false);
        }
    };

    // CHAMA O FETCH NA MONTAGEM DO COMPONENTE
    // Foi removida a duplicação do useEffect.
    useEffect(() => {
        getManutencoes();
    }, []);
    
    // FUNÇÕES DE CALLBACK APÓS SALVAR/EXCLUIR
    const handleManutencaoSaved = (message, type) => {
        setNotification({ message, type });
        if (type === 'success') { getManutencoes(); } // Recarrega a lista
    };
    
    const dismissNotification = () => setNotification(null);

    // FUNÇÕES PARA MODAL
    const handleOpenModal = () => {
        setManutencaoSelecionada(null); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setManutencaoSelecionada(null);
    };

    // ----------------------------------------------------------------------
    // FUNÇÕES DE AÇÃO NA TABELA
    // ----------------------------------------------------------------------

    const handleVisualizar = (manutencao) => {
        setManutencaoSelecionada(manutencao); 
        setIsModalOpen(true);
    };

    const handleEditar = (manutencao) => {
        setManutencaoSelecionada(manutencao); 
        setIsModalOpen(true);
    };

    const handleExcluir = async (manutencao) => {
        // Usa a PK do banco: id_manutencao
        const idToDelete = manutencao.id_manutencao; 
        const veiculoDisplay = `${manutencao.placa || 'N/A'} - ${manutencao.modelo || 'N/A'}`; // Supondo que a API inclua placa/modelo

        if (!idToDelete) {
            handleManutencaoSaved("Erro: ID da Manutenção não encontrado.", 'error');
            return;
        }

        if (window.confirm(`Tem certeza que deseja excluir a Manutenção ID: ${idToDelete} do veículo ${veiculoDisplay}?`)) {
            try {
                await sendData(`${API_ENDPOINT}/${idToDelete}`, 'DELETE'); 
                handleManutencaoSaved("Manutenção excluída com sucesso!", 'success');
            } catch (error) {
                console.error("Erro ao excluir:", error);
                handleManutencaoSaved("Erro ao excluir. Tente novamente.", 'error');
            }
        }
    };

    // Função para renderizar a etiqueta de status (adaptada para status_manutencao do DB)
    const renderStatus = (status) => {
        if (!status) return null;
        
        const normalizado = status
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
            .replace(/[\s_]/g, "-"); 

        let statusClass = '';
        switch (normalizado) {
            case 'nao-iniciado': statusClass = 'status-aguardando'; break; 
            case 'em-andamento': statusClass = 'status-em-uso'; break; 
            case 'concluida': statusClass = 'status-disponivel'; break; 
            case 'cancelada': statusClass = 'status-inativo'; break; 
            default: statusClass = 'status-desconhecido';
        }
        return <span className={`status-pill ${statusClass}`}>{status}</span>;
    };
    
    if (loading) {
        return <div className="manutencoes-container">Carregando manutenções...</div>;
    }

    if (error) {
        return <div className="manutencoes-container">Erro: {error}</div>;
    }

    return (
        <div className="manutencoes-container">
            {/* Cabeçalho com Título e Botão *
            <div className="header-container">
                <h1 className="page-title">Cadastro de Manutenção</h1>
                <button className="btn-nova-manutencao" onClick={handleOpenModal}>Novo Cadastro</button>
            </div>

            {/* Área de Pesquisa - Mantida *
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
                        <label htmlFor="data-solicitacao">Data</label>
                        <input type="date" id="data-solicitacao" className="filtro-input" />
                    </div>
                    <div className="filtro-item">
                        <label htmlFor="status-select">Status</label>
                        <select id="status-select" className="filtro-select">
                            <option>Todos</option>
                            <option>Não iniciado</option>
                            <option>Em andamento</option>
                            <option>Concluida</option>
                            <option>Cancelada</option>
                        </select>
                    </div>
                 </div>
            </div>


            {/* Tabela de Manutenções 
            <div className="tabela-wrapper">
                <table className="tabela-manutencao">
                    <thead>
                        <tr>
                            <th>Veiculo</th>
                            <th>Tipo de manutenção</th>
                            <th>Descrição</th>
                            <th>Data de Início</th>
                            <th>Data Final</th> 
                            <th>Status</th>
                            <th>Ações</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {manutencoes.length > 0 ? (
                            manutencoes.map((manutencao) => (
                                // ⚠️ Chave única: id_manutencao
                                <tr key={manutencao.id_manutencao}>
                                    {/* ⚠️ CAMPOS: Usando campos reais do DB tb08_manutencao e dados de veículo agregados 
                                    <td>{`${manutencao.placa || manutencao.fk_veiculo} - ${manutencao.modelo || 'N/A'}`}</td>
                                    <td>{manutencao.tipo_manutencao}</td>
                                    <td>{manutencao.descricao}</td>
                                    <td>{manutencao.data_inicio}</td>
                                    <td>{manutencao.data_fim || '-'}</td> 
                                    <td>{renderStatus(manutencao.status_manutencao)}</td> 
                                    
                                    <td className="acoes-cell">
                                        <button 
                                            className="action-button view-button" 
                                            title="Visualizar" 
                                            onClick={() => handleVisualizar(manutencao)}
                                        >
                                            <FaEye />
                                        </button>
                                        <button 
                                            className="action-button edit-button" 
                                            title="Editar" 
                                            onClick={() => handleEditar(manutencao)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="action-button delete-button" 
                                            title="Excluir" 
                                            onClick={() => handleExcluir(manutencao)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>Nenhuma manutenção cadastrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            
            {/* RENDERIZAÇÃO DO MODAL
            {isModalOpen && (
                <ManutencaoModal
                    onClose={handleCloseModal}
                    onItemSaved={handleManutencaoSaved}
                    itemToEdit={manutencaoSelecionada} 
                />
            )}
            

            {/* RENDERIZAÇÃO DO TOAST *
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

export default ManutencaoModal;

*/