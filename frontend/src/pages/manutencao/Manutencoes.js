

import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importa ícones de ação
import { fetchData, sendData } from '../../service/api'; // Assume que você tem fetchData/sendData
//import ManutencaoModal from './ManutencaoModal'; // Iremos criar este modal
import NotificationToast from '../loadingoverlay/NotificationToast'; 

import './Manutencoes.css'; 

const Manutencoes = () => {
    
  
    const API_ENDPOINT = '/api/manutencoes'; 
    

    const [manutencoes, setManutencoes] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [manutencaoSelecionada, setManutencaoSelecionada] = useState(null); // Item para edição/visualização
    const [notification, setNotification] = useState(null); 
    
    // FUNÇÃO DE CARREGAMENTO DAS MANUTENÇÕES
    const getManutencoes = async () => {
        try {
            setLoading(true);
            const data = await fetchData(API_ENDPOINT);
            setManutencoes(data);
            setError(null); // Limpar erro se a busca for bem-sucedida
        } catch (err) {
            console.error("Erro ao buscar manutenções:", err);
            setError("Erro ao carregar dados de manutenção. Verifique o servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getManutencoes(); // Chama a função de busca
    }, []);
    

    // Função que o MODAL chamará no sucesso ou erro (Igual ao Veiculos.js)
    const handleManutencaoSaved = (message, type) => {
        setNotification({ message, type });
        if (type === 'success') { getManutencoes(); } // Descomentar quando usar API
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
    // FUNÇÕES DE AÇÃO NA TABELA (Visualizar, Editar, Excluir)
    // ----------------------------------------------------------------------

    const handleVisualizar = (manutencao) => {
        alert(`Visualizando Manutenção ID: ${manutencao.id} - Veículo: ${manutencao.veiculo}`);
        // setManutencaoSelecionada(manutencao); setIsModalOpen(true); // Lógica para abrir modal
    };

    const handleEditar = (manutencao) => {
        alert(`Preparando para Editar Manutenção ID: ${manutencao.id} - Veículo: ${manutencao.veiculo}`);
        setManutencaoSelecionada(manutencao); 
        setIsModalOpen(true);
    };

    const handleExcluir = async (manutencao) => {
        if (window.confirm(`Tem certeza que deseja excluir a Manutenção ID: ${manutencao.id} do veículo ${manutencao.veiculo}?`)) {
            try {
                // ⚠️ Se o ID for diferente de 'id' no objeto, ajuste (Ex: manutencao.id_manutencao)
                // await sendData(`${API_ENDPOINT}/${manutencao.id}`, 'DELETE'); 
                handleManutencaoSaved("Manutenção excluída com sucesso!", 'success');
                // Após exclusão, você precisará recarregar a lista (chamar getManutencoes())
            } catch (error) {
                console.error("Erro ao excluir:", error);
                handleManutencaoSaved("Erro ao excluir. Tente novamente.", 'error');
            }
        }
    };

    // Função para renderizar a etiqueta de status (mantendo a lógica do Veiculos.js)
    const renderStatus = (status) => {
        if (!status) return null;
        
        const normalizado = status
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
            .replace(/[\s_]/g, "-"); 

        let statusClass = '';
        switch (normalizado) {
            case 'nao-iniciado': statusClass = 'status-não-iniciado'; break; // Usando status-aguardando para cor neutra
            case 'em-andamento': statusClass = 'status-em-andamento'; break; // Usando status-em-uso para cor ativa
            case 'concluida': statusClass = 'status-concluida'; break; // Usando status-disponivel para cor sucesso
            case 'cancelada': statusClass = 'status-cancelada'; break; // Usando status-inativo para cor rejeitada
            default: statusClass = 'status-desconhecido';
        }
        // Nota: as classes status-aguardando, status-em-uso, etc., virão do seu CSS global ou Veiculos.css se for importado/compartilhado.
        return <span className={`status-pill ${statusClass}`}>{status}</span>;
    };
    
    if (loading) {
        return <div className="manutencoes-container">Carregando...</div>;
    }

    if (error) {
        return <div className="manutencoes-container">Erro: {error}</div>;
    }

    return (
        <div className="manutencoes-container">
            {/* Cabeçalho com Título e Botão */}
            <div className="header-container">
                <h1 className="page-title">Cadastro de Manutenção</h1>
                <button className="btn-nova-manutencao" onClick={handleOpenModal}>Novo Cadastro</button>
            </div>

            {/* Área de Pesquisa - Mantida */}
            <div className="area-pesquisa-container">
                <h3 className="area-pesquisa-titulo">
                    <FaSearch /> Área de Pesquisa
                </h3>
                {/* ... Filtros de Placa, Data e Status ... */}
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

            {/* Tabela de Manutenções */}
            <div className="tabela-wrapper">
                <table className="tabela-manutencao">
                    <thead>
                        <tr>
                            <th>Veiculo</th>
                            <th>Tipo de manutenção</th>
                            <th>Descrição</th>
                            <th>Data de Inicio</th>
                            <th>Previsão de Entrega</th>
                            <th>Horario Marcado</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {manutencoes.map((manutencao) => (
                            <tr key={manutencao.id}>
                                <td>{`${manutencao.veiculo?.modelo || 'N/A'} - ${manutencao.veiculo?.placa || 'N/A'}`}</td>
                                <td>{manutencao.tipo}</td>
                                <td>{manutencao.descricao}</td>
                                <td>{manutencao.dataInicio}</td>
                                <td>{manutencao.dataFim}</td>
                                <td>{manutencao.horarioMarcado}</td>
                                <td>{renderStatus(manutencao.status)}</td>
                                
                                {/* CÉLULA DE AÇÕES ADAPTADA */}
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
                        ))}
                    </tbody>
                </table>
            </div>
            
           
            
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

export default Manutencoes;















/*codigo antigo de manutencoes.js removido


import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importa o ícone de lupa

import './Manutencoes.css'; // Arquivo de estilos que também vamos criar

const Manutencoes = () => {

  // Dados fictícios para a tabela
  const manutencaoCadastrada = [
  { id: 1, veiculo: 'Onix - ART-2025', tipo_manutencao: 'Troca de Oleo', descricao: 'xxxxxx', data_inicio: '02/01/2026', previsao_entrega: '05/01/2026', status: 'Não iniciado' },
  { id: 2, veiculo: 'Gol - BRT-1024', tipo_manutencao: 'Reparo no freio', descricao: 'xxxxxx', data_inicio: '25/12/2025', previsao_entrega: '29/12/2025', status: 'Não iniciado' },
  { id: 3, veiculo: 'Hilux - CDE-5678', tipo_manutencao: 'Pintura', descricao: 'xxxxxx', data_inicio: '03/03/2026', previsao_entrega: '03/04/2026', status: 'Não iniciado' },
  
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
    <div className="manutencoes-container">
      {/* Cabeçalho com Título e Botão *
      <div className="header-container">
        <h1 className="page-title">Cadastro de Manutenção</h1>
        <button className="btn-nova-manutencao">Novo Cadastro</button>
      </div>

      {/* Área de Pesquisa - NOVO CONTAINER *
        <div className="area-pesquisa-container">
          <h3 className="area-pesquisa-titulo">
            <FaSearch /> Área de Pesquisa
          </h3>

          {/* Área de Filtros *
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


      {/* Tabela de Solicitações 
      <div className="tabela-wrapper">
        <table className="tabela-manutencao">
          <thead>
            <tr>
              <th>Veiculo</th>
              <th>Tipo de manutenção</th>
              <th>Descrição</th>
              <th>Data de Inicio</th>
              <th>Previsão de Entrega</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {manutencaoCadastrada.map((sol) => (
              <tr key={sol.id}>
                <td>{sol.veiculo}</td>
                <td>{sol.tipo_manutencao}</td>
                <td>{sol.descricao}</td>
                <td>{sol.data_inicio}</td>
                <td>{sol.previsao_entrega}</td>
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

export default Manutencoes;

*/